import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { SingleProjectService } from '../../services/single-project.service';
import { SingleProjectArchiveService } from '../../services/single-project-archive.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'infiltro-single-project-archive',
  template: `
    <div class="wrapper">
        <h1>Historiek</h1>
        <div class="controls">
                <div class="icon goBack" (click)="goBack()"><img src="/assets/images/icon-back.svg" alt=""></div>
            <div class="info" *ngIf="singleProjectArchiveService.archiveProjectData">
                <div class="date">Opgeslagen op: {{ singleProjectArchiveService.archiveProjectData.savedDateTime | formatDate: 'time' }}</div>
                <div class="user">Opgeslagen door: {{ singleProjectArchiveService.archiveProjectData.user | user | async }}</div>
            </div>
            <div class="arrows">
                <div (click)="singleProjectArchiveService.olderProject()" class="icon"><img *ngIf="singleProjectArchiveService.isOlderProjectAvailable()" src="/assets/images/icon-arrow-prev.svg" alt=""></div>
                <div (click)="singleProjectArchiveService.newerProject()" class="icon"><img *ngIf="singleProjectArchiveService.isNewerProjectAvailable()" src="/assets/images/icon-arrow-next.svg" alt=""></div>
            </div>
        </div>
    </div>

    <infiltro-single-project></infiltro-single-project>
  `,
  styleUrls: ['./single-project-archive.component.scss']
})
export class SingleProjectArchiveComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toastr: ToastrService,
    private router: Router,
    public singleProjectArchiveService: SingleProjectArchiveService,
    public singleProjectService: SingleProjectService,
  ) { }

  ngOnInit(): void {
    this.singleProjectService.archiveActive = true;

    this.route.params.subscribe(params => {
      if (params['projectId']) {
        firstValueFrom(this.api.getProjectArchive(params['projectId']))
          .then((res: any) => this.singleProjectArchiveService.init(res))
          .catch((err: any) => {
            this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
            this.router.navigate(['/'])
          });
      }
    })
  }

  goBack(): void {
    this.router.navigate(['project', this.singleProjectService.projectId$.value]);
  }

}
