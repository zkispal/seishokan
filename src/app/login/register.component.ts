import { MessageService } from './../_services/message.service';
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthLoginService, DataService, AlertService } from '../_services/index';
import { Options, RegData } from '../_models/index';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Console } from '@angular/core/src/console';






@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {


    dojos: Options[];
    ranks: Options[];

    dpColorTheme = 'theme-dark-blue';
    today: Date;
    birthdaymindate: Date;
    practicestartmindate: Date;
    locale = 'hu';
    bdbsConfig: Partial<BsDatepickerConfig>;
    psbsConfig: Partial<BsDatepickerConfig>;

    birthday: Date;
    praticestartdate: Date;

    regdata: RegData = {firstname : '',
                        lastname : '',
                        username : '',
                        password : '',
                        email : '',
                        dateofbirth : 0,
                        practicestart : 0,
                        rankID : 0,
                        homedojoID : 0,
                        roleID : []};





    constructor( private router: Router,
                private authService: AuthLoginService,
                private dataService: DataService,
                private alertService: AlertService,
                private bsLocService: BsLocaleService ) { }

    ngOnInit () {

        this.loadDojos();
        this.loadadultranks();
        this.loadRole('Visitor');
        this.loadRole('Aikidoka');

        this.today = new Date();

        this.birthdaymindate  = new Date();
        this.birthdaymindate.setFullYear(this.today.getFullYear() - 100);

        this.bsLocService.use(this.locale);
        this.practicestartmindate =  new Date();
        this.practicestartmindate.setFullYear(this.today.getFullYear() - 60);

        this.bdbsConfig = Object.assign({},   {containerClass: this.dpColorTheme },
                                            {maxDate: this.today},
                                            {minDate: this.birthdaymindate},
                                            {showWeekNumbers: false},
                                            {dateInputFormat: 'YYYY-MMM-DD'});

        this.psbsConfig = Object.assign({},   {containerClass: this.dpColorTheme },
                                                {maxDate: this.today},
                                                {minDate: this.practicestartmindate},
                                                {showWeekNumbers: false},
                                                {dateInputFormat: 'YYYY-MMM-DD'});
    }


    private loadDojos() {
        this.dataService.getdojos()
            .subscribe( res => {  this.dojos = res; },
                        err => {this.alertService.error('Dojoinformációk betöltése sikertelen!'); }
            ) ;
    }

    private loadadultranks() {
        this.dataService.getadultranks()
            .subscribe(  res => {  this.ranks = res; },
                        err => {this.alertService.error('Aikido fokozat információk betöltése sikertelen!'); });
    }

    private loadRole(_rolename) {
        this.dataService.getroleid(_rolename)
            .subscribe(  res => {  console.log(res);
                this.regdata.roleID.push(res); },
                err => {this.alertService.error('Szerepkör azonosítók betöltése sikertelen!'); });
    }

    register() {
        this.birthday.setHours(this.birthday.getHours() + 12);
        this.praticestartdate.setHours(this.praticestartdate.getHours() + 12);
        this.regdata.dateofbirth = this.birthday.valueOf();
        this.regdata.practicestart = this.praticestartdate.valueOf();

        this.authService.createPerson(this.regdata)
            .subscribe( data => { this.authService.setCurrentUser(data);
                                this.router.navigate(['/home']); },
                        err => { console.log(JSON.stringify(err));
                            this.alertService.error('Sikertelen regisztráció! ' + err.error.message); });
        }
    }
