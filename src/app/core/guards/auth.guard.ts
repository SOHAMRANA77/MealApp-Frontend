import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../authentication/Services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(): boolean {
    console.log('AuthGuard canActivate called.');
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      console.log('User is not authenticated.');
      if (!this.authService.isLogoutInProgress()) {
        console.log('Unauthorized access detected.');
        this.snackBar.open('Unauthorized access', 'Close', {
          duration: 3000,
        });
      } else {
        console.log('Logout in progress, skipping unauthorized access snackbar.');
      }
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
