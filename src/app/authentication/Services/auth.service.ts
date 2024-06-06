import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private logoutInProgress = false;

  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  login(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.logoutInProgress = true;
    console.log('Logout initiated, flag set to true.');
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/auth/login']).then(() => {
      console.log('Navigation to login complete.');
      this.logoutInProgress = false; // Reset the flag after navigation completes
      console.log('Flag reset to false.');
    });
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLogoutInProgress(): boolean {
    console.log('Checking logoutInProgress:', this.logoutInProgress);
    return this.logoutInProgress;
  }

  decodeToken(): any {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    return token ? this.jwtHelper.getTokenExpirationDate(token) : null;
  }
}
