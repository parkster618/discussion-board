import { Component, OnInit } from '@angular/core';
import { PromptService } from '../_services/prompt.service';

@Component({
  selector: 'app-discussion-board',
  templateUrl: './discussion-board.component.html',
  styleUrls: ['./discussion-board.component.less']
})
export class DiscussionBoardComponent implements OnInit {

  constructor(private promptService: PromptService) {}

  ngOnInit() {
    this.promptService.getAll();
  }

}
