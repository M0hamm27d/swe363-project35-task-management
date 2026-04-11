import { useState, useEffect } from 'react';
import './TagsPanel.css';

const MAX_COLORS = 20;

const PRESET_COLORS = [
  '#e05c5c', '#e07c3a', '#c9a83c', '#c8c030',
  '#7ab84a', '#3da85e', '#2ea89a', '#20b5cc',
  '#c87d20', '#8a4fd4', '#c44fae', '#d4476b',
];

// ─── Shared form view (create OR edit) ───────────────────────────────────────
function TagForm({
  mode,           // 'create' | 'edit'
  tags,           // all existing tags — for uniqueness checks
  editingTagName, // original name when editing (to exclude self from duplicate check)
  initialName,
  initialColor,
  colors,
  setColors,
  onConfirm,      // (name, color) => void
  onCancel,
}) {
  const [name,       setName]       = useState(initialName);
  const [color,      setColor]      = useState(initialColor || colors[0] || '#4ade80');
  const [nameError,  setNameError]  = useState('');
  const [colorError, setColorError] = useState('');

  // ── Color palette ──────────────────────────────────────────────────────────
  function handleDragColor(e) {
    setColor(e.target.value.toLowerCase());
    setColorError('');
  }

  useEffect(() => {
    const el = document.getElementById('native-color-picker');
    if (!el) return;
    function handleCommitColor(e) {
      const newColor = e.target.value.toLowerCase();
      setColors((prev) => {
        if (prev.includes(newColor) || prev.length >= MAX_COLORS) return prev;
        return [...prev, newColor];
      });
      setColor(newColor);
      setColorError('');
    }
    el.addEventListener('change', handleCommitColor);
    return () => el.removeEventListener('change', handleCommitColor);
  }, [mode]); // re-attach when the form mounts

  function removeColor(c) {
    setColors((prev) => prev.filter((x) => x !== c));
    if (color === c) setColor(colors.find((x) => x !== c) ?? '');
  }

  // ── Confirm ────────────────────────────────────────────────────────────────
  function handleConfirm() {
    const trimmed = name.trim();
    let valid = true;

    // Name validation
    if (!trimmed) {
      setNameError('Name cannot be empty');
      valid = false;
    } else {
      const nameDuplicate = tags.some(
        (t) =>
          t.name.toLowerCase() === trimmed.toLowerCase() &&
          t.name !== editingTagName  // allow keeping same name when editing
      );
      if (nameDuplicate) { setNameError('Tag name already exists'); valid = false; }
    }

    // Color validation
    const colorDuplicate = tags.some(
      (t) =>
        t.color.toLowerCase() === color.toLowerCase() &&
        t.name !== editingTagName  // allow keeping same color when editing
    );
    if (colorDuplicate) { setColorError('This color is already used by another tag'); valid = false; }

    if (!valid) return;
    onConfirm(trimmed, color);
  }

  return (
    <div className="tags-panel">
      <div className="tags-panel__header">
        <span className="tags-panel__title">
          {mode === 'create' ? 'New Tag' : 'Edit Tag'}
        </span>
      </div>

      {/* Name */}
      <div className="tag-edit-field">
        <label className="tag-edit-label">Tag name</label>
        <input
          className={`tag-edit-input ${nameError ? 'tag-edit-input--error' : ''}`}
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(''); }}
          maxLength={20}
          placeholder="Tag name"
          autoFocus
        />
        {nameError && <p className="tag-edit-error">{nameError}</p>}
      </div>

      {/* Color palette */}
      <div className="tag-edit-field">
        <div className="tag-edit-label-row">
          <label className="tag-edit-label">Color</label>
          <span className="tag-edit-count">{colors.length}/{MAX_COLORS}</span>
        </div>

        {colorError && <p className="tag-edit-error tag-edit-error--color">{colorError}</p>}

        <div className="color-picker">
          {colors.map((c) => (
            <div key={c} className="color-circle-wrapper">
              <button
                className={`color-circle ${color === c ? 'color-circle--selected' : ''}`}
                style={{ background: c }}
                onClick={() => { setColor(c); setColorError(''); }}
                aria-label={`Select color ${c}`}
                title={c}
              />
              <button
                className="color-circle-delete"
                onClick={(e) => { e.stopPropagation(); removeColor(c); }}
                aria-label={`Remove color ${c}`}
                title="Remove color"
              >
                ×
              </button>
            </div>
          ))}

          {colors.length < MAX_COLORS && (
            <div className="color-circle-add-wrapper">
              <input
                id="native-color-picker"
                type="color"
                className="color-picker-hidden"
                onChange={handleDragColor}
                value={color}
                aria-label="Add custom color"
              />
              <div className="color-circle-add" aria-hidden="true">+</div>
            </div>
          )}
        </div>

        {colors.length >= MAX_COLORS && (
          <p className="tag-edit-hint">Max {MAX_COLORS} colors. Delete one to add more.</p>
        )}
      </div>

      {/* Preview */}
      <div className="tag-edit-field">
        <label className="tag-edit-label">Preview</label>
        <div className="tag-edit-preview">
          <span
            className="tag-chip-preview"
            style={{
              background:  `${color}35`,
              color,
              borderColor: `${color}60`,
            }}
          >
            {name || 'Preview'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="tag-edit-actions">
        <button className="tag-edit-btn tag-edit-btn--confirm" onClick={handleConfirm}>
          {mode === 'create' ? 'Create' : 'Confirm'}
        </button>
        <button className="tag-edit-btn tag-edit-btn--cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── TagsPanel ────────────────────────────────────────────────────────────────
function TagsPanel({ tags, tasks, selectedTag, onSelectTag, onEditTag, onDeleteTag, onAddTag, selectionOnly = false }) {
  const [colors,     setColors]     = useState(PRESET_COLORS);
  const [openMenu,   setOpenMenu]   = useState(null);
  const [editingTag, setEditingTag] = useState(null);  // tag object being edited | null
  const [isCreating, setIsCreating] = useState(false);

  function getCount(tagName) {
    return tasks.filter((t) => t.tag?.name === tagName).length;
  }

  // ── Create mode ─────────────────────────────────────────────────────────────
  if (isCreating) {
    return (
      <TagForm
        mode="create"
        tags={tags}
        editingTagName={null}
        initialName=""
        initialColor={colors[0] ?? '#4ade80'}
        colors={colors}
        setColors={setColors}
        onConfirm={(name, color) => {
          onAddTag({ name, color });
          setIsCreating(false);
        }}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  // ── Edit mode ────────────────────────────────────────────────────────────────
  if (editingTag) {
    return (
      <TagForm
        mode="edit"
        tags={tags}
        editingTagName={editingTag.name}
        initialName={editingTag.name}
        initialColor={editingTag.color}
        colors={colors}
        setColors={setColors}
        onConfirm={(name, color) => {
          onEditTag(editingTag.name, { name, color });
          setEditingTag(null);
        }}
        onCancel={() => setEditingTag(null)}
      />
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="tags-panel">
      <div className="tags-panel__header">
        <span className="tags-panel__title">Tags</span>
        {!selectionOnly && (
          <button
            className="tags-panel__add-btn"
            onClick={() => setIsCreating(true)}
            aria-label="Add new tag"
            title="Add new tag"
          >
            +
          </button>
        )}
      </div>

      <div className="tags-panel__list">
        <div className="tag-row">
          <button
            className={`tag-chip ${!selectedTag ? 'tag-chip--active' : ''}`}
            onClick={() => onSelectTag(null)}
          >
            <span className="tag-chip__name">All</span>
            <span className="tag-chip__count">{tasks.length}</span>
          </button>
        </div>

        {tags.length === 0 && (
          <p className="tags-panel__empty">No tags yet. Hit + to create one!</p>
        )}

        {tags.map((tag) => (
          <div key={tag.name} className="tag-row">
            <button
              className={`tag-chip ${selectedTag === tag.name ? 'tag-chip--active' : ''}`}
              style={{
                background:  selectedTag === tag.name ? `${tag.color}40` : `${tag.color}18`,
                borderColor: `${tag.color}55`,
                color:        tag.color,
              }}
              onClick={() => onSelectTag(selectedTag === tag.name ? null : tag.name)}
            >
              <span className="tag-chip__dot" style={{ background: tag.color }} />
              <span className="tag-chip__name">{tag.name}</span>
              <span className="tag-chip__count">{getCount(tag.name)}</span>
            </button>

            {!selectionOnly && (
              <div className="tag-row__menu-wrapper">
                <button
                  className="tag-row__menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === tag.name ? null : tag.name);
                  }}
                  aria-label={`Options for ${tag.name}`}
                >
                  ⋮
                </button>

                {openMenu === tag.name && (
                  <div className="tag-dropdown">
                    <button
                      className="tag-dropdown__item"
                      onClick={() => { setEditingTag(tag); setOpenMenu(null); }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="tag-dropdown__item tag-dropdown__item--danger"
                      onClick={() => { setOpenMenu(null); onDeleteTag(tag.name); }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TagsPanel;
