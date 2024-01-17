import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = '';
  private loginStatus = new BehaviorSubject<boolean>(false);
  private clearTimer: NodeJS.Timeout;

  constructor(private http: HttpClient, private router: Router) {}

  getLoginStatus() {
    return this.loginStatus.asObservable();
  }

  getToken() {
    return this.token;
  }

  autoLogin(tokenData: string) {
    if (tokenData) {
      const tokenDetails: {
        expiresIn: string,
        timestamp: string,
        token: string
      } = JSON.parse(tokenData);
      this.token = tokenDetails.token;
      this.loginStatus.next(true);
      let timeNow = (new Date()).getTime();
      let timeCreated = new Date(tokenDetails.timestamp).getTime();
      let timeElapsed = timeNow - timeCreated;
      console.log(timeNow - timeCreated);
      this.autoLogout(Number(tokenDetails.expiresIn) - timeElapsed);
    }
  }

  login(email: string, password: string) {
    this.http
      .post<any>('http://localhost:3000/api/auth/login', {
        email,
        password,
      })
      .subscribe({
        next: (response) => {
          this.token = response.token;
          if (this.token) {
            this.loginStatus.next(true);
            this.router.navigate(['/']);
            localStorage.setItem('tokenDetails', JSON.stringify(response));
            this.autoLogout(response.expiresIn);
          }
        },
        error: (err) => {
          console.log(err.message);
        },
      });
  }

  autoLogout(time) {
    this.clearTimer = setTimeout(() => {
      this.logout();
    }, time);
  }

  logout() {
    clearTimeout(this.clearTimer);
    this.loginStatus.next(false);
    localStorage.removeItem('tokenDetails');
    this.router.navigate(['/']);
  }

  register(email: string, password: string) {
    return this.http.post('http://localhost:3000/api/auth/register', {
      email,
      password,
    });
  }
}
