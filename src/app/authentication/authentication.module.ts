import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ForgotPageComponent } from './forgot-page/forgot-page.component';
import { OTPdialogComponent } from './otpdialog/otpdialog.component';


@NgModule({
  declarations: [
    AuthenticationComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ForgotPageComponent,
    OTPdialogComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,

    ReactiveFormsModule,
    AuthenticationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class AuthenticationModule { }
