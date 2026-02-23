import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {

      console.log("🔥 INTERCEPTOR TRIGGERED");
      console.log("Status:", error.status);
      console.log("Full error:", error);

      if (error.status === 401) {
        console.log("🚨 401 detected — redirecting");
        localStorage.removeItem('token');
        router.navigate(['']);
      }

      return throwError(() => error);
    })
  );
};