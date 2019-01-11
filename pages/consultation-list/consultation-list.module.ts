import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsultationListPage } from './consultation-list';

@NgModule({
  declarations: [
    ConsultationListPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultationListPage),
  ],
})
export class ConsultationListPageModule {}
