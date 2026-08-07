import React from 'react';
import { Eye, ShieldCheck, Cpu, UserCheck, Bell, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenNewScan, onOpenChatbot }) {
  return (
    <header className="glass-panel no-print" style={{ borderRadius: '0 0 16px 16px', marginBottom: '24px', padding: '14px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)'
          }}>
            <Eye size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AlphaEye <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.4)', verticalAlign: 'middle' }}>CLOUD AI</span>
              </h1>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot"></span> MobileNetV2 Cataract Classifier • Mengo/Mulago Protocol
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'dashboard' ? 'rgba(14, 165, 233, 0.25)' : 'transparent',
              color: activeTab === 'dashboard' ? '#38bdf8' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'queue' ? 'rgba(14, 165, 233, 0.25)' : 'transparent',
              color: activeTab === 'queue' ? '#38bdf8' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Screening Queue
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'referrals' ? 'rgba(14, 165, 233, 0.25)' : 'transparent',
              color: activeTab === 'referrals' ? '#38bdf8' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Referrals
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'facilities' ? 'rgba(14, 165, 233, 0.25)' : 'transparent',
              color: activeTab === 'facilities' ? '#38bdf8' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            Eye Clinics & Map
          </button>
        </nav>

        {/* Action Buttons & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenChatbot}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#c084fc',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} /> AI Assistant
          </button>

          <button
            onClick={onOpenNewScan}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <Eye size={16} /> New Eye Scan
          </button>

          <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.1)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>Dr. Musiime Phionah</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>Ophthalmologist • Mengo</p>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              MP
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
