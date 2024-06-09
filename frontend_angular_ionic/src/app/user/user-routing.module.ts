import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuestGuard } from './auth-guest.guard';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';

import { UserPage } from './user.page';
import { UserOtpComponent } from './user-otp/user-otp.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/user/account',
    pathMatch: 'full'
  },
  {
    path: 'account',
    component: UserPage,
    children: [
      {
        path: '',
        redirectTo: '/user/account/profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'notifications',
        component: NotificationsComponent
      },
    ],
    canActivate: [AuthGuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'signinotp',
    component: UserOtpComponent
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule { }
