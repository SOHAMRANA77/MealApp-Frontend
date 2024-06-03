import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BulkBookingComponent } from '../bulk-booking/bulk-booking.component';
import { DashbordService } from '../Services/dashbord.service';
import { AuthService } from 'src/app/authentication/Services/auth.service';
import { format, toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { WeekDay } from '@angular/common';
import { ApiService } from '../Services/API/api.service';
import { MatCalendar } from '@angular/material/datepicker';


interface Bookings {
  [date: string]: {
    LUNCH?: boolean;
    DINNER?: boolean;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  today: Date;
  startDate: Date;
  maxDate: Date;

  showTooltip = false;

  selectedDate: Date | null = null;
  mealType: 'LUNCH' | 'DINNER' | null = null;
  bookings: any;
  // bookings: { [key: string]: { [key: string]: boolean } } = {};
  

  menu: { [key: string]: { LUNCH: string[], DINNER: string[] } } = {};

  bulkMealType: 'LUNCH' | 'DINNER' | null = null;
  bulkStartDate: Date | null = null;
  bulkEndDate: Date | null = null;

  constructor(public dialog: MatDialog, private mealService: ApiService, private token: AuthService, private cdr: ChangeDetectorRef) {
    this.today = this.resetTimeToIST(new Date());
    this.startDate = this.resetTimeToIST(new Date());
    this.maxDate = this.resetTimeToIST(new Date(this.today.getFullYear(), this.today.getMonth() + 3, this.today.getDate()));
    this.getBookedDate()
    console.log("aaaa"+this.bookings)
    this.getBookedDate1();
  }

  ngOnInit() {
    this.fetchMenu();
    this.selectedDate = this.today; // Set today's date as selected by default
    this.refreshCalendarView(); // Refresh calendar view
  }

  fetchMenu() {
    this.mealService.getMeals().subscribe(menu => {
      this.menu = menu;
      console.log(menu);
    });
    
  }

  

  getBookedDate1(){
    this.mealService.getCouponsById(this.token.decodeToken().id)
.subscribe(
{
  next:(response) => {
    console.log(response);
    this.bookings = response;
    console.log("abbbb"+this.bookings);
    console.log("Bookings:", JSON.stringify(this.bookings, null, 2));
    this.refreshCalendarView(); 
  },
  error:(err) => {
    console.error(err);
  }
}
)  }


//   transformBookings(response: any): Bookings {
//     console.log("transforemed:",response)
//     const transformed: Bookings = {};
//     for (const date in response) {
//       if (response.hasOwnProperty(date)) {
//         transformed[date] = {
//           LUNCH: response[date].LUNCH || false,
//           DINNER: response[date].DINNER || false
//         };
//       }
//     }
//     return transformed;
//   }


  getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay();
    return days[dayIndex];
  }

  dateClass = (d: Date) => {
    const formattedDate = this.formatDateToIST(d);
    const bookingStatus = this.getBookingStatus(d);
    
    if (bookingStatus.LUNCH && bookingStatus.DINNER) {
      return 'isBooked';
    } else if (bookingStatus.LUNCH) {
      return 'lunchIsBooked';
    } else if (bookingStatus.DINNER) {
      return 'dinnerIsBooked';
    } else {
      return '';
    }
  };

getBookingStatus(date: Date) {
  const formattedDate = this.formatDateToIST(date);
  return {
    LUNCH: this.hasBooking(date, 'LUNCH'),
    DINNER: this.hasBooking(date, 'DINNER')
    };
  }

  myDateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  isWeekend(date: Date | null): boolean {
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  canBook(): boolean {
    if (!this.selectedDate || !this.mealType || this.isPastDate(this.selectedDate) || this.isWeekend(this.selectedDate)) { return false;}
    if ((this.mealType === 'LUNCH' && this.isPastLUNCHTime(this.selectedDate)) || (this.mealType === 'DINNER' && this.isPastDINNERTime(this.selectedDate))) return false;
    return !this.hasBooking(this.selectedDate, this.mealType);
  }

  canCancel(): boolean {
    if (!this.selectedDate || this.isPastDate(this.selectedDate) || this.isWeekend(this.selectedDate)) return false;
    if ((this.mealType === 'LUNCH' && this.isPastLUNCHTime(this.selectedDate)) || (this.mealType === 'DINNER' && this.isPastDINNERTime(this.selectedDate))) return false;
    return this.hasBooking(this.selectedDate, this.mealType);
  }

  hasBooking(date: Date | null, mealType: 'LUNCH' | 'DINNER' | null): boolean {
    if (!date || !mealType) return false;
    const formattedDate = this.formatDateToIST(date);
    return !!this.bookings[formattedDate]?.[mealType];
  }

  onDateChange(date: Date | null) {
    this.selectedDate = date;
    this.refreshCalendarView();
  }
  getBookedDate(){
    // this.refreshCalendarView(); // Refresh calendar view
    this.mealService.getCouponsById(this.token.decodeToken().id).subscribe(
      (response) => {
        this.bookings = response;
        console.log("aofiwfei"+this.bookings);
        this.refreshCalendarView(); 
      },
      (error) => {
        console.error('Error fetching coupons', error);
      }
    );

  }



 

  bookMeal() {
    this.refreshCalendarView();
    if (this.selectedDate && this.mealType) {
      // const formattedDate = this.formatDateToIST(this.selectedDate);
      // if (!this.bookings[formattedDate]) {
      //   this.bookings[formattedDate] = {};
      // }
      // this.bookings[formattedDate][this.mealType] = true;
      console.log("jdfnjfio: "+this.bookings)
      console.log(this.mealService.bulkBooking(this.token.decodeToken().id,this.mealType,this.selectedDate))
      this.refreshCalendarView(); // Refresh calendar view
    }
    this.refreshCalendarView();
    this.refreshCalendarView();
    console.log(this.bookings)
  }

  cancelBooking() {
    if (this.selectedDate && this.mealType) {
      const formattedDate = this.formatDateToIST(this.selectedDate);
      if (this.bookings[formattedDate]) {
        delete this.bookings[formattedDate][this.mealType];
        if (Object.keys(this.bookings[formattedDate]).length === 0) {
          delete this.bookings[formattedDate];
        }
      }
      this.refreshCalendarView(); // Refresh calendar view
    }
    this.refreshCalendarView();
  }

  isPastDate(date: Date): boolean {
    const today = this.resetTimeToIST(new Date());
    return date < today;
  }

  isPastLUNCHTime(date: Date): boolean {
    const today = new Date();
    const LUNCHCutoff = new Date(date);
    LUNCHCutoff.setHours(9, 0, 0, 0);
    console.log("idhiofjfjijijsoijvifxihovji"+LUNCHCutoff.setHours(9, 0, 0, 0));
    return date.toDateString() === today.toDateString() && today > LUNCHCutoff;
  }

  isPastDINNERTime(date: Date): boolean {
    const today = new Date();
    const DINNERCutoff = new Date(date);
    DINNERCutoff.setHours(14, 0, 0, 0);
    return date.toDateString() === today.toDateString() && today > DINNERCutoff;
  }

  resetTimeToIST(date: Date): Date {
    const timeZone = 'Asia/Kolkata';
    const zonedDate = toZonedTime(date, timeZone);
    return new Date(zonedDate.getFullYear(), zonedDate.getMonth(), zonedDate.getDate());
  }

  formatDateToIST(date: Date): string {
    const timeZone = 'Asia/Kolkata';
    return formatInTimeZone(date, timeZone, 'yyyy-MM-dd');
  }

  get menuForDay() {
    if (this.selectedDate && !this.isWeekend(this.selectedDate)) {
      const dayOfWeek = this.getDayOfWeek(this.selectedDate);
      return this.menu[dayOfWeek.toUpperCase()];
    }
    return null;
  }

  shouldShowButton(): boolean {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const selectedDateIsToday = this.selectedDate?.toDateString() === this.today.toDateString();

    if (!selectedDateIsToday) {
      return false;
    }

    if (this.hasBooking(this.selectedDate, 'LUNCH') && currentHour >= 12 && currentHour < 13) {
      return true;
    }

    if (this.hasBooking(this.selectedDate, 'DINNER') && currentHour >= 19 && currentHour < 20) {
      return true;
    }

    return false;
  }

  openBulkBookingDialog() {
    const dialogRef = this.dialog.open(BulkBookingComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bulkMealType = result.bulkMealType;
        this.bulkStartDate = this.resetTimeToIST(result.bulkStartDate);
        this.bulkEndDate = this.resetTimeToIST(result.bulkEndDate);
        this.bookBulkMeal();
      }
    });
    this.refreshCalendarView();
  }

  bookBulkMeal() {
    if (this.bulkStartDate && this.bulkEndDate && this.bulkMealType) {
      let currentDate = new Date(this.bulkStartDate);
      const bulkEndDate = new Date(this.bulkEndDate);
      let allDatesBooked = true;

      console.log("jdfnjfio: "+this.bookings)
      console.log(this.mealService.bulkBooking(this.token.decodeToken().id,this.bulkMealType,this.bulkStartDate,this.bulkEndDate))
      this.getBookedDate()
      this.refreshCalendarView(); // Refresh calendar view


      // while (currentDate <= bulkEndDate) {
      //   if (!this.isWeekend(currentDate) && !this.hasBooking(currentDate, this.bulkMealType)) {
      //     allDatesBooked = false;
      //     const formattedDate = this.formatDateToIST(currentDate);
      //     if (!this.bookings[formattedDate]) {
      //       this.bookings[formattedDate] = {};
      //     }
      //     this.bookings[formattedDate][this.bulkMealType] = true;
      //   }
      //   currentDate.setDate(currentDate.getDate() + 1);
      // }

      // if (allDatesBooked) {
      //   alert('You have already booked meals for all the dates in the given range.');
      // } else {
      //   alert('Bulk booking is successful.');
      // }
    }
  }

  refreshCalendarView() {
    if (this.calendar) { // Check if calendar is defined
      this.calendar.updateTodaysDate();
      this.cdr.detectChanges();
    }
  }

}
