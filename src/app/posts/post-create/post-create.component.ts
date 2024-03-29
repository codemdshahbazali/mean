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

          this.imagePreview = this.fetchedPost.imagePath;

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
    //This line gets the first file from the files array of the HTMLInputElement that triggered the event 
    //(i.e., the file input element), and assigns it to the constant file.
    const file = (event.target as HTMLInputElement).files[0];
    //This line updates the value of the image field in the form with the file selected by the user.
    this.form.patchValue({
      image: file,
    });
    //This line triggers value and validation updates for the image field in the form. This is necessary 
    //to ensure that the form’s state is updated correctly after the value of the image field has been changed.
    this.form.get('image').updateValueAndValidity();

    //This line creates a new FileReader object, which is used to read the contents of the file selected by the user.
    const reader = new FileReader();
    //This block sets up a callback function to be executed when the FileReader has finished reading the file. The callback function 
    //assigns the result of the read operation (i.e., the data URL representing the file’s contents) to this.imagePreview.
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    //This line starts the read operation for the file selected by the user. The FileReader will read the file as a data URL, 
    //and once it’s done, it will call the onload callback function set up earlier.
    reader.readAsDataURL(file);
  }
}
