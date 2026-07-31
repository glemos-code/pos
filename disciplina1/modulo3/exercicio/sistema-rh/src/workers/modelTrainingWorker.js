import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
import { workerEvents } from '../events/constants.js';

let _globalCtx = {};
let _model = null;

const WEIGHTS = {
    skills: 0.7,
    seniority: 0.4,
    experience: 0.25,
    salary: 0.1,
};

const normalize = (value, min, max) => (value - min) / ((max - min) || 1);

function makeContext(jobs, candidates, history) {
    const experiences = candidates.map((candidate) => candidate.yearsExperience);

    const minExperience = Math.min(...experiences);
    const maxExperience = Math.max(...experiences);

    const skills = [...new Set([
        ...jobs.flatMap((job) => job.requiredSkills),
        ...candidates.flatMap((candidate) => candidate.skills),
    ])];

    const skillsIndex = Object.fromEntries(skills.map((skill, index) => [skill, index]));

    const seniorities = [...new Set([
        ...jobs.map((job) => job.minimumSeniority),
        ...candidates.map((candidate) => candidate.seniority),
    ])];

    const senioritiesIndex = Object.fromEntries(seniorities.map((seniority, index) => [seniority, index]));

    const salaries = [...new Set([
        ...candidates.map((candidate) => candidate.salaryExpectation),
        ...jobs.flatMap((job) => job.salaryRange),
    ])];

    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);

    return {
        candidates,
        jobs,
        history,
        skillsIndex,
        senioritiesIndex,
        minExperience,
        maxExperience,
        minSalary,
        maxSalary,
        numSkills: skills.length,
        numSeniorities: seniorities.length,
        dimensions: 2 + skills.length + seniorities.length,
    };
}

const oneHotWeighted = (index, length, weight) => {
    if (index === undefined || index < 0) {
        return tf.zeros([length]).cast('float32').mul(weight);
    }

    return tf.oneHot(index, length).cast('float32').mul(weight);
};

const multiHotWeighted = (indices, length, weight) =>
  tf.oneHot(indices, length)
    .sum(0)
    .cast('float32')
    .mul(weight);

function encodeJob(job, context) {
        return tf.tidy(() => {
    const skillVector = multiHotWeighted(
        job.requiredSkills.map((skill) => context.skillsIndex[skill]),
        context.numSkills,
        WEIGHTS.skills
    );

    const seniorityVector = oneHotWeighted(
        context.senioritiesIndex[job.minimumSeniority],
        context.numSeniorities,
        WEIGHTS.seniority
    );

    const salaryRangeVector = tf.tensor1d(
        job.salaryRange.map((salary) => normalize(salary, context.minSalary, context.maxSalary))
    ).mul(WEIGHTS.salary);

    return tf.concat1d([salaryRangeVector, skillVector, seniorityVector]);
})
}

function encodeCandidate(candidate, context) {
    return tf.tidy(() => {
    const skillVector = multiHotWeighted(
        candidate.skills.map((skill) => context.skillsIndex[skill]),
        context.numSkills,
        WEIGHTS.skills
    );

    const salaryVector = tf.tensor1d([
        normalize(candidate.salaryExpectation, context.minSalary, context.maxSalary)
    ]).mul(WEIGHTS.salary);

    const seniorityVector = oneHotWeighted(
        context.senioritiesIndex[candidate.seniority],
        context.numSeniorities,
        WEIGHTS.seniority
    );

    const experienceVector = tf.tensor1d([
        normalize(candidate.yearsExperience, context.minExperience, context.maxExperience)
    ]).mul(WEIGHTS.experience);

    return tf.concat1d([experienceVector, salaryVector, skillVector, seniorityVector]);
})
}

function skillOverlapRatio(candidate, job) {
    if (!job.requiredSkills.length) return 0;
    const overlap = candidate.skills.filter((s) => job.requiredSkills.includes(s)).length;
    return overlap / job.requiredSkills.length;
}

const SENIORITY_RANK = { junior: 0, mid: 1, senior: 2 };

