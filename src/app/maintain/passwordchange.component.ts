import { Component, OnInit } from '@angular/core';
import { AuthLoginService, AlertService } from '../_services/index';

@Component({
  selector: 'app-passwordchange',
  templateUrl: './passwordchange.component.html',
  styleUrls: ['./passwordchange.component.css']
})
export class PasswordchangeComponent implements OnInit {

  submitData = {password : '',
                newpass : ''};
  confirmNewPass: string;

  constructor(private authLoginSrvc: AuthLoginService,
              private alertSrvc: AlertService) { }

  ngOnInit() {
    this.confirmNewPass = '';
  }

  passwordsMatch(): boolean {
    return this.submitData.newpass === this.confirmNewPass;
  }


  changePassword() {
    if (this.submitData.newpass === this.confirmNewPass) {
      this.authLoginSrvc.changePassword(this.submitData)
          .subscribe((data) => {
            this.alertSrvc.success('Jelszó sikeresen megváltoztatva.');
           },
                      (err) => { console.log(JSON.stringify(err));
            this.alertSrvc.error('Jelszóváltoztatás sikertelen! ' + err.error.message);
           });

    } else {
      this.alertSrvc.error('Az új jelszó nem egyezik meg a megerősített jelszóval!');
    }

  }
}
