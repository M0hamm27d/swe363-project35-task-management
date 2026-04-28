import './TaskCard.css';
import { calculateTaskStatus } from '../utils/urgencyCalculator';

const STATUS_COLORS = {
  green:  '#4ade80',
  orange: '#fb923c',
  red:    '#f87171',
  grey:   '#9ca3af',
};

const BATTERY_COLOR = '#4ade80'; // always green — urgency is communicated by the status dot

function formatDeadline(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const isCurrentYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(isCurrentYear ? {} : { year: 'numeric' }),
  });
}

// Deduct progress% from the estimated duration and return a compact string.
// Only non-zero units are included: '1d 3h 20m', '5h', '45m', etc.
function calcRemaining(est, progress) {
  if (!est || typeof est !== 'object') return null;
  const totalMins =
    (Number(est.days)    || 0) * 24 * 60 +
    (Number(est.hours)   || 0) * 60 +
    (Number(est.minutes) || 0);
  if (totalMins <= 0) return null;
  const remainMins = Math.round(totalMins * (1 - Number(progress) / 100));
  if (remainMins <= 0) return null;
  const d = Math.floor(remainMins / (24 * 60));
  const h = Math.floor((remainMins % (24 * 60)) / 60);
  const m = remainMins % 60;
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  return parts.length > 0 ? parts.join(' ') : null;
}

// ─── TaskCard Component ───────────────────────────────────────────────────────
// Props:
//   task             — task object
//   allTasks         — array of tasks for urgency calculation
//   onClick          — opens the detail panel (fires on card body click)
//   onToggleComplete — marks task done / undoes it
//   onDelete         — triggers the delete confirmation in the parent

function TaskCard({ task, allTasks = [], onClick, onToggleComplete, onDelete, canEdit = true }) {
  const { title, tag, status, deadline, progress, completed, estimatedFinish } = task;
  
  // Apply the python-derived urgency algorithm
  const dynamicStatus = calculateTaskStatus(allTasks, task.id) || status || 'green';

  const remaining = calcRemaining(estimatedFinish, progress);
  const isOverdue = !completed && new Date(deadline) < new Date();

  // Card color from tag, or grey default
  const cardStyle = tag
    ? { background: `${tag.color}18`, borderColor: `${tag.color}55` }
    : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' };

  const tagChipStyle = tag
    ? { background: `${tag.color}35`, color: tag.color }
    : {};

  return (
    <div
      className={`task-card ${completed ? 'task-card--completed' : ''}`}
      style={cardStyle}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      {/* ── Top row: tag chip | status dot + X button ── */}
      <div className="task-card__header">
        {tag ? (
          <span className="task-card__tag" style={tagChipStyle}>{tag.name}</span>
        ) : (
          <span className="task-card__tag task-card__tag--none">No tag</span>
        )}

        <div className="task-card__header-right">
          <div 
            className="task-card__status-dot" 
            style={{ backgroundColor: STATUS_COLORS[dynamicStatus] || STATUS_COLORS.green }}
            title={`Urgency: ${dynamicStatus}`}
          ></div>

          {/* X delete button — stopPropagation prevents the card click from firing */}
          {canEdit && (
            <button
              className="task-card__delete-btn"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              aria-label="Delete task"
              title="Delete task"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Title ── */}
      <h3 className="task-card__title">
        {title.length > 35 ? title.slice(0, 35) + '…' : title}
      </h3>

      {/* ── Deadline + remaining time ── */}
      <p className={`task-card__deadline ${isOverdue ? 'task-card__deadline--overdue' : ''}`}>
        <span aria-hidden="true">⏰</span>
        {formatDeadline(deadline)}
      </p>
      {remaining && (
        <p className="task-card__remaining">
          <span aria-hidden="true">⏱</span>
          {remaining} of work 
        </p>
      )}

      {/* ── Battery progress bar ── */}
      <div className="task-card__battery-wrapper" aria-label={`Progress: ${progress}%`}>
        <div className="task-card__battery-body">
          <div
            className="task-card__battery-fill"
            style={{ width: `${progress}%`, background: BATTERY_COLOR }}
          />
          <span className="task-card__battery-label">{progress}%</span>
        </div>
        <div className="task-card__battery-nub" />
      </div>

      {/* ── Checkbox footer ── */}
      {/*
        stopPropagation: prevents opening the detail panel when clicking checkbox.
        The checkbox circle fills green when completed.
      */}
      <div className="task-card__footer">
        {canEdit && (
          <>
            <button
              className={`task-card__check-btn ${completed ? 'task-card__check-btn--checked' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
              aria-label={completed ? 'Mark as ongoing' : 'Mark as complete'}
              title={completed ? 'Undo completion' : 'Mark as complete'}
            >
              {completed && '✓'}
            </button>
            <span className="task-card__check-label">
              {completed ? 'Completed' : 'Mark done'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
