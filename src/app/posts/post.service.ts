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
              imagePath: post.imagePath,
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

  addPost(title: string, desc: string, content: string, image) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('desc', desc);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe({
        next: (response) => {
          //updating the created post id to the static post
          const post: Post = {
            id: response.post.id,
            title,
            desc,
            content,
            imagePath: response.post.imagePath,
          };
          // post.id = response.postId;
          this.postsArr.push(post);
          this.postUpdated.next([...this.postsArr]);
          this.router.navigate(['/']);
        },
      });
  }

  editPost(
    id: string,
    title: string,
    desc: string,
    content: string,
    image: File | string
  ) {
    let postData;
    console.log(typeof image);
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('desc', desc);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        desc,
        content,
        imagePath: image,
      };
      console.log(postData);
    }

    this.http
      .put<{ message: string }>(
        `http://localhost:3000/api/posts/${id}`,
        postData
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
