import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: any = null;
  isLoggedIn = false;
  private sub!: Subscription;
  displayDialog: boolean = false;
  dialogClass: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.showWelcomeDialog();
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  showWelcomeDialog(): void {
    this.dialogClass = 'dialog-open';
    this.displayDialog = true;
    setTimeout(() => {
      this.displayDialog = false;
      this.dialogClass = '';
    }, 2500);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
