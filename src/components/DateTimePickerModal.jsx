import { useState, useEffect } from 'react';
import './DateTimePickerModal.css';

// Helpers
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function DateTimePickerModal({ isOpen, initialValue, onClose, onSave, title = "Select Date & Time" }) {
  // initialValue is expected to be "YYYY-MM-DDTHH:mm". If missing, default to now.
  const [viewDate, setViewDate] = useState(new Date()); 
  const [selectedDay, setSelectedDay] = useState(null); // { year, month, day }
  const [timeStr, setTimeStr] = useState("09:00");

  useEffect(() => {
    if (isOpen) {
      if (initialValue) {
        const d = new Date(initialValue);
        if (!isNaN(d)) {
          setViewDate(d);
          setSelectedDay({ year: d.getFullYear(), month: d.getMonth(), day: d.getDate() });
          const hh = String(d.getHours()).padStart(2, '0');
          const mm = String(d.getMinutes()).padStart(2, '0');
          setTimeStr(`${hh}:${mm}`);
          return;
        }
      }
      // fallback to roughly now
      const d = new Date();
      setViewDate(d);
      setSelectedDay({ year: d.getFullYear(), month: d.getMonth(), day: d.getDate() });
      const hh = String(d.getHours()).padStart(2, '0');
      setTimeStr(`${hh}:00`);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  function handleSave() {
    if (!selectedDay) return;
    const { year, month, day } = selectedDay;
    const [hh, mm] = timeStr.split(':');
    
    // Create local string perfectly
    const yyStr = year;
    const moStr = String(month + 1).padStart(2, '0');
    const daStr = String(day).padStart(2, '0');
    
    onSave(`${yyStr}-${moStr}-${daStr}T${hh}:${mm}`);
  }

  // Generate grid
  const blanks = Array.from({ length: firstDay }).map((_, i) => null);
  const days = Array.from({ length: daysInMonth }).map((_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  return (
    <div className="dt-picker-overlay" onClick={onClose}>
      <div className="dt-picker-modal" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="dt-picker-header">
          <h3>{title}</h3>
          <button className="dt-picker-close" onClick={onClose}>×</button>
        </div>

        {/* Month Navigation */}
        <div className="dt-picker-month-nav">
          <button onClick={prevMonth} aria-label="Previous Month">‹</button>
          <span>{MONTH_NAMES[month]} {year}</span>
          <button onClick={nextMonth} aria-label="Next Month">›</button>
        </div>

        {/* Calendar Grid */}
        <div className="dt-picker-grid-header">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div className="dt-picker-grid">
          {totalSlots.map((dayNum, index) => {
            if (!dayNum) return <div key={`blank-${index}`} className="dt-picker-cell dt-picker-cell--empty" />;
            
            const isSelected = selectedDay && selectedDay.year === year && selectedDay.month === month && selectedDay.day === dayNum;
            const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();

            return (
              <button
                key={`day-${dayNum}`}
                className={`dt-picker-cell ${isSelected ? 'dt-picker-cell--selected' : ''} ${isToday ? 'dt-picker-cell--today' : ''}`}
                onClick={() => setSelectedDay({ year, month, day: dayNum })}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {/* Time Selector */}
        <div className="dt-picker-time-section">
          <label htmlFor="time-input">Time:</label>
          <input 
            id="time-input" 
            type="time" 
            className="dt-picker-time-input" 
            value={timeStr} 
            onChange={e => setTimeStr(e.target.value)} 
          />
        </div>

        {/* Action Buttons */}
        <div className="dt-picker-footer">
          <button className="dt-picker-btn dt-picker-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="dt-picker-btn dt-picker-btn--save" onClick={handleSave} disabled={!selectedDay}>Confirm</button>
        </div>

      </div>
    </div>
  );
}

export default DateTimePickerModal;
