import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit {
  public isAuthenticated?: Observable<boolean>;
  public userName?: Observable<string | undefined>;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.isAuthenticated = this.authenticationService.isAuthenticated();
    this.userName = this.authenticationService.getUser().pipe(map(u => u?.name));
  }
}
