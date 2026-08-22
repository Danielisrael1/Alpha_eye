import React from 'react';
import { Eye, LayoutDashboard, ListChecks, FileText, MapPin, BarChart3, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'queue', label: 'Screening Queue', icon: ListChecks },
  { id: 'referrals', label: 'Referrals', icon: FileText },
  { id: 'facilities', label: 'Eye Clinics', icon: MapPin },
  { id: 'stats', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Eye size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h1>AlphaEye</h1>
            <div className="tagline">Clinical Platform</div>
          </div>
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (setIsOpen) setIsOpen(false);
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span>System Operational</span>
          </div>
          <p>
            AlphaEye v2.4 (MoH)<br />
            Uganda Cataract Network<br />
            Kampala &amp; Wakiso District
          </p>
        </div>
      </aside>
    </>
  );
}
