import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  // google maps zoom level
  zoom: number = 8

  // initial center position for the map
  lat: number = 51.023431
  lng: number = 4.261164

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  markers: marker[] = []

  pointers: any = {
    "david": {
      "planned": "david-planned.png",
      "default": "david-faded.png"
    },
    "roel": {
      "planned": "roel-planned.png",
      "default": "roel-faded.png"
    },
    "together": {
      "planned": "default-planned.png",
      "default": "default-faded.png"
    }
  }

  constructor(
    private api: ApiService,
    public projectService: ProjectService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getProjects()
  }

  getProjects() {
    this.api.getProjects().subscribe(
      (res: any) => {
        const now = new Date()
        res.forEach(project => {
          if ((new Date(project.datePlanned) > now || !project.datePlanned) && project.status !== "onHold" && project.status !== "contractSigned") {
            let pointerUrl = this.pointers.together.default

            if (project.executor) {
              pointerUrl = this.pointers[project.executor][project.status] || this.pointers[project.executor]['default']
            } else {
              pointerUrl = this.pointers['together'][project.status] || this.pointers['together']['default']
            }

            this.markers.push(
              {
                lat: project.lat,
                lng: project.lng,
                title: project.projectName,
                street: project.street,
                city: project.city,
                postalCode: project.postalCode,
                datePlanned: project.datePlanned,
                hourPlanned: project.hourPlanned,
                status: project.status,
                executor: project.executor,
                pointerUrl: pointerUrl
              }
            )
          }
        })
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

}
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  title: string;
  street: string;
  city: string;
  postalCode: number;
  datePlanned: Date;
  hourPlanned: Date;
  status: string;
  executor: string;
  pointerUrl: string;
}
