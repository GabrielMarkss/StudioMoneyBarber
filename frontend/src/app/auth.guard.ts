import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const requiresAuth = route.data['requiresAuth'] === true;

    // Se a rota exige estar logado e não tem token, redireciona pro login
    if (requiresAuth && !token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Se a rota exige estar deslogado e existe token, redireciona pro dashboard
    if (!requiresAuth && token) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
