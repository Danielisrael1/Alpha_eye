import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import MetricsOverview from './components/MetricsOverview';
import ScreeningQueue from './components/ScreeningQueue';
import PatientDetailModal from './components/PatientDetailModal';
import NewScanModal from './components/NewScanModal';
import ReferralManager from './components/ReferralManager';
import KampalaMap from './components/KampalaMap';
import AiChatbotDrawer from './components/AiChatbotDrawer';
import { fetchScreenings, updateScreening, addScreening } from './services/database';
import { Plus, BrainCircuit, Loader2 } from 'lucide-react';

export default function App() {
  const [screenings, setScreenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isNewScanOpen, setIsNewScanOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchScreenings();
        setScreenings(data);
      } catch (err) {
        console.error("Error loading screenings", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdatePatient = async (updatedRecord) => {
    // Optimistic UI update
    setScreenings((prev) =>
      prev.map((s) => (s.id === updatedRecord.id ? updatedRecord : s))
    );
    setSelectedPatient(updatedRecord);
    
    // Background DB update
    try {
      await updateScreening(updatedRecord.id, updatedRecord);
    } catch (err) {
      console.error('Failed to update in DB', err);
    }
  };

  const handleAddNewScan = async (newRecord) => {
    try {
      const addedRecord = await addScreening(newRecord);
      const recordToUse = addedRecord || newRecord;
      setScreenings((prev) => [recordToUse, ...prev]);
      setSelectedPatient(recordToUse);
    } catch (err) {
      console.error('Failed to add in DB', err);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        <TopHeader 
          title={
            activeTab === 'dashboard' ? 'National Cataract Dashboard' :
            activeTab === 'queue' ? 'Screening & Triage Queue' :
            activeTab === 'referrals' ? 'Ophthalmic Hospital Referrals' :
            activeTab === 'facilities' ? 'Eye Clinics & Facility Directory' : 'Analytical Insights'
          }
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing active screening data for <strong style={{ color: 'var(--text-main)' }}>Kampala & Wakiso District</strong>
          </div>
          <button className="btn btn-primary" onClick={() => setIsNewScanOpen(true)}>
            <Plus size={16} /> New Field Screening Scan
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Loader2 className="lucide-spin" size={32} style={{ marginBottom: 16 }} />
            <p>Loading screening data securely from Supabase...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
          <>
            <MetricsOverview screenings={screenings} />
            <ScreeningQueue
              screenings={screenings}
              onSelectPatient={(patient) => setSelectedPatient(patient)}
            />
          </>
        )}

        {activeTab === 'queue' && (
          <ScreeningQueue
            screenings={screenings}
            onSelectPatient={(patient) => setSelectedPatient(patient)}
          />
        )}

        {activeTab === 'referrals' && (
          <ReferralManager
            screenings={screenings}
            onSelectPatient={(patient) => setSelectedPatient(patient)}
          />
        )}

        {activeTab === 'facilities' && <KampalaMap />}

        {activeTab === 'stats' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3>Epidemiological Analytics</h3>
                <div className="card-subtitle">Cataract prevalence and screening density by division</div>
              </div>
            </div>
            <div className="grid-2" style={{ gap: 20 }}>
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                  Division Prevalence Distribution
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Kasubi & Nateete</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Account for 62% of moderate-to-severe cataract findings in field screenings.</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                  Surgical Conversion Rate
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>84.2% Verified</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Patient referral compliance rate from VHT field triage to Mengo Eye Dept.</div>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </main>

      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onUpdatePatient={handleUpdatePatient}
      />

      {isNewScanOpen && (
        <NewScanModal
          onClose={() => setIsNewScanOpen(false)}
          onAddNewScan={handleAddNewScan}
        />
      )}

      {/* Understated Clinical Assistant Floating Toggle Button */}
      <button 
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          padding: '10px 18px',
          borderRadius: 30,
          background: '#0f172a',
          color: '#ffffff',
          border: '1px solid #1e293b',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          zIndex: 550,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.82rem',
          fontWeight: 600,
          fontFamily: 'var(--font-sans)',
          transition: 'all 0.15s ease'
        }}
      >
        <BrainCircuit size={18} color="#3b82f6" />
        <span>Clinical AI Assistant</span>
      </button>

      <AiChatbotDrawer
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}

