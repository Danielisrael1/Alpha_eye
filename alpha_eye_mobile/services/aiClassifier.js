/**
 * AlphaEye Mobile — AI Inference Classifier Engine
 * Calls the hosted MobileNetV2 Keras Model API for
 * Cataract Detection & Severity Grading
 */

const AI_API_URL = process.env.EXPO_PUBLIC_AI_API_URL || 'http://localhost:5000';

// The hosted API runs on Render's free tier, which spins the service down
// after periods of inactivity. The first request after that can take
// 30-60s while the container cold-boots and the model reloads.
const REQUEST_TIMEOUT_MS = 60000;

/**
 * Analyzes an eye image using trained MobileNetV2 Keras Model API
 * @param {string} imageUri - URI of the captured image
 * @returns {Promise<Object>} Screening result
 */
export async function analyzeEyeScan(imageUri) {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'eye_scan.jpg',
    type: 'image/jpeg',
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${AI_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The AI server is taking longer than expected to respond (it may be waking up from idle). Please try again in a moment.');
    }
    throw new Error('Could not reach the AI server. Check your connection and try again.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `AI server returned an error (status ${response.status}).`);
  }

  const data = await response.json();
  return {
    ...data,
    imageUri,
  };
}
