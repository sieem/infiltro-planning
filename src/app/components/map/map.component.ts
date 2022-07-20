import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IsDateActiveTooOldPipe } from 'src/app/pipes/is-date-active-too-old.pipe';
import { pointers, IPointerIcon, defaultPointerUrl } from './map.component.util';
import { map } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project.service';
import { statusesForMap } from 'shared/constants/statuses';

@Component({
  selector: 'app-map',
  template: `
    <app-filterbar context="map"></app-filterbar>
    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">

      <agm-marker *ngFor="let marker of markers$ | async"
        [latitude]="marker.lat"
        [longitude]="marker.lng"
        [label]="marker.executor | executor: 'label'"
        [iconUrl]="'assets/images/map/' + marker.pointerUrl">

        <agm-info-window>
          <div class="container">
            <h2><a routerLink="/project/{{ marker._id }}" routerLinkActive="active">{{ marker.projectName }}</a></h2>
            <p>Type: {{ marker.projectType | projectType }}</p>
            <p>Aantal/Omschrijving: {{ marker.houseAmount }}</p>
            <p>Adres: <a href="https://www.google.be/maps/search/{{ marker.street }}+{{ marker.postalCode }}+{{ marker.city }}"
                target="_blank">{{ marker.street }}, {{ marker.postalCode }} {{ marker.city }}</a></p>
            <p>Email: <a href="mailto:{{ marker.email }}">{{ marker.email }}</a></p>
            <p>Tel: <a href="tel:{{ marker.tel }}">{{ marker.tel }}</a></p>
            <p>Tijdstip:
              <ng-container *ngIf="marker.calendarLink">
                <a href="{{ marker.calendarLink }}" target="_blank">{{ marker.datePlanned | formatDate }} om
                  {{ marker.hourPlanned }}</a>
              </ng-container>
              <ng-container *ngIf="!marker.calendarLink">
                {{ marker.datePlanned | formatDate }} om
                {{ marker.hourPlanned }}
              </ng-container>

            </p>
            <p>Status: {{ marker.status | status }}</p>
            <p>Bedrijf: {{ marker.company | company | async }}</p>
            <p>Actief Sinds: {{ marker.dateActive | formatDate:'empty' }}</p>
            <app-comments [comments]="marker.comments"></app-comments>
          </div>
        </agm-info-window>

      </agm-marker>

    </agm-map>
  `,
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
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


  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private isDateActiveTooOldPipe: IsDateActiveTooOldPipe,
  ) { }
}
