import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../_ui/index';
import { AuthLoginService, AlertService } from '../_services/index';
import { User } from '../_models/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  submitData: any = {};
  // currentUser: User;
  loading = false;
  returnUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthLoginService,
              private alertService: AlertService) { }

  ngOnInit() {
      // reset login status
    this.authService.logout();
      // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
      this.loading = true;
      this.authService.login( this.submitData.username, this.submitData.password)
          .subscribe(
              data => {
                this.authService.setCurrentUser(data);
                this.router.navigate([this.returnUrl]);
              },
              err => { console.log(JSON.stringify(err));
                const message = 'Sikertelen bejelentkezés. '.concat(err.error.message, ' ', err.message);
                this.alertService.error(message);
                this.loading = false;
              });
  }
}







