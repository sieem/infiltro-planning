import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { SingleProjectService } from 'src/app/services/single-project.service';
import { SingleProjectArchiveService } from 'src/app/services/single-project-archive.service';

@Component({
  selector: 'app-single-project-archive',
  templateUrl: './single-project-archive.component.html',
  styleUrls: ['./single-project-archive.component.scss']
})
export class SingleProjectArchiveComponent implements OnInit {
  projectData: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService, 
    private toastr: ToastrService,
    private router: Router,
    public singleProjectArchiveService: SingleProjectArchiveService,
    private singleProjectService: SingleProjectService,
  ) { }

  ngOnInit(): void {
    this.singleProjectService.archiveActive = true;

    this.route.params.subscribe(params => {
      if (params.projectId) {
        this.api.getProjectArchive(params.projectId).subscribe(
          (res: any) => {
            this.singleProjectArchiveService.init(res);
          },
          err => {
            this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
            this.router.navigate(['/'])
          }
        )
      }
    })
  }

}
