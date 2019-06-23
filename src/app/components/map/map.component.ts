import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';

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

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getProjects()
  }

  formatDate(value) {
    return moment(value).format("DD-MM-YYYY")
  }

  getProjects() {
    this.api.getProjects().subscribe(
      (res: any) => {
        console.log(res)
        res.forEach(project => {
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
            }
          )
        });
      },
      err => console.log(err)
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
}
