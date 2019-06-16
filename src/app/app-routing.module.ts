import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AdminCompaniesComponent } from './components/admin-companies/admin-companies.component';
import { AdminProjectComponent } from './components/admin-project/admin-project.component';
import { SingleProjectComponent } from './components/single-project/single-project.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'projects',
    component: OverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'project/:projectId',
    component: SingleProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register/:userId',
    component: RegisterComponent
  },
  {
    path: 'admin/user',
    component: AdminUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/companies',
    component: AdminCompaniesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/project',
    component: AdminProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/project/:projectId',
    component: AdminProjectComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
