import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './components/overview/overview.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AdminCompaniesComponent } from './components/admin-companies/admin-companies.component';
import { AdminProjectComponent } from './components/admin-project/admin-project.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AdminCompaniesComponent,
    AdminProjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ApiService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
