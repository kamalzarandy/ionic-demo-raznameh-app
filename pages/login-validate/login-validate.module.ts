import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginValidatePage } from './login-validate';

@NgModule({
  declarations: [
    LoginValidatePage,
  ],
  imports: [
    IonicPageModule.forChild(LoginValidatePage),
  ],
})
export class LoginValidatePageModule {}
