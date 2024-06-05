import { HttpClient,HttpErrorResponse,HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/Services/auth.service';

interface BookingRequest {
  employeeId: number;
  startDate: string;
  endDate: string;
  bookingType: string;
}
interface DeleteCouponRequest {
  id: number;
  date: string;
  menuType: string;
}

interface QrCodeResponse {
  message: string;
  http: any;
  status: boolean;
}
interface DeleteNotificationRequest {
  id: number;
  empId: number;
}
interface LogResponse {
  status: string;
  success: boolean;
}

interface ChangePasswordRequest {
  email: string;
  newPassword: string;
  oldPassword: string;
}

interface ChangePasswordResponse {
  message: string;
  http: string;
  status: boolean;
}

interface NotificationResponse {
  message: string;
  id: number;
  type: string;
  seen: boolean;
}
interface LogResponse {
  status: string;
  success: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  bookingDate: string;
  mealType: 'LUNCH' | 'DINNER';
  couponCode: string;
  status: string;
}



interface MealApiResponse {
  id: number;
  menuType: string;
  specialDate: string;
  menuDay: string;
  item1: string;
  item2: string;
  item3: string;
  item4: string;
  item5: string;
}

interface Coupon {
  date: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private http: HttpClient, private token : AuthService) {}

  getMeals(): Observable<{ [key: string]: { LUNCH: string[], DINNER: string[] } }> {
    return this.http.get<MealApiResponse[]>(environment.mainURL+"/allMenu").pipe(
      map((meals) => {
        const menu: { [key: string]: { LUNCH: string[], DINNER: string[] } } = {};
        meals.forEach(meal => {
          const day = meal.menuDay.toUpperCase();
          const items = [meal.item1, meal.item2, meal.item3, meal.item4, meal.item5];
          if (!menu[day]) {
            menu[day] = { LUNCH: [], DINNER: [] };
          }
          if (meal.menuType === 'LUNCH') {
            menu[day].LUNCH = items;
          } else if (meal.menuType === 'DINNER') {
            menu[day].DINNER = items;
          }
        });
        return menu;
      })
    );
  }

  bulkBooking(employeeId: number, bookingType: string, startDate: Date, endDate: Date = startDate){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const formattedData: BookingRequest = {
      employeeId: employeeId,
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
      bookingType: bookingType.toUpperCase()
    };

    return this.http.post<[]>(`${environment.mainURL}/addBooking`, formattedData, { headers: headers }).pipe(catchError(this.handleError) )
  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  getCouponsById(employeeId: number): Observable<any> {
    const url = `${environment.mainURL}/getCouponByID?emp_id=${employeeId}`;
    return this.http.get<any[]>(url).pipe(
      map(coupons => {
        const bookings: { [key: string]: { [key: string]: boolean } } = {};
        coupons.forEach(coupon => {
          const date = coupon.date; // Assuming date is in format 'yyyy-MM-dd'
          const type = coupon.type.toUpperCase(); // Assuming type is either 'LUNCH' or 'DINNER'
          if (!bookings[date]) {
            bookings[date] = {};
          }
          bookings[date][type] = true;
        });
        console.log('Bookings:', bookings); // Add this line for detailed logging
        return bookings;
      })      
    );
  }

  getBookings(): Observable<Booking[]> {
    // const url = ${environment.mainURL};
    return this.http.get<Booking[]>(`${environment.mainURL}/getCouponByID?emp_id=${this.token.decodeToken().id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

private handleError(error: HttpErrorResponse): Observable<any> {
  console.error('An error occurred:', error.error.message || error.statusText);
  return throwError('Something bad happened; please try again later.');
  }
  

  deleteCoupon(id: number, date: Date, menuType: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const formattedData: DeleteCouponRequest = {
      id: id,
      date: this.formatDate(date),
      menuType: menuType.toUpperCase()
    };

    return this.http.put<any>(`${environment.mainURL}/DeleteCoupon`, formattedData, { headers });
  }

//   deleteBooking(date: string, mealType: 'LUNCH' | 'DINNER'): Observable<void> {
//     const url = ${this.apiUrl}/${this.userId}/${date}/${mealType};
//     return this.http.delete<void>(url)
//       .pipe(
//         catchError(this.handleError) // Use the error handling function here
//       );
//   }
  // deleteCoupon() {
  //   const id = 2;
  //   const date = new Date('2024-08-12');
  //   const menuType = 'DINNER';

  //   this.bookingService.deleteCoupon(id, date, menuType).subscribe(
  //     (response) => {
  //       this.responseMessage = 'Coupon deleted successfully';
  //       console.log(response);
  //     },
  //     (error) => {
  //       this.responseMessage = 'Error deleting coupon';
  //       console.error('Error deleting coupon', error);
  //     }
  //   );
  // }


  getQrCode(empId: number, date: string, type: string): Observable<QrCodeResponse> {
    const params = new HttpParams()
      .set('emp_id', empId.toString())
      .set('date', date)
      .set('type', type);

    return this.http.get<QrCodeResponse>(`${environment.mainURL}/GetQrCode`, { params });
  }

  changePassword(data: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(`${environment.mainURL}/changePassword`, data);
  }

  // getNotifications1(id: number): Observable<NotificationResponse[]> {
  //   const params = new HttpParams().set('id', id.toString());
  //   return this.http.get<NotificationResponse[]>(`${environment.mainURL}/Notification`, { params });
  // }
  private notificationsSubject: BehaviorSubject<NotificationResponse[]> = new BehaviorSubject<NotificationResponse[]>([]);
  public notifications$: Observable<NotificationResponse[]> = this.notificationsSubject.asObservable();

  getNotifications(id: number): void {
    const params = new HttpParams().set('id', id.toString());
    this.http.get<NotificationResponse[]>(`${environment.mainURL}/Notification`, { params }).subscribe(notifications => {
      this.notificationsSubject.next(notifications);
    });
  }

  deleteNotification(request: DeleteNotificationRequest): Observable<LogResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put<LogResponse>(`${environment.mainURL}/deleteNotification`, request, { headers });
  }

  getName(id: number): Observable<string> {
    return this.http.get(`${environment.mainURL}/getName?id=${id}`, { responseType: 'text' });
  }

}
