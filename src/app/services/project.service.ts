import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CompanyService } from './company.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public projectTypes: any = [
    {
      type: "house",
      name: "Woning"
    },
    {
      type: "stairs",
      name: "Traphal"
    },
    {
      type: "apartment",
      name: "Appartement"
    },
    {
      type: "mixed",
      name: "Gemengd"
    },
    {
      type: "other",
      name: "Andere"
    }
  ]

  public executors: any = [
    {
      type: "roel",
      name: "Roel"
    },
    {
      type: "david",
      name: "David"
    },
    {
      type: "together",
      name: "Samen"
    }
  ]

  public statuses: any = [
    {
      type: "contractSigned",
      name: "Nog niet actief",
      onlyAdmin: false,
    },
    {
      type: "toContact",
      name: "Te contacteren",
      onlyAdmin: false,
    },
    {
      type: "toPlan",
      name: "Te plannen",
      onlyAdmin: false,
    },
    {
      type: "proposalSent",
      name: "Voorstel doorgegeven",
      onlyAdmin: false,
    },
    {
      type: "planned",
      name: "Ingepland",
      onlyAdmin: false,
    },
    {
      type: "onHold",
      name: "On - Hold",
      onlyAdmin: false,
    },
    {
      type: "onHoldByClient",
      name: "On - Hold door klant",
      onlyAdmin: false,
    },
    {
      type: "executed",
      name: "Uitgevoerd",
      onlyAdmin: false,
    },
    {
      type: "reportAvailable",
      name: "Rapport beschikbaar",
      onlyAdmin: false,
    },
    {
      type: "conformityAvailable",
      name: "Conformiteit beschikbaar",
      onlyAdmin: false,
    },
    {
      type: "completed",
      name: "Afgerond",
      onlyAdmin: false,
    },
    {
      type: "deleted",
      name: "Verwijderd",
      onlyAdmin: true,
    }
  ]

  public sortables: any = [
    {
      type: "company",
      name: "Bedrijf",
      sort: true
    },
    {
      type: "dateCreated",
      name: "Ingegeven op",
      sort: true
    },
    {
      type: "projectType",
      name: "Type",
      sort: false
    },
    {
      type: "projectName",
      name: "Referentie",
      sort: true
    },
    {
      type: "street",
      name: "Straat + Nr",
      sort: true
    },
    {
      type: "city",
      name: "Gemeente",
      sort: false
    },
    {
      type: "postalCode",
      name: "Postcode",
      sort: false
    },
    {
      type: "name",
      name: "Naam contactpersoon",
      sort: false
    },
    {
      type: "tel",
      name: "Telefoonnummer contactpersoon",
      sort: false
    },
    {
      type: "email",
      name: "E-mail contactpersoon",
      sort: false
    },
    {
      type: "executor",
      name: "Uitvoerder",
      sort: true
    },
    {
      type: "datePlanned",
      name: "Datum ingepland",
      sort: true
    },
    {
      type: "hourPlanned",
      name: "Uur ingepland",
      sort: false
    },
    {
      type: "status",
      name: "Status",
      sort: true
    }
  ]

  public activeFilter: any = {
    status: ['toContact', 'toPlan', 'proposalSent', 'planned', 'executed', 'reportAvailable', 'conformityAvailable', 'onHold', 'onHoldCovid19', !this.auth.isAdmin() ? 'onHoldByClient' : [...[]]],
    executor: ['david', 'roel', 'together'],
    company: []
  }

  public sortOptions: any = {
    field: 'datePlanned',
    order: 'asc'
  }

  public projects: any = []
  public allProjects: any = []

  public searchTerm = "";

  private technicalFields = ["ATest", "v50Value", "protectedVolume", "EpbNumber"]

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private companyService: CompanyService,
    private auth: AuthService,
    ) {}

  async getProjects() {
    if (!this.activeFilter.company.length) {
      this.selectAllFilter('company', true, 'companies')
    }

    this.api.getProjects().subscribe(
      res => {
        this.projects = this.allProjects = res
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

  changeFilter(filterCat, filterVal) {
    if (!this.activeFilter[filterCat].includes(filterVal)) {
      this.activeFilter[filterCat] = [...this.activeFilter[filterCat], filterVal]
    } else {
      this.activeFilter[filterCat] = this.activeFilter[filterCat].filter(val => { return val !== filterVal })
    }

    // trigger pipe
    this.activeFilter = { ...this.activeFilter };
  }

  async selectAllFilter(filterCat: string, selectAll: boolean, filterCatArray: string = '') {
    if (selectAll) {
      if (filterCat === 'company') {
        const companies = await firstValueFrom(this.companyService.companies$);
        this.activeFilter[filterCat] = companies.map((company) => company._id)
      } else {
        this.activeFilter[filterCat] = this[filterCatArray].map(el => el.filter === undefined || el.filter ? el.type : null)
      }
    } else {
      this.activeFilter[filterCat] = []
    }

    // trigger pipe
    this.activeFilter = { ...this.activeFilter};
  }

  setSearchTerm(searchTerm) {
    this.searchTerm = searchTerm;
  }

  setSortable(sortable = "") {
    if (sortable !== '') {
      if (this.sortOptions.field === sortable) {
        this.sortOptions.order = this.sortOptions.order === 'asc' ? 'desc' : 'asc';
      }
      this.sortOptions.field = sortable;
    }

    // trigger pipe
    this.sortOptions = {...this.sortOptions};
  }


  public statusName(type: string) {
    let name: string
    this.statuses.forEach(status => {
      if (status.type === type) {
        name = status.name
      }
    })
    return name || 'Onbekend'
  }

  public executorName(type: string) {
    let name: string
    this.executors.forEach(executor => {
      if (executor.type === type) {
        name = executor.name
      }
    })
    return name || 'Onbeslist'

  }

  public projectTypeName(type: string) {
    let name: string
    this.projectTypes.forEach(projectType => {
      if (projectType.type === type) {
        name = projectType.name
      }
    })
    return name || 'Onbekend'
  }

  public isTechnicalDataFilledIn(projectData) {
    for (const technicalField of this.technicalFields) {
      if (projectData[technicalField] === "") {
        return false
      }
    }
    return true
  }
}
