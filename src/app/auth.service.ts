import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface User {
  username: string;
  role: string;
  logo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5020/api/Auth'; 

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable(); 

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        this.currentUserSubject.next(parsedUser); 
      } catch (e) {
        console.error('Failed to parse saved user JSON:', e);
      }
    }
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.role === 'Admin' : false;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      catchError(error => {
        console.error('Login failed', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null); 
  }

  saveUserSession(user: User, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user)); 
    localStorage.setItem('token', token); 
    this.currentUserSubject.next(user); 
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
