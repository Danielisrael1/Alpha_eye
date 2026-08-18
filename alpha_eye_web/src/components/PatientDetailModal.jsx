import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Printer, ArrowLeft } from 'lucide-react';

const STAGES = {
  NORMAL: { label: 'Normal Lens', badgeClass: 'badge-normal', color: '#059669', desc: 'Clear crystalline lens, no pathological opacities detected.', rec: 'Routine annual eye checkup recommended.' },
  MILD: { label: 'Mild Cataract', badgeClass: 'badge-mild', color: '#0284c7', desc: 'Early nuclear or cortical opacity present with slight light scatter.', rec: 'Ophthalmic re-evaluation in 3-6 months.' },
  MODERATE: { label: 'Moderate Cataract', badgeClass: 'badge-moderate', color: '#d97706', desc: 'Significant nuclear sclerosis/cortical cloudiness causing visual acuity loss.', rec: 'Specialist consultation for surgical scheduling within 4 weeks.' },
  SEVERE: { label: 'Severe Cataract', badgeClass: 'badge-severe', color: '#dc2626', desc: 'Dense mature/hypermature cataract with profound vision impairment.', rec: 'URGENT priority referral for surgical extraction.' },
};

export default function PatientDetailModal({ patient, onClose, onUpdatePatient }) {
  const [stage, setStage] = useState(patient?.stageKey || 'MODERATE');
  const [hospital, setHospital] = useState(patient?.assignedHospital || 'Mengo Hospital Eye Dept');
  const [notes, setNotes] = useState(patient?.doctorNotes || '');
  const [saved, setSaved] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  if (!patient) return null;

  const info = STAGES[stage] || STAGES.MODERATE;

  const handleSave = (status = 'Verified') => {
    onUpdatePatient({ ...patient, stageKey: stage, diagnosis: info.label, assignedHospital: hospital, doctorNotes: notes, status });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 920 }}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>

        {showReferral ? (
          <>
            <div className="flex-between" style={{ marginBottom: 20 }}>
              <button className="btn btn-outline" onClick={() => setShowReferral(false)}>
                <ArrowLeft size={16} /> Return to Clinical Examination
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={16} /> Print Official MoH Referral Notice
              </button>
            </div>
            <div className="referral-doc">
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 24 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569' }}>
                  REPUBLIC OF UGANDA · MINISTRY OF HEALTH
                </div>
                <h2 style={{ fontSize: '1.35rem', color: '#0f172a', margin: '4px 0', fontWeight: 700 }}>
                  NATIONAL OPHTHALMIC REFERRAL NOTICE
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Community Cataract Screening Network · Kampala & Wakiso District
                </p>
              </div>

              <div className="grid-2" style={{ marginBottom: 20, fontSize: '0.88rem', gap: 24 }}>
                <div>
                  <p style={{ margin: '0 0 4px 0' }}><strong>REFERRAL FORM ID:</strong> <span style={{ fontFamily: 'monospace' }}>REF-2026-{patient.id}</span></p>
                  <p style={{ margin: '0 0 4px 0' }}><strong>DATE OF ISSUE:</strong> {new Date().toLocaleDateString('en-GB')}</p>
                  <p style={{ margin: '0 0 4px 0' }}><strong>DESTINATION HOSPITAL:</strong> {hospital}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0' }}><strong>REFERRING CLINICIAN:</strong> Dr. Musiime Phionah (Reg #MOH-882)</p>
                  <p style={{ margin: '0 0 4px 0' }}><strong>OUTREACH VHT:</strong> {patient.vhtName}</p>
                  <p style={{ margin: '0 0 4px 0' }}><strong>HEALTH ZONE:</strong> {patient.location}</p>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, marginBottom: 20, border: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
                <strong>PATIENT IDENTITY:</strong> {patient.patientName} &nbsp;|&nbsp; <span style={{ fontFamily: 'monospace' }}>{patient.patientId}</span> &nbsp;|&nbsp; {patient.age} Yrs ({patient.gender}) &nbsp;|&nbsp; Affected: <strong>{patient.eyeSide}</strong>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', marginBottom: 24 }}>
                <tbody>
                  <tr style={{ background: '#f8fafc' }}>
                    <td style={{ padding: '10px 14px', border: '1px solid #cbd5e1', width: '30%', fontWeight: 700 }}>AI Classification</td>
                    <td style={{ padding: '10px 14px', border: '1px solid #cbd5e1', color: info.color, fontWeight: 700 }}>
                      {info.label} ({patient.confidenceScore}% Model Confidence)
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 14px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Diagnostic Finding</td>
                    <td style={{ padding: '10px 14px', border: '1px solid #cbd5e1' }}>{info.desc}</td>
                  </tr>
                  <tr style={{ background: '#f8fafc' }}>
                    <td style={{ padding: '10px 14px', border: '1px solid #cbd5e1', fontWeight: 700 }}>Clinician Notes</td>
                    <td style={{ padding: '10px 14px', border: '1px solid #cbd5e1' }}>{notes || 'Priority ophthalmic evaluation and surgical consult recommended.'}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>AUTHORIZING OPHTHALMOLOGIST SIGNATURE</p>
                  <div style={{ borderBottom: '1.5px solid #0f172a', width: 200, marginTop: 24 }} />
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, margin: '4px 0 0 0', color: '#0f172a' }}>Dr. Musiime Phionah, MD</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>MOH DIGITAL VERIFICATION HASH</p>
                  <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: '#2563eb', margin: '4px 0 0 0' }}>
                    AE-2026-UG-MOH-{patient.id.replace('SCR-', '')}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid #e2e8f0' }}>
              <img src={patient.imageUrl} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{patient.patientName}</h2>
                  <span className={`badge ${info.badgeClass}`}>
                    <span className="badge-dot" />
                    {info.label}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                  ID: <span className="patient-id-tag">{patient.patientId}</span> · {patient.age} yrs · {patient.gender} · Location: {patient.location}
                </p>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 28 }}>
              {/* Left Column: Anterior Segment Scan Viewer */}
              <div>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Anterior Segment Scan ({patient.eyeSide})
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                    RESOL: 1920x1080
                  </span>
                </div>

                <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #cbd5e1', marginBottom: 14, position: 'relative', background: '#000' }}>
                  <img src={patient.eyeImageUrl} alt="Eye Scan" style={{ width: '100%', height: 250, objectFit: 'cover', display: 'block', opacity: 0.95 }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15, 23, 42, 0.75)', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                    MobileNetV2 ROI Grid Active
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 10 }}>
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Field Collector</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>{patient.vhtName}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Capture Timestamp</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: 2 }}>{patient.date}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Quantitative Analysis & Physician Override */}
              <div>
                <label className="form-label">Neural Network Quantitative Output</label>
                
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 16, borderRadius: 10, marginBottom: 18 }}>
                  <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Classification Confidence</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{patient.confidenceScore}% Score</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${patient.confidenceScore}%`, background: '#2563eb' }} />
                  </div>

                  <div className="flex-between" style={{ fontSize: '0.78rem', marginTop: 14, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Lens Opacity Grading</span>
                    <span style={{ fontWeight: 700, color: info.color }}>{info.label}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: stage === 'SEVERE' ? '92%' : stage === 'MODERATE' ? '65%' : stage === 'MILD' ? '35%' : '10%',
                        background: info.color
                      }}
                    />
                  </div>
                </div>

                {/* Doctor Confirmation Controls */}
                <div className="form-group">
                  <label className="form-label">Physician Diagnosis Confirmation</label>
                  <select className="form-select" value={stage} onChange={(e) => setStage(e.target.value)}>
                    <option value="NORMAL">Normal Lens (Clear)</option>
                    <option value="MILD">Mild Cataract (Grade 1)</option>
                    <option value="MODERATE">Moderate Cataract (Grade 2)</option>
                    <option value="SEVERE">Severe / Mature Cataract (Grade 3+)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Referral Facility</label>
                  <select className="form-select" value={hospital} onChange={(e) => setHospital(e.target.value)}>
                    <option>Mengo Hospital Eye Dept</option>
                    <option>Mulago National Referral Hospital</option>
                    <option>City Eye Care Kampala</option>
                    <option>Rubaga Hospital Ophthalmic Clinic</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Clinical Observations</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter clinical examination notes or surgical instructions..."
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleSave('Verified')}>
                    <CheckCircle2 size={16} /> {saved ? 'Verified & Saved!' : 'Confirm Diagnosis'}
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { handleSave('Referred'); setShowReferral(true); }}>
                    <FileText size={16} /> Issue Official Referral
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

