import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'An Unknown Error Ocurred !!!';
        console.log(error);
        if (error.error.message) {
          errorMsg = error.error.message;
        } else if (error.error.error.message) {
          errorMsg = error.error.error.message;
        }
        this.dialog.open(ErrorComponent, {
          data: { message: errorMsg },
        });
        // alert(JSON.stringify(error.error));
        return throwError(error);
      })
    );
  }
}
