import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  // @Output() submittedPost = new EventEmitter<Post>();
  editMode: boolean = false;
  fetchedPost;
  isLoading: boolean = false;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.route.params.subscribe((params) => {
      const postId = params['id'];
      if (postId) {
        this.editMode = true;
        this.isLoading = true;
        this.postService.getPostById(postId).subscribe((response) => {
          this.fetchedPost = response.post;
          this.isLoading = false;
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSavePost(formRef: NgForm) {
    if (formRef.invalid) {
      return;
    }
    const post: Post = {
      id: null,
      title: formRef.value.title,
      desc: formRef.value.desc,
      content: formRef.value.content,
    };

    if (this.editMode) {
      post.id = this.fetchedPost._id;
      this.postService.editPost(post);
    } else {
      this.postService.addPost(post);
    }

    formRef.resetForm();
  }
}
