import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [AngularMaterialModule, ReactiveFormsModule, CommonModule],
})
export class PostModule {}
