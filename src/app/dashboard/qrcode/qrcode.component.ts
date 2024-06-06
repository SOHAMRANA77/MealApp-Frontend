import { Component } from '@angular/core';
import { ApiService } from '../Services/API/api.service';
import { AuthService } from 'src/app/authentication/Services/auth.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QRcodeComponent {
  constructor(private bookingService: ApiService, private token: AuthService) {
    this.getQrCode();
  }

  qrCodeResponse: any;

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
    const date = '2024-06-06' as string;
    const type = 'DINNER';

    this.bookingService.getQrCode(empId, date, type).subscribe(
      (response) => {
        this.qrCodeResponse = response;
        console.log(response);
        this.qrData.name = response.empName;
        this.qrData.couponCode = response.CouponCode;
        this.qrData.mealType = response.MenuType;

        // Check the value of response.LocalDate
        console.log('Response LocalDate:', response.LocalDate);

        // Ensure QrDate is a Date object
        this.qrData.QrDate = new Date(response.LocalDate);

        // Update class properties (optional, if you need them elsewhere)
        this.name = response.empName;
        this.couponCode = response.CouponCode;
        this.mealType = response.MenuType;
        this.QrDate = new Date(response.LocalDate);
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
