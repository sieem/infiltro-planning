import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { CompanyService } from '../../services/company.service';
import { combineLatest, firstValueFrom, map } from 'rxjs';
import { BatchModeService } from '../../services/batch-mode.service';
import { ModalService } from '../../services/modal.service';
import { statuses, statusesForMap, sortables, executors } from '@infiltro/shared';

@Component({
  selector: 'infiltro-filterbar',
  template: `
    <div class="controls" *ngIf="projectService.activeFilter$ | async as activeFilter">
        <a *ngIf="context === 'projects'" [routerLink]="[ '/project/toevoegen' ]" class="btn red"><img src="/assets/images/icon-new.svg" alt="">Nieuw project</a>
        <div class="btn filter status">
            <span class="title">Toon ook <span class="error" *ngIf="activeFilter.status.length === 0"><span>!</span></span></span>
            <div class="dropdown">
                <div class="select-options">
                    <div>Selecteer</div>
                    <div class="btn" (click)="projectService.selectAllFilter('status', true)">Alles</div>
                    <div class="btn" (click)="projectService.selectAllFilter('status', false)">Niets</div>
                </div>
                <div class="item" *ngFor="let status of statuses" (click)="projectService.changeFilter('status', status.type)">
                    <ng-container *ngIf="!status.onlyAdmin || (status.onlyAdmin && auth.isAdmin() )">
                        <img src="/assets/images/icon-unchecked.svg" alt="" *ngIf="!activeFilter.status.includes(status.type)">
                        <img src="/assets/images/icon-checked.svg" alt="" *ngIf="activeFilter.status.includes(status.type)">
                        <span>{{status.name}}</span>
                    </ng-container>
                </div>
            </div>
        </div>

        <div class="btn filter executor" *ngIf="auth.isAdmin()">
            <span class="title">Uitvoerder <span class="error" *ngIf="activeFilter.executor.length === 0"><span>!</span></span></span>
            <div class="dropdown">
                <div class="select-options">
                    <div>Selecteer</div>
                    <div class="btn" (click)="projectService.selectAllFilter('executor', true)">Alles</div>
                    <div class="btn" (click)="projectService.selectAllFilter('executor', false)">Niets</div>
                </div>
                <div class="item" *ngFor="let executor of executors"
                    (click)="projectService.changeFilter('executor', executor.type)">
                    <img src="/assets/images/icon-unchecked.svg" alt=""
                        *ngIf="!activeFilter.executor.includes(executor.type)">
                    <img src="/assets/images/icon-checked.svg" alt=""
                        *ngIf="activeFilter.executor.includes(executor.type)">
                    <span>{{executor.name}}</span>
                </div>
            </div>
        </div>

        <div class="btn filter company" *ngIf="auth.isAdmin()">
            <span class="title">Bedrijf <span class="error" *ngIf="activeFilter.company.length === 0"><span>!</span></span></span>
            <div class="dropdown">
                <div class="select-options">
                    <div>Selecteer</div>
                    <div class="btn" (click)="projectService.selectAllFilter('company', true)">Alles</div>
                    <div class="btn" (click)="projectService.selectAllFilter('company', false)">Niets</div>
                </div>
                <div class="item" *ngFor="let company of companyService.companies$ | async"
                    (click)="projectService.changeFilter('company', company._id)">
                    <img src="/assets/images/icon-unchecked.svg" alt=""
                        *ngIf="!activeFilter.company.includes(company._id)">
                    <img src="/assets/images/icon-checked.svg" alt=""
                        *ngIf="activeFilter.company.includes(company._id)">
                    <span>{{company.name}}</span>
                </div>
            </div>
        </div>

        <ng-container *ngIf="context === 'projects'">
          <div class="btn filter sort" *ngIf="projectService.sortOptions$ | async as sortOptions" [ngClass]="sortOptions.order">
              <span class="title">Sorteer</span>
              <div class="dropdown">
                  <div class="item" *ngFor="let sortable of sortables" (click)="projectService.setSortable(sortable.type)">
                      <ng-container *ngIf="sortable.sort">
                          <img src="/assets/images/icon-unchecked.svg" alt="" *ngIf="sortOptions.field !== sortable.type">
                          <img src="/assets/images/icon-checked.svg" alt="" *ngIf="sortOptions.field === sortable.type">
                          <span>{{sortable.name}}</span>
                          <span class="arrow desc" *ngIf="sortOptions.field === sortable.type && sortOptions.order === 'desc'"><img src="/assets/images/icon-arrow.svg" alt=""></span>
                          <span class="arrow asc" *ngIf="sortOptions.field === sortable.type && sortOptions.order === 'asc'"><img src="/assets/images/icon-arrow.svg" alt=""></span>
                      </ng-container>
                  </div>
              </div>
          </div>
        </ng-container>
        <ng-container *ngIf="context === 'projects'">
          <div class="btn filter batch" *ngIf="auth.isAdmin()" (click)="toggleBatchMode()">
                  <span *ngIf="showStartBatchMode$ | async" class="title">Batch status</span>
                  <span *ngIf="showStopBatchMode$ | async" class="title">Stop batch status</span>
                  <span *ngIf="showEditBatchMode$ | async" class="title">Pas projecten aan</span>
          </div>
        </ng-container>
        <div class="search">
            <input type="text" name="search" [value]="projectService.searchTerm$ | async" (input)="projectService.setSearchTerm($event)" placeholder="Zoeken">
        </div>
    </div>
  `,
  styleUrls: ['./filterbar.component.scss']
})
export class FilterBarComponent {
  @Input()
  private _context: 'projects' | 'map' = 'projects';
  get context(): 'projects' | 'map' {
    return this._context;
  }
  set context(context: 'projects' | 'map') {
    this.statuses = statuses.filter(({ type }) => context === 'projects' || statusesForMap.includes(type));
    this._context = context;
  }

  sortables = sortables;
  executors = executors;
  statuses = statuses;

  showStartBatchMode$ = this.batchModeService.batchMode$.pipe(map((batchMode) => !batchMode));
  showStopBatchMode$ = combineLatest([this.batchModeService.batchMode$, this.batchModeService.selectedProjects$]).pipe(
    map(([batchMode, selectedProjects]) => batchMode && selectedProjects.length === 0),
  );
  showEditBatchMode$ = combineLatest([this.batchModeService.batchMode$, this.batchModeService.selectedProjects$]).pipe(
    map(([batchMode, selectedProjects]) => batchMode && selectedProjects.length > 0),
  );


  constructor(
    public auth: AuthService,
    public companyService: CompanyService,
    public projectService: ProjectService,
    private batchModeService: BatchModeService,
    private modalService: ModalService,
    ) { }

  async toggleBatchMode() {
    const [batchMode, selectedProjects] = await firstValueFrom(combineLatest([this.batchModeService.batchMode$, this.batchModeService.selectedProjects$]))

    if (batchMode && selectedProjects.length > 0) {
      this.modalService.open("batchmode-modal");
    } else {
      this.batchModeService.batchMode$.next(!batchMode);
    }
  }
}
