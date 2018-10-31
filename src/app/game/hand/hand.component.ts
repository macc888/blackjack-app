import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Hand, Outcome, GameState } from 'src/app/shared/models/models';
import { StateService } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {

  @Input()
  public hand: Hand;

  @Input()
  public isDealer: boolean;

  @Input()
  public handIndex: number;

  @Output()
  private hitEmitter: EventEmitter<number> = new EventEmitter();

  @Output()
  private splitEmitter: EventEmitter<number> = new EventEmitter();

  @Output()
  private standEmitter: EventEmitter<number> = new EventEmitter();

  private state: string;

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateService.currentState$.subscribe(state => {
      this.state = state;
    });
  }

  public hit() {
    this.hitEmitter.emit(this.handIndex);
  }

  public split() {
    this.splitEmitter.emit(this.handIndex);
  }

  public stand() {
    this.standEmitter.emit(this.handIndex);
  }

  public canHit(): boolean {
    return this.hand && (this.state === GameState.PLAYERS_TURN &&
      (this.hand.outcome === Outcome.CanHit || this.hand.outcome === Outcome.CanSplit));
  }

  public canSplit(): boolean {
    return this.hand && (this.state === GameState.PLAYERS_TURN && this.hand.outcome === Outcome.CanSplit);
  }
}
