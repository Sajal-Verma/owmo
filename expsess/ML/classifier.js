import natural from "natural";
import trainingData from "./trainingData.js";
import Preprocess from "./utility/preprocess.js";


// Initialize classifier
const classifier = new natural.BayesClassifier();


// Add training data
trainingData.forEach(item => {
  classifier.addDocument(Preprocess(item.text), item.label);
});


// Train model
classifier.train();

// Predict function
function predict(text) {
  const preprocessed = Preprocess(text);
  const prediction = classifier.classify(preprocessed);

  // Probabilities
  const classifications = classifier.getClassifications(preprocessed);

  return {
    prediction,
    probabilities: classifications.map(c => ({ label: c.label, value: c.value }))
  };
}


// List of labels that are considered "mobile issues"
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
  
  // Check if predicted label is in mobileLabels
  const related = mobileLabels.includes(result.prediction);

  if(related){
      return {
    text,
    isMobileIssue: related,
    prediction: result.prediction,
    probabilities: result.probabilities
    };

  }

  else{
      return {
    text,
    isMobileIssue: related,
    prediction: "plz enter the right issue",
    probabilities: result.probabilities
    };
  }

}

