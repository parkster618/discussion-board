import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussionBoardComponent } from './discussion-board/discussion-board.component';
import { DiscussionBoardRoutingModule } from './discussion-board-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DiscussionBoardComponent,
  ],
  imports: [
    CommonModule,
    DiscussionBoardRoutingModule,
    FormsModule,
  ]
})
export class DiscussionBoardModule { }
