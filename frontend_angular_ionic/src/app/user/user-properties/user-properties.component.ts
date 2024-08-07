import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.component.html',
  styleUrls: ['./user-properties.component.scss'],
})
export class UserPropertiesComponent implements OnInit {

  public isUser: boolean;
  public userName: string;

  constructor( private userService: UserService) { }

  ngOnInit() {
    this.userService.userSessionSub.subscribe(({isSession,userName}) => {
      this.isUser = isSession; 
      this.userName = userName
    }); 
  }

}
