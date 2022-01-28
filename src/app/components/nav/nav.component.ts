import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-nav',
  template: `
    <nav *ngIf="auth.loggedIn()">
      <a routerLink="/projecten" routerLinkActive="active">Projecten</a>
      <a routerLink="/kaart" *ngIf="auth.isAdmin()" routerLinkActive="active">Kaart</a>
      <a routerLink="/staffel" routerLinkActive="active" *ngIf="companyService.pricePageVisibleForCurrentUser$ | async">Staffel</a>
      <a *ngIf="auth.isAdmin()" routerLinkActive="active">Administratie
        <div class="submenu">
          <a routerLink="/admin/gebruikers" routerLinkActive="active">Gebruikers</a>
          <a routerLink="/admin/bedrijven" routerLinkActive="active">Bedrijven</a>
          <a routerLink="/admin/mail-templates" routerLinkActive="active">Mail templates</a>
        </div>
      </a>
      <a *ngIf="auth.loggedIn()" (click)="auth.logoutUser()">Uitloggen</a>
    </nav>
  `,
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  constructor(
    public auth: AuthService,
    public companyService: CompanyService) { }

}
