// utils/sortTasks.ts
// Smart task sorting algorithm that weights priority and deadline urgency

import { Task, Priority } from '../types';

// Priority weight map: higher number = more urgent
const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

// Maximum hours before deadline to consider a task "urgent"
const URGENCY_WINDOW_HOURS = 48;

/**
 * Calculates an urgency score based on how close the deadline is.
 * Tasks due within URGENCY_WINDOW_HOURS get a bonus score.
 * Overdue tasks get the maximum urgency score.
 */
function getUrgencyScore(deadlineIso: string): number {
  const now = Date.now();
  const deadline = new Date(deadlineIso).getTime();
  const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);

  if (hoursUntilDeadline <= 0) {
    // Overdue — highest urgency
    return 3;
  } else if (hoursUntilDeadline <= URGENCY_WINDOW_HOURS) {
    // Within urgency window — scale from 0 to 2
    return 2 * (1 - hoursUntilDeadline / URGENCY_WINDOW_HOURS);
  }
  return 0;
}

/**
 * Composite sort score: priority weight (0-3) + urgency score (0-3)
 * Higher score = task should appear first
 */
function getCompositeScore(task: Task): number {
  const priorityScore = PRIORITY_WEIGHT[task.priority];
  const urgencyScore = getUrgencyScore(task.deadline);
  return priorityScore + urgencyScore;
}

/**
 * Sort tasks using the composite algorithm.
 * Completed tasks always appear at the bottom, sorted by completion time.
 */
export function sortTasks(tasks: Task[]): Task[] {
  const active = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  // Sort active tasks by composite score descending
  active.sort((a, b) => getCompositeScore(b) - getCompositeScore(a));

  // Sort completed tasks by creation date descending (most recently completed first)
  completed.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return [...active, ...completed];
}
