import { useState, useRef, useEffect } from 'react';
import TaskCard from '../../components/TaskCard';
import TagsPanel from '../../components/TagsPanel';
import TaskDetailDrawer from '../../components/TaskDetailDrawer';
import { useTasks } from '../../context/TasksContext';
import { extractTags, filterByView } from '../../utils/taskHelpers';
import './MyTasks.css';

// ─── MyTasks Component ────────────────────────────────────────────────────────
function MyTasks() {
  const { tasks, tags, addTask, updateTask, deleteTask, toggleComplete, clearCompleted, addTag, editTag, deleteTag } = useTasks();

  const [view, setView] = useState('inbox');
  const [selectedTag, setSelectedTag] = useState(null);  // Tags are now managed via context, filtered for 'personal' scope
  const personalTags = tags.filter(t => t.workspaceId === 'personal');
  const [tagsOpen, setTagsOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);  // task object | null
  const [isCreatingTask, setIsCreatingTask] = useState(false); // open drawer in 'create' mode
  const [isClearingCompleted, setIsClearingCompleted] = useState(false); // clear all modal

  // Tags are now managed via context

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

  // ── Handlers ────────────────────────────────────────────────────────────────

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
    editTag(oldName, updatedTag, 'personal');
    if (selectedTag === oldName) setSelectedTag(updatedTag.name);
  }

  function handleDeleteTag(tagName) {
    deleteTag(tagName, 'personal');
    if (selectedTag === tagName) setSelectedTag(null);
  }

  function handleAddTag(tag) {
    addTag(tag, 'personal');
  }

  function handleCreateTask(newTaskFields) {
    addTask({ ...newTaskFields, workspaceId: 'personal' });
  }

  function handleSaveTask(id, updatedFields) {
    updateTask(id, updatedFields);
  }

  // ── Filtering pipeline: view → tag → split ──────────────────────────────────
  const viewFiltered = filterByView(tasks, view);
  const personalTasks = viewFiltered.filter(t => t.workspaceId === 'personal' || !t.workspaceId);
  const tagFiltered = selectedTag
    ? personalTasks.filter((t) => t.tag?.name === selectedTag)
    : personalTasks;
  const ongoing = tagFiltered.filter((t) => !t.completed);
  const completed = tagFiltered.filter((t) => t.completed);

  function renderCard(task) {
    return (
      <TaskCard
        key={task.id}
        task={task}
        allTasks={tasks}
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
        <h1 className="my-tasks__title">My Tasks</h1>

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
              tags={personalTags}
              tasks={personalTasks}
              selectedTag={selectedTag}
              onSelectTag={(tag) => { setSelectedTag(tag); }}
              onEditTag={handleEditTag}
              onDeleteTag={handleDeleteTag}
              onAddTag={handleAddTag}
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
              background: `${personalTags.find((t) => t.name === selectedTag)?.color ?? '#888'}30`,
              color: personalTags.find((t) => t.name === selectedTag)?.color ?? '#888',
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
          {completed.length > 0 && (
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
          tags={personalTags}
          showVisibility={false}
          onSave={handleSaveTask}
          onCreate={handleCreateTask}
          onClose={() => {
            setSelectedTask(null);
            setIsCreatingTask(false);
          }}
        />
      )}

      <button
        className="my-tasks__fab"
        onClick={() => setIsCreatingTask(true)}
        aria-label="Create new task"
        title="Create new task"
      >
        +
      </button>
    </div>
  );
}

export default MyTasks;