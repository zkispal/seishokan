import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HomeComponent, AikidoComponent } from './home/index';
import { LoginComponent, RegisterComponent } from './login/index';
import { AuthGuard } from './_guards/index';
import { TrainingqrregComponent, TrainingmanregComponent,
    TraininghistoryComponent, TrainingapprovalComponent } from './training/index';
import { ExamregComponent, ExamhistoryComponent, ExamresultsComponent } from './exam/index';
import { EventsComponent, EventregsComponent } from './event/index';
import { EventComponent, NewtrainingComponent,
        LocationComponent, RolechangeComponent } from './maintain/index';

const appRoutes: Routes = [
    { path: '',
        component: HomeComponent, canActivate: [AuthGuard]
     },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'aikido', component: AikidoComponent, canActivate: [AuthGuard] },
    { path: 'qrreg', component: TrainingqrregComponent },
    { path: 'manreg', component: TrainingmanregComponent },
    { path: 'traininghistory', component: TraininghistoryComponent },
    { path: 'trainingapproval', component: TrainingapprovalComponent },
    { path: 'examhistory', component: ExamhistoryComponent },
    { path: 'examresults', component: ExamresultsComponent },
    { path: 'examregistration', component: ExamregComponent },
    { path: 'events', component: EventsComponent },
    { path: 'registeredforevent', component: EventregsComponent },
    { path: 'examevent', component: EventComponent },
    { path: 'newtraining', component: NewtrainingComponent },
    { path: 'location', component: LocationComponent },
    { path: 'rolechange', component: RolechangeComponent },




    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
