import React from 'react';
import { Search, Bell, ShieldCheck, ChevronRight, Menu } from 'lucide-react';

export default function TopHeader({ title, searchTerm, onSearchChange, onToggleSidebar }) {
  return (
    <div className="top-header">
      <div className="header-title-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <button className="mobile-header-toggle" onClick={onToggleSidebar}>
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Republic of Uganda MoH</span>
            <ChevronRight size={12} />
            <span>Ophthalmic Care</span>
            <ChevronRight size={12} />
            <span>Central Division</span>
          </div>
        </div>
        <h2>{title}</h2>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search patient ID, name, VHT zone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="shortcut-hint">⌘K</span>
        </div>

        <div className="user-profile">
          <button style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: 8, padding: 7, cursor: 'pointer', color: '#475569', position: 'relative' }}>
            <Bell size={18} />
            <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: '#dc2626' }} />
          </button>
          <div className="user-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <p>Dr. Musiime Phionah</p>
              <ShieldCheck size={14} color="#059669" />
            </div>
            <p>Senior Ophthalmic Surgeon · Mengo Hospital</p>
          </div>
          <div className="user-avatar">MP</div>
        </div>
      </div>
    </div>
  );
}
