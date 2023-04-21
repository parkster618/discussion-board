import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscussionBoardComponent } from './discussion-board/discussion-board.component';

const routes: Routes = [
  {
        path: '',
        component: DiscussionBoardComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class DiscussionBoardRoutingModule {}
