// import { Alert } from './_models/alert';
import { NgModule, LOCALE_ID,  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,    } from '@angular/forms';
import { registerLocaleData  } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule,
         BsDatepickerConfig,
         BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { huLocale } from 'ngx-bootstrap/locale';
defineLocale('hu', huLocale);
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { AlertModule } from 'ngx-bootstrap/alert';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { AngularDualListBoxModule } from 'angular-dual-listbox';

import { ZXingScannerModule } from '@zxing/ngx-scanner';



import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { RegisterComponent } from './login/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/index';
import {  AuthLoginService, AuthHeaderInterceptorService,
    DataService, AlertService, MessageService } from './_services/index';
import { NavigationComponent, NavmenuComponent,
        EventregComponent, AlertComponent } from './_ui/index';

import { HomeComponent, AikidoComponent } from './home/index';
import { TrainingqrregComponent, TrainingmanregComponent,
        TraininghistoryComponent, TrainingapprovalComponent } from './training/index';
import { ExamregComponent, ExamhistoryComponent, ExamresultsComponent } from './exam/index';
import { EventsComponent, EventregsComponent } from './event/index';
import { EventComponent, NeweventmodalComponent, NewtrainingComponent,
        LocationComponent, NewlocmodalComponent, RolechangeComponent } from './maintain/index';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AikidoComponent,
    RegisterComponent,
    LoginComponent,
    NavigationComponent,
    NavmenuComponent,
    TrainingqrregComponent,
    TrainingmanregComponent,
    TraininghistoryComponent,
    TrainingapprovalComponent,
    ExamregComponent,
    ExamhistoryComponent,
    ExamresultsComponent,
    EventsComponent,
    EventregsComponent,
    EventComponent,
    NewtrainingComponent,
    LocationComponent,
    RolechangeComponent,
    NewlocmodalComponent,
    NeweventmodalComponent,
    EventregComponent,
    AlertComponent



  ],

  entryComponents: [
    NewlocmodalComponent,
    NeweventmodalComponent

  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    // AlertModule.forRoot(),
    PopoverModule.forRoot(),
    ButtonsModule.forRoot(),
    PaginationModule.forRoot(),
    AngularDualListBoxModule,
    ZXingScannerModule.forRoot()


  ],
  exports: [
    BsDatepickerModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptorService,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'hu' },
    AuthGuard,
    AuthLoginService,
    DataService,
    AlertService,
    MessageService,
    BsModalService
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
