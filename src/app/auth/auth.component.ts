import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { response } from 'express';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  public isLogin: boolean = true;
  public isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  onAuthFormSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if (this.isLogin) {
      this.authService.login(form.value.email, form.value.password);
    } else {
      this.isLoading = true;
      this.authService
        .register(form.value.email, form.value.password)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.isLoading = false;
          },
          error: (err => {
            console.log(err.message);
            this.isLoading = false;
          })
        });
    }
  }
}
