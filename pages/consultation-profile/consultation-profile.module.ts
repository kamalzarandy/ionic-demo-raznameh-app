import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsultationProfilePage } from './consultation-profile';

@NgModule({
  declarations: [
    ConsultationProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultationProfilePage),
  ],
})
export class ConsultationProfilePageModule {}
