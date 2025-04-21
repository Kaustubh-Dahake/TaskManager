import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { TaskService } from '../task.service';
import { AuthService } from '../auth.service';
import { Task } from '../taskInterface';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  providers: [MessageService]
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEdit = false;
  isAdmin = false;
  users: string[] = [];
  currentUser: any;
  displayDeleteDialog: boolean = false;
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
      this.initializeForm();
    });
    const currentUserName = this.currentUser?.username || 'self';
    this.users = ['user1', 'user2', 'user3', 'user4', currentUserName];

    const id = +this.router.url.split('/').pop()!;
    if (id) {
      this.isEdit = true;
      this.taskService.getById(id).subscribe(existingTask => {
        if (existingTask) {
          this.taskForm.patchValue({
            title: existingTask.title,
            description: existingTask.description,
            dueDate: existingTask.dueDate ? new Date(existingTask.dueDate) : null, 
            isCompleted: existingTask.isCompleted,
            assignedTo: existingTask.assignedTo
          });
        }
      });
    }
  }

  initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', [Validators.required, this.noPastDateValidator()]],
      isCompleted: [false],
      assignedTo: ['', this.isAdmin ? Validators.required : []]
    });
  }

  noPastDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        const today = new Date();
        const selectedDate = new Date(control.value);
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return { pastDate: true };
        }
      }
      return null; 
    };
  }
  

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const taskData: Task = this.taskForm.value;

    if (this.isEdit) {
      taskData.id = +this.router.url.split('/').pop()!;
      this.taskService.update(taskData.id, taskData).subscribe(
        () => {
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task updated successfully' });
            this.navigateAfterToast();
          }, 500); 
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating task' });
          this.isSaving = false;
        }
      );
    } else {
      this.taskService.create(taskData).subscribe(
        () => {
          setTimeout(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task created successfully' });
            this.navigateAfterToast();
          }, 500); 
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating task' });
          this.isSaving = false;
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  confirmDelete(): void {
    this.displayDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.displayDeleteDialog = false;
  }

  deleteTask(): void {
    const taskId = +this.router.url.split('/').pop()!;
    this.taskService.delete(taskId).subscribe(
      () => {
        setTimeout(() => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Task deleted successfully' });
          this.navigateAfterToast();
        }, 500);
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting task' });
      }
    );
  }

  private navigateAfterToast(): void {
    setTimeout(() => {
      this.router.navigate(['/tasks']);
    }, 1000); 
  }
}