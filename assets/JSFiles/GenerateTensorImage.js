import * as tf from '@tensorflow/tfjs';

/**
* @typedef {Object} GeneratedImageResult
* @property {Uint8ClampedArray} raw - an array of all pixel values
* @property {Blob} blob - image blob
* @property {p5.Image | null} image - p5 Image, if p5 is available.
* @property {tf.Tensor3D} [tensor] - the original tensor, if `returnTensors` is true.
*/

/**
 * Utility function for returning an image in multiple formats.
 *
 * Takes a Tensor and returns an object containing `blob`, `raw`, `image`, and optionally `tensor`.
 * Will dispose of the Tensor if not returning it.
 *
 * Accepts options as an object with property `returnTensors` so that models can pass this.config.
 *
 * @param {tf.Tensor3D} tensor
 * @param {{ returnTensors: boolean }} options
 * @return {Promise<GeneratedImageResult>}
 */
export default async function generatedImageResult(tensor) {
  const [height, width] = tensor.shape;
  const raw = await tf.tidy(() => {
    return tf.browser.toPixels(tensor);  
  });
  const blob = await rawToBlob(raw, width, height);
  const image = URL.createObjectURL(blob);
  return { raw, blob, image };
  // const raw = await tf.browser.toPixels(tensor); // or tensor.data()??
  // const [height, width] = tensor.shape;
  // const blob = await rawToBlob(raw, width, height);
  //URL.createObjectURL(blob))
  // const image = URL.createObjectURL(blob);
  // return { raw, blob, image };
  // if (options.returnTensors) {
  //   return { tensor, raw, blob, image };
  // }
  // tensor.dispose();
  // return { raw, blob, image };
}

async function rawToBlob(raws, width, height) {
  const arr = Array.from(raws)
  const canvas = document.createElement('canvas'); // Consider using offScreenCanvas when it is ready?
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  const imgData = ctx.createImageData(width, height);
  const {data} = imgData;

  for (let i = 0; i < width * height * 4; i += 1) data[i] = arr[i];
  ctx.putImageData(imgData, 0, 0);

  return this.getBlob(canvas);
};