import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { IUser } from '@infiltro/shared';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject$ = new BehaviorSubject<IUser[] | null>(null);
  users$: Observable<IUser[]> = this.userSubject$.pipe(
    switchMap(() => this.api.getUsers()),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

  userRoles: { type: 'admin' | 'company' | 'client', name: string}[] = [
    {
      "type": "admin",
      "name": "Administrator"
    },
    {
      "type": "company",
      "name": "Bedrijf"
    },
    {
      "type": "client",
      "name": "Klant"
    }
  ]

  constructor(
    private api: ApiService,
  ) {}

  refreshUsers() {
    this.userSubject$.next(null);
  }

  getUserRoles() {
    return this.userRoles
  }

  roleName(type: string) {
    return this.userRoles.find((role) => role.type === type)?.name ?? 'Onbekend';
  }

  userToName(userId: string): Observable<string> {
    return this.users$.pipe(
      map((users) => users.find((user) => user._id === userId)?.name ?? userId ?? 'Onbekende gebruiker'),
    );
  }
}
