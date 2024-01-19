import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  postsList: Post[] = [];
  isloading: boolean = false;
  isAuthenticated = false;
  creator: string | null = null;

  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50];

  private postServiceSbs: Subscription;
  private authSubs: Subscription;

  constructor(private postService: PostService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isloading = true;
    this.creator = this.authService.getCreator();
    this.postsList =  this.postService.postsArr;
    this.postService.getPosts(this.pageIndex, this.pageSize);
    this.postServiceSbs = this.postService.getPostUpdatedListener().subscribe({
      next: (postData: {posts: Post[], totalPosts: number}) => {
        this.postsList = postData.posts;
        this.length = postData.totalPosts;
        this.isloading = false;
      },
    });

    this.authSubs = this.authService.getLoginStatus().subscribe({
      next: (isAuth) => {
        this.isAuthenticated = isAuth;
      }
    })
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.pageIndex, this.pageSize);
    })
  }

  onEdit(postId: string) {
    this.router.navigate(['/edit', postId]);
  }

  onPageChange(pageEvent: PageEvent) {
    this.isloading = true;
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.postService.getPosts(this.pageIndex, this.pageSize);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.postServiceSbs.unsubscribe();
    this.authSubs.unsubscribe();
  }
}
