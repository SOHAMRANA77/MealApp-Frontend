import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../Services/API/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-otpdialog',
  templateUrl: './otpdialog.component.html',
  styleUrls: ['./otpdialog.component.css']
})
export class OTPdialogComponent {
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  showChangePassword: boolean = false

  Password = new FormControl('', Validators.required);
  CoPassword = new FormControl('', Validators.required);

  OTP = new FormControl("", [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<OTPdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private api : ApiService,private router: Router,private _snackBar: MatSnackBar
  ) {this.startCountdown(3*60);}

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Close', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 3000
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    this.Password.updateValueAndValidity();
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
    this.CoPassword.updateValueAndValidity();
  }
  getErrorMessage(control: FormControl) {
    if (!control.touched || !control.dirty) {
      return null;
    }
    if (control.hasError('required')) {
      return 'You must enter a value';
    }
    if (control.hasError('email')) {
      return 'Not a valid email';
    }
    if (control.hasError('pattern')) {
      return 'Phone number must be 10 digits';
    }
    return '';
  }

  arePasswordsEqual(): boolean {
    const password = this.Password.value;
    const confirmPassword = this.CoPassword.value;
    return password === confirmPassword;
  };

  countdownMinutes: number = 0;
  countdownSeconds: number = 0;
  interval: any;
  buttonDisabled: boolean = false;

  startCountdown(totalSeconds: number) {
    // Disable the button
    this.buttonDisabled = true;
  
    this.interval = setInterval(() => {
      totalSeconds--;
      this.countdownMinutes = Math.floor(totalSeconds / 60);
      this.countdownSeconds = totalSeconds % 60;
  
      if (totalSeconds <= 0) {
        clearInterval(this.interval);
        // Enable the button and reset countdown display
        this.buttonDisabled = false;
        this.countdownMinutes = 0;
        this.countdownSeconds = 0;
        // Here you can perform any action when countdown finishes
      }
    }, 1000);
  }
  
  onVerify(){
    if(this.OTP.valid){
      const otp = this.OTP.value as string;
      this.api.verifyOtp(this.data.email, otp).subscribe((data) =>{
        if(data.status == true){
          this.showChangePassword = true
        }
      })
    }
  }

  onChange(){
    if(this.arePasswordsEqual()){
      const pass = this.Password.value as string;
      this.api.changePass(this.data.email, pass).subscribe((data)=>{
        // if(data.status == true){}
        this.openSnackBar("Change Password Successfully");
        this.router.navigate(['/auth/login']);
      })
    }
  }
  onSend(){
    this.api.SendOtp(this.data.email).subscribe((data) => {
      this.openSnackBar("OTP Sent");
    })
  }
  

}
