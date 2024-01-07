import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  postsList: Post[] = [];
  postServiceSbs: Subscription;
  isloading: boolean = false;
  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.isloading = true;
    this.postService.getPosts();
    this.postServiceSbs = this.postService.getPostUpdatedListener().subscribe({
      next: (postData: Post[]) => {
        this.postsList = postData;
        this.isloading = false;
      },
    });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  onEdit(postId: string) {
    this.router.navigate(['/edit', postId]);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.postServiceSbs.unsubscribe();
  }
}
