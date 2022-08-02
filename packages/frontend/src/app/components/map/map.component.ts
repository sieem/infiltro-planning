import { Component, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IsDateActiveTooOldPipe } from '../../pipes/is-date-active-too-old.pipe';
import { pointers, IPointerIcon, defaultPointerUrl } from './map.component.util';
import { map } from 'rxjs/operators';
import { ProjectService } from '../../services/project.service';
import { statusesForMap } from '@infiltro/shared';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'infiltro-map',
  template: `
    <infiltro-filterbar context="map"></infiltro-filterbar>
    <ng-container *ngIf="apiLoaded$ | async">
      <google-map height="100vh" width="100%" [center]="{lat, lng}" [zoom]="zoom">
          <map-marker *ngFor="let mapMarker of markers$ | async"
                #marker="mapMarker"
                [position]="{ lat: mapMarker.lat, lng: mapMarker.lng }"
                [options]="{ label: mapMarker.executor, icon: 'assets/images/map/' + mapMarker.pointerUrl }"
                (mapClick)="openInfoWindow(marker, mapMarker._id)">
            <map-info-window [id]="mapMarker._id">
                <div class="container">
                  <h2><a routerLink="/project/{{ mapMarker._id }}" routerLinkActive="active">{{ mapMarker.projectName }}</a></h2>
                  <p>Type: {{ mapMarker.projectType | projectType }}</p>
                  <p>Aantal/Omschrijving: {{ mapMarker.houseAmount }}</p>
                  <p>Adres: <a href="https://www.google.be/maps/search/{{ mapMarker.street }}+{{ mapMarker.postalCode }}+{{ mapMarker.city }}"
                      target="_blank">{{ mapMarker.street }}, {{ mapMarker.postalCode }} {{ mapMarker.city }}</a></p>
                  <p>Email: <a href="mailto:{{ mapMarker.email }}">{{ mapMarker.email }}</a></p>
                  <p>Tel: <a href="tel:{{ mapMarker.tel }}">{{ mapMarker.tel }}</a></p>
                  <p>Tijdstip:
                    <ng-container *ngIf="mapMarker.calendarLink">
                      <a href="{{ mapMarker.calendarLink }}" target="_blank">{{ mapMarker.datePlanned | formatDate }} om
                        {{ mapMarker.hourPlanned }}</a>
                    </ng-container>
                    <ng-container *ngIf="!mapMarker.calendarLink">
                      {{ mapMarker.datePlanned | formatDate }} om
                      {{ mapMarker.hourPlanned }}
                    </ng-container>

                  </p>
                  <p>Status: {{ mapMarker.status | status }}</p>
                  <p>Bedrijf: {{ mapMarker.company | company | async }}</p>
                  <p>Actief Sinds: {{ mapMarker.dateActive | formatDate:'empty' }}</p>
                  <infiltro-comments [comments]="mapMarker.comments"></infiltro-comments>
                </div>
            </map-info-window>
          </map-marker>
      </google-map>
    </ng-container>
  `,
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  @ViewChildren(MapInfoWindow) infoWindows!: QueryList<MapInfoWindow>

  zoom = 8;
  lat = 51.023431;
  lng = 4.261164;

  markers$ = this.projectService.projects$.pipe(
    map((projects) => projects
      .filter((project) => {
        if (!project.lat && project.lng) {
          this.toastr.warning(`Projectnaam: ${project.projectName}`, 'Coördinaten niet gevonden');
        }
        return project.lat && project.lng;
      })
      .filter(({ status }) => statusesForMap.includes(status))
      .map((project) => {
        let pointerExecutor: IPointerIcon['executor'] = 'default';
        let pointerType: IPointerIcon['type'] = 'default';
        let pointerUrgency: IPointerIcon['urgency'] = 'normal';

        if (project.executor !== '') {
          pointerExecutor = project.executor;
        }

        if (project.status === 'planned') {
          pointerType = 'planned';
        }

        // show little red dot
        if (this.isDateActiveTooOldPipe.transform(project.dateActive, project.status)) {
          pointerUrgency = 'warning';
        }

        // show in complete red, since this is more urgent
        if (project.status === "toContact") {
          pointerUrgency = 'error';
        }

        const pointerUrl = pointers.find((pointer) =>
          (pointer.urgency === pointerUrgency && pointer.urgency === 'error') || // go for the red in case of error urgency
          (pointer.executor === pointerExecutor &&
          pointer.type === pointerType &&
          pointer.urgency === pointerUrgency)
        )?.url ?? defaultPointerUrl;

        return {
          ...project,
          pointerUrl,
        }
      })
    ),
  )

  apiLoaded$ = this.mapService.apiLoaded$;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private isDateActiveTooOldPipe: IsDateActiveTooOldPipe,
    private mapService: MapService,
  ) {}

  openInfoWindow(anchor: MapMarker, id: string) {
    this.infoWindows.find((item) => (item.infoWindow?.getContent() as unknown as { id: string }).id === id)?.open(anchor);
  }
}
