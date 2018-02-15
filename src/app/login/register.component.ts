import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthLoginService, DataService } from '../_services/index';
import { Options, RegData } from '../_models/index';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { defineLocale } from 'ngx-bootstrap/bs-moment';

import { Console } from '@angular/core/src/console';






@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {


    dojos: Options[];

    ranks: Options[];

    roles: Options[] = [{'ID': 9, 'name': 'Aikidoka'}];

    dpColorTheme = 'theme-dark-blue';
    today: Date;
    birthdaymindate: Date;
    practicestartmindate: Date;
    bdbsConfig: Partial<BsDatepickerConfig>;
    psbsConfig: Partial<BsDatepickerConfig>;

    birthday: Date;
    praticestartdate: Date;

    regdata: any =  {};
    loading = false;




    constructor(
        private router: Router,
        private authService: AuthLoginService,
        private dataService: DataService
         ) { }

    ngOnInit () {

        this.loadDojos();
        this.loadadultranks();
        this.regdata.roleID = [9]; // TODO populate from roles
        this.today = new Date();

        this.birthdaymindate  = new Date();
        this.birthdaymindate.setFullYear(this.today.getFullYear() - 100);

        this.practicestartmindate =  new Date();
        this.practicestartmindate.setFullYear(this.today.getFullYear() - 60);

        this.bdbsConfig = Object.assign({},   {containerClass: this.dpColorTheme },
                                            {maxDate: this.today},
                                            {minDate: this.birthdaymindate},
                                            {showWeekNumbers: false},
                                            {dateInputFormat: 'YYYY-MM-DD'});

        this.psbsConfig = Object.assign({},   {containerClass: this.dpColorTheme },
                                                {maxDate: this.today},
                                                {minDate: this.practicestartmindate},
                                                {showWeekNumbers: false},
                                                {dateInputFormat: 'YYYY-MM-DD'});
    }


    private loadDojos() {
        this.dataService.getdojos().subscribe( res => {  this.dojos = res; },
                                                err => {console.log(err); }  ) ;
    }





    private loadadultranks() {
        this.dataService.getadultranks().subscribe(  res => {  this.ranks = res; },
                                                    err => {console.log(err); } );
    }


    onHomedojoSelectChange($event, dojoid) {
    this.regdata.homedojoID = dojoid;
    }

    onRankSelectChange($event, rank) {
        this.regdata.rankID = rank;
    }

    onBirthdayPickerChange($event) {
        // change back to local time as bsDatepicker returns UTC time
        this.birthday.setTime(this.birthday.getTime() - (this.birthday.getTimezoneOffset() * 60000));
        this.regdata.dateofbirth = this.birthday;
    }


    onPracticestartPickerChange($event) {
        // change back to local time as bsDatepicker returns UTC time
        this.praticestartdate.setTime(this.praticestartdate.getTime() - (this.praticestartdate.getTimezoneOffset() * 60000));
        this.regdata.practicestart = this.praticestartdate;
    }

    register() {
            this.loading = true;
            this.authService.createPerson(this.regdata)
                .subscribe(
                    data => {
                        this.authService.setCurrentUser(data);
                        this.router.navigate(['/login']);
                    },
                    error => {
                        console.log(error);
                        this.loading = false;
                    });
        }
    }
