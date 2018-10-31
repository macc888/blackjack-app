import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public name: string;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public onEnterGameClicked() {
    this.userService.setUserName(this.name);
    this.router.navigate(['game']);
  }
}
