// import { CanActivateFn } from '@angular/router';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { PostService } from '../post.service';

@Injectable({ providedIn: 'root' })
export class PostGaurdService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private postService: PostService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const creator = this.authService.getCreator();
    console.log(creator);
    console.log(this.postService.postsArr)

    const filtered = this.postService.postsArr.filter((post) => {
      return post.id == route.params.id;
    });
    const postCreator = filtered[0].creator;

    console.log(creator);
    console.log(postCreator);
    if (creator === postCreator) {
      return true;
    } else {
      return this.router.createUrlTree(['/']);
    }
  }
}
