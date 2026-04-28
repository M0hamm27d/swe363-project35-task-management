import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskCard from '../../components/TaskCard';
import TagsPanel from '../../components/TagsPanel';
import TaskDetailDrawer from '../../components/TaskDetailDrawer';
import { useWorkspaces } from '../../context/WorkspacesContext';
import { useTasks } from '../../context/TasksContext';
import { extractTags, filterByView } from '../../utils/taskHelpers';
import { MoreIcon, StarIcon, UserMinusIcon, MailIcon } from '../../components/Icons';
import './WorkspaceBoard.css';

// ─── WorkspaceBoard Component ────────────────────────────────────────────────────────
function WorkspaceBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workspaces, setWorkspaces } = useWorkspaces();
  const { tasks, tags, addTask, updateTask, deleteTask, toggleComplete, clearCompleted, addTag, editTag, deleteTag } = useTasks();

  const workspace = workspaces.find(ws => ws.id === id);
  const isLeader = workspace && workspace.members[0] === "You";

  const [view, setView] = useState('inbox');
  const [selectedTag, setSelectedTag] = useState(null);  // tag name | null
  const [tagsOpen, setTagsOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);  // task object | null
  const [isCreatingTask, setIsCreatingTask] = useState(false); // open drawer in 'create' mode
  const [isClearingCompleted, setIsClearingCompleted] = useState(false); // clear all modal
  const [infoModalOpen, setInfoModalOpen] = useState(false); // workspace info modal
  const [leaveModalOpen, setLeaveModalOpen] = useState(false); // leave confirmation
  const [memberMenuOpen, setMemberMenuOpen] = useState(null);
  const [memberToKick, setMemberToKick] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteEmailError, setInviteEmailError] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteToken] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());

  const inviteLink = `${window.location.origin}/join?workspace=${id}&token=${inviteToken}`;

  // Tags are now managed via context, filtered for this workspace
  const workspaceTags = tags.filter(t => t.workspaceId === id);

  // Ref used to close the tags panel when clicking outside of it
  const tagsBtnRef = useRef(null);
  const tagsPanelRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (
        tagsOpen &&
        !tagsBtnRef.current?.contains(e.target) &&
        !tagsPanelRef.current?.contains(e.target)
      ) {
        setTagsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [tagsOpen]);

  // ── Task Handlers ───────────────────────────────────────────────────────────

  function confirmDelete() {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  }

  function handleClearCompleted() {
    clearCompleted();
    setIsClearingCompleted(false);
  }

  function handleEditTag(oldName, updatedTag) {
    editTag(oldName, updatedTag, id);
    if (selectedTag === oldName) setSelectedTag(updatedTag.name);
  }

  function handleDeleteTag(tagName) {
    deleteTag(tagName, id);
    if (selectedTag === tagName) setSelectedTag(null);
  }

  function handleAddTag(tag) {
    addTag(tag, id);
  }

  function handleCreateTask(newTaskFields) {
    addTask({ ...newTaskFields, workspaceId: id });
  }

  function handleSaveTask(id, updatedFields) {
    updateTask(id, updatedFields);
  }

  // ── Filtering pipeline: view → tag → split ──────────────────────────────────
  // Note: For workspace board, we should ideally only show tasks for THIS workspace.
  // Assuming 'id' is used to filter tasks (though mock data doesn't have workspace IDs yet)
  const viewFiltered = filterByView(tasks, view);
  
  // RBAC: Non-leaders only see visible tasks
  const accessFiltered = isLeader 
    ? viewFiltered.filter(t => t.workspaceId === id)
    : viewFiltered.filter(t => t.workspaceId === id && t.isVisible !== false);

  const tagFiltered = selectedTag
    ? accessFiltered.filter((t) => t.tag?.name === selectedTag)
    : accessFiltered;
    
  const ongoing = tagFiltered.filter((t) => !t.completed);
  const completed = tagFiltered.filter((t) => t.completed);

  function renderCard(task) {
    return (
      <TaskCard
        key={task.id}
        task={task}
        allTasks={tasks}
        canEdit={isLeader}
        onClick={() => setSelectedTask(task)}
        onToggleComplete={() => toggleComplete(task.id)}
        onDelete={() => setTaskToDelete(task.id)}
      />
    );
  }

  const views = [
    { key: 'inbox', label: 'Inbox' },
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
  ];

  return (
    <div className="my-tasks">

      {/* ── Header: Title | Tags button | View selector ── */}
      <div className="my-tasks__header">
        <div className="workspace-board-title-group">
          <h1 className="my-tasks__title">{workspace ? workspace.name : 'Workspace'} Tasks</h1>
          {workspace && (
            <button
              className="workspace-more-btn"
              onClick={() => setInfoModalOpen(true)}
              aria-label="Workspace Options"
            >
              <MoreIcon />
            </button>
          )}
        </div>

        <div className="my-tasks__controls">
          <div className="tags-btn-wrapper">
            <button
              id="tags-toggle-btn"
              ref={tagsBtnRef}
              className={`tags-toggle-btn ${tagsOpen ? 'tags-toggle-btn--active' : ''} ${selectedTag ? 'tags-toggle-btn--filtered' : ''}`}
              onClick={() => setTagsOpen((o) => !o)}
              aria-expanded={tagsOpen}
            >
              🏷 Tags {selectedTag && <span className="tags-toggle-btn__badge">1</span>}
              <span className="tags-toggle-btn__arrow">{tagsOpen ? '▲' : '▼'}</span>
            </button>
          </div>

          <div className="view-selector" role="group" aria-label="View filter">
            {views.map(({ key, label }) => (
              <button
                key={key}
                id={`view-${key}`}
                className={`view-selector__btn ${view === key ? 'view-selector__btn--active' : ''}`}
                onClick={() => setView(key)}
                aria-pressed={view === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tagsOpen && (
        <div
          className="tags-modal-overlay"
          onClick={() => setTagsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Tags panel"
        >
          <div
            className="tags-modal-box"
            ref={tagsPanelRef}
            onClick={(e) => e.stopPropagation()}
          >
            <TagsPanel
              tags={workspaceTags}
              tasks={accessFiltered}
              selectedTag={selectedTag}
              onSelectTag={(tag) => { setSelectedTag(tag); }}
              onEditTag={handleEditTag}
              onDeleteTag={handleDeleteTag}
              onAddTag={handleAddTag}
              selectionOnly={!isLeader}
            />
          </div>
        </div>
      )}

      {selectedTag && (
        <div className="active-tag-bar">
          <span>Filtering by:</span>
          <span
            className="active-tag-chip"
            style={{
              background: `${workspaceTags.find((t) => t.name === selectedTag)?.color ?? '#888'}30`,
              color: workspaceTags.find((t) => t.name === selectedTag)?.color ?? '#888',
            }}
          >
            {selectedTag}
          </span>
          <button className="active-tag-clear" onClick={() => setSelectedTag(null)}>
            × Clear
          </button>
        </div>
      )}

      <section className="my-tasks__section">
        <div className="my-tasks__section-header">
          <h2 className="my-tasks__section-title">
            Ongoing
            <span className="my-tasks__count">{ongoing.length}</span>
          </h2>
        </div>
        {ongoing.length === 0 ? (
          <p className="my-tasks__empty">No tasks yet</p>
        ) : (
          <div className="my-tasks__grid">{ongoing.map(renderCard)}</div>
        )}
      </section>

      <section className="my-tasks__section">
        <div className="my-tasks__section-header">
          <h2 className="my-tasks__section-title my-tasks__section-title--completed">
            Completed
            <span className="my-tasks__count">{completed.length}</span>
          </h2>
          {completed.length > 0 && isLeader && (
            <button
              className="my-tasks__clear-btn"
              onClick={() => setIsClearingCompleted(true)}
              aria-label="Clear all completed tasks"
              title="Clear all completed tasks"
            >
              <span aria-hidden="true">🗑</span> Clear
            </button>
          )}
        </div>
        {completed.length === 0 ? (
          <p className="my-tasks__empty">No tasks yet</p>
        ) : (
          <div className="my-tasks__grid">{completed.map(renderCard)}</div>
        )}
      </section>

      {taskToDelete !== null && (
        <div
          className="delete-modal-overlay"
          onClick={() => setTaskToDelete(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-heading"
        >
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="delete-modal-heading" className="delete-modal__title">Delete Task</h3>
            <p className="delete-modal__body">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="delete-modal__actions">
              <button id="confirm-delete-btn" className="delete-modal__btn delete-modal__btn--danger" onClick={confirmDelete}>
                Yes, delete
              </button>
              <button id="cancel-delete-btn" className="delete-modal__btn delete-modal__btn--cancel" onClick={() => setTaskToDelete(null)}>
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isClearingCompleted && (
        <div
          className="delete-modal-overlay"
          onClick={() => setIsClearingCompleted(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-heading"
        >
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="clear-modal-heading" className="delete-modal__title">Clear Completed Tasks</h3>
            <p className="delete-modal__body">
              Are you sure you want to delete all completed tasks? This action cannot be undone.
            </p>
            <div className="delete-modal__actions">
              <button className="delete-modal__btn delete-modal__btn--danger" onClick={handleClearCompleted}>
                Yes, clear all
              </button>
              <button className="delete-modal__btn delete-modal__btn--cancel" onClick={() => setIsClearingCompleted(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(selectedTask || isCreatingTask) && (
        <TaskDetailDrawer
          mode={isCreatingTask ? 'create' : 'edit'}
          task={selectedTask || undefined}
          tags={workspaceTags}
          canEdit={isLeader}
          showVisibility={true}
          onSave={handleSaveTask}
          onCreate={handleCreateTask}
          onClose={() => {
            setSelectedTask(null);
            setIsCreatingTask(false);
          }}
        />
      )}

      {isLeader && (
        <button
          className="my-tasks__fab"
          onClick={() => setIsCreatingTask(true)}
          aria-label="Create new task"
          title="Create new task"
        >
          +
        </button>
      )}

      {/* ── Workspace Info Modal ── */}
      {infoModalOpen && workspace && (
        <div
          className="tags-modal-overlay"
          onClick={() => setInfoModalOpen(false)}
        >
          <div className="workspace-info-modal" onClick={e => e.stopPropagation()}>
            <button className="workspace-info-close" onClick={() => setInfoModalOpen(false)}>×</button>
            <div className="workspace-info-header" style={{ '--ws-color': workspace.color }}>
              <h2>{workspace.name}</h2>
              <p>{workspace.description}</p>
            </div>
            <div className="workspace-info-body">
              <h3>Members ({workspace.members.length})</h3>
              <ul className="workspace-member-list">
                {workspace.members.map((member, index) => (
                  <li key={index} className="workspace-member-item" onMouseLeave={() => setMemberMenuOpen(null)}>
                    <div className="workspace-member-avatar" style={{ '--ws-color': workspace.color }}>
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span className="workspace-member-name">{member}</span>

                    {index === 0 && (
                      <span className="workspace-leader-badge" title="Team Leader">
                        <StarIcon style={{ width: 14, height: 14 }} />
                      </span>
                    )}

                    {isLeader && index !== 0 && (
                      <div className="member-menu-wrapper">
                        <button
                          className="member-menu-btn"
                          onClick={e => { e.stopPropagation(); setMemberMenuOpen(memberMenuOpen === member ? null : member); }}
                          aria-label={`Options for ${member}`}
                        >
                          ⋮
                        </button>
                        {memberMenuOpen === member && (
                          <div className="member-dropdown">
                            <button
                              className="member-dropdown__item member-dropdown__item--danger"
                              onClick={() => { setMemberMenuOpen(null); setMemberToKick(member); }}
                            >
                              <UserMinusIcon style={{ width: 14, height: 14 }} />
                              Kick Member
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {isLeader && (
                <button
                  className="workspace-invite-member-btn"
                  onClick={() => {
                    setInviteEmail('');
                    setInviteSent(false);
                    setInviteCopied(false);
                    setInfoModalOpen(false);
                    setInviteModalOpen(true);
                  }}
                >
                  <MailIcon style={{ width: 15, height: 15 }} />
                  Invite Member
                </button>
              )}

              <button
                className="workspace-leave-btn"
                onClick={() => { setInfoModalOpen(false); setLeaveModalOpen(true); }}
              >
                {isLeader ? 'Disband Workspace' : 'Leave Workspace'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Kick Member Confirmation Modal ── */}
      {memberToKick && workspace && (
        <div
          className="delete-modal-overlay"
          onClick={() => setMemberToKick(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <h3 className="delete-modal__title">Kick Member</h3>
            <p className="delete-modal__body">
              Are you sure you want to remove <strong>{memberToKick}</strong> from <strong>{workspace.name}</strong>? They will immediately lose access to this workspace.
            </p>
            <div className="delete-modal__actions">
              <button
                className="delete-modal__btn delete-modal__btn--danger"
                onClick={() => {
                  setWorkspaces(prev => prev.map(ws =>
                    ws.id === id
                      ? { ...ws, members: ws.members.filter(m => m !== memberToKick) }
                      : ws
                  ));
                  setMemberToKick(null);
                }}
              >
                Yes, kick
              </button>
              <button
                className="delete-modal__btn delete-modal__btn--cancel"
                onClick={() => setMemberToKick(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Invite Member Modal ── */}
      {inviteModalOpen && workspace && (
        <div
          className="delete-modal-overlay"
          onClick={() => setInviteModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="invite-modal" onClick={e => e.stopPropagation()}>
            <div className="invite-modal__header">
              <h3 className="invite-modal__title">Invite Member</h3>
              <button className="create-ws-modal__close" onClick={() => setInviteModalOpen(false)} aria-label="Close">×</button>
            </div>
            <p className="invite-modal__subtitle">Invite someone to join <strong>{workspace.name}</strong></p>

            <div className="invite-modal__section">
              <label className="create-ws-label" htmlFor="invite-email">Email address</label>
              <div className="invite-email-row">
                <input
                  id="invite-email"
                  type="email"
                  className="create-ws-input"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={e => { setInviteEmail(e.target.value); setInviteSent(false); setInviteEmailError(''); }}
                  autoFocus
                />
                <button
                  className="invite-send-btn"
                  onClick={() => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!inviteEmail.trim()) {
                      setInviteEmailError('Email address is required.');
                    } else if (!emailRegex.test(inviteEmail.trim())) {
                      setInviteEmailError('Please enter a valid email address.');
                    } else {
                      setInviteEmailError('');
                      setInviteSent(true);
                      setInviteEmail('');
                    }
                  }}
                >
                  {inviteSent ? '✓ Sent!' : 'Send Invite'}
                </button>
              </div>
              {inviteEmailError && <p className="create-ws-error">{inviteEmailError}</p>}
              {inviteSent && (
                <p className="invite-success-msg">Invitation sent successfully.</p>
              )}
            </div>

            <div className="invite-modal__divider"><span>or</span></div>

            <div className="invite-modal__section">
              <label className="create-ws-label">Invite Link</label>
              <div className="invite-link-row">
                <span className="invite-link-display">{inviteLink}</span>
                <button
                  className={`invite-copy-btn ${inviteCopied ? 'invite-copy-btn--copied' : ''}`}
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink).catch(() => { });
                    setInviteCopied(true);
                    setTimeout(() => setInviteCopied(false), 2500);
                  }}
                >
                  {inviteCopied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
              <p className="invite-link-hint">Anyone with this link can request to join the workspace.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Leave / Disband Confirmation Modal ── */}
      {leaveModalOpen && workspace && (
        <div
          className="delete-modal-overlay"
          onClick={() => setLeaveModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <h3 className="delete-modal__title">
              {isLeader ? 'Disband Workspace' : 'Leave Workspace'}
            </h3>
            <p className="delete-modal__body">
              {isLeader
                ? <>You are the <strong>leader</strong> of <strong>{workspace.name}</strong>. Disbanding this workspace will permanently remove it and revoke access for all members. This action cannot be undone.</>
                : <>Are you sure you want to leave <strong>{workspace.name}</strong>? You will immediately lose access to all tasks and communications within this workspace.</>}
            </p>
            <div className="delete-modal__actions">
              <button
                className="delete-modal__btn delete-modal__btn--danger"
                onClick={() => {
                  setWorkspaces(prev => prev.filter(ws => ws.id !== id));
                  setLeaveModalOpen(false);
                  navigate('/workspace');
                }}
              >
                {isLeader ? 'Yes, disband it' : 'Yes, leave'}
              </button>
              <button
                className="delete-modal__btn delete-modal__btn--cancel"
                onClick={() => setLeaveModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceBoard;