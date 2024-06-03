import { Component } from '@angular/core';
import { ApiService } from '../Services/API/api.service';
import { AuthService } from 'src/app/authentication/Services/auth.service';


@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QRcodeComponent {
  constructor(private bookingService: ApiService,private token: AuthService) {}

  qrCodeResponse: any;

  getQrCode() {
    const empId = this.token.decodeToken().id;
    const date = '2024-08-12';
    const type = 'LUNCH';

    this.bookingService.getQrCode(empId, date, type).subscribe(
      (response) => {
        this.qrCodeResponse = response;
        console.log(response);
      },
      (error) => {
        console.error('Error getting QR code', error);
      }
    );
  }
}
