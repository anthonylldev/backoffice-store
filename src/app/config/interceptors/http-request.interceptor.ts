import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, retry, throwError} from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const retryNumber = 3;
    return next.handle(request)
      .pipe(
        retry(retryNumber),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.status) {
            errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
          } else {
            errorMessage = `Error: ${error.message}`;
          }
          console.log(errorMessage)
          return throwError(() => error);
        })
      )
  }
}
