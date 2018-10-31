import { Injectable } from '@angular/core';
import { GameState } from '../models/models';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _currentState: BehaviorSubject<string> = new BehaviorSubject(GameState.INITIAL);
  public currentState$: Observable<string> = this._currentState.asObservable();

  constructor() {
  }

  public setCurrentState(state: GameState) {
    this._currentState.next(state);
  }
}
