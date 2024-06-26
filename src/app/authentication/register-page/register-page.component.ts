import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../Services/API/api.service';

interface Department {
  name: string;
  location: string;
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['../authentication.component.css']
})
export class RegisterPageComponent {
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  departmentOptions: Department[] = [];
  userRoles: string[] = ['EMPLOYEE', 'GUEST'];

  Email = new FormControl('', [Validators.required, Validators.email]);
  Name = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z]+ [a-zA-Z]+$/)
  ]);
  Password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)
  ]);
  CoPassword = new FormControl('', Validators.required);
  Department = new FormControl('', Validators.required);
  UserRole = new FormControl('', Validators.required);
  PhoneNo = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/)
  ]);

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private service: ApiService
  ) {
    this.service.ListDepart().subscribe((Response: Department[]) => {
      console.log(Response);
  
      const departmentOptions = Response.map((department: Department) => {
        return { name: department.name, location: department.location };
      });
      console.log("Department Options:", departmentOptions);
  
      this.departmentOptions = departmentOptions;
      console.log("Updated Department Options:", this.departmentOptions);
    });
  }

  formatDepartmentOption(department: Department): string {
    return `${department.name} (${department.location})`;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    this.Password.updateValueAndValidity();
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
    this.CoPassword.updateValueAndValidity();
  }

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Close', {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 3000
    });
  }

  getErrorMessage(control: FormControl) {
    if (!control.touched || !control.dirty) {
      return '';
    }
    if (control.hasError('required')) {
      return 'You must enter a value';
    }
    if (control.hasError('email')) {
      return 'Not a valid email';
    }
    if (control === this.PhoneNo && control.hasError('pattern')) {
      return 'Phone number must be 10 digits';
    }
    if (control === this.Name && control.hasError('pattern')) {
      return 'Name must contain only letters and spaces';
    }
    if (control === this.Password && control.hasError('pattern')) {
      return 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character';
    }
    return '';
  }

  arePasswordsEqual(): boolean {
    const password = this.Password.value;
    const confirmPassword = this.CoPassword.value;
    return password === confirmPassword;
  }

  isDepartment(department: any): department is Department {
    return typeof department === 'object' && 'name' in department && 'location' in department;
  }

  Registration() {
    if (!this.arePasswordsEqual()) {
      // alert("Passwords do not match");
      this.openSnackBar("Passwords do not match");
      return;
    }

    if (this.Email.invalid || this.Password.invalid) {
        this.openSnackBar('Please fill in all required fields correctly');
        return;
      }
    
    const selectedDepartment = this.Department.value;

    if (!this.isDepartment(selectedDepartment)) {
      // alert("Invalid department selected");
      this.openSnackBar("Invalid department selected");
      return;
    }

    const Data = {
      name: this.Name.value,
      email: this.Email.value,
      currentPassword: this.Password.value,
      department: selectedDepartment.name,
      phoneNo: this.PhoneNo.value,
      location: selectedDepartment.location,
      userRole: this.UserRole.value
    };

    console.log(Data);
    if (Data.currentPassword === "" || Data.department === "" || Data.email === "" || Data.name === "" || Data.phoneNo === "") {
      this.openSnackBar("Please fill all fields");
    } else {
      this.service.RegisterApi(Data).subscribe(
        (resultData: any) => {
          if (resultData.status === true) {
            this.openSnackBar(resultData.message);
            this.router.navigate(['/auth/login']);
          } else {
            this.openSnackBar(resultData.message);
          }
        }
      );
    }
  }
}
