import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../shared/services/score.service';
import { LeaderBoardEntry } from '../shared/models/models';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent implements OnInit {
  public leaderBoard: LeaderBoardEntry[];

  constructor(private scoreService: ScoreService) { }

  ngOnInit() {
    this.leaderBoard = this.scoreService.getLeaderBoard();
  }

}
