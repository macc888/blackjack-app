import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userName: BehaviorSubject<string> = new BehaviorSubject('');
  public userName$: Observable<string> = this._userName.asObservable();

  constructor() { }

  public setUserName(name: string) {
    this._userName.next(name);
  }
}
