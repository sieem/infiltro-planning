import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CompanyService } from './company.service';

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
      type: "onHoldCovid19",
      name: "On - Hold (COVID-19)",
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
      name: "Datum aanvraag",
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

  private technicalFields = ["ATest", "v50Value", "protectedVolume", "EpbNumber"]

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private companyService: CompanyService,
    private auth: AuthService,
    ) {
      
    }

  async getProjects() {
    if (!this.activeFilter.company.length) {
      this.selectAllFilter('company', true, 'companies')
    }
    
    this.api.getProjects().subscribe(
      res => {
        this.projects = this.allProjects = res
        this.filterProjects()
        this.sortProjects()
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

    this.filterProjects()
    this.sortProjects()
  }

  async selectAllFilter(filterCat: string, selectAll: boolean, filterCatArray: string = '') {
    if (selectAll) {
      if (filterCat === 'company') {
        const companies = await this.companyService.getCompanies().toPromise();
        this.activeFilter[filterCat] = companies.map(el => el._id)
      } else {
        this.activeFilter[filterCat] = this[filterCatArray].map(el => el.filter === undefined || el.filter ? el.type : null)
      }
    } else {
      this.activeFilter[filterCat] = []
    }

    this.filterProjects()
    this.sortProjects()
  }

  filterProjects() {
    this.projects = this.allProjects.filter(row => {
      let filterBooleans = []

      for (let [key, values] of Object.entries(this.activeFilter)) {
        let filterArr: any = values
        if (filterArr.length == 0) {
          return false
        } else if (row[key] !== '') {
          filterBooleans.push(filterArr.includes(row[key]))
        }
      }
      return !filterBooleans.includes(false)
    })
  }

  sortProjects(sortType = '') {
    if (sortType !== '') {
      if (this.sortOptions.field === sortType) {
        this.sortOptions.order = (this.sortOptions.order === 'asc') ? 'desc' : 'asc'
      }
      this.sortOptions.field = sortType
    }


    this.projects = this.projects.sort((a, b) => {
      let x: string;
      let y: string;

      if ((this.sortOptions.field !== 'datePlanned' || this.sortOptions.field !== 'executor') && !a[this.sortOptions.field] && !b[this.sortOptions.field]) {
        x = a.dateEdited;
        y = b.dateEdited;
      } else {
        if (!a[this.sortOptions.field]) return 1;
        if (!b[this.sortOptions.field]) return -1;
      }

      x = x || a[this.sortOptions.field].toLowerCase();
      y = y || b[this.sortOptions.field].toLowerCase();

      if (x == y) return 0

      return x < y ? -1 : 1
    })

    if (this.sortOptions.order == 'desc') {
      this.projects = this.projects.reverse()
    }
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
