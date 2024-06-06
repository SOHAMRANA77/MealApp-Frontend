import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '../Services/API/api.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['../authentication.component.css']
})
export class LoginPageComponent {
  Email = new FormControl(null, [Validators.required, Validators.email]);
  Password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)
  ]);
  hidePassword: boolean = true;

  constructor(
    private router: Router,
    private StorageService: AuthService,
    private service: ApiService,
    private _snackBar: MatSnackBar
  ) {
    // if (this.StorageService.isAuthenticated()) {
    //   this.router.navigateByUrl('/dashboard');
    // }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Close', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 3000
    });
  }

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'You must enter a value';
    }
    if (control === this.Email && control.hasError('email')) {
      return 'Not a valid email';
    }
    if (control === this.Password && control.hasError('pattern')) {
      return '8+ chars with lowercase, uppercase, digit, and special character.';
    }
    return '';
  }

  login() {
    // if (this.Email.invalid || this.Password.invalid) {
    //   this.openSnackBar('Please fill in all required fields correctly');
    //   return;
    // }

    const email = this.Email.value || '';
    const password = this.Password.value || '';

    this.service.loginApi(email, password).subscribe({
      next: (response) => {
        this.StorageService.login(response.jwt);
        this.openSnackBar(response.message);
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.openSnackBar('Login failed: ' + error.message);
      }
    });
  }
}
