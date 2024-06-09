import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertDialogComponent } from '../custom-alert-dialog/custom-alert-dialog.component';
import { ApiService } from '../Services/API/api.service';
import { AuthService } from 'src/app/authentication/Services/auth.service';
import { LogoutConfirmationDialogComponent } from '../logout-confirmation-dialog/logout-confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Notification {
  type: string;
  message: string;
  id: number;
  seen: boolean;
}
interface NotificationResponse {
  message: string;
  id: number;
  type: string;
  seen: boolean;
}
interface DeleteNotificationRequest {
  id: number;
  empId: number;
}


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  dropdownOpen = false;
  isChangePasswordDialogOpen = false;
  errorMessage: string | null = null;
  username : string = "";
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  // Password visibility toggles
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmNewPassword = true;

  // Mock current password
  currentPassword = 'currentPassword123';

  notifications: Notification[] = [];

  notificationDropdownOpen = false;

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Close', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 3000
    });
  }

  constructor(private dialog: MatDialog, private bookingService : ApiService,private token : AuthService,private _snackBar: MatSnackBar) {}
  ngOnInit() {
    this.getNotifications();
    this.GetName();
  }
  getNotifications() {
    this.bookingService.getNotifications(this.token.decodeToken().id);

    this.bookingService.notifications$.subscribe(
      (response: NotificationResponse[]) => {
        this.notifications = this.transformNotifications(response);
        console.log(this.notifications);
      },
      (error) => {
        console.error('Error getting notifications', error);
      }
    )
  }

  GetName() {
    this.bookingService.getName(this.token.decodeToken().id).subscribe(
      (response: any) => {
        // Assuming response is a string
        this.username = response; // Assign the string directly
        console.log("Response:", response);
        console.log("Username:", this.username);
      },
      (error) => {
        console.log("Error:", error);
      }
    );
  }
  transformNotifications(apiNotifications: NotificationResponse[]): Notification[] {
    const notificationTypeMapping: { [key: string]: string } = {
      'WELCOME': 'welcome',
      'OTP': 'otp',
      'PASSWORD': 'changePassword',
      'BOOKED': 'mealBooked',
      'BOOKING_CANCEL': 'bookingCancel'
    };

    return apiNotifications.map(notification => ({
      type: notificationTypeMapping[notification.type] || 'other',
      message: notification.message,
      id: notification.id,
      seen: notification.seen
    }));
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  openChangePasswordDialog(event: Event) {
    event.preventDefault();
    this.isChangePasswordDialogOpen = true;
    this.errorMessage = null;
    this.dropdownOpen = false; // Close dropdown when opening dialog
  }

  closeChangePasswordDialog() {
    this.isChangePasswordDialogOpen = false;
  }

  handleChangePassword() {
    // if (this.passwordForm.oldPassword !== this.currentPassword) {
    //   this.errorMessage = 'Old password does not match.';
    //   return;
    // }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmNewPassword) {
      this.openSnackBar('New password and confirm new password do not match.');
      // this.errorMessage = 'New password and confirm new password do not match.';
      return;
    }

    // If validation passes, close the dialog and reset the form
    this.currentPassword = this.passwordForm.newPassword;
    // this.closeChangePasswordDialog();
    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
    // this.showCustomAlert('Success', 'Password changed successfully!');
  }

  toggleNotificationDropdown() {
    this.notificationDropdownOpen = !this.notificationDropdownOpen;
  }

  removeNotification(event: Event, id: number, message: string) {
    event.preventDefault();
  
    const index = this.notifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      console.log(message, id, this.token.decodeToken().id);
    }
  
    const data: DeleteNotificationRequest = {
      id: id,
      empId: this.token.decodeToken().id
    };
  
    // Correctly log the data object
    console.log("DATA: ", data);
  
    this.bookingService.deleteNotification(data).subscribe(
      (response) => {
        console.log("Delete notification response: ", response);
      },
      (error) => {
        console.error('Error deleting notification', error);
      }
    );
  }
  

  isSuccess(notification: Notification): boolean {
    // return notification.message.toLowerCase().includes('successfully');
    return notification.type == 'mealBooked';
  }

  isFailure(notification: Notification): boolean {
    return notification.type == 'bookingCancel';
  }
  isOtp(notification: Notification): boolean{
    return notification.type == ('changePassword' || 'otp');
  }
  isNew(notification:Notification): boolean{
    return notification.type == 'welcome';
  }

  @HostListener('document:click', ['$event'])
handleClick(event: Event) {
  const target = event.target as HTMLElement;
  const sidebar = document.querySelector('.sidebar-container');
  const profileBtn = document.querySelector('.profile-btn');

  if (sidebar && !sidebar.contains(target) && profileBtn && !profileBtn.contains(target)) {
    this.closeSidebar();
  }

  const notificationDropdown = document.querySelector('.notification-dropdown-content');
  const notificationBtn = document.querySelector('.notification-btn');

  if (notificationDropdown && notificationBtn && !notificationDropdown.contains(target) && !notificationBtn.contains(target)) {
    this.notificationDropdownOpen = false;
  }
}

  showCustomAlert(title: string, message: string): void {
    this.dialog.open(CustomAlertDialogComponent, {
      data: {
        title: title,
        message: message
      }
    });
  }

  Logout(event: Event):void{
    console.log('Logout button clicked.');
    event.preventDefault();
    // this.showCustomAlert('Warning', 'Do you really want to logout?');
    const logoutDialogRef = this.dialog.open(LogoutConfirmationDialogComponent);

    logoutDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.token.logout();
      }
    });
    
    
  }


  ChangePassword() {
    // Password change logic here
    // if (this.passwordForm.newPassword !== this.passwordForm.confirmNewPassword) {
    //   this.errorMessage = 'New passwords do not match';
    //   return;
    // }

    const id = this.token.decodeToken().email;

    const data = {
      email: id,
      oldPassword: this.passwordForm.oldPassword,
      newPassword: this.passwordForm.newPassword
    };

    this.bookingService.changePassword(data).subscribe(
      response => {
        if(response.status == false){
          this.openSnackBar(response.message);
        }
        if(response.status == true){
          this.openSnackBar(response.message);
          console.log('Password change successful:', response);
          this.closeChangePasswordDialog();
          this.showCustomAlert('Success', 'Password changed successfully!');
        }
      },
      error => {
        this.openSnackBar('Password change error: '+error);
        this.errorMessage = 'Password change failed';
      }
    );
  }

  removeAllNotifications(event: Event) {
    event.preventDefault();
    this.notifications = [];
  
    const data: DeleteNotificationRequest = {
      id: 0,
      empId: this.token.decodeToken().id
    };

    this.bookingService.deleteAllNotification(data).subscribe(
      (response) => {
        console.log("Delete notification response: ", response);
      },
      (error) => {
        console.error('Error deleting notification', error);
      }
    );
    }
    sidebarOpen = false;
    closeSidebar() {
      this.sidebarOpen = false; // Set sidebarOpen to false to close the sidebar
    }
  
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    }
}
