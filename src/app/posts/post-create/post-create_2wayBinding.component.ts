import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create_2wayBinding.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent {
  title = '';
  desc = '';
  content: '';

  @Output() submittedPost = new EventEmitter<Post>();

  onSavePost() {
    const post: Post = {
      title: this.title,
      desc: this.desc,
      content: this.content,
    };

    this.submittedPost.emit(post);
  }
}
