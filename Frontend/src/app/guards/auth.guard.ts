import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (auth.isLoggedIn()) {
    return true;
  }

  toastr.warning('Please login to access this page', 'Authentication Required');
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
