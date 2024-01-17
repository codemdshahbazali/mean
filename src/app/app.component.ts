import { Component, Input, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'mean-project';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const tokenDetails = localStorage.getItem("tokenDetails");
    if(tokenDetails) {
      this.authService.autoLogin(tokenDetails);
    }
  }
}
