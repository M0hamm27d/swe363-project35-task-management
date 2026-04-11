import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useWorkspaces } from '../../context/WorkspacesContext';
import { useTasks } from '../../context/TasksContext';
import TagsPanel from '../../components/TagsPanel';
import TaskDetailDrawer from '../../components/TaskDetailDrawer';
import {
  MONTH_NAMES,
  getDaysInMonth,
  getFirstDayOfMonth,
  getStartOfWeek,
  extractTags
} from '../../utils/taskHelpers';
import './Calendar.css';

// ─── Timeline / Date Helpers ──────────────────────────────────────────────────

function calculateHeatmapClass(tasks, y, m, d) {
  // Count how many tasks cover this specific day
  const targetDateAtMidnight = new Date(y, m, d).getTime();
  let count = 0;

  tasks.forEach(task => {
    if (!task.startDate || !task.deadline) return;
    const start = new Date(task.startDate);
    const end = new Date(task.deadline);
    // strip time
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (targetDateAtMidnight >= start.getTime() && targetDateAtMidnight <= end.getTime()) {
      count++;
    }
  });

  if (count === 0) return '';
  if (count === 1) return 'heatmap-step-1';
  if (count === 2) return 'heatmap-step-2';
  if (count === 3) return 'heatmap-step-3';
  return 'heatmap-step-4';
}

