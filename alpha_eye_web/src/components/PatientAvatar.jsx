import React from 'react';

const COLORS = ['#0ea5e9', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0284c7', '#db2777'];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function initialsFor(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}

export default function PatientAvatar({ name, size = 38 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: colorFor(name || ''),
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initialsFor(name || '?') || '?'}
    </div>
  );
}
