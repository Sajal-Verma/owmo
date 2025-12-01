import natural from "natural";
import trainingData from "./trainingData.js";
import Preprocess from "./utility/preprocess.js";

// Initialize classifier
const classifier = new natural.BayesClassifier();

// Add training documents with correct label handling
trainingData.forEach(item => {
  const label =
    item.label ||
    (Array.isArray(item.mobileLabels) ? item.mobileLabels[0] : null);

  if (!label) {
    console.error("Training sample missing label:", item);
    return;
  }

  classifier.addDocument(Preprocess(item.text), label);
});

// Train model
classifier.train();

function predict(text) {
  const preprocessed = Preprocess(text);
  const prediction = classifier.classify(preprocessed);

  const classifications = classifier.getClassifications(preprocessed);

  return {
    prediction,
    probabilities: classifications.map(c => ({
      label: c.label,
      value: c.value
    }))
  };
}

const mobileLabels = [
  "Battery Issue",
  "Power Issue",
  "Charging Issue",
  "Display Issue",
  "Connectivity Issue",
  "Camera Issue",
  "Audio Issue",
  "Hardware Issue",
  "Performance Issue",
  "Storage Issue",
  "Overheating Issue",
  "Boot Issue",
  "System Issue",
  "App Issue",
  "System Stability Issue"
];

export function isMobileIssue(text) {
  const result = predict(text);

  const related = mobileLabels.includes(result.prediction);

  return {
    text,
    isMobileIssue: related,
    prediction: related ? result.prediction : "Please enter a valid mobile issue",
    probabilities: result.probabilities
  };
}
