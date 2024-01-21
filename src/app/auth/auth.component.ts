import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLogin: boolean = true;
  isLoading: boolean = false;
  loginStatusSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginStatusSubs = this.authService
      .getLoginStatus()
      .subscribe((isAuthenticated) => {
        if (!isAuthenticated) {
          this.isLoading = false;
        }
      });
  }

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  onAuthFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.isLogin) {
      this.authService.login(form.value.email, form.value.password);
    } else {
      this.authService
        .register(form.value.email, form.value.password)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.isLoading = false;
          },
          error: (err) => {
            console.log(err.error.message);
            this.isLoading = false;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.loginStatusSubs.unsubscribe();
  }
}
