import React from 'react';
import { Eye, AlertTriangle, Clock, FileCheck, TrendingUp } from 'lucide-react';

export default function StatCards({ screenings }) {
  const total = screenings.length;
  const severe = screenings.filter((s) => s.stageKey === 'SEVERE').length;
  const moderate = screenings.filter((s) => s.stageKey === 'MODERATE').length;
  const pending = screenings.filter((s) => s.status === 'Pending Verification').length;
  const referred = screenings.filter((s) => s.status === 'Referred').length;

  const cards = [
    { 
      label: 'Total Screenings', 
      value: total, 
      trend: 'Kampala & Wakiso Outreach',
      icon: Eye, 
      colorClass: 'emerald' 
    },
    { 
      label: 'Cataract Detected', 
      value: severe + moderate, 
      trend: `${Math.round(((severe + moderate) / (total || 1)) * 100)}% Positivity Rate`,
      icon: AlertTriangle, 
      colorClass: 'amber' 
    },
    { 
      label: 'Pending Physician Review', 
      value: pending, 
      trend: 'Requires Doctor Verification',
      icon: Clock, 
      colorClass: 'indigo' 
    },
    { 
      label: 'Hospital Referrals', 
      value: referred, 
      trend: 'Sent to Mengo & Mulago',
      icon: FileCheck, 
      colorClass: 'blue' 
    },
  ];

  return (
    <div className="stat-cards">
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <div className="stat-card-main">
            <div className="stat-card-label">{c.label}</div>
            <div className="stat-card-value">{c.value}</div>
            <div className="stat-card-trend">
              <TrendingUp size={12} color="#64748b" />
              <span>{c.trend}</span>
            </div>
          </div>
          <div className={`stat-card-icon ${c.colorClass}`}>
            <c.icon size={20} />
          </div>
        </div>
      ))}
    </div>
  );
}

