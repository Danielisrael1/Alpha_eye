import React, { useState, useEffect } from 'react';
import { fetchFacilities, fetchVhtTeams } from '../services/database';
import { MapPin, Phone, Mail, ShieldCheck, Users, Loader2 } from 'lucide-react';

export default function KampalaMap() {
  const [facilities, setFacilities] = useState([]);
  const [vhtTeams, setVhtTeams] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [facs, teams] = await Promise.all([
          fetchFacilities(),
          fetchVhtTeams()
        ]);
        setFacilities(facs);
        setVhtTeams(teams);
        if (facs.length > 0) {
          setSelectedFacility(facs[0]);
        }
      } catch (err) {
        console.error('Error loading map data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        <Loader2 className="lucide-spin" size={32} style={{ marginBottom: 16 }} />
        <p>Loading network data securely from Supabase...</p>
      </div>
    );
  }

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
            background: 'var(--bg-muted)',
            marginBottom: 24
          }}
        >
          {/* Map Grid overlay */}
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--color-brand)', fontWeight: 700 }}>Coverage Zones:</span> Kasubi · Nateete · Kisenyi · Bwaise · Wakiso
          </div>

          {/* Simulated Facility Map Pins */}
          {facilities.map((fac, idx) => {
            const isSelected = selectedFacility?.id === fac.id;
            const topPositions = ['35%', '20%', '55%', '70%'];
            const leftPositions = ['30%', '60%', '45%', '25%'];
            return (
              <button
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                style={{
                  position: 'absolute',
                  top: topPositions[idx % topPositions.length],
                  left: leftPositions[idx % leftPositions.length],
                  background: isSelected ? 'var(--color-brand)' : 'var(--bg-surface)',
                  border: 'none',
                  color: isSelected ? '#ffffff' : 'var(--color-brand)',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                  transition: 'background 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  zIndex: isSelected ? 10 : 1
                }}
              >
                <MapPin size={14} color={isSelected ? '#ffffff' : 'var(--color-brand)'} />
                {fac.name.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Selected Facility Details Card */}
        {selectedFacility && (
        <div style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: 20 }}>
          <div className="flex-between" style={{ marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-brand)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
              <MapPin size={16} color="var(--text-muted)" /> {selectedFacility.location} ({selectedFacility.distance})
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Phone size={16} color="var(--text-muted)" /> {selectedFacility.phone}
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={16} color="var(--text-muted)" /> {selectedFacility.email}
            </div>
            <div style={{ color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="#059669" /> Surgical Capacity: {selectedFacility.surgicalCapacity}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Right Column: VHT Outreach Teams Panel */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-brand-muted)', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>VHT Field Coverage</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Community Outreach Units</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {vhtTeams.map((team, i) => (
            <div key={i} style={{ borderRadius: 8, padding: 14, background: 'var(--bg-muted)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>{team.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                Lead: {team.leader}
              </div>
              <div className="flex-between" style={{ fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-brand)', fontWeight: 600, background: 'var(--color-brand-muted)', padding: '3px 8px', borderRadius: 4 }}>
                  {team.activeScans} Scans
                </span>
                <span style={{ color: '#b91c1c', fontWeight: 600, background: 'var(--status-severe-bg)', padding: '3px 8px', borderRadius: 4 }}>
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

