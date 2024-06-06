import { Component, Inject } from '@angular/core';
import { ApiService } from '../Services/API/api.service';
import { AuthService } from 'src/app/authentication/Services/auth.service';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QRcodeComponent {
  constructor(
    private bookingService: ApiService,
    private token: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data here
    ,private datePipe: DatePipe
  ) {
    this.getQrCode();
  }

  qrCodeResponse: QrCodeResponse | undefined;

  name: string = "naitik";
  QrDate: Date = new Date();
  mealType: string = "Breakfast";
  couponCode: string = "ABCDEF";

  public qrData = {
    name: this.name,
    QrDate: this.QrDate,
    mealType: this.mealType,
    couponCode: this.couponCode
  };

  getQrCode() {
    const empId = this.token.decodeToken().id;
    const date =  this.datePipe.transform(this.data.date, 'yyyy-MM-dd') || '';  
    const type = this.data.mealType;
    // const type = "DINNER"

    this.bookingService.getQrCode(empId, date, type).subscribe(
      (response: any) => {
        this.qrCodeResponse = response.body;
        console.log(response);
        this.qrData.name = response.body.empName;
        this.qrData.couponCode = response.body.couponCode;
        this.qrData.mealType = response.body.menuType;

        // Ensure QrDate is a Date object
        this.qrData.QrDate = new Date(response.body.qrDate);

        // Update class properties (optional, if you need them elsewhere)
        this.name = response.body.empName;
        this.couponCode = response.body.couponCode;
        this.mealType = response.body.menuType;
        this.QrDate = new Date(response.body.qrDate);
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
}

interface QrCodeResponse {
  empName: string;
  couponCode: string;
  qrDate: string; // Adjusted to match the response
  menuType: 'LUNCH' | 'DINNER';
  httpStatus: any; // Adjusted to match the response
  status: boolean;
}
