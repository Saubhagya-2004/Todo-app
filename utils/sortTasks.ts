


import { Task, Priority } from '../types';


const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};


const URGENCY_WINDOW_HOURS = 48;


function getUrgencyScore(deadlineIso: string): number {
  const now = Date.now();
  const deadline = new Date(deadlineIso).getTime();
  const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);

  if (hoursUntilDeadline <= 0) {
    
    return 3;
  } else if (hoursUntilDeadline <= URGENCY_WINDOW_HOURS) {
    
    return 2 * (1 - hoursUntilDeadline / URGENCY_WINDOW_HOURS);
  }
  return 0;
}


function getCompositeScore(task: Task): number {
  const priorityScore = PRIORITY_WEIGHT[task.priority];
  const urgencyScore = getUrgencyScore(task.deadline);
  return priorityScore + urgencyScore;
}


export function sortTasks(tasks: Task[]): Task[] {
  const active = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  
  active.sort((a, b) => getCompositeScore(b) - getCompositeScore(a));

  
  completed.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return [...active, ...completed];
}
