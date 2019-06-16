import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminCompaniesComponent } from './components/admin-companies/admin-companies.component';
import { AdminProjectComponent } from './components/admin-project/admin-project.component';
import { SingleProjectComponent } from './components/single-project/single-project.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { NavComponent } from './components/nav/nav.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    LoginComponent,
    RegisterComponent,
    AdminCompaniesComponent,
    AdminProjectComponent,
    SingleProjectComponent,
    AdminUserComponent,
    NavComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ApiService, AuthService, AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
