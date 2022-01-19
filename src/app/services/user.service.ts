import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject$ = new BehaviorSubject(null);
  public users$: Observable<IUser[]> = this.userSubject$.pipe(
    switchMap(() => this.api.getUsers()),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

  userRoles: any = [
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
      "name": "klant"
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

  public roleName(type: string) {
    return this.userRoles.find(role => role.type === type)?.name ?? 'Onbekend';
  }

  userToName(userId: string): Observable<string> {
    return this.users$.pipe(
      map((users) => users.find((user) => user._id === userId).name),
      map((user) => user ?? userId ?? 'Onbekende gebruiker'),
    );
  }
}
