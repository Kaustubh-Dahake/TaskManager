import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task } from './taskInterface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5020/api/Tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable(); // Components can subscribe to this

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

 // task.service.ts

loadTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(this.apiUrl, {
    headers: this.getAuthHeaders()
  }).pipe(
    tap(tasks => this.tasksSubject.next(tasks)),
    catchError(error => {
      console.error('Failed to load tasks', error);
      return throwError(() => error);
    })
  );
}


  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.loadTasks()), // reload tasks
      catchError(error => {
        console.error('Create failed', error);
        return throwError(() => error);
      })
    );
  }

  update(id: number, task: Task): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, task, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.loadTasks()), // reload tasks
      catchError(error => {
        console.error('Update failed', error);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.loadTasks()), // reload tasks
      catchError(error => {
        console.error('Delete failed', error);
        return throwError(() => error);
      })
    );
  }

  assignTaskToUser(taskId: number, username: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${taskId}/assign`, { assignedTo: username }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.loadTasks()), // reload tasks
      catchError(error => {
        console.error('Assignment failed', error);
        return throwError(() => error);
      })
    );
  }
}
