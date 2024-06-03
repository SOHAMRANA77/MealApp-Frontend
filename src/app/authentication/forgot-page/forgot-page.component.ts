import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OTPdialogComponent } from '../otpdialog/otpdialog.component';
import { ApiService } from '../Services/API/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-page',
  templateUrl: './forgot-page.component.html',
  styleUrls: ['../authentication.component.css']
})
export class ForgotPageComponent {

  Password: string = "";
  newPassword : string = "";
  Email = new FormControl("", [Validators.required, Validators.email]);

  constructor(public dialog: MatDialog, private otp : ApiService ,private _snackBar: MatSnackBar) {}

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

  onSubmit() {
    if (this.Email.valid) {
            
      const emailValue = this.Email.value as string;
      // this.openDialog(emailValue);
      this.otp.SendOtp(emailValue).subscribe((data) => {
        this.openDialog(emailValue);
        this.openSnackBar('OTP Sent');
      });
    }
  }

  openDialog(email: string): void {
    const dialogRef = this.dialog.open(OTPdialogComponent, {
      data: { email: email }
    });
  }


}
