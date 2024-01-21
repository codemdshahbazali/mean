import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGaurdService } from './auth/auth-gaurd.service';
import { PostGaurdService } from './posts/post-list/post-edit.gaurd';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
  },
  {
    canActivate: [AuthGaurdService],
    path: 'create',
    component: PostCreateComponent,
  },
  ,
  {
    canActivate: [AuthGaurdService],
    path: 'edit/:id',
    component: PostCreateComponent,
  },
  ,
  {
    path: 'auth',
    component: AuthComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
