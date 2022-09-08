import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { GoogleMapsModule } from '@angular/google-maps';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './infiltro-routing.module';
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
import { AdminMailTemplatesComponent } from './components/admin-mail-templates/admin-mail-templates.component';
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
import { FilterUsersPipe } from './pipes/filter-users.pipe';
import { SingleProjectArchiveComponent } from './components/single-project-archive/single-project-archive.component';
import { DynamicProjectPipe } from './pipes/dynamic-project.pipe';
import { CompanyPipe } from './pipes/company.pipe';
import { UserPipe } from './pipes/user.pipe';
import { ProjectTypePipe } from './pipes/project-type.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { StatusPipe } from './pipes/status.pipe';
import { ExecutorPipe } from './pipes/executor.pipe';
import { NewlineToBrPipe } from './pipes/newline-to-br.pipe';
import { CommentsComponent } from './components/comments/comments.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SortProjectsPipe } from './pipes/sort-projects.pipe';
import { MailTemplatePipe } from './pipes/mail-template.pipe';
import { MailTemplateSelectorComponent } from './components/mail-template-selector/mail-template-selector.component';
import { IsDateActiveTooOldPipe } from './pipes/is-date-active-too-old.pipe';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { FilterBarComponent } from './components/filterbar/filterbar.component';

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
    SingleProjectRowComponent,
    FilterUsersPipe,
    SingleProjectArchiveComponent,
    DynamicProjectPipe,
    CompanyPipe,
    UserPipe,
    ProjectTypePipe,
    FormatDatePipe,
    StatusPipe,
    ExecutorPipe,
    NewlineToBrPipe,
    CommentsComponent,
    SafeHtmlPipe,
    SortProjectsPipe,
    MailTemplatePipe,
    MailTemplateSelectorComponent,
    AdminMailTemplatesComponent,
    IsDateActiveTooOldPipe,
    FilterBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
    CompanyPipe,
    UserPipe,
    ProjectTypePipe,
    FormatDatePipe,
    StatusPipe,
    ExecutorPipe,
    MailTemplatePipe,
    IsDateActiveTooOldPipe,
    SortProjectsPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
