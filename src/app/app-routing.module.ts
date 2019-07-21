import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminCompaniesComponent } from './components/admin-companies/admin-companies.component';
import { SingleProjectComponent } from './components/single-project/single-project.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { MapComponent } from './components/map/map.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/projecten',
    pathMatch: 'full'
  },
  {
    path: 'projecten',
    component: ProjectsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project/toevoegen',
    component: SingleProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project/:projectId',
    component: SingleProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'kaart',
    component: MapComponent
  },
  {
    path: 'inloggen',
    component: LoginComponent
  },
  {
    path: 'herstel-wachtwoord',
    component: ResetPasswordComponent
  },
  {
    path: 'registreer',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'registreer/:userId',
    component: RegisterComponent
  },
  {
    path: 'admin/gebruikers',
    component: AdminUserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/bedrijven',
    component: AdminCompaniesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
