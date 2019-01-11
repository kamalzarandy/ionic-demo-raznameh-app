import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PollQuestionPage } from './poll-question';

@NgModule({
  declarations: [
    PollQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(PollQuestionPage),
  ],
})
export class PollQuestionPageModule {}
