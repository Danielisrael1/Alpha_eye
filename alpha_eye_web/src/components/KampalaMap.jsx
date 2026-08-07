import React, { useState } from 'react';
import { EYE_FACILITIES, VHT_OUTREACH_TEAMS } from '../services/mockDatabase';
import { MapPin, Phone, Mail, ShieldCheck, Users } from 'lucide-react';

export default function KampalaMap() {
  const [selectedFacility, setSelectedFacility] = useState(EYE_FACILITIES[0]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
      {/* Left Column: Interactive Map View & Facilities */}
      <div className="card">
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Kampala & Wakiso Ophthalmic Network</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Partner referral hospitals & VHT community screening field units
            </p>
          </div>
          <span className="badge badge-normal">
            <span className="badge-dot" />
            4 Regional Centers
          </span>
        </div>

        {/* Map Visualization Container */}
        <div
          style={{
            position: 'relative',
            height: 360,
            borderRadius: 12,
            overflow: 'hidden',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            marginBottom: 24,
            backgroundImage: 'radial-gradient(circle at 50% 50%, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        >
          {/* Map Grid overlay */}
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255, 255, 255, 0.95)', padding: '6px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.75rem', color: 'var(--text-muted)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>Coverage Zones:</span> Kasubi · Nateete · Kisenyi · Bwaise · Wakiso
          </div>

          {/* Simulated Facility Map Pins */}
          {EYE_FACILITIES.map((fac, idx) => {
            const isSelected = selectedFacility.id === fac.id;
            const topPositions = ['35%', '20%', '55%', '70%'];
            const leftPositions = ['30%', '60%', '45%', '25%'];
            return (
              <button
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                style={{
                  position: 'absolute',
                  top: topPositions[idx],
                  left: leftPositions[idx],
                  background: isSelected ? '#2563eb' : '#ffffff',
                  border: isSelected ? '2px solid #ffffff' : '1px solid #2563eb',
                  color: isSelected ? '#ffffff' : '#2563eb',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  zIndex: isSelected ? 10 : 1
                }}
              >
                <MapPin size={14} color={isSelected ? '#ffffff' : '#2563eb'} />
                {fac.name.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Selected Facility Details Card */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20 }}>
          <div className="flex-between" style={{ marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {selectedFacility.category}
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2px 0 0 0', color: 'var(--text-main)' }}>
                {selectedFacility.name}
              </h4>
            </div>
            <span className="badge badge-normal">
              <span className="badge-dot" />
              {selectedFacility.status}
            </span>
          </div>

          <div className="grid-2" style={{ fontSize: '0.82rem', marginTop: 16 }}>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="#64748b" /> {selectedFacility.location} ({selectedFacility.distance})
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Phone size={16} color="#64748b" /> {selectedFacility.phone}
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={16} color="#64748b" /> {selectedFacility.email}
            </div>
            <div style={{ color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="#059669" /> Surgical Capacity: {selectedFacility.surgicalCapacity}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: VHT Outreach Teams Panel */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>VHT Field Coverage</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Community Outreach Units</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {VHT_OUTREACH_TEAMS.map((team, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, background: '#ffffff' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>{team.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                Lead: {team.leader}
              </div>
              <div className="flex-between" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: '#0369a1', fontWeight: 600, background: '#f0f9ff', padding: '3px 8px', borderRadius: 4, border: '1px solid #bae6fd' }}>
                  {team.activeScans} Scans
                </span>
                <span style={{ color: '#b91c1c', fontWeight: 600, background: '#fef2f2', padding: '3px 8px', borderRadius: 4, border: '1px solid #fecaca' }}>
                  {team.severeCases} Severe
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

