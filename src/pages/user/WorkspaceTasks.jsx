import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockInvites } from '../../data/mockTasks';
import { useWorkspaces } from '../../context/WorkspacesContext';
import { countWords } from '../../utils/taskHelpers';
import './WorkspaceTasks.css';

const WORKSPACE_COLORS = [
  '#1e4db7', '#8a4fd4', '#3da85e', '#3a90c8',
  '#d94a4a', '#e07c3a', '#c9a83c', '#2ea89a',
  '#c44fae', '#20b5cc', '#7ab84a', '#e05c5c',
];

// Using Feather Icons for rich metadata visuals
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ws-icon">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ws-icon ws-icon--star">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

function WorkspaceCard({ workspace }) {
  const { id, name, color, members } = workspace;
  const leader = members[0];
  const memberCount = members.length;

  return (
    <Link to={`/workspace/${id}`} className="workspace-card" style={{ '--ws-color': color, textDecoration: 'none' }}>
      <div className="workspace-card__banner">
        <div className="workspace-card__avatar">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="workspace-card__content">
        <h3 className="workspace-card__title">{name}</h3>

        <div className="workspace-card__meta">
          <div className="workspace-card__stat">
            <StarIcon />
            <span>Leader: <strong>{leader}</strong></span>
          </div>
          <div className="workspace-card__stat">
            <UsersIcon />
            <span><strong>{memberCount}</strong> Member{memberCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function InviteCard({ invite, onJoin, onReject }) {
  const { name, color, leader, memberCount } = invite;

  return (
    <div className="workspace-card workspace-card--invite" style={{ '--ws-color': color }}>
      <div className="workspace-card__banner">
        <div className="workspace-card__avatar">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="workspace-card__content">
        <h3 className="workspace-card__title">{name}</h3>

        <div className="workspace-card__meta" style={{ marginBottom: '20px' }}>
          <div className="workspace-card__stat">
            <StarIcon />
            <span>Leader: <strong>{leader}</strong></span>
          </div>
          <div className="workspace-card__stat">
            <UsersIcon />
            <span><strong>{memberCount}</strong> Member{memberCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="workspace-invite-actions">
          <button className="workspace-invite-btn workspace-invite-btn--join" onClick={() => onJoin(invite)}>Join</button>
          <button className="workspace-invite-btn workspace-invite-btn--reject" onClick={() => onReject(invite)}>Reject</button>
        </div>
      </div>
    </div>
  );
}

function WorkspaceTasks() {
  const { workspaces, addWorkspace } = useWorkspaces();
  const [invites, setInvites] = useState(mockInvites);
  const [inviteToReject, setInviteToReject] = useState(null);

  // ── New Workspace Modal state ────────────────────────────────────────────
  const [isCreatingWs, setIsCreatingWs] = useState(false);
  const [wsName, setWsName] = useState('');
  const [wsDesc, setWsDesc] = useState('');
  const [wsColor, setWsColor] = useState(WORKSPACE_COLORS[0]);
  const [wsNameError, setWsNameError] = useState('');
  const [wsDescError, setWsDescError] = useState('');

  const wsNameCount = wsName.length;
  const wsDescWordCount = countWords(wsDesc);

  function openCreateModal() {
    setWsName('');
    setWsDesc('');
    setWsColor(WORKSPACE_COLORS[0]);
    setWsNameError('');
    setWsDescError('');
    setIsCreatingWs(true);
  }

  function handleCreateWorkspace() {
    const trimmed = wsName.trim();
    if (!trimmed) { setWsNameError('Workspace name is required'); return; }
    const duplicate = workspaces.some(w => w.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { setWsNameError('A workspace with this name already exists'); return; }

    if (wsDescWordCount > 500) {
      setWsDescError('Description cannot exceed 500 words');
      return;
    }

    const newWs = {
      id: trimmed.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: trimmed,
      color: wsColor,
      description: wsDesc.trim() || 'No description provided.',
      members: ['You'],
    };
    addWorkspace(newWs);
    setIsCreatingWs(false);
  }

  function handleJoin(invite) {
    setInvites(prev => prev.filter(inv => inv.id !== invite.id));
    const newWs = {
      id: invite.id,
      name: invite.name,
      color: invite.color,
      description: "A newly joined workspace.",
      members: [invite.leader, "You"]
    };
    addWorkspace(newWs);
  }

  function confirmReject() {
    setInvites(prev => prev.filter(inv => inv.id !== inviteToReject.id));
    setInviteToReject(null);
  }

  return (
    <div className="workspace-page">
      <div className="workspace-page__header">
        <h1 className="workspace-page__title">Workspaces Directory</h1>
        <button className="workspace-page__add-btn" onClick={openCreateModal}>
          + New Workspace
        </button>
      </div>

      <div className="workspace-grid">
        {workspaces.map(ws => (
          <WorkspaceCard key={ws.id} workspace={ws} />
        ))}
      </div>

      {invites.length > 0 && (
        <div className="workspace-page__section" style={{ marginTop: '24px' }}>
          <div className="workspace-page__header">
            <h2 className="workspace-page__title" style={{ fontSize: '22px', color: '#a0b8e0' }}>Pending Invites</h2>
          </div>
          <div className="workspace-grid">
            {invites.map(inv => (
              <InviteCard key={inv.id} invite={inv} onJoin={handleJoin} onReject={setInviteToReject} />
            ))}
          </div>
        </div>
      )}

      {/* ── New Workspace Modal ── */}
      {isCreatingWs && (
        <div
          className="delete-modal-overlay"
          onClick={() => setIsCreatingWs(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-ws-heading"
        >
          <div className="create-ws-modal" onClick={e => e.stopPropagation()}>
            <div className="create-ws-modal__header">
              <h3 id="create-ws-heading" className="create-ws-modal__title">New Workspace</h3>
              <button className="create-ws-modal__close" onClick={() => setIsCreatingWs(false)} aria-label="Close">×</button>
            </div>

            {/* Name */}
            <div className="create-ws-field">
              <label className="create-ws-label" htmlFor="ws-name-input">
                Name <span className="create-ws-required">*</span>
              </label>
              <input
                id="ws-name-input"
                className={`create-ws-input ${wsNameError ? 'create-ws-input--error' : ''}`}
                value={wsName}
                onChange={e => { setWsName(e.target.value); setWsNameError(''); }}
                placeholder="e.g. Design Team"
                maxLength={35}
                autoFocus
              />
              <div className="input-counter-row">
                {wsNameError ? <p className="create-ws-error">{wsNameError}</p> : <div />}
                <span className={`input-counter ${wsNameCount >= 35 ? 'input-counter--max' : ''}`}>
                  {wsNameCount}/35
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="create-ws-field">
              <label className="create-ws-label" htmlFor="ws-desc-input">
                Description <span className="create-ws-optional">(optional)</span>
              </label>
              <textarea
                id="ws-desc-input"
                className={`create-ws-textarea ${wsDescError ? 'create-ws-input--error' : ''}`}
                value={wsDesc}
                onChange={e => { setWsDesc(e.target.value); setWsDescError(''); }}
                placeholder="What is this workspace for? (Max 500 words)"
                rows={3}
              />
              <div className="input-counter-row">
                {wsDescError ? <p className="create-ws-error">{wsDescError}</p> : <div />}
                <span className={`input-counter ${wsDescWordCount > 500 ? 'input-counter--max' : ''}`}>
                  {wsDescWordCount}/500 words
                </span>
              </div>
            </div>

            {/* Color */}
            <div className="create-ws-field">
              <label className="create-ws-label">Card Color</label>
              <div className="create-ws-colors">
                {WORKSPACE_COLORS.map(c => (
                  <button
                    key={c}
                    className={`create-ws-color-btn ${wsColor === c ? 'create-ws-color-btn--selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setWsColor(c)}
                    aria-label={`Select color ${c}`}
                    title={c}
                  />
                ))}
              </div>
              {/* Preview */}
              <div className="create-ws-preview" style={{ '--ws-color': wsColor }}>
                <div className="create-ws-preview__banner" />
                <div className="create-ws-preview__avatar">
                  {wsName.charAt(0).toUpperCase() || 'W'}
                </div>
                <span className="create-ws-preview__name">{wsName || 'Workspace name'}</span>
              </div>
            </div>

            <div className="create-ws-modal__actions">
              <button className="delete-modal__btn delete-modal__btn--cancel" onClick={() => setIsCreatingWs(false)}>Cancel</button>
              <button className="create-ws-modal__confirm-btn" onClick={handleCreateWorkspace}>Create Workspace</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Confirmation Modal ── */}
      {inviteToReject && (
        <div
          className="delete-modal-overlay"
          onClick={() => setInviteToReject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="delete-modal__title">Reject Invite</h3>
            <p className="delete-modal__body">
              Are you sure you want to reject the invitation to join <strong>{inviteToReject.name}</strong>?
            </p>
            <div className="delete-modal__actions">
              <button className="delete-modal__btn delete-modal__btn--danger" onClick={confirmReject}>
                Yes, reject
              </button>
              <button className="delete-modal__btn delete-modal__btn--cancel" onClick={() => setInviteToReject(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceTasks;