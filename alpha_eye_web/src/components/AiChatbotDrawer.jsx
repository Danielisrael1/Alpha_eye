import React, { useState } from 'react';
import { X, Send, BrainCircuit, Stethoscope, BookOpen } from 'lucide-react';

export default function AiChatbotDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Clinical Assistant ready. You can query WHO cataract grading standards, Uganda referral pathways, or field patient communication guidelines in Luganda.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const promptText = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'AlphaEye MobileNetV2 architecture calculates nuclear opacification, pupil margin symmetry, and lens transparency index against fine-tuned Ugandan ophthalmic datasets.';

      if (promptText.includes('referral') || promptText.includes('mengo') || promptText.includes('mulago')) {
        reply = 'Referral Pathway Protocol: Moderate and Severe cases generate digital referral notices. Mengo Hospital Eye Dept accepts non-emergency surgical consults Mon-Fri 8am-4pm. Mulago Hospital accepts 24/7 ophthalmic emergencies.';
      } else if (promptText.includes('luganda') || promptText.includes('translate') || promptText.includes('language')) {
        reply = 'Luganda Field Guidelines: "Okukebera amaaso" = Eye examination. "Laba mu ttaala eno obutanyenya maaso" = Look into the device light without moving eyes.';
      } else if (promptText.includes('stage') || promptText.includes('grade') || promptText.includes('who')) {
        reply = 'WHO Cataract Staging: Grade 0 (Clear Lens), Grade 1 (Mild Cortical/Nuclear Sclerosis), Grade 2 (Moderate Visual Impairment), Grade 3-4 (Severe/Dense Mature Cataract requiring extraction).';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="chatbot-panel">
      {/* Header */}
      <div className="chatbot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BrainCircuit size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Clinical Diagnostic Assistant</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>AlphaEye Ophthalmic Knowledge Base</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-bubble ${m.sender}`}>
            {m.text}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.75rem', paddingLeft: 4 }}>
            Querying clinical knowledge engine...
          </div>
        )}
      </div>

      {/* Quick Clinical Prompts */}
      <div style={{ padding: '8px 12px', background: 'var(--bg-surface)', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {['Mengo Protocol', 'Luganda Phrases', 'WHO Staging'].map((tag) => (
          <button
            key={tag}
            onClick={() => setInput(tag)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: 'var(--bg-muted)',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.72rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Ask clinical or referral protocol questions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

