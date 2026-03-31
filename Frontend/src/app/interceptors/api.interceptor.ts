import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const auth = inject(AuthService);
  const token = auth.getToken();

  let cloned = req;
  if (token) {
    cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastr.error('Session expired, please login again', 'Unauthorized');
        auth.logout();
      } else {
        toastr.error(error.error?.message || 'Something went wrong', 'API Error');
      }
      return throwError(() => error);
    })
  );
};
