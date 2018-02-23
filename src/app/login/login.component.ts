import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AuthLoginService } from '../_services/index';
import { User, ErrorResp } from '../_models/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  submitData: any = {};
  currentUser: User;
  loading = false;
  returnUrl: string;
  error: ErrorResp;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthLoginService ) { }

  ngOnInit() {
      // reset login status
    this.authService.logout();
    this.error = {ok: true, message: [], status : 0};
      // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
      this.loading = true;
      this.authService.login( this.submitData.username, this.submitData.password)
          .subscribe(
              data => {  console.log(JSON.stringify(data));
                this.authService.setCurrentUser(data);
                    this.router.navigate([this.returnUrl]);
              },
              err => {

                console.log(err);
                  this.error.ok = err.ok;
                  this.error.status = err.status;
                  this.error.message.push(err.message);
                  this.error.message.push(err.error.message);
                  this.loading = false;
              });
  }
}







