import React, { useState, useEffect } from 'react';
import {
  Shield, Play, Pause, RotateCcw, Upload, Plus,
  CheckCircle2, AlertTriangle, Layers, Database,
  FileText, Check, Trash2, Edit3, X
} from 'lucide-react';
import { Story, StoryLanguage, LanguageStoryStats } from '../../types/story';
import { KathaSetuEngine } from '../../services/kathaSetuEngine';
import { kathaSetuDb } from '../../services/db';
import { STORY_CATEGORIES } from '../../data/storyCategories';

export const AdminDashboard: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('kathasetu_admin_auth') === 'true';
  });

  const [stats, setStats] = useState<LanguageStoryStats | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchTargetLang, setBatchTargetLang] = useState<StoryLanguage | 'all'>('all');
  const [batchSize, setBatchSize] = useState<number>(25);
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [jsonImportInput, setJsonImportInput] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // New Story Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLang, setNewLang] = useState<StoryLanguage>('en');
  const [newCategory, setNewCategory] = useState('panchatantra');
  const [newContent, setNewContent] = useState('');
  const [newMoral, setNewMoral] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const loadData = async () => {
    const s = await KathaSetuEngine.getLibraryStats();
    setStats(s);
    const all = await kathaSetuDb.getAllStories();
    setStories(all);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin360' || passcode.trim() === 'wordsetu') {
      setIsAuthenticated(true);
      localStorage.setItem('kathasetu_admin_auth', 'true');
    } else {
      alert('Incorrect administrator passcode. Default is "admin360".');
    }
  };

  const handleRunBatchStep = async () => {
    setIsBatchRunning(true);
    setBatchLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Starting batch import step (Target: ${batchTargetLang}, Batch Size: ${batchSize})...`,
      ...prev
    ]);

    try {
      const result = await KathaSetuEngine.runBatchImportStep(batchTargetLang, batchSize);
      setStats(result.currentStats);
      await loadData();

      setBatchLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Batch step finished: +${result.added} published stories, ${result.duplicatesSkipped} duplicates rejected.`,
        `Remaining needed to reach 1,000 target: English: ${result.remainingNeeded.en}, Hindi: ${result.remainingNeeded.hi}, Tamil: ${result.remainingNeeded.ta}, Malayalam: ${result.remainingNeeded.ml}`,
        ...prev
      ]);
    } catch (e: any) {
      setBatchLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Batch error: ${e.message}`,
        ...prev
      ]);
    } finally {
      setIsBatchRunning(false);
    }
  };

  const handleJsonImport = async () => {
    if (!jsonImportInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonImportInput);
      const storiesToImport: Story[] = Array.isArray(parsed) ? parsed : [parsed];

      // Validate required metadata
      for (const s of storiesToImport) {
        if (!s.title || !s.content || !s.language) {
          throw new Error('Each story must include "title", "content", and "language".');
        }
        if (!s.id) s.id = `import-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        s.normalizedTitle = s.title.toLowerCase().trim();
        s.status = 'published';
        s.createdAt = Date.now();
        s.updatedAt = Date.now();
      }

      await kathaSetuDb.upsertStoriesBatch(storiesToImport);
      setImportMessage(`Successfully imported and validated ${storiesToImport.length} stories!`);
      setJsonImportInput('');
      loadData();
    } catch (e: any) {
      setImportMessage(`Import failed: ${e.message}`);
    }
  };

  const handleToggleStoryStatus = async (story: Story) => {
    const updatedStatus = story.status === 'published' ? 'draft' : 'published';
    await kathaSetuDb.upsertStory({ ...story, status: updatedStatus });
    loadData();
  };

  const handleDeleteStory = async (id: string) => {
    if (confirm('Are you sure you want to delete this story permanently?')) {
      await kathaSetuDb.deleteStory(id);
      loadData();
    }
  };

  const handleCreateNewStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill in both title and content.');
      return;
    }

    const storyObj: Story = {
      id: `admin-story-${Date.now()}`,
      title: newTitle.trim(),
      normalizedTitle: newTitle.toLowerCase().trim(),
      language: newLang,
      category: newCategory,
      shortDescription: newMoral ? `Moral: ${newMoral}` : 'Indian cultural story',
      content: newContent.trim(),
      author: newAuthor.trim() || 'Traditional Indian Lore',
      source: 'Verified Admin Publication',
      difficulty: 'intermediate',
      readingTimeMinutes: Math.max(2, Math.round(newContent.split(/\s+/).length / 150)),
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      moral: newMoral.trim()
    };

    await kathaSetuDb.upsertStory(storyObj);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewMoral('');
    setNewAuthor('');
    loadData();
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ maxWidth: '440px', margin: '60px auto', textAlign: 'center' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Administrator Access
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
            Enter your admin passcode to access batch import pipelines, story publishing, and library targets.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin passcode (e.g. admin360)..."
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                marginBottom: '16px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Verify Passcode
            </button>
          </form>
        </div>
      </div>
    );
  }

  const enRemaining = stats ? Math.max(0, stats.targetPerLanguage - stats.en) : 0;
  const hiRemaining = stats ? Math.max(0, stats.targetPerLanguage - stats.hi) : 0;
  const taRemaining = stats ? Math.max(0, stats.targetPerLanguage - stats.ta) : 0;
  const mlRemaining = stats ? Math.max(0, stats.targetPerLanguage - stats.ml) : 0;

  return (
    <div className="container" style={{ maxWidth: '1040px', margin: '20px auto 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#dc2626',
            background: '#fee2e2',
            padding: '4px 12px',
            borderRadius: '9999px'
          }}>
            KathaSetu Admin Panel
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 800,
            color: '#0f172a',
            marginTop: '8px'
          }}>
            Content Management & Batch Pipeline
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
            Monitor real published story counts, execute deduplicated batch imports, and manage community submissions.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>Add New Story</span>
        </button>
      </div>

      {/* Target & Real Published Counts Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* English */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
              English Stories
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>
              {stats.en} <span style={{ fontSize: '15px', fontWeight: 600, color: '#64748b' }}>/ 1,000 target</span>
            </div>
            <div style={{ fontSize: '12px', color: enRemaining === 0 ? '#16a34a' : '#d97706' }}>
              {enRemaining === 0 ? '✓ Target Met' : `Remaining needed: ${enRemaining}`}
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ width: `${Math.min(100, (stats.en / 1000) * 100)}%`, height: '100%', background: '#2563eb' }} />
            </div>
          </div>

          {/* Hindi */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
              हिंदी (Hindi) Stories
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>
              {stats.hi} <span style={{ fontSize: '15px', fontWeight: 600, color: '#64748b' }}>/ 1,000 target</span>
            </div>
            <div style={{ fontSize: '12px', color: hiRemaining === 0 ? '#16a34a' : '#d97706' }}>
              {hiRemaining === 0 ? '✓ Target Met' : `Remaining needed: ${hiRemaining}`}
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ width: `${Math.min(100, (stats.hi / 1000) * 100)}%`, height: '100%', background: '#d97706' }} />
            </div>
          </div>

          {/* Tamil */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>
              தமிழ் (Tamil) Stories
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>
              {stats.ta} <span style={{ fontSize: '15px', fontWeight: 600, color: '#64748b' }}>/ 1,000 target</span>
            </div>
            <div style={{ fontSize: '12px', color: taRemaining === 0 ? '#16a34a' : '#d97706' }}>
              {taRemaining === 0 ? '✓ Target Met' : `Remaining needed: ${taRemaining}`}
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ width: `${Math.min(100, (stats.ta / 1000) * 100)}%`, height: '100%', background: '#16a34a' }} />
            </div>
          </div>

          {/* Malayalam */}
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
              മലയാളം (Malayalam) Stories
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>
              {stats.ml} <span style={{ fontSize: '15px', fontWeight: 600, color: '#64748b' }}>/ 1,000 target</span>
            </div>
            <div style={{ fontSize: '12px', color: mlRemaining === 0 ? '#16a34a' : '#d97706' }}>
              {mlRemaining === 0 ? '✓ Target Met' : `Remaining needed: ${mlRemaining}`}
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ width: `${Math.min(100, (stats.ml / 1000) * 100)}%`, height: '100%', background: '#7c3aed' }} />
            </div>
          </div>
        </div>
      )}

      {/* Resumable Batch Import Pipeline Runner */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Resumable Content Generation & Import Pipeline
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Generates and imports verified, culturally authentic Indian stories across all 25 categories until targets are reached.
            </p>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
            Duplicates Rejected: <strong>{stats?.duplicatesRejected || 0}</strong>
          </span>
        </div>

        {/* Controls Row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              Target Language
            </label>
            <select
              value={batchTargetLang}
              onChange={e => setBatchTargetLang(e.target.value as typeof batchTargetLang)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            >
              <option value="all">All 4 Languages</option>
              <option value="en">English (en)</option>
              <option value="hi">हिंदी (hi)</option>
              <option value="ta">தமிழ் (ta)</option>
              <option value="ml">മലയാളം (ml)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              Batch Step Size
            </label>
            <select
              value={batchSize}
              onChange={e => setBatchSize(parseInt(e.target.value, 10))}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            >
              <option value={10}>10 stories / step</option>
              <option value={25}>25 stories / step (Recommended)</option>
              <option value={50}>50 stories / step</option>
              <option value={100}>100 stories / step</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1, justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              onClick={handleRunBatchStep}
              disabled={isBatchRunning}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '10px',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isBatchRunning ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
              }}
            >
              <Play size={16} />
              <span>{isBatchRunning ? 'Running Import Pipeline...' : 'Run Next Import Batch'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Import Logs */}
        <div style={{
          background: '#0f172a',
          color: '#38bdf8',
          fontFamily: 'monospace',
          fontSize: '12px',
          padding: '14px',
          borderRadius: '10px',
          maxHeight: '160px',
          overflowY: 'auto'
        }}>
          {batchLogs.length > 0 ? (
            batchLogs.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '4px', whiteSpace: 'pre-wrap' }}>
                {log}
              </div>
            ))
          ) : (
            <div style={{ color: '#64748b' }}>
              Pipeline ready. Click "Run Next Import Batch" to start importing verified Indian folklore stories.
            </div>
          )}
        </div>
      </div>

      {/* JSON/CSV Batch Importer Box */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        marginBottom: '32px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Structured Batch Story Importer (JSON)
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
          Paste JSON arrays of stories with title, language (en/hi/ta/ml), category, and content for automated validation and insertion.
        </p>

        <textarea
          rows={4}
          placeholder='[{"title": "The Golden Mango", "language": "en", "category": "tenali-raman", "content": "Full story text here..."}]'
          value={jsonImportInput}
          onChange={e => setJsonImportInput(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontFamily: 'monospace',
            fontSize: '13px',
            marginBottom: '12px'
          }}
        />

        {importMessage && (
          <div style={{
            fontSize: '13px',
            color: importMessage.includes('Successfully') ? '#166534' : '#991b1b',
            background: importMessage.includes('Successfully') ? '#f0fdf4' : '#fef2f2',
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            {importMessage}
          </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleJsonImport}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Validate & Import Stories
          </button>
        </div>
      </div>

      {/* Published Stories Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          Story Inventory ({stories.length} Total Records)
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '10px' }}>Title</th>
                <th style={{ padding: '10px' }}>Language</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.slice(0, 15).map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: 600, color: '#0f172a' }}>{s.title}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9' }}>
                      {s.language.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: '#64748b' }}>{s.category}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: s.status === 'published' ? '#dcfce7' : '#ede9fe',
                      color: s.status === 'published' ? '#166534' : '#7c3aed'
                    }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStoryStatus(s)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        marginRight: '6px'
                      }}
                    >
                      {s.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDeleteStory(s.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Story Modal */}
      {isCreateModalOpen && (
        <div
          className="modal-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) setIsCreateModalOpen(false);
          }}
        >
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '92%',
            padding: '28px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                Add New Story
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewStory}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Language</label>
                  <select
                    value={newLang}
                    onChange={e => setNewLang(e.target.value as StoryLanguage)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="ml">മലയാളം (Malayalam)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    {STORY_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Moral</label>
                <input
                  type="text"
                  value={newMoral}
                  onChange={e => setNewMoral(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Full Story Text</label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save & Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
