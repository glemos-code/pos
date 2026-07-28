import * as tf from '@tensorflow/tfjs';

async function trainModel(inputXs, outputYs) {
    const model = tf.sequential();

    // First layer of the network:
    // input of 7 positions (normalized age + 3 colors + 3 locations)

    // 80 neurons = I placed everything here because the training set is small
    // the more neurons, the more complexity the network can learn
    // and consequently, the more processing it will use

    // ReLU works like a filter:
    // it allows only the interesting data to continue through the network
    // if the information reached this neuron as positive, it passes forward
    // if it is zero or negative, it can be discarded as it will not be useful
    model.add(tf.layers.dense({ inputShape: [7], units: 80, activation: 'relu' }));

    // Output: 3 neurons
    // one for each category (premium, medium, basic)

    // activation: softmax normalizes the output into probabilities
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

    // Compiling the model
    // optimizer Adam (Adaptive Moment Estimation)
    // a modern personal trainer for neural networks:
    // adjusts weights efficiently and intelligently
    // learning from the history of errors and successes

    // loss: categoricalCrossentropy
    // it compares what the model "thinks" (the scores for each category)
    // with the correct answer
    // the premium category will always be [1, 0, 0]

    // the farther the model's prediction is from the correct answer
    // the greater the error (loss)
    // classic examples include image classification, recommendation, and user categorization
    // anything where the correct answer is "just one among several possibilities"

    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Training the model
    // verbose: disables the internal log (and uses only the callback)
    // epochs: number of times the dataset is run
    // shuffle: shuffles the data to avoid bias
    await model.fit(
        inputXs,
        outputYs,
        {
            verbose: 0,
            epochs: 100,
            shuffle: true,
            callbacks: {
                // onEpochEnd: (epoch, log) => console.log(
                //     `Epoch: ${epoch}: loss = ${log.loss}`
                // )
            }
        }
    );

    return model;
}

async function predict(model, person) {
    // Convert the JS array to a tensor (tfjs)
    const tfInput = tf.tensor2d(person);

    // Make the prediction (output will be a vector of 3 probabilities)
    const prediction = model.predict(tfInput);
    const predictionArray = await prediction.array();
    return predictionArray[0].map((prob, index) => ({ prob, index }));
}

// Example people for training (each person with age, color, and location)
// const people = [
//     { name: "Erick", age: 30, color: "blue", location: "São Paulo" },
//     { name: "Ana", age: 25, color: "red", location: "Rio" },
//     { name: "Carlos", age: 40, color: "green", location: "Curitiba" }
// ];

// Input vectors with values already normalized and one-hot encoded
// Order: [normalized_age, blue, red, green, São Paulo, Rio, Curitiba]
// const peopleTensor = [
//     [0.33, 1, 0, 0, 1, 0, 0], // Erick
//     [0, 0, 1, 0, 0, 1, 0],    // Ana
//     [1, 0, 0, 1, 0, 0, 1]     // Carlos
// ];

// We only use numeric data because the neural network only understands numbers.
// normalizedPeopleTensor corresponds to the input dataset for the model.
const normalizedPeopleTensor = [
    [0.33, 1, 0, 0, 1, 0, 0], // Erick
    [0, 0, 1, 0, 0, 1, 0],    // Ana
    [1, 0, 0, 1, 0, 0, 1]     // Carlos
];

// Labels of the categories to be predicted (one-hot encoded)
// [premium, medium, basic]
const labelNames = ['premium', 'medium', 'basic']; // Label order
const labelsTensor = [
    [1, 0, 0], // premium - Erick
    [0, 1, 0], // medium - Ana
    [0, 0, 1]  // basic - Carlos
];

// Create input and output tensors to train the model
const inputXs = tf.tensor2d(normalizedPeopleTensor);
const outputYs = tf.tensor2d(labelsTensor);

// The more data, the better!
// This allows the algorithm to understand complex patterns more effectively.
const model = await trainModel(inputXs, outputYs);

const person = { name: 'Zé', age: 28, color: 'green', location: 'Curitiba' };

// Normalize the new person's age using the same pattern as training
// Example: age_min = 25, age_max = 40, so (28 - 25) / (40 - 25) = 0.2
const normalizedPersonTensor = [
    [
        0.2, // normalized age
        1,   // blue color
        0,   // red color
        0,   // green color
        0,   // São Paulo location
        1,   // Rio location
        0    // Curitiba location
    ]
];

const predictions = await predict(model, normalizedPersonTensor);
const results = predictions
    .sort((a, b) => b.prob - a.prob)
    .map(p => `${labelNames[p.index]} (${(p.prob * 100).toFixed(2)}%)`)
    .join('\n');
console.log(results);