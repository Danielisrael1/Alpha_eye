/**
 * AlphaEye - AI Inference Classifier Engine
 * Calls the hosted MobileNetV2 Keras model API for
 * Cataract Detection & Severity Grading (Normal, Mild, Moderate, Severe)
 */

const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:5000';

// The hosted API runs on Render's free tier, which spins the service down
// after periods of inactivity. The first request after that can take
// 30-60s while the container cold-boots and the model reloads.
const REQUEST_TIMEOUT_MS = 60000;

export async function analyzeEyeScan(imageInput) {
  const formData = new FormData();
  if (typeof imageInput === 'string' && (imageInput.startsWith('data:') || imageInput.startsWith('blob:'))) {
    const res = await fetch(imageInput);
    const blob = await res.blob();
    formData.append('image', blob, 'eye_scan.jpg');
  } else if (imageInput instanceof File || imageInput instanceof Blob) {
    formData.append('image', imageInput);
  } else if (typeof imageInput === 'string' && imageInput.startsWith('http')) {
    const res = await fetch(imageInput);
    const blob = await res.blob();
    formData.append('image', blob, 'eye_scan.jpg');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${AI_API_URL}/predict`, {
      method: 'POST',
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

  const result = await response.json();
  return {
    ...result,
    id: result.id || 'SCAN-' + Math.floor(100000 + Math.random() * 900000),
  };
}
