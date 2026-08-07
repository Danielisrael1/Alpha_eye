import React from 'react';
import { Calendar, MapPin, Building, Printer, ChevronRight } from 'lucide-react';

const STAGE_BADGE = {
  NORMAL: 'badge-normal',
  MILD: 'badge-mild',
  MODERATE: 'badge-moderate',
  SEVERE: 'badge-severe',
};

const STAGE_LABEL = {
  NORMAL: 'Normal Lens',
  MILD: 'Mild Cataract',
  MODERATE: 'Moderate Cataract',
  SEVERE: 'Severe Cataract',
};

export default function ReferralManager({ screenings, onSelectPatient }) {
  const referredPatients = screenings.filter((s) => s.status === 'Referred' || (s.assignedHospital && s.assignedHospital !== 'N/A'));

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Ophthalmic Hospital Referral Pipeline</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Active surgical pathways and clinical referrals to Mengo, Mulago & Partner Eye Hospitals.
          </p>
        </div>
        <span className="badge badge-pending" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
          <span className="badge-dot" />
          {referredPatients.length} Active Referrals Tracked
        </span>
      </div>

      <div className="grid-3" style={{ gap: 20 }}>
        {referredPatients.map((patient) => {
          const badgeClass = STAGE_BADGE[patient.stageKey] || 'badge-moderate';
          const label = STAGE_LABEL[patient.stageKey] || patient.diagnosis;
          
          return (
            <div key={patient.id} className="card" style={{ marginBottom: 0 }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <span className={`badge ${badgeClass}`}>
                  <span className="badge-dot" />
                  {label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)' }}>
                  <Calendar size={12} /> {patient.date.split(' ')[0]}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <img
                  src={patient.imageUrl}
                  alt=""
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{patient.patientName}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span className="patient-id-tag">{patient.patientId}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{patient.age}y ({patient.gender})</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} color="#64748b" /> {patient.location}
                  </p>
                </div>
              </div>

              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '10px 14px', borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: '0.7rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Destination Facility</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0c4a6e', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Building size={14} color="#0284c7" /> {patient.assignedHospital}
                </div>
              </div>

              <button
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onSelectPatient(patient)}
              >
                <Printer size={14} /> Open Referral Form <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

