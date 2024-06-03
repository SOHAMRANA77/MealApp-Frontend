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
  Password = new FormControl(null, Validators.required);
  hidePassword: boolean = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    this.Password.updateValueAndValidity();
  }

  constructor(private router : Router,private StorageService : AuthService,private service : ApiService ,private _snackBar: MatSnackBar){}

  openSnackBar(msg :string) {
    this._snackBar.open(msg , 'Close', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 3000
    });
  }

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'You must enter a value';
    }

    return control.hasError('email') ? 'Not a valid email' : '';
  }

  login() {
    const email = this.Email.value;
    const password = this.Password.value;
    if (email && password) {
      this.service.loginApi(email, password).subscribe({
        next: (response) => {
          console.log(response.jwt);
          this.StorageService.login(response.jwt);
          
          this.openSnackBar('Login successful');
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          console.error('Login failed', error);
          this.openSnackBar('Login failed: ' + error.message);
        }
      });
    } else {
      this.openSnackBar('Please fill in all required fields');
    }
  }


}
