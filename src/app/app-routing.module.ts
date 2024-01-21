import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGaurdService } from './auth/auth-gaurd.service';

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
  {
    canActivate: [AuthGaurdService],
    path: 'edit/:id',
    component: PostCreateComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