function seniorityFitBusinessRule(candidate, job) {
    const diff = SENIORITY_RANK[candidate.seniority] - SENIORITY_RANK[job.minimumSeniority];
    if (diff === 0) return 1.0;   // nível exato pedido
    if (diff === 1) return 0.6;   // "recém-promovido", aceitável mas não ideal
    if (diff >= 2) return -0.8;   // muito acima (ex: sênior pra vaga júnior) -> penaliza forte
    return -0.5;                  // abaixo do exigido -> também penaliza
}

function createTrainingData(context) {
    const inputs = [];
    const labels = [];

    context.history.forEach((unit) => {
        const candidate = context.candidates.find((item) => item.id === unit.candidateId);
        const job = context.jobs.find((item) => item.id === unit.jobId);

        if (!candidate || !job) {
            return;
        }

        const candidateVector = encodeCandidate(candidate, context).dataSync();
        const jobVector = encodeJob(job, context).dataSync();
        const skillOverlap = skillOverlapRatio(candidate, job);
        const seniorityFit = seniorityFitBusinessRule(candidate, job);

        inputs.push([...candidateVector, ...jobVector, skillOverlap, seniorityFit]);
        labels.push(Number(unit.label) === 1 ? 0.9 : 0.1 );
    });

    return {
        xs: tf.tensor2d(inputs),
        ys: tf.tensor2d(labels, [labels.length, 1]),
        inputDimension: inputs[0].length
    };
}

async function configureNeuralNetAndTrain(trainData) {
    console.log('Backend:', tf.getBackend()) 
    const model = tf.sequential();

    model.add(
        tf.layers.dense({
            inputShape: [trainData.inputDimension],
            units: 16,
            activation: 'relu',
        })
    );

    model.add(
        tf.layers.dense({
            units: 8,
            activation: 'relu',
        })
    );

    model.add(
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
    );

    model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
    });

    console.time('treino total')
    let lastEpochTime = performance.now()
    await model.fit(trainData.xs, trainData.ys, {
        epochs: 100,
        batchSize: 32,
        shuffle: true,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Tensores ativos: ${tf.memory().numTensors}`)
                const now = performance.now()
                if (epoch < 5 || epoch % 20 === 0) {
                    console.log(`Época ${epoch}: ${(now - lastEpochTime).toFixed(1)}ms desde a última`)
                }
                lastEpochTime = now
                postMessage({
                    type: workerEvents.trainingLog,
                    epoch,
                    loss: logs.loss,
                    accuracy: logs.acc,
                });
            },
        },
    });

    return model;
}

async function trainModel({ candidates, jobs, history }) {
    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 1 } });

    const resolvedCandidates = candidates || await (await fetch(new URL('../../data/candidates.json', import.meta.url))).json();
    const resolvedJobs = jobs || await (await fetch(new URL('../../data/jobs.json', import.meta.url))).json();
    const resolvedHistory = history || await (await fetch(new URL('../../data/history.json', import.meta.url))).json();

    const context = makeContext(resolvedJobs, resolvedCandidates, resolvedHistory);
    context.jobVectors = resolvedJobs.map((job) => ({
        title: job.title,
        meta: { ...job },
        vector: encodeJob(job, context).dataSync(),
    }));

    _globalCtx = context;

    const trainData = createTrainingData(context);
    _model = await configureNeuralNetAndTrain(trainData);

    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 100 } });
    postMessage({ type: workerEvents.trainingComplete });
}

function recommend({ candidate }) {
    if (!_model) return;

    const context = _globalCtx;
    const candidateVector = encodeCandidate(candidate, context).dataSync();

    const inputs = context.jobVectors.map(({ meta, vector }) => [...candidateVector, ...vector, skillOverlapRatio(candidate, meta), seniorityFitBusinessRule(candidate, meta)]);
    const inputTensor = tf.tensor2d(inputs);
    const predictions = _model.predict(inputTensor);

    const scores = predictions.dataSync();
    const recommendations = context.jobVectors.map((item, index) => ({
        ...item.meta,
        title: item.title,
        score: scores[index],
    }));

    const sortedItems = recommendations.sort((a, b) => b.score - a.score);

    postMessage({
        type: workerEvents.recommend,
        candidate,
        recommendations: sortedItems,
    });
}

const handlers = {
    [workerEvents.trainModel]: trainModel,
    [workerEvents.recommend]: recommend,
};

self.onmessage = (event) => {
    const { action, ...data } = event.data;
    if (handlers[action]) {
        handlers[action](data);
    }
};
