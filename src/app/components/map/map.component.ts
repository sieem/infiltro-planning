import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/services/company.service';
import { IsDateActiveTooOldPipe } from 'src/app/pipes/is-date-active-too-old.pipe';
import { firstValueFrom } from 'rxjs';
import { IProject } from '../../interfaces/project.interface';

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
    public projectService: ProjectService,
    private toastr: ToastrService,
    public companyService: CompanyService,
    private isDateActiveTooOldPipe: IsDateActiveTooOldPipe,
    ) { }

  ngOnInit() {
    firstValueFrom(this.projectService.allProjects$)
      .then((res: IProject[]) => {
        res.forEach((project) => {
          if (project.status === "toPlan" || project.status === "planned" || project.status === "toContact" || project.status === "proposalSent") {
            let pointerUrl = this.pointers.together.default

            if (project.executor) {
              pointerUrl = this.pointers[project.executor][project.status] || this.pointers[project.executor].default
            } else {
              pointerUrl = this.pointers.default[project.status] || this.pointers.default.default
            }

            if (this.isDateActiveTooOldPipe.transform(project.dateActive, project.status)) {
              pointerUrl = pointerUrl.replace('.png', '-warning.png');
            }

            // always show red if it's to contact
            if (project.status === "toContact") {
              pointerUrl = this.pointers.warning[project.status] || this.pointers.warning.default
            }

            if (project.lat && project.lng) {
              this.markers.push(
                {
                  _id: project._id,
                  lat: project.lat,
                  lng: project.lng,
                  projectName: project.projectName,
                  street: project.street,
                  city: project.city,
                  email: project.email,
                  tel: project.tel,
                  postalCode: project.postalCode,
                  datePlanned: project.datePlanned,
                  hourPlanned: project.hourPlanned,
                  dateActive: project.dateActive as Date,
                  status: project.status,
                  executor: project.executor,
                  company: project.company,
                  calendarLink: project.calendarLink,
                  comments: project.comments,
                  pointerUrl: pointerUrl,
                }
              )
            } else {
              this.toastr.warning(`Projectnaam: ${project.projectName}`, 'Coördinaten niet gevonden')
            }
          }
        })
      },
      )
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`))
  }

}
// just an interface for type safety.
interface marker {
  _id: string,
  lat: number;
  lng: number;
  projectName: string;
  street: string;
  city: string;
  email: string;
  tel: string;
  postalCode: string;
  datePlanned: Date;
  hourPlanned: string;
  dateActive: Date;
  status: string;
  executor: string;
  pointerUrl: string;
  company: string;
  calendarLink: string;
  comments: any[];
}
