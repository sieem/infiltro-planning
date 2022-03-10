import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CompanyService } from './company.service';
import { BehaviorSubject, firstValueFrom, map, Observable, shareReplay, switchMap, combineLatest } from 'rxjs';
import { IProject } from '../interfaces/project.interface';
import { IExecutors } from '../interfaces/executors.interface';
import { IStatuses } from '../interfaces/statuses.interface';
import { ISortables } from '../interfaces/sortables.interface';
import { IActiveFilter } from '../interfaces/active-filter.interface';
import { SortProjectsPipe } from '../pipes/sort-projects.pipe';
import { ProjectEnumsService } from './project-enums.service';
import { FilterProjectsPipe } from '../pipes/filter-projects.pipe';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  activeFilter$ = new BehaviorSubject<IActiveFilter>({
    status: ['toContact', 'toPlan', 'proposalSent', 'planned', 'executed', 'reportAvailable', 'conformityAvailable', 'onHold', ...(!this.auth.isAdmin() ? ['onHoldByClient'] : []) as 'onHoldByClient'[]],
    executor: ['david', 'roel', 'together'],
    company: []
  });


  private sortOptionsSubject$ = new BehaviorSubject<{ field: ISortables['type'], order: 'asc' | 'desc' }>({
    field: 'datePlanned',
    order: 'asc'
  });

  sortOptions$ = this.sortOptionsSubject$.pipe(shareReplay({ refCount: false, bufferSize: 1 }));

  private projectsSubject$ = new BehaviorSubject<null>(null);

  searchTermSubject$ = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject$.pipe(shareReplay({ refCount: false, bufferSize: 1 }));

  private filteredProjects$ = combineLatest([this.activeFilter$, this.projectsSubject$]).pipe(
    switchMap(([activeFilter]) => this.api.getProjects(activeFilter)),
    switchMap((filteredProjects) => this.filterProjectsPipe.transform(filteredProjects, this.searchTermSubject$.value)),
  )

  projects$: Observable<IProject[]> = combineLatest([this.filteredProjects$, this.sortOptions$]).pipe(
    map(([filteredProjects]) => this.sortProjectsPipe.transform(filteredProjects, this.sortOptionsSubject$.value)),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

  private technicalFields = ["ATest", "v50Value", "protectedVolume", "EpbNumber"] as const;

  constructor(
    private api: ApiService,
    private companyService: CompanyService,
    private auth: AuthService,
    private filterProjectsPipe: FilterProjectsPipe,
    private sortProjectsPipe: SortProjectsPipe,
    private projectEnumsService: ProjectEnumsService,
    ) {}

  getProjects() {
    if (!this.activeFilter$.value.company.length) {
      this.selectAllFilter('company', true)
    }

    this.refreshProjects();
  }

  changeFilter(filterCat: 'status' | 'executor' | 'company', filterVal: ISortables['type'] | IExecutors['type'] | string) {
    const newFilter = this.activeFilter$.value;
    let activeFilter = [];
    switch (filterCat) {
      case 'status':
        activeFilter = newFilter.status;
        break;
      case 'executor':
        activeFilter = newFilter.executor;
        break;
      case 'company':
        activeFilter = newFilter.company;
        break;
      default:
        throw new Error(`Couldn't find filter category, tried ${filterCat}`);
    }

    if (!activeFilter.includes(filterVal)) {
      activeFilter = [...activeFilter, filterVal]
    } else {
      activeFilter = activeFilter.filter(val => { return val !== filterVal })
    }

    switch (filterCat) {
      case 'status':
        newFilter.status = activeFilter as IStatuses['type'][];
        break;
      case 'executor':
        newFilter.executor = activeFilter as IExecutors['type'][];
        break;
      case 'company':
        newFilter.company = activeFilter;
        break;
      default:
        throw new Error(`Couldn't find filter category, tried ${filterCat}`);
    }

    this.activeFilter$.next(newFilter);
  }

  async selectAllFilter(filterCat: 'status' | 'executor' | 'company', selectAll: boolean) {
    const newFilter = this.activeFilter$.value;
    if (selectAll) {
      switch (filterCat) {
        case 'company':
          const companies = await firstValueFrom(this.companyService.companies$);
          newFilter[filterCat] = companies.map((company) => company._id);
          break;
        case 'executor':
          newFilter.executor = this.projectEnumsService.executors.map(el => el.type)
          break;
        case 'status':
          newFilter.status = this.projectEnumsService.statuses.map(el => el.type)
          break;
        default:
          throw new Error(`Couldn't find filter category, tried ${filterCat}`);
      }
    } else {
      newFilter[filterCat] = []
    }

    this.activeFilter$.next(newFilter);
  }

  setSearchTerm(event: Event) {
    this.searchTermSubject$.next((event?.target as any).value ?? '');
  }

  setSortable(sortable: ISortables['type'] | '' = '') {
    const newSortOptions = this.sortOptionsSubject$.value;
    if (sortable !== '') {
      if (newSortOptions.field === sortable) {
        newSortOptions.order = newSortOptions.order === 'asc' ? 'desc' : 'asc';
      }
      newSortOptions.field = sortable;
    }

    this.sortOptionsSubject$.next(newSortOptions);
  }

  isTechnicalDataFilledIn(projectData: IProject) {
    for (const technicalField of this.technicalFields) {
      if (projectData[technicalField] === "") {
        return false
      }
    }
    return true
  }

  private refreshProjects() {
    this.projectsSubject$.next(null);
  }
}
