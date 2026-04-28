import { useState, useEffect } from 'react';
import DateTimePickerModal from './DateTimePickerModal';
import { countWords } from '../utils/taskHelpers';
import './TaskDetailDrawer.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDuration(raw) {
  if (raw && typeof raw === 'object') {
    return {
      days:    Number(raw.days    ?? 0),
      hours:   Number(raw.hours   ?? 0),
      minutes: Number(raw.minutes ?? 0),
    };
  }
  return { days: 0, hours: 0, minutes: 0 };
}

function progressColor(pct) {
  const p = Number(pct);
  if (p >= 70) return '#4ade80';
  if (p >= 35) return '#fb923c';
  return '#f87171';
}

function nowLocalStr() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function formatDateOnly(isoString) {
  if (!isoString) return 'Date';
  const d = new Date(isoString);
  if (isNaN(d)) return 'Date';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTimeOnly(isoString) {
  if (!isoString) return 'Time';
  const d = new Date(isoString);
  if (isNaN(d)) return 'Time';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ─── TaskDetailDrawer ─────────────────────────────────────────────────────────
// Props:
//   mode     — 'edit' (default) | 'create'
//   task     — task object (edit) | undefined (create)
//   tags     — array of { name, color }
//   onSave   — (taskId, updatedFields) => void   [edit]
//   onCreate — (newTaskFields) => void            [create]
//   onClose  — () => void
function TaskDetailDrawer({ mode = 'edit', task, tags, onSave, onCreate, onClose, canEdit = true, showVisibility = true }) {
  const isCreate = mode === 'create';
  const isView   = mode === 'view' || (!isCreate && !canEdit);

  const [title,       setTitle]       = useState(isCreate ? '' : task.title);
  const [description, setDescription] = useState(isCreate ? '' : (task.description    ?? ''));
  const [startDate,   setStartDate]   = useState(isCreate ? nowLocalStr() : (task?.startDate?.slice(0,16) || nowLocalStr()));
  const [deadline,    setDeadline]    = useState(isCreate ? '' : (task?.deadline?.slice(0,16) || ''));
  const [progress,    setProgress]    = useState(isCreate ? 0 : (task.progress          ?? 0));
  const [tagName,     setTagName]     = useState(isCreate ? '' : (task.tag?.name        ?? ''));
  const [isVisible,   setIsVisible]   = useState(isCreate ? true : (task.isVisible      ?? true));

  const [estDays,    setEstDays]    = useState(() => parseDuration(isCreate ? null : task?.estimatedFinish).days);
  const [estHours,   setEstHours]   = useState(() => parseDuration(isCreate ? null : task?.estimatedFinish).hours);
  const [estMinutes, setEstMinutes] = useState(() => parseDuration(isCreate ? null : task?.estimatedFinish).minutes);

  const [titleError,    setTitleError]    = useState('');
  const [descError,     setDescError]     = useState('');
  const [startError,    setStartError]    = useState('');
  const [deadlineError, setDeadlineError] = useState('');

  const titleCount = title.length;
  const descWordCount = countWords(description);

  // Re-sync when switching between tasks in edit mode
  useEffect(() => {
    if (isCreate) return;
    setTitle(task.title);
    setDescription(task.description ?? '');
    setStartDate(task.startDate?.slice(0,16) || nowLocalStr());
    setDeadline(task.deadline?.slice(0,16) || '');
    setProgress(task.progress        ?? 0);
    setTagName(task.tag?.name        ?? '');
    setIsVisible(task.isVisible      ?? true);
    setTitleError(''); setDescError(''); setStartError(''); setDeadlineError('');
    const dur = parseDuration(task.estimatedFinish);
    setEstDays(dur.days); setEstHours(dur.hours); setEstMinutes(dur.minutes);
  }, [task?.id]);

  const [activePicker, setActivePicker] = useState(null); // 'start' | 'deadline' | null

  // Escape closes drawer
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleSave() {
    if (isView) return;
    let valid = true;
    const trimmed = title.trim();
    if (!trimmed) { setTitleError('Title is required'); valid = false; }
    
    let isoStart = startDate;
    let isoEnd = deadline;

    if (!isoStart && isCreate) {
      setStartError('Start date/time is required');
      valid = false;
    }

    if (!isoEnd && isCreate) {
      setDeadlineError('End date/time is required');
      valid = false;
    }

    if (descWordCount > 500) {
      setDescError('Description cannot exceed 500 words');
      valid = false;
    }
    
    // Validates that start date is not after end date
    if (valid && isoStart && isoEnd) {
      if (new Date(isoStart) >= new Date(isoEnd)) {
        setDeadlineError('End time must be after start time');
        valid = false;
      }
    }

    if (!valid) return;

    const selectedTag = tags.find((t) => t.name === tagName) ?? null;
    const fields = {
      title: trimmed, description, startDate: isoStart, deadline: isoEnd,
      estimatedFinish: { days: Number(estDays), hours: Number(estHours), minutes: Number(estMinutes) },
      progress: Number(progress),
      tag: selectedTag,
      isVisible,
      completed: false,
    };

    isCreate ? onCreate(fields) : onSave(task.id, fields);
    onClose();
  }

  const color      = progressColor(progress);
  const currentTag = tags.find((t) => t.name === tagName);

  return (
    <>
      <div className="task-drawer-overlay" onClick={onClose} aria-hidden="true" />

      <aside 
        className="task-drawer" 
        role="dialog" 
        aria-modal="true"
        aria-label={isCreate ? 'New task' : isView ? 'Task details (Read Only)' : 'Task details'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName.toLowerCase() !== 'textarea' && !isView) {
            e.preventDefault();
            handleSave();
          }
        }}
      >

        {/* Header */}
        <div className="task-drawer__header">
          <div className="task-drawer__header-left">
            {currentTag && (
              <span className="task-drawer__tag-chip"
                style={{ background: `${currentTag.color}30`, color: currentTag.color }}>
                {currentTag.name}
              </span>
            )}
            <h2 className="task-drawer__heading">{isCreate ? 'New Task' : isView ? 'Task Details' : 'Task Details'}</h2>
          </div>
          <button className="task-drawer__close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Body */}
        <div className="task-drawer__body">

          {/* Title */}
          <div className="drawer-field">
            <label className="drawer-label" htmlFor="drawer-title">
              Title <span className="drawer-required">*</span>
            </label>
            <input
              id="drawer-title"
              className={`drawer-input ${titleError ? 'drawer-input--error' : ''}`}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
              placeholder="Task title"
              maxLength={35}
              autoFocus={isCreate}
              disabled={isView}
            />
            <div className="input-counter-row">
              {titleError ? <p className="drawer-error">{titleError}</p> : <div />}
              {!isView && (
                <span className={`input-counter ${titleCount >= 35 ? 'input-counter--max' : ''}`}>
                  {titleCount}/35
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="drawer-field">
            <label className="drawer-label" htmlFor="drawer-desc">
              Description {isCreate && <span className="drawer-optional">(optional)</span>}
            </label>
            <textarea id="drawer-desc" className={`drawer-textarea ${descError ? 'drawer-textarea--error' : ''}`} value={description}
              onChange={(e) => { setDescription(e.target.value); setDescError(''); }}
              disabled={isView}
              placeholder="Add a description… (Max 500 words)" rows={4} />
            <div className="input-counter-row">
              {descError ? <p className="drawer-error">{descError}</p> : <div />}
              {!isView && (
                <span className={`input-counter ${descWordCount > 500 ? 'input-counter--max' : ''}`}>
                  {descWordCount}/500 words
                </span>
              )}
            </div>
          </div>

          {/* Tag */}
          <div className="drawer-field">
            <label className="drawer-label" htmlFor="drawer-tag">
              Tag {isCreate && <span className="drawer-optional">(optional)</span>}
            </label>
            <select id="drawer-tag" className="drawer-select" value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              disabled={isView}>
              <option value="">No tag</option>
              {tags.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>

          {/* Visibility Toggle */}
          {showVisibility && (
            <div className="drawer-field">
              <div className={`drawer-visibility-card ${!isVisible ? 'drawer-visibility-card--hidden' : ''} ${isView ? 'drawer-visibility-card--disabled' : ''}`}>
                <div className="drawer-visibility-info">
                  <div className="drawer-visibility-icon-box">
                    {isVisible ? (
                      <svg className="drawer-visibility-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg className="drawer-visibility-svg drawer-visibility-svg--off" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </div>
                  <div className="drawer-visibility-content">
                    <label className="drawer-label drawer-label--nocaps" htmlFor="drawer-visible">
                      Team Visibility
                    </label>
                    <p className="drawer-visibility-sub">{isVisible ? 'Visible to everyone' : 'Only visible to you'}</p>
                  </div>
                </div>
                <label className="drawer-switch">
                  <input
                    id="drawer-visible"
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    disabled={isView}
                  />
                  <span className="drawer-switch-slider"></span>
                </label>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="drawer-date-grid">
            <div className="drawer-field">
              <label className="drawer-label">
                Start Time {isCreate && <span className="drawer-required">*</span>}
              </label>
              <div 
                className={`drawer-split-group ${startError ? 'drawer-split-group--error' : ''} ${isView ? 'drawer-split-group--disabled' : ''}`}
                onClick={() => !isView && setActivePicker('start')}
                role="button"
                tabIndex={isView ? -1 : 0}
              >
                <div className="drawer-split-half">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drawer-split-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{formatDateOnly(startDate)}</span>
                </div>
                <div className="drawer-split-divider"></div>
                <div className="drawer-split-half drawer-split-half--time">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drawer-split-icon">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{formatTimeOnly(startDate)}</span>
                </div>
              </div>
              {startError && <p className="drawer-error">{startError}</p>}
            </div>
            
            <div className="drawer-field">
              <label className="drawer-label">
                End Time {isCreate && <span className="drawer-required">*</span>}
              </label>
              <div 
                className={`drawer-split-group ${deadlineError ? 'drawer-split-group--error' : ''} ${isView ? 'drawer-split-group--disabled' : ''}`}
                onClick={() => !isView && setActivePicker('deadline')}
                role="button"
                tabIndex={isView ? -1 : 0}
              >
                <div className="drawer-split-half">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drawer-split-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{formatDateOnly(deadline)}</span>
                </div>
                <div className="drawer-split-divider"></div>
                <div className="drawer-split-half drawer-split-half--time">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drawer-split-icon">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{formatTimeOnly(deadline)}</span>
                </div>
              </div>
              {deadlineError && <p className="drawer-error">{deadlineError}</p>}
            </div>
          </div>

          {/* Estimated time */}
          <div className="drawer-field">
            <label className="drawer-label">
              Estimated Time to Finish {isCreate && <span className="drawer-optional">(optional)</span>}
            </label>
            <div className="drawer-duration-row">
              <div className="drawer-duration-unit">
                <input id="drawer-est-days" type="number" className="drawer-duration-input"
                  min={0} max={999} value={estDays} disabled={isView}
                  onChange={(e) => setEstDays(Math.max(0, Number(e.target.value)))} aria-label="Days" />
                <span className="drawer-duration-label">days</span>
              </div>
              <div className="drawer-duration-unit">
                <input id="drawer-est-hours" type="number" className="drawer-duration-input"
                  min={0} max={23} value={estHours} disabled={isView}
                  onChange={(e) => setEstHours(Math.min(23, Math.max(0, Number(e.target.value))))} aria-label="Hours" />
                <span className="drawer-duration-label">hrs</span>
              </div>
              <div className="drawer-duration-unit">
                <input id="drawer-est-minutes" type="number" className="drawer-duration-input"
                  min={0} max={59} value={estMinutes} disabled={isView}
                  onChange={(e) => setEstMinutes(Math.min(59, Math.max(0, Number(e.target.value))))} aria-label="Minutes" />
                <span className="drawer-duration-label">min</span>
              </div>
            </div>
          </div>

          {/* Progress — hidden in create mode */}
          {!isCreate && (
            <div className="drawer-field">
              <div className="drawer-label-row">
                <label className="drawer-label" htmlFor="drawer-progress">Progress</label>
                <div className="drawer-progress-input-wrapper" style={{ color }}>
                  <input
                    type="number"
                    className="drawer-progress-text-input"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))))}
                    onBlur={() => { if (progress === '') setProgress(0); }}
                  />
                  <span className="drawer-progress-percent">%</span>
                </div>
              </div>
              <div className="drawer-slider-wrapper">
                <input id="drawer-progress" type="range" min={0} max={100} step={1}
                  value={progress} onChange={(e) => setProgress(e.target.value)}
                  disabled={isView}
                  className="drawer-slider" style={{ '--thumb-color': color }} />
                <div className="drawer-slider-track-fill" style={{ width: `${progress}%`, background: color }} />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="task-drawer__footer">
          <button className="task-drawer__cancel-btn" onClick={onClose}>{isView ? 'Close' : 'Cancel'}</button>
          {!isView && (
            <button className="task-drawer__save-btn" onClick={handleSave}>
              {isCreate ? 'Create Task' : 'Save Changes'}
            </button>
          )}
        </div>
      </aside>

      {/* Date Pickers */}
      <DateTimePickerModal
        isOpen={activePicker === 'start'}
        initialValue={startDate}
        title="Select Start Time"
        onClose={() => setActivePicker(null)}
        onSave={(val) => { setStartDate(val); setStartError(''); setActivePicker(null); }}
      />
      <DateTimePickerModal
        isOpen={activePicker === 'deadline'}
        initialValue={deadline}
        title="Select End Time"
        onClose={() => setActivePicker(null)}
        onSave={(val) => { setDeadline(val); setDeadlineError(''); setActivePicker(null); }}
      />
    </>
  );
}

export default TaskDetailDrawer;
