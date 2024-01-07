import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postsArr: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              desc: post.desc,
              content: post.content,
            };
          });
        })
      )
      .subscribe({
        next: (transformedPost) => {
          this.postsArr = transformedPost;
          this.postUpdated.next([...this.postsArr]);
        },
      });
  }

  getPostUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  addPost(post: Post) {
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe({
        next: (response) => {
          //updating the created post id to the static post
          post.id = response.postId;
          this.postsArr.push(post);
          this.postUpdated.next([...this.postsArr]);
          this.router.navigate(['/']);
        },
      });
  }

  editPost(post: Post) {
    this.http
      .put<{ message: string }>(
        `http://localhost:3000/api/posts/${post.id}`,
        post
      )
      .subscribe({
        next: (response) => {
          //updating the created post id to the static post
          // this.postsArr.push(post);
          // this.postUpdated.next([...this.postsArr]);
          this.router.navigate(['/']);
        },
      });
  }

  getPostById(postId: string) {
    return this.http.get<any>(`http://localhost:3000/api/posts/${postId}`);
  }

  deletePost(postId: string) {
    this.http
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe((res) => {
        //way 1 - easy way (API call)
        // this.getPosts();

        //way 2 - difficult way (No API call)
        const filteredPost = this.postsArr.filter((post) => {
          return post.id !== postId;
        });

        this.postsArr = filteredPost;
        this.postUpdated.next([...this.postsArr]);
      });
  }
}
