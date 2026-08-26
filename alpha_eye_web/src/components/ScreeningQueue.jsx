import React, { useState } from 'react';
import { ChevronRight, Clock, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import PatientAvatar from './PatientAvatar';

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

export default function ScreeningQueue({ screenings, onSelectPatient }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = screenings.filter((s) => {
    const term = search.toLowerCase();
    const matchesSearch =
      s.patientName.toLowerCase().includes(term) ||
      s.patientId.toLowerCase().includes(term) ||
      s.location.toLowerCase().includes(term) ||
      s.vhtName.toLowerCase().includes(term);
    if (!matchesSearch) return false;
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return s.status === 'Pending Verification';
    if (filter === 'SEVERE') return s.stageKey === 'SEVERE';
    if (filter === 'REFERRED') return s.status === 'Referred';
    return true;
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>Community Ophthalmic Screening Queue</h3>
          <div className="card-subtitle">Real-time VHT field captures from Kampala & Wakiso Divisions</div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="search-box" style={{ width: 220, padding: '6px 12px' }}>
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Filter queue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            />
          </div>

          <div className="filter-row">
            {[
              { id: 'ALL', label: 'All Records' },
              { id: 'PENDING', label: 'Pending Review' },
              { id: 'SEVERE', label: 'Severe' },
              { id: 'REFERRED', label: 'Referred' },
            ].map((f) => (
              <button
                key={f.id}
                className={`filter-pill ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient Record</th>
              <th>Location & Field VHT</th>
              <th>AI Diagnostic Result</th>
              <th>Model Confidence</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: 36, color: '#94a3b8' }}>
                  No screening records match your current filter parameters.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} onClick={() => onSelectPatient(s)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <PatientAvatar name={s.patientName} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.patientName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <span className="patient-id-tag">{s.patientId}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            · {s.age}y · {s.gender}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{s.location}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.vhtName}</div>
                  </td>
                  <td>
                    <span className={`badge ${STAGE_BADGE[s.stageKey] || 'badge-moderate'}`}>
                      <span className="badge-dot" />
                      {STAGE_LABEL[s.stageKey] || s.diagnosis}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 100 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                        <span>Score</span>
                        <span>{s.confidenceScore}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${s.confidenceScore}%`,
                            background: 'var(--color-brand)'
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    {s.status === 'Pending Verification' && (
                      <span className="badge badge-pending">
                        <Clock size={12} /> Pending Review
                      </span>
                    )}
                    {s.status === 'Verified' && (
                      <span className="badge badge-verified">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    )}
                    {s.status === 'Referred' && (
                      <span className="badge badge-referred">
                        <AlertCircle size={12} /> Referred
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); onSelectPatient(s); }}>
                      Review <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

