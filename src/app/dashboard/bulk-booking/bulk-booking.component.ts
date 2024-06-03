import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../Services/API/api.service';
import { AuthService } from 'src/app/authentication/Services/auth.service';

@Component({
  selector: 'app-bulk-booking',
  templateUrl: './bulk-booking.component.html',
  styleUrls: ['./bulk-booking.component.css']
})
export class BulkBookingComponent {
  bulkMealType: 'lunch' | 'dinner' | null = null;
  bulkStartDate: Date | null = null;
  bulkEndDate: Date | null = null;

  today: Date = new Date();
  minDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 1);
  maxDate: Date = new Date(this.today.getFullYear(), this.today.getMonth() + 2, this.today.getDate());

  constructor(public dialogRef: MatDialogRef<BulkBookingComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private token: AuthService, private mealService: ApiService,) {}

  validateDateRange(): boolean {
    if (!this.bulkMealType) {
      alert('Please select a meal type.');
      return false;
    }

    if (!this.bulkStartDate || !this.bulkEndDate) {
      alert('Please select both start and end dates.');
      return false;
    }

    if (this.bulkStartDate < this.minDate) {
      alert('The start date must be from tomorrow onwards.');
      return false;
    }

    if (this.bulkStartDate > this.bulkEndDate) {
      alert('The start date must be before the end date.');
      return false;
    }

    if (this.bulkEndDate > this.maxDate) {
      alert('The end date must be within two months from today.');
      return false;
    }

    return true;
  }

  bookBulkMeal() {
    if (this.validateDateRange()) {
      this.dialogRef.close({ bulkMealType: this.bulkMealType, bulkStartDate: this.bulkStartDate, bulkEndDate: this.bulkEndDate });
      console.log(this.mealService.bulkBooking(this.token.decodeToken().id,this.bulkMealType as string,this.bulkStartDate as Date, this.bulkEndDate as Date))
    }
  }

  dateFilter = (d: Date | null): boolean => {
    if (!d) {
      return false;
    }
    const day = d.getDay();
    return d >= this.minDate && d <= this.maxDate && day !== 0 && day !== 6;
  };
}
