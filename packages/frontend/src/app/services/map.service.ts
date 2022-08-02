import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  apiLoaded$ = this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.gmapsApiKey}`, 'callback').pipe(
    map(() => true),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

    constructor(private httpClient: HttpClient) {}
}
