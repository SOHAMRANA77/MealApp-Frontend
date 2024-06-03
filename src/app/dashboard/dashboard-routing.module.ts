import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { AboutUSComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsNDcondiComponent } from './terms-ndcondi/terms-ndcondi.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, canActivate: [AuthGuard] ,
    children:
    [
      {path:'', component: HomeComponent},
      { path: 'aboutus', component: AboutUSComponent },
      { path: 'privacypolicy', component: PrivacyPolicyComponent },
      { path: 'terms&condition', component: TermsNDcondiComponent },
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