function MonthGrid({ year, monthIndex, tasks, isMini, onDayClick }) {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const firstDay = getFirstDayOfMonth(year, monthIndex);
  const totalCells = Array.from({ length: 42 });
  const dayHeaders = isMini ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`month-detail-grid ${isMini ? 'month-grid-mini' : ''}`}>
      {dayHeaders.map((d, i) => (
        <div key={i} className={`month-detail-col-header ${isMini ? 'mini-header' : ''}`}>{d}</div>
      ))}

      {totalCells.map((_, index) => {
        const dayNumber = index - firstDay + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
        const isToday = isCurrentMonth && year === new Date().getFullYear() && monthIndex === new Date().getMonth() && dayNumber === new Date().getDate();

        if (!isCurrentMonth) {
          return <div key={`empty-${index}`} className={`month-detail-cell month-detail-cell--empty ${isMini ? 'mini-cell' : ''}`}></div>;
        }

        const heatmapClass = calculateHeatmapClass(tasks, year, monthIndex, dayNumber);

        return (
          <div
            key={`day-${dayNumber}`}
            className={`month-detail-cell ${isToday ? 'month-detail-cell--today' : ''} ${isMini ? 'mini-cell' : ''}`}
            onClick={() => onDayClick && onDayClick(year, monthIndex, dayNumber)}
          >
            <div className={`month-detail-date-number ${isMini ? 'mini-date-number' : ''}`}>{dayNumber}</div>
            <div className={`month-detail-heatmap-container ${isMini ? 'mini-heatmap-container' : ''}`}>
              <div className={`heatmap-circle ${isMini ? 'mini-heatmap-circle' : ''} ${heatmapClass}`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ROW_MIN_HEIGHT = 44;

export default function Calendar() {
  const { workspaces } = useWorkspaces();
  const { tasks: allTasks, updateTask } = useTasks();

  // View states
  const [viewMode, setViewMode] = useState('monthOverview'); // 'monthOverview' | 'monthDetail' | 'week'
  const [source, setSource] = useState('myTasks'); // 'myTasks' | 'workspace'
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaces[0]?.id || '');
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');

  // Date State
  const [activeDate, setActiveDate] = useState(new Date());

  // Interaction State
  const [selectedDayTasks, setSelectedDayTasks] = useState(null); // { dateLabel, tasks }
  const [drawerTask, setDrawerTask] = useState(null);

  // Derive tasks
  const tasksToRender = useMemo(() => {
    // In actual implementation, we might filter by Source/Workspace.
    // For now we use the main unified task dataset.
    return allTasks;
  }, [allTasks, source, selectedWorkspaceId]);

  const uniqueTags = useMemo(() => {
    return extractTags(tasksToRender);
  }, [tasksToRender]);

  const [tagsOpen, setTagsOpen] = useState(false);
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

  // View navigation handlers
  const openMonthDetail = (monthIndex) => {
    setActiveDate(new Date(activeDate.getFullYear(), monthIndex, 1));
    setViewMode('monthDetail');
  };

  const navPrevMonth = () => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1));
  const navNextMonth = () => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 1));

  const navPrevYear = () => setActiveDate(new Date(activeDate.getFullYear() - 1, activeDate.getMonth(), 1));
  const navNextYear = () => setActiveDate(new Date(activeDate.getFullYear() + 1, activeDate.getMonth(), 1));

  const startOfWeek = getStartOfWeek(activeDate);
  const navPrevWeek = () => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate() - 7));
  const navNextWeek = () => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate() + 7));

  // Day click handler for month detail
  const handleDayClick = (y, m, d) => {
    if (viewMode !== 'monthDetail') return;

    const dayStart = new Date(y, m, d); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(y, m, d); dayEnd.setHours(23, 59, 59, 999);

    const intersectingTasks = tasksToRender.filter(task => {
      if (!task.startDate || !task.deadline) return false;
      const tStart = new Date(task.startDate);
      const tEnd = new Date(task.deadline);
      return tStart <= dayEnd && tEnd >= dayStart;
    });

    if (intersectingTasks.length > 0) {
      const dateLabel = `${MONTH_NAMES[m]} ${d}, ${y}`;
      setSelectedDayTasks({ dateLabel, tasks: intersectingTasks });
    }
  };

  // Render variables
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  return (
    <div className="calendar-page">
      {/* ─── Floating Header Bar ─── */}
      <header className="calendar-header">
        <div className="calendar-controls-group">
          <div className="calendar-toggle">
            <button
              className={`calendar-toggle-btn ${source === 'myTasks' ? 'calendar-toggle-btn--active' : ''}`}
              onClick={() => setSource('myTasks')}
            >
              My Tasks
            </button>
            <button
              className={`calendar-toggle-btn ${source === 'workspace' ? 'calendar-toggle-btn--active' : ''}`}
              onClick={() => setSource('workspace')}
            >
              Workspace
            </button>
          </div>

          {source === 'workspace' && (
            <div className="calendar-workspace-trigger-container">
              <button
                className="calendar-workspace-trigger"
                onClick={() => setIsWorkspaceModalOpen(true)}
              >
                {(() => {
                  const ws = workspaces.find(w => w.id === selectedWorkspaceId);
                  if (!ws) return <span>Select Workspace</span>;
                  return (
                    <>
                      <div className="calendar-trigger-avatar" style={{ '--ws-color': ws.color || '#1e4db7' }}>
                        {ws.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="calendar-trigger-name">{ws.name}</span>
                    </>
                  );
                })()}
                <span className="calendar-workspace-trigger-icon">▼</span>
              </button>
            </div>
          )}
        </div>

        <div className="calendar-controls-group">
          {viewMode === 'week' && (
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
          )}

          <div className="calendar-toggle">
            <button
              className={`calendar-toggle-btn ${viewMode.startsWith('month') ? 'calendar-toggle-btn--active' : ''}`}
              onClick={() => setViewMode('monthOverview')}
            >
              Month View
            </button>
            <button
              className={`calendar-toggle-btn ${viewMode === 'week' ? 'calendar-toggle-btn--active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week View
            </button>
          </div>
        </div>
      </header>

      {/* ─── Calendar Body ─── */}
      <div className="calendar-content">

        {/* ─── MONTH OVERVIEW (12 BOXES) ─── */}
        {viewMode === 'monthOverview' && (
          <div className="cal-view-container">
            <div className="cal-view-header">
              <button className="cal-nav-btn" onClick={navPrevYear}>&lt;</button>
              <h2 className="cal-title">{year}</h2>
              <button className="cal-nav-btn" onClick={navNextYear}>&gt;</button>
            </div>

            <div className="month-overview-grid">
              {MONTH_NAMES.map((mName, index) => {
                const isActive = activeDate.getMonth() === index;

                return (
                  <button
                    key={mName}
                    className={`month-overview-card month-overview-card--is-mini ${isActive ? 'month-overview-card--active' : ''}`}
                    onClick={() => openMonthDetail(index)}
                  >
                    <h3 className="mini-month-title">{mName}</h3>
                    <div className="mini-month-wrapper">
                      <MonthGrid year={year} monthIndex={index} tasks={tasksToRender} isMini={true} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── MONTH DETAIL (GRID) ─── */}
        {viewMode === 'monthDetail' && (
          <div className="cal-view-container">
            <div className="cal-view-header">
              <button className="cal-nav-btn" onClick={navPrevMonth}>&lt;</button>
              <h2 className="cal-title">{MONTH_NAMES[month]} {year}</h2>
              <button className="cal-nav-btn" onClick={navNextMonth}>&gt;</button>

              <button className="cal-btn-back" onClick={() => setViewMode('monthOverview')}>
                ↑ Back to Year
              </button>
            </div>

            <MonthGrid year={year} monthIndex={month} tasks={tasksToRender} isMini={false} onDayClick={handleDayClick} />
          </div>
        )}

        {viewMode === 'week' && (
          <div className="cal-view-container cal-week-view">
            <div className="cal-view-header">
              <button className="cal-nav-btn" onClick={navPrevWeek}>&lt;</button>
              <h2 className="cal-title">Week of {MONTH_NAMES[startOfWeek.getMonth()]} {startOfWeek.getDate()}</h2>
              <button className="cal-nav-btn" onClick={navNextWeek}>&gt;</button>
            </div>

            <div className="week-timeline-container">
              <div className="week-hours-col">
                <div className="week-time-header">Time</div>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={`hr-${i}`} className="week-hour-label" style={{ minHeight: ROW_MIN_HEIGHT }}>
                    {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                  </div>
                ))}
              </div>

              <div className="week-days-grid">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const dObj = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + dayIndex);
                  const isToday = dObj.toDateString() === new Date().toDateString();

                  const hourMap = {};
                  tasksToRender.forEach(t => {
                    if (selectedTag && t.tag?.name !== selectedTag) return;
                    if (!t.startDate || !t.deadline) return;

                    const tStart = new Date(t.startDate);
                    const tEnd = new Date(t.deadline);
                    const dayStart = new Date(dObj); dayStart.setHours(0, 0, 0, 0);
                    const dayEnd = new Date(dObj); dayEnd.setHours(23, 59, 59, 999);

                    if (tStart <= dayEnd && tEnd >= dayStart) {
                      const effectiveStart = tStart < dayStart ? dayStart : tStart;
                      const startHour = effectiveStart.getHours();
                      if (!hourMap[startHour]) hourMap[startHour] = [];
                      hourMap[startHour].push(t);
                    }
                  });

                  return (
                    <div
                      key={dayIndex}
                      className={`week-day-col${isToday ? ' week-day-col--today' : ''}`}
                    >
                      <div className={`week-day-header${isToday ? ' week-day-header--today' : ''}`}>
                        <span className="week-day-head-name">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex]}</span>
                        <span className={`week-day-head-num${isToday ? ' week-day-head-num--today' : ''}`}>{dObj.getDate()}</span>
                      </div>

                      <div className="week-day-body">
                        {Array.from({ length: 24 }).map((_, hourIndex) => {
                          const chips = hourMap[hourIndex] || [];
                          return (
                            <div
                              key={`row-${hourIndex}`}
                              className={`week-hour-row${chips.length > 0 ? ' week-hour-row--filled' : ''}`}
                              style={{ minHeight: ROW_MIN_HEIGHT }}
                            >
                              {chips.map(t => (
                                <div
                                  key={`chip-${t.id}`}
                                  className="week-task-chip"
                                  style={{ '--chip-color': t.tag?.color || '#3a90c8', cursor: 'pointer' }}
                                  title={`${t.title}\n${new Date(t.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(t.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                  onClick={() => setDrawerTask(t)}
                                >
                                  <span className="week-task-chip__bar" />
                                  <span className="week-task-chip__title">{t.title}</span>
                                  {t.tag && (
                                    <span className="week-task-chip__tag">{t.tag.name}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Workspace Selection Modal ─── */}
      {isWorkspaceModalOpen && (
        <div className="workspace-modal-overlay" onClick={() => setIsWorkspaceModalOpen(false)}>
          <div className="workspace-modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="workspace-modal-title">Select a Workspace</h2>
            <div className="workspace-card-grid">
              {workspaces.map(workspace => {
                const { id, name, color, members } = workspace;
                const leader = members[0];
                const memberCount = members.length;
                return (
                  <button
                    key={id}
                    className={`mini-workspace-card ${selectedWorkspaceId === id ? 'mini-workspace-card--active' : ''}`}
                    style={{ '--ws-color': color || '#1e4db7' }}
                    onClick={() => {
                      setSelectedWorkspaceId(id);
                      setIsWorkspaceModalOpen(false);
                    }}
                  >
                    <div className="mini-workspace-card__banner">
                      <div className="mini-workspace-card__avatar">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="mini-workspace-card__content">
                      <h3 className="mini-workspace-card__title">{name}</h3>
                      <div className="mini-workspace-card__meta">
                        <div className="mini-workspace-card__stat">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mini-ws-icon mini-ws-icon--star">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          <span>Leader: <strong>{leader}</strong></span>
                        </div>
                        <div className="mini-workspace-card__stat">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mini-ws-icon">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <span><strong>{memberCount}</strong> Member{memberCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <button className="workspace-modal-close" onClick={() => setIsWorkspaceModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ─── Global Tags Panel Modal ─── */}
      {tagsOpen && (
        <div className="tags-modal-overlay" onClick={() => setTagsOpen(false)}>
          <div className="tags-modal-box" ref={tagsPanelRef} onClick={(e) => e.stopPropagation()}>
            <TagsPanel
              tags={uniqueTags}
              tasks={tasksToRender}
              selectedTag={selectedTag}
              onSelectTag={(tag) => setSelectedTag(tag)}
              onEditTag={() => { }}
              onDeleteTag={() => { }}
              onAddTag={() => { }}
              selectionOnly={true}
            />
          </div>
        </div>
      )}

      {/* ─── Day Tasks Popup ─── */}
      {selectedDayTasks && (
        <div className="day-pop-overlay" onClick={() => setSelectedDayTasks(null)}>
          <div className="day-pop-box" onClick={(e) => e.stopPropagation()}>
            <div className="day-pop-header">
              <h3 className="day-pop-title">Tasks for {selectedDayTasks.dateLabel}</h3>
              <button className="day-pop-close-btn" onClick={() => setSelectedDayTasks(null)}>×</button>
            </div>
            <div className="day-pop-list">
              {selectedDayTasks.tasks.map(t => (
                <div
                  key={`day-task-${t.id}`}
                  className="week-task-chip day-task-chip"
                  style={{ '--chip-color': t.tag?.color || '#3a90c8' }}
                  onClick={() => {
                    setDrawerTask(t);
                    setSelectedDayTasks(null);
                  }}
                >
                  <span className="week-task-chip__bar" />
                  <div className="day-task-chip-content">
                    <span className="week-task-chip__title">{t.title}</span>
                    <div className="day-task-chip-meta">
                      {t.tag && <span className="week-task-chip__tag">{t.tag.name}</span>}
                      <span className="day-task-time">
                        {new Date(t.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(t.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Task Detail Drawer ─── */}
      {drawerTask && (
        <TaskDetailDrawer
          mode="view"
          task={drawerTask}
          tags={uniqueTags}
          onSave={(taskId, fields) => {
            updateTask(taskId, fields);
            setDrawerTask(null);
          }}
          onClose={() => setDrawerTask(null)}
        />
      )}
    </div>
  );
}