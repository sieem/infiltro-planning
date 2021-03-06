import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/services/company.service';
import { IsDateActiveTooOldPipe } from 'src/app/pipes/is-date-active-too-old.pipe';

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

  markers: marker[] = []

  pointers: any = {
    david: {
      planned: "david-planned.png",
      default: "david-faded.png"
    },
    roel: {
      planned: "roel-planned.png",
      default: "roel-faded.png"
    },
    together: {
      planned: "together-planned.png",
      default: "together-faded.png"
    },
    default: {
      planned: "default-planned.png",
      default: "default-faded.png"
    },
    warning: {
      planned: "warning-planned.png",
      default: "warning-faded.png"
    }
  }

  constructor(
    private api: ApiService,
    public projectService: ProjectService,
    private toastr: ToastrService,
    public companyService: CompanyService,
    private isDateActiveTooOldPipe: IsDateActiveTooOldPipe,
    ) { }

  ngOnInit() {
    this.getProjects()
  }

  getProjects() {
    this.api.getProjects().subscribe(
      (res: any) => {
        res.forEach(project => {
          if (project.status === "toPlan" || project.status === "planned" || project.status === "toContact" || project.status === "proposalSent" || project.status === "onHoldCovid19") {
            let pointerUrl = this.pointers.together.default

            if (project.executor) {
              pointerUrl = this.pointers[project.executor][project.status] || this.pointers[project.executor].default
            } else {
              pointerUrl = this.pointers.default[project.status] || this.pointers.default.default
            }

            if (this.isDateActiveTooOldPipe.transform([project.dateActive, project.status])) {
              pointerUrl = pointerUrl.replace('.png', '-warning.png');
            }
            
            // always show red if it's to contact
            if (project.status === "toContact") {
              pointerUrl = this.pointers.warning[project.status] || this.pointers.warning.default
            }

            if (project.lat && project.lng) {
              this.markers.push(
                {
                  ...project,
                  pointerUrl: pointerUrl,
                }
              )
            } else {
              this.toastr.warning(`Projectnaam: ${project.projectName}`, 'Coördinaten niet gevonden')
            }
            
          }
        })
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

}
// just an interface for type safety.
interface marker {
  id: string,
  lat: number;
  lng: number;
  title: string;
  street: string;
  city: string;
  email: string;
  tel: string;
  postalCode: number;
  datePlanned: Date;
  hourPlanned: Date;
  status: string;
  executor: string;
  pointerUrl: string;
  company: string;
  calendarLink: string;
  comments: any[];
}
