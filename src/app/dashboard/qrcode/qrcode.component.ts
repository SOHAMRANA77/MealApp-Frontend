import { Component, Inject } from '@angular/core';
import { ApiService } from '../Services/API/api.service';
import { AuthService } from 'src/app/authentication/Services/auth.service';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QRcodeComponent {

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Close', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 3000
    });
  }

  constructor(
    private bookingService: ApiService,
    private token: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data here
    ,private datePipe: DatePipe,
    private _snackBar: MatSnackBar
  ) {
    this.getQrCode();
    if (data.redeemed) {
      this.redeemed = data.redeemed;
    }
  }

  qrCodeResponse: QrCodeResponse | undefined;

  name: string = "Aditya";
  QrDate: Date = new Date();
  mealType: string = "Breakfast";
  couponCode: string = "ABCDEF84558";

  redeemed: boolean = false;
  

  countdown: number = 60;
  timer: any;
  Counter: number = 60;


  public qrData = {
    name: this.name,
    QrDate: this.QrDate,
    mealType: this.mealType,
    couponCode: this.couponCode
  };

  ngOnInit(): void {
    this.startCountdown(this.Counter);
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }


  getQrCode() {
    const empId = this.token.decodeToken().id;
    const date =  this.datePipe.transform(this.data.date, 'yyyy-MM-dd') || '';  
    const type = this.data.mealType;
    // const type = "DINNER"

    this.bookingService.getQrCode(empId, date, type).subscribe(
      (response: any) => {
        if(response.status === false){
          this.openSnackBar(response.message);
        }
        this.qrCodeResponse = response;
        console.log(response);
        this.qrData.name = response.empName;
        this.qrData.couponCode = response.couponCode;
        this.qrData.mealType = response.menuType;

        // Ensure QrDate is a Date object
        this.qrData.QrDate = new Date(response.qrDate);


        // Update class properties (optional, if you need them elsewhere)
        this.name = response.empName;
        this.couponCode = response.couponCode;
        this.mealType = response.menuType;
        this.QrDate = new Date(response.qrDate);
        this.redeemed = !response.status;
      },
      (error) => {
        console.error('Error getting QR code', error);
      }
    );
  }

  generateQRData(): string {
    return `User data:-
    name: ${this.qrData.name}
    QrDate: ${this.qrData.QrDate}
    mealType: ${this.qrData.mealType}
    couponCode: ${this.qrData.couponCode}`;
  }
  countdownMinutes: number = 0;
  countdownSeconds: number = 0;
  interval: any;
  buttonDisabled: boolean = false;

  startCountdown(totalSeconds: number) {
    // Disable the button
    this.buttonDisabled = true;
    console.log(this.redeemed);
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
        this.redeemed = true;

        // Here you can perform any action when countdown finishes
      }
    }, 1000);
  }


}

interface QrCodeResponse {
  empName: string;
  couponCode: string;
  qrDate: string; // Adjusted to match the response
  menuType: 'LUNCH' | 'DINNER';
  httpStatus: any; // Adjusted to match the response
  status: boolean;
}
