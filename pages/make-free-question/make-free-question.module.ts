import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MakeFreeQuestionPage } from './make-free-question';

@NgModule({
  declarations: [
    MakeFreeQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(MakeFreeQuestionPage),
  ],
})
export class MakeFreeQuestionPageModule {}
