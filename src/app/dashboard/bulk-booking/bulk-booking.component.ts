import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../Services/API/api.service';
import { AuthService } from 'src/app/authentication/Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(public dialogRef: MatDialogRef<BulkBookingComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private token: AuthService, private mealService: ApiService,private _snackBar: MatSnackBar) {}

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Close', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 3000
    });
  }

  validateDateRange(): boolean {
    if (!this.bulkMealType) {
      this.openSnackBar('Please select a meal type.');
      return false;
    }

    if (!this.bulkStartDate || !this.bulkEndDate) {
      this.openSnackBar('Please select both start and end dates.');
      return false;
    }

    if (this.bulkStartDate < this.minDate) {
      this.openSnackBar('The start date must be from tomorrow onwards.');
      return false;
    }

    if (this.bulkStartDate > this.bulkEndDate) {
      this.openSnackBar('The start date must be before the end date.');
      return false;
    }

    if (this.bulkEndDate > this.maxDate) {
      this.openSnackBar('The end date must be within two months from today.');
      return false;
    }

    return true;
  }

  bookBulkMeal() {
    if (this.validateDateRange()) {
      // Close dialog
      this.dialogRef.close({ bulkMealType: this.bulkMealType, bulkStartDate: this.bulkStartDate, bulkEndDate: this.bulkEndDate });
  
      // Check if all properties are defined
      if (this.bulkMealType && this.bulkStartDate && this.bulkEndDate) { 
        // Call bulkBooking with start and end dates
        this.mealService.bulkBooking(
          this.token.decodeToken().id, 
          this.bulkMealType.toUpperCase() as 'LUNCH' | 'DINNER', 
          this.bulkStartDate, 
          this.bulkEndDate
        ).subscribe(
          (response) => {
            // Handle successful booking
            // console.log('Bulk meal booked successfully');
            this.openSnackBar(response.message);  
            // You may want to handle any UI updates here
          },
          (error: HttpErrorResponse) => {
            // Handle error
            console.error('Error booking bulk meal:', error.message);
          }
        );
      } else {
        console.error('bulkMealType, bulkStartDate, or bulkEndDate is null or undefined.');
      }
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
