/**
 * Calculates urgency color (green/orange/red) based on true uncompleted task loads overlapping the target task's window.
 */
export function calculateTaskStatus(tasks, targetTaskId) {
  const now = Date.now();
  const targetTaskData = tasks.find(t => t.id === targetTaskId);
  
  if (!targetTaskData) return null;

  // 1. Immediate checks for target task
  const deadlineTime = targetTaskData.deadline ? new Date(targetTaskData.deadline).getTime() : 0;
  
  // If target is completed, it's green (safe)
  if (targetTaskData.completed || targetTaskData.progress === 100) {
    return "green";
  }

  // If target is overdue and not completed, it's grey
  if (deadlineTime > 0 && now > deadlineTime) {
    return "grey";
  }

  // 2. Filter tasks for 'load' calculation: 
  // Only consider tasks that are NOT completed and NOT overdue.
  const activeTasks = tasks.filter(t => {
    if (t.completed || t.progress === 100) return false;
    const d = t.deadline ? new Date(t.deadline).getTime() : 0;
    if (d > 0 && now > d) return false;
    return true;
  });

  // 3. Build remaining period bars from active tasks
  const bars = activeTasks.map(task => {
    const endTime = task.deadline ? new Date(task.deadline).getTime() : 0;

    // Parse existing estimatedFinish object
    const est = task.estimatedFinish;
    const estMins = est ? ((est.days || 0) * 24 * 60) + ((est.hours || 0) * 60) + (est.minutes || 0) : 0;
    const estMs = estMins * 60 * 1000;

    // Progress is 0-100
    const progressFactor = task.progress ? task.progress / 100 : 0;
    const remainingMs = (1 - progressFactor) * estMs;

    const newStart = endTime - remainingMs;

    return {
      id: task.id,
      start: newStart,
      end: endTime,
      originalStart: task.startDate ? new Date(task.startDate).getTime() : 0
    };
  }).filter(b => b.end > 0 && b.originalStart > 0);

  // 4. Find the target task's bar for calculation
  const target = bars.find(b => b.id === targetTaskId);
  if (!target) return "green"; // Should only happen if target was somehow excluded (shouldn't happen here)

  const target_start = target.originalStart;
  const target_end = target.end;

  if (target_start >= target_end) return "green";

  // 5. Collect all time points (for slicing) within target task window
  const pointsSet = new Set();
  for (const bar of bars) {
    if (bar.end > target_start && bar.start < target_end) {
      pointsSet.add(Math.max(bar.start, target_start));
      pointsSet.add(Math.min(bar.end, target_end));
    }
  }

  const sortedPoints = Array.from(pointsSet).sort((a, b) => a - b);

  // 6. Calculate total required time using slices
  let totalRequired = 0;
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const sliceStart = sortedPoints[i];
    const sliceEnd = sortedPoints[i + 1];
    const sliceDuration = sliceEnd - sliceStart;

    if (sliceDuration <= 0) continue;

    let load = 0;
    for (const bar of bars) {
      if (bar.start < sliceEnd && bar.end > sliceStart) {
        load += 1;
      }
    }
    totalRequired += load * sliceDuration;
  }

  // 7. Compute available time
  const available = target_end - target_start;

  // 8. Apply color logic
  if (totalRequired === 0) return "green";

  if (available >= 2 * totalRequired) {
    return "green";
  } else if (available >= totalRequired) {
    return "orange";
  } else {
    return "red";
  }
}
