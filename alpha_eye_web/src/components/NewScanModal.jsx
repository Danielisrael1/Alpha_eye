import React, { useState } from 'react';
import { X, Upload, Eye, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { analyzeEyeScan } from '../services/aiClassifier';
import { uploadEyeImage } from '../services/database';
import { IMAGE_PLACEHOLDER, onImageError } from '../utils/imagePlaceholder';

export default function NewScanModal({ onClose, onAddNewScan }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('56');
  const [gender, setGender] = useState('Female');
  const [location, setLocation] = useState('Kasubi Division, Kampala');
  const [eyeSide, setEyeSide] = useState('Right Eye');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(IMAGE_PLACEHOLDER);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); }
  };

  const runAi = async () => {
    if (!name.trim()) return alert('Please enter patient name');
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const r = await analyzeEyeScan(file || preview);
      setResult(r);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Failed to analyze the image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const save = async () => {
    if (!result) return;
    setSaving(true);
    const id = 'SCR-2026-' + Math.floor(100 + Math.random() * 900);

    // preview is a blob: URL when a file was picked - only valid in this
    // tab, so persist the actual bytes before anyone else can view it.
    let persistedImageUrl = IMAGE_PLACEHOLDER;
    if (file) {
      const uploadedUrl = await uploadEyeImage(file, id);
      persistedImageUrl = uploadedUrl || IMAGE_PLACEHOLDER;
    }

    onAddNewScan({
      id,
      patientId: 'UG-KLA-' + Math.floor(1000 + Math.random() * 9000),
      patientName: name,
      age: parseInt(age) || 50,
      gender,
      location,
      vhtName: 'Direct Clinical Scan',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      eyeSide,
      eyeImageUrl: persistedImageUrl,
      diagnosis: result.diagnosis,
      stageKey: result.stageKey,
      confidenceScore: result.confidenceScore,
      status: 'Pending Verification',
      doctorNotes: '',
      assignedHospital: 'Mengo Hospital Eye Dept',
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 740 }}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Eye color="var(--color-brand)" size={22} /> New Field Screening Encounter
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Upload anterior eye photo for automated MobileNetV2 cataract grading and triage.
          </p>
        </div>

        <div className="grid-2" style={{ gap: 24 }}>
          {/* Patient Details */}
          <div>
            <div className="form-group">
              <label className="form-label">Patient Full Name</label>
              <input className="form-input" placeholder="e.g. Namusoke Prossy" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Age (Years)</label>
                <input className="form-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Division / Parish Location</label>
              <input className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Affected Eye</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Right Eye', 'Left Eye', 'Both Eyes'].map((s) => (
                  <button key={s} className={`filter-pill ${eyeSide === s ? 'active' : ''}`} onClick={() => setEyeSide(s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Photo & AI Analysis */}
          <div>
            <div style={{ borderRadius: 10, overflow: 'hidden', height: 170, position: 'relative', marginBottom: 14, background: 'var(--bg-muted)' }}>
              <img src={preview} alt="Eye preview" onError={onImageError} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <label style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.4)', color: '#fff', transition: 'background 0.15s ease' }}>
                <Upload size={24} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: 6 }}>Select Eye Photo</span>
                <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </label>
            </div>

            {!result ? (
              <>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px 0' }} onClick={runAi} disabled={analyzing}>
                  <Eye size={16} /> {analyzing ? 'Processing Classifier (may take up to a minute)...' : 'Run MobileNetV2 Diagnostic AI'}
                </button>
                {analysisError && (
                  <p style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: 8 }}>{analysisError}</p>
                )}
              </>
            ) : (
              <div style={{ borderRadius: 10, padding: 14, background: 'var(--bg-muted)' }}>
                <div className="flex-between" style={{ marginBottom: 6 }}>
                  <span className={`badge badge-${result.stageKey.toLowerCase()}`}>{result.diagnosis}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{result.confidenceScore}% Confidence</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>{result.recommendation}</p>
                <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={save} disabled={saving}>
                  <CheckCircle2 size={16} /> {saving ? 'Saving...' : 'Save Record to Screening Queue'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

