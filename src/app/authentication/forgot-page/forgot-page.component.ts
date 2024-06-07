import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OTPdialogComponent } from '../otpdialog/otpdialog.component';
import { ApiService } from '../Services/API/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-page',
  templateUrl: './forgot-page.component.html',
  styleUrls: ['../authentication.component.css']
})
export class ForgotPageComponent {

  Password: string = "";
  newPassword : string = "";
  Email = new FormControl("", [Validators.required, Validators.email,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]);
  loading: boolean = false;


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

  // onSubmit() {
  //   if (this.Email.valid) {
            
  //     const emailValue = this.Email.value as string;
  //     // this.openDialog(emailValue);
  //     this.otp.SendOtp(emailValue).subscribe((data) => {
  //       this.openDialog(emailValue);
  //       this.openSnackBar('OTP Sent');
  //     });
  //   }
  // }

  openDialog(email: string): void {
    const dialogRef = this.dialog.open(OTPdialogComponent, {
      data: { email: email }
    });
  }

  async onSubmit(){
    if (this.Email.invalid || this.loading) {
      return;
    }
    this.loading = true;
    const emailValue = this.Email.value as string;
    try{
      const res = await firstValueFrom(
        this.otp.SendOtp(emailValue).pipe(catchError((error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 404) {
              this.openSnackBar("Invalid email");
              this.loading = false;
              return of(null);
            } else {
              this.openSnackBar("Error occurred while sending OTP!");
              this.loading = false;
              return throwError(error);
            }
          } else {
            this.openSnackBar("An unexpected error occurred!");
            this.loading = false;
            return throwError(error);
          }
        })
      )
    );
    if(res.status == true){
      this.openDialog(emailValue);
      this.openSnackBar('OTP Sent');
    }else{
      this.openSnackBar(res.message);
    }
    }catch(err){
      console.log("Error occurred", err);
      this.openSnackBar(err as string);
    }
  finally {
    this.loading = false;
    }
  }
}
