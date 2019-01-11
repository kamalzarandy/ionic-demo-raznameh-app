import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MakeconsultationPage } from './makeconsultation';

@NgModule({
  declarations: [
    MakeconsultationPage,
  ],
  imports: [
    IonicPageModule.forChild(MakeconsultationPage),
  ],
})
export class MakeconsultationPageModule {}
