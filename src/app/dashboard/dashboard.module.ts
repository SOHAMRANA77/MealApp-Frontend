import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { QRCodeModule } from 'angularx-qrcode';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BulkBookingComponent } from './bulk-booking/bulk-booking.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { QRcodeComponent } from './qrcode/qrcode.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomAlertDialogComponent } from './custom-alert-dialog/custom-alert-dialog.component';
import { AboutUSComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsNDcondiComponent } from './terms-ndcondi/terms-ndcondi.component';
import { LogoutConfirmationDialogComponent } from './logout-confirmation-dialog/logout-confirmation-dialog.component';


@NgModule({
  declarations: [
    DashboardComponent,
    BulkBookingComponent,
    FooterComponent,
    HomeComponent,
    NavbarComponent,
    QRcodeComponent,
    CustomAlertDialogComponent,
    AboutUSComponent,
    PrivacyPolicyComponent,
    TermsNDcondiComponent,
    LogoutConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule,
    MatBadgeModule,
    MatIconModule,
    QRCodeModule,
    MatProgressSpinnerModule ,
    ReactiveFormsModule

  ]
})
export class DashboardModule { }
