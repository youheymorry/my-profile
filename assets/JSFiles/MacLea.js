let imgClassifier = ml5.imageClassifier('MobileNet', modelLoaded);
function modelLoaded() {
  //console.log('Model Loaded!', r);
}
/**
 * @param {P5.image} imgData 
 * @param {function() => (error, result)} callBack
 */
export function classifyMyImage(imgData, callBack){
  //console.log(imgClassifier);
  try{
    imgClassifier.classify(imgData, callBack);
  }catch(err){
    callBack("Unexpected Error", false);
  }
}

// // A function to run when we get any errors and the results
// function gotResult(error, results) {
//   // Display error in the console
//   if (error) {
//     console.error(error);
//   }
//   // The results are in an array ordered by confidence.
//   console.log(results);
//   createDiv(`Label: ${results[0].label}`);
//   createDiv(`Confidence: ${nf(results[0].confidence, 0, 2)}`);
// }