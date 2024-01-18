import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSubs: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubs = this.authService.getLoginStatus().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }
}
