import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  // @Output() submittedPost = new EventEmitter<Post>();
  editMode: boolean = false;
  isLoading: boolean = false;
  fetchedPost;
  form: FormGroup;
  imagePreview: string = '';

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      desc: new FormControl(null, {
        validators: [Validators.required],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.params.subscribe((params) => {
      const postId = params['id'];
      if (postId) {
        this.editMode = true;
        this.isLoading = true;
        this.postService.getPostById(postId).subscribe((response) => {
          this.fetchedPost = response.post;
          this.form.setValue({
            title: this.fetchedPost.title,
            desc: this.fetchedPost.desc,
            content: this.fetchedPost.content,
            image: this.fetchedPost.imagePath,
          });
          // response.post;
          this.isLoading = false;
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    if (this.editMode) {
      this.postService.editPost(
        this.fetchedPost._id,
        this.form.value.title,
        this.form.value.desc,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.desc,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file,
    });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
