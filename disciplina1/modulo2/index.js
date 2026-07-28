import * as tf from '@tensorflow/tfjs';

// Exercise: Vehicle Maintenance Risk Classifier (each car with mileage, brand, and fuel)
// const cars = [
//     { mileage: 15000, brand: "Toyota", fuel: "Flex" }, // low
//     { mileage: 80000, brand: "Fiat", fuel: "Flex" }, // medium
//     { mileage: 150000, brand: "VW", fuel: "Diesel" }, // high
//     { mileage: 220000, brand: "Chevrolet", fuel: "Diesel" }, // critical
//     { mileage: 20000, brand: "Toyota", fuel: "Flex" }, // low
//     { mileage: 95000, brand: "Fiat", fuel: "Diesel" }, // medium
//     { mileage: 30000, brand: "VW", fuel: "flex" } // low
// ];

// Input vectors with values already normalized and one-hot encoded
// Order: [mileage, Toyota, Fiat, VW, Chevrolet, Flex, Diesel]
// Normalize the mileage of the new car using the same pattern as training
// Example: km_min = 15000, km_max = 220000, so (60000 - 15000) / (220000 - 15000) = 0.19

async function trainModel(inputXs, outputYs) {
    const model = tf.sequential();

    model.add(tf.layers.dense({ inputShape: [7], units: 90, activation: 'relu' }));

    model.add(tf.layers.dense({ units: 4, activation: 'softmax' }));

    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    await model.fit(inputXs, outputYs,
        {
            verbose: 0,
            epochs: 100,
            shuffle: true,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: (epoch, log) => console.log(
                    `Epoch ${epoch}: loss = ${log.loss.toFixed(4)}, val_loss = ${log.val_loss.toFixed(4)}`
                )
            }
        });

    return model;
}

async function predict(model, car) {
    const tfInput = tf.tensor2d(car);

    const prediction = model.predict(tfInput);
    const predictionArray = await prediction.array();
    return predictionArray[0].map((prob, index) => ({ prob, index }));
}

const normalizedCarsTensor = [
    [0, 1, 0, 0, 0, 1, 0], // low - Toyota
    [0.31, 0, 1, 0, 0, 1, 0],    // medium - Fiat
    [0.65, 0, 0, 1, 0, 0, 1],     // high - VW
    [1, 0, 0, 0, 1, 1, 0],    // critical - Chevrolet
    [0.02, 1, 0, 0, 0, 1, 0], // low - Toyota
    [0.39, 0, 1, 0, 0, 0, 1],    // medium - Fiat
    [0.07, 0, 0, 1, 0, 1, 0]   // low - VW
];

const car = { mileage: '60000', brand: 'VW', fuel: 'Flex' };
const normalizedCarTensor = [[0.21, 0, 0, 1, 0, 1, 0]];
const riskLabels = ['low', 'medium', 'high', 'critical'];
const riskLabelsTensor = [
    [1, 0, 0, 0], // low
    [0, 1, 0, 0], // medium
    [0, 0, 1, 0], // high
    [0, 0, 0, 1], // critical
    [1, 0, 0, 0], // low
    [0, 1, 0, 0], // medium
    [1, 0, 0, 0]  // low
];

const inputXs = tf.tensor2d(normalizedCarsTensor);
const outputYs = tf.tensor2d(riskLabelsTensor);

const model = await trainModel(inputXs, outputYs);

const predictions = await predict(model, normalizedCarTensor);
const results = predictions.sort((a, b) => b.prob - a.prob).map(p => ({
    risk: riskLabels[p.index],
    probability: p.prob.toFixed(2)
}));
console.log(`Prediction for the car ${car.brand} with ${car.mileage} km and fuel ${car.fuel}: result ->`, results);
