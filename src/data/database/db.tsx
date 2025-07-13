import Dexie, { type Table } from "dexie";
import type { Task } from "../../components/TaskItem";

class TasksDB extends Dexie {
  tasks!: Table<Task, number>;

  constructor() {
    super("tasks-DB");
    this.version(1).stores({
      tasks:
        "id, title, description, createdAt, updatedAt, dueDate, category, status, priority",
    });
  }
}

export const TasksIndexDB = new TasksDB();

export const taskDBService = {
  getAllTasks: async (): Promise<Task[]> => {
    return TasksIndexDB.tasks.toArray();
  },
  getTask: async (id: number): Promise<Task | undefined> => {
    return TasksIndexDB.tasks.get(id);
  },
  createTask: async (task: Task): Promise<void> => {
    if (task.id === 0) {
      task.id = await TasksIndexDB.tasks
        .orderBy("id")
        .last()
        .then((lastTask) => (lastTask ? lastTask.id + 1 : 1));
    }
    await TasksIndexDB.tasks.add(task);
  },
  updateTask: async (task: Task): Promise<void> => {
    task.updatedAt = new Date();
    await TasksIndexDB.tasks.put(task);
  },
  deleteTask: async (id: number): Promise<void> => {
    await TasksIndexDB.tasks.delete(id);
  },
  doneTask: async (id: number): Promise<void> => {
    const task = await taskDBService.getTask(id);
    if (task) {
      task.status = "done";
      await taskDBService.updateTask(task);
    }
  },
  deleteAllTasks: async (): Promise<void> => {
    await TasksIndexDB.tasks.clear();
  },
};
