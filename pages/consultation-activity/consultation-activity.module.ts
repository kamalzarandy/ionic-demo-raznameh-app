import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsultationActivityPage } from './consultation-activity';

@NgModule({
  declarations: [
    ConsultationActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultationActivityPage),
  ],
})
export class ConsultationActivityPageModule {}
