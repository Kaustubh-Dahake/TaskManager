import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../taskInterface';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  providers: [MessageService]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  showFilters: boolean = false;
  searchTerm: string = '';
  sortOption: string = '';
  currentUser: any;
  isAdmin: boolean = false;
  selectedTask: Task | null = null;
  displayDialog: boolean = false;
  isTaskListVisible: boolean = true;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
  
      this.taskService.loadTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasks = [...tasks];
  
          this.messageService.add({
            severity: 'info',
            summary: 'Loaded',
            detail: 'Tasks loaded successfully'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tasks'
          });
        }
      });
    });
  }
  

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    this.messageService.add({
      severity: 'info',
      summary: 'Filters',
      detail: this.showFilters ? 'Filters shown' : 'Filters hidden'
    });
  }

  toggleTaskList(): void {
    this.isTaskListVisible = !this.isTaskListVisible;
    this.messageService.add({
      severity: 'info',
      summary: 'Task List',
      detail: this.isTaskListVisible ? 'Task list expanded' : 'Task list collapsed'
    });
  }

  createTask(): void {
    this.messageService.add({ severity: 'info', summary: 'Navigation', detail: 'Redirecting to create task' });
    this.router.navigate(['/tasks/create']);
  }

  editTask(id: number): void {
    this.messageService.add({ severity: 'info', summary: 'Navigation', detail: 'Editing task #' + id });
    this.router.navigate(['/tasks/edit', id]);
  }

  confirmDelete(task: Task): void {
    this.selectedTask = task;
    this.displayDialog = true;
    this.messageService.add({ severity: 'warn', summary: 'Confirmation', detail: `Confirm deletion of "${task.title}"` });
  }

  deleteTask(): void {
    if (this.selectedTask) {
      this.taskService.delete(this.selectedTask.id).subscribe(
        () => {
          this.filteredTasks = this.filteredTasks.filter(t => t.id !== this.selectedTask?.id);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Task deleted successfully' });
          this.displayDialog = false;
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting task' });
          this.displayDialog = false;
        }
      );
    }
  }

  applyFilters(): void {
    this.filterTasks();
    this.messageService.add({ severity: 'info', summary: 'Filters Applied', detail: 'Filter and sort options applied' });
  }

 private filterTasks(): void {
  const term = this.searchTerm.trim().toLowerCase();

  this.filteredTasks = this.tasks.filter(task => {
    const fieldValue = task[this.sortOption as keyof Task];
    if (typeof fieldValue === 'string') {
      return fieldValue.toLowerCase().includes(term);
    }
    return false;
  });

  if (this.sortOption) {
    this.filteredTasks = [...this.filteredTasks].sort((a, b) => {
      const aValue = a[this.sortOption as keyof Task];
      const bValue = b[this.sortOption as keyof Task];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return (aValue === bValue) ? 0 : aValue ? -1 : 1;
      } else if (!isNaN(Date.parse(aValue as string)) && !isNaN(Date.parse(bValue as string))) {
        return new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
      } else {
        return 0;
      }
    });
  }
}
  

  isTaskCreatedByUser(task: Task): boolean {
    return task.assignedTo === this.currentUser?.username;
  }
}
