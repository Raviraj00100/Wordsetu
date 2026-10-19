import React, { useState } from 'react';
import {
  Settings, Globe, Type, Volume2, Shield, Download,
  Upload, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES } from '../../data/languages';
import { kathaSetuDb } from '../../services/db';

interface SettingsViewProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenAdmin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onOpenAdmin
}) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('kathasetu_reader_theme') || 'light');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('kathasetu_reader_fontsize') || 'medium');
  const [audioSpeed, setAudioSpeed] = useState(() => localStorage.getItem('wordsetu_audio_speed') || '1.0');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const handleExportBackup = async () => {
    try {
      const json = await kathaSetuDb.exportFullDatabase();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wordsetu_kathasetu_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupStatus('Backup exported successfully!');
    } catch (e: any) {
      setBackupStatus(`Export failed: ${e.message}`);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const res = await kathaSetuDb.importDatabaseBackup(text);
        setBackupStatus(`Successfully restored ${res.importedCount} stories! Please refresh to view.`);
      } catch (err: any) {
        setBackupStatus(`Restore failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container" style={{ maxWidth: '820px', margin: '20px auto 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          color: '#2563eb',
          background: '#eff6ff',
          padding: '4px 12px',
          borderRadius: '9999px',
          border: '1px solid #bfdbfe'
        }}>
          Preferences & Data
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '30px',
          fontWeight: 800,
          color: '#0f172a',
          marginTop: '8px'
        }}>
          Platform Settings
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
          Customize your reading typography, configure native Indian language meanings, and manage offline data backups.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Language Selection */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Globe size={20} color="#2563eb" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Meaning & Vocabulary Language
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Select your preferred Indian language for daily vocabulary translations, example sentences, and search definitions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {SUPPORTED_LANGUAGES.map(lang => {
              const isSelected = lang.code === selectedLanguage.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelectLanguage(lang)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#1d4ed8' : '#334155',
                    fontSize: '13px',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div>{lang.name}</div>
                  <div style={{ fontSize: '11px', color: isSelected ? '#2563eb' : '#94a3b8' }}>{lang.nativeName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reader Typography Preferences */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Type size={20} color="#7c3aed" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Story Reader Defaults
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Default Font Size
              </label>
              <select
                value={fontSize}
                onChange={e => {
                  setFontSize(e.target.value);
                  localStorage.setItem('kathasetu_reader_fontsize', e.target.value);
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              >
                <option value="small">Small (16px)</option>
                <option value="medium">Medium (19px) - Default</option>
                <option value="large">Large (22px)</option>
                <option value="xlarge">Extra Large (26px)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Default Theme
              </label>
              <select
                value={theme}
                onChange={e => {
                  setTheme(e.target.value);
                  localStorage.setItem('kathasetu_reader_theme', e.target.value);
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              >
                <option value="light">Light (Clean Paper)</option>
                <option value="sepia">Sepia (Warm Book)</option>
                <option value="dark">Dark (Night Reading)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audio Speech Synthesis Defaults */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Volume2 size={20} color="#059669" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Audio Read Aloud Speed
            </h2>
          </div>

          <div style={{ maxWidth: '300px' }}>
            <select
              value={audioSpeed}
              onChange={e => {
                setAudioSpeed(e.target.value);
                localStorage.setItem('wordsetu_audio_speed', e.target.value);
              }}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            >
              <option value="0.75">0.75x (Measured, Learner-friendly)</option>
              <option value="0.92">0.92x (Natural Measured) - Default</option>
              <option value="1.0">1.0x (Standard Speed)</option>
              <option value="1.25">1.25x (Fast)</option>
            </select>
          </div>
        </div>

        {/* Backup and Restore */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Download size={20} color="#d97706" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Backup & Restore
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Export your entire library, bookmarks, saved vocabulary, and quiz history to a JSON file.
          </p>

          {backupStatus && (
            <div style={{
              fontSize: '13px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: backupStatus.includes('failed') ? '#fef2f2' : '#ecfdf5',
              color: backupStatus.includes('failed') ? '#991b1b' : '#065f46',
              marginBottom: '16px'
            }}>
              {backupStatus}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportBackup}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>Export Full Backup</span>
            </button>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Upload size={16} />
              <span>Restore from Backup</span>
              <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Administrator Access Card */}
        <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                <Shield size={18} color="#2563eb" />
                <span>Administrator Dashboard</span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Access batch import pipelines, story publishing controls, and 4,000 story targets.
              </p>
            </div>
            <button
              onClick={onOpenAdmin}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Open Admin Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
