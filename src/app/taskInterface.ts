export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  assignedTo: string;
  createdBy: string;
}
