import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminCompaniesComponent } from './components/admin-companies/admin-companies.component';
import { AdminProjectComponent } from './components/admin-project/admin-project.component';
import { SingleProjectComponent } from './components/single-project/single-project.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:projectId',
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
    path: 'admin/users',
    component: AdminUserComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/companies',
    component: AdminCompaniesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/projects',
    component: AdminProjectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'company'] }
  },
  {
    path: 'admin/projects/:projectId',
    component: AdminProjectComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'company'] }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
