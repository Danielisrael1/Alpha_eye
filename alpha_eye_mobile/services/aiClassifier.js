/**
 * AlphaEye Mobile — AI Inference Classifier Engine
 * Simulates MobileNetV2 Transfer Learning Architecture
 * for Cataract Detection & Severity Grading
 */

export const CATARACT_STAGES = {
  NORMAL: {
    key: 'NORMAL',
    label: 'Normal Eye',
    color: '#10b981',
    description: 'Clear crystalline lens with normal pupil transparency and no visible opacities.',
    recommendation: 'Routine eye checkup recommended in 12 months. Continue basic ocular hygiene.',
  },
  MILD: {
    key: 'MILD',
    label: 'Mild Cataract',
    color: '#0ea5e9',
    description: 'Early nuclear or cortical opacity detected. Slight reduction in lens transparency.',
    recommendation: 'Schedule non-urgent ophthalmic review within 3 months. Monitor for night glare or blurry vision.',
  },
  MODERATE: {
    key: 'MODERATE',
    label: 'Moderate Cataract',
    color: '#f59e0b',
    description: 'Significant lens opacification causing noticeable visual impairment.',
    recommendation: 'Specialist consultation required within 3-4 weeks. Patient candidates for surgical assessment.',
  },
  SEVERE: {
    key: 'SEVERE',
    label: 'Severe / Mature Cataract',
    color: '#ef4444',
    description: 'Dense, mature cataract with complete pupil cloudiness. Severe vision impairment.',
    recommendation: 'URGENT Referral to Mengo Hospital / Mulago Eye Clinic for surgical evaluation.',
  },
};

/**
 * Analyzes an eye image and returns simulated MobileNetV2 classification
 * @param {string} imageUri - URI of the captured image
 * @returns {Promise<Object>} Screening result
 */
export async function analyzeEyeScan(imageUri) {
  // Simulate cloud neural network processing delay
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Generate simulated classification
  const randomVal = Math.random();
  let stageKey;
  if (randomVal > 0.65) stageKey = 'NORMAL';
  else if (randomVal > 0.35) stageKey = 'MILD';
  else if (randomVal > 0.12) stageKey = 'MODERATE';
  else stageKey = 'SEVERE';

  const stage = CATARACT_STAGES[stageKey];
  const confidence = (89.5 + Math.random() * 9.5).toFixed(1);

  const lensClarityIndex = stageKey === 'NORMAL' ? 95 : stageKey === 'MILD' ? 72 : stageKey === 'MODERATE' ? 44 : 18;
  const pupilSymmetryScore = (88 + Math.random() * 10).toFixed(1);
  const nuclearOpacityGrade =
    stageKey === 'NORMAL' ? 'Grade 0 (Clear)' :
    stageKey === 'MILD' ? 'Grade 1 (Trace)' :
    stageKey === 'MODERATE' ? 'Grade 2+ (Moderate)' :
    'Grade 4 (Dense Mature)';

  return {
    id: 'SCAN-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    aiModel: 'MobileNetV2 (Ugandan Eye Fine-tuned v2.4)',
    diagnosis: stage.label,
    stageKey,
    confidenceScore: parseFloat(confidence),
    color: stage.color,
    description: stage.description,
    recommendation: stage.recommendation,
    imageUri,
    metrics: {
      lensClarityIndex,
      pupilSymmetryScore: parseFloat(pupilSymmetryScore),
      nuclearOpacityGrade,
      corticalOpacification: stageKey === 'NORMAL' ? '0%' : stageKey === 'MILD' ? '18%' : stageKey === 'MODERATE' ? '48%' : '86%',
      processingTimeMs: Math.floor(650 + Math.random() * 300),
    },
  };
}
