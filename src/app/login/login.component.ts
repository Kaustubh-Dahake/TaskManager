import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(loginForm: NgForm): void {
    if (loginForm.invalid) {
      return; 
    }
    this.isLoading = true;  

    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        const { username, role, logo, token } = response;
        const user = { username, role, logo };
        this.authService.saveUserSession(user, token);
        this.router.navigate(['/tasks']);
      },
      (error) => {
        this.errorMessage = 'Invalid username or password';
        this.isLoading = false;  
      }
    );
  }
}
