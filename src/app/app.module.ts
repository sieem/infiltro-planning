import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AgmCoreModule } from '@agm/core';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminCompaniesComponent } from './components/admin-companies/admin-companies.component';
import { SingleProjectComponent } from './components/single-project/single-project.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { NavComponent } from './components/nav/nav.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { MapComponent } from './components/map/map.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ModalDirective } from './directives/modal.directive';
import { MailProjectComponent } from './components/mail-project/mail-project.component';
import { PricesComponent } from './components/prices/prices.component';
import { SingleProjectCommentsComponent } from './components/single-project-comments/single-project-comments.component';
import { ReversePipe } from './pipes/reverse.pipe';
import { SingleProjectControlsComponent } from './components/single-project-controls/single-project-controls.component';
import { SingleProjectRowComponent } from './components/single-project-row/single-project-row.component';
@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    LoginComponent,
    RegisterComponent,
    AdminCompaniesComponent,
    SingleProjectComponent,
    AdminUserComponent,
    NavComponent,
    MapComponent,
    ResetPasswordComponent,
    ModalDirective,
    MailProjectComponent,
    PricesComponent,
    SingleProjectCommentsComponent,
    ReversePipe,
    SingleProjectControlsComponent,
    SingleProjectRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.gmapsApiKey
    }),
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
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
