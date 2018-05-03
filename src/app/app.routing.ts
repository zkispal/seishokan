import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HomeComponent, AikidoComponent } from './home/index';
import { LoginComponent, RegisterComponent } from './login/index';
import { AuthGuard, AikidokaGuard, InstructorGuard, DojochoGuard } from './_guards/index';
import { TrainingqrregComponent, TrainingmanregComponent,
    TraininghistoryComponent, TrainingapprovalComponent } from './training/index';
import { ExamregComponent, ExamhistoryComponent, ExamresultsComponent } from './exam/index';
import { EventsComponent, EventregsComponent } from './event/index';
import { EventComponent, NewtrainingComponent,
        LocationComponent, RolechangeComponent, PasswordchangeComponent } from './maintain/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard, AikidokaGuard] },
    { path: 'aikido', component: AikidoComponent },
    { path: 'qrreg', component: TrainingqrregComponent, canActivate: [AuthGuard, InstructorGuard] },
    { path: 'manreg', component: TrainingmanregComponent, canActivate: [AuthGuard, AikidokaGuard] },
    { path: 'traininghistory', component: TraininghistoryComponent, canActivate: [AuthGuard, AikidokaGuard] },
    { path: 'trainingapproval', component: TrainingapprovalComponent, canActivate: [AuthGuard, InstructorGuard] },
    { path: 'examhistory', component: ExamhistoryComponent, canActivate: [AuthGuard, AikidokaGuard]  },
    { path: 'examresults', component: ExamresultsComponent, canActivate: [AuthGuard, DojochoGuard] },
    { path: 'examregistration', component: ExamregComponent, canActivate: [AuthGuard, AikidokaGuard]  },
    { path: 'events', component: EventsComponent, canActivate: [AuthGuard, AikidokaGuard]  },
    { path: 'registeredforevent', component: EventregsComponent, canActivate: [AuthGuard, AikidokaGuard]  },
    { path: 'examevent', component: EventComponent, canActivate: [AuthGuard, DojochoGuard]  },
    { path: 'newtraining', component: NewtrainingComponent, canActivate: [AuthGuard, DojochoGuard] },
    { path: 'location', component: LocationComponent, canActivate: [AuthGuard, DojochoGuard]  },
    { path: 'rolechange', component: RolechangeComponent, canActivate: [AuthGuard, DojochoGuard] },
    { path: 'passwordchange', component: PasswordchangeComponent, canActivate: [AuthGuard, AikidokaGuard]},




    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
