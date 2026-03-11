// services/taskService.ts
// Firestore CRUD operations for tasks
// All tasks are scoped to the authenticated user's userId

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, TaskFormData } from '../types';

// Reference to the top-level "tasks" collection
const TASKS_COLLECTION = 'tasks';

/**
 * Subscribe to all tasks for a given user in real-time.
 * Returns an unsubscribe function — call it to stop listening.
 */
export function subscribeTasks(
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          dateTime: data.dateTime,
          deadline: data.deadline,
          priority: data.priority,
          completed: data.completed,
          category: data.category,
          createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        };
      });
      onUpdate(tasks);
    },
    onError
  );
}

/**
 * Add a new task document to Firestore.
 * Returns the generated task id.
 */
export async function addTaskToFirestore(
  userId: string,
  formData: TaskFormData
): Promise<string> {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    userId,
    title: formData.title,
    description: formData.description,
    dateTime: formData.dateTime.toISOString(),
    deadline: formData.deadline.toISOString(),
    priority: formData.priority,
    category: formData.category,
    completed: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update the completed status of a task.
 */
export async function toggleTaskComplete(
  taskId: string,
  completed: boolean
): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, { completed });
}

/**
 * Update all editable fields of an existing task.
 */
export async function updateTaskInFirestore(
  taskId: string,
  formData: TaskFormData
): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, {
    title: formData.title,
    description: formData.description,
    dateTime: formData.dateTime.toISOString(),
    deadline: formData.deadline.toISOString(),
    priority: formData.priority,
    category: formData.category,
  });
}

/**
 * Permanently delete a task document.
 */
export async function deleteTaskFromFirestore(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}
