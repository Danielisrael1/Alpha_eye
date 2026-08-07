import React from 'react';
import { Eye, LayoutDashboard, ListChecks, FileText, MapPin, BarChart3, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'queue', label: 'Screening Queue', icon: ListChecks },
  { id: 'referrals', label: 'Referrals', icon: FileText },
  { id: 'facilities', label: 'Eye Clinics', icon: MapPin },
  { id: 'stats', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Eye size={22} />
        </div>
        <div>
          <h1>AlphaEye</h1>
          <div className="tagline">Clinical Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
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
  );
}

