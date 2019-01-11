import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPayPage } from './chat-pay';

@NgModule({
  declarations: [
    ChatPayPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatPayPage),
  ],
})
export class ChatPayPageModule {}
