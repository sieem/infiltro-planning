import { Injectable } from '@angular/core';
import { FormService } from './form.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './api.service';
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
      filter: true
    },
    {
      type: "toContact",
      name: "Te contacteren",
      filter: true
    },
    {
      type: "toPlan",
      name: "Te plannen",
      filter: true
    },
    {
      type: "proposalSent",
      name: "Voorstel doorgegeven",
      filter: true
    },
    {
      type: "planned",
      name: "Ingepland",
      filter: true
    },
    {
      type: "onHold",
      name: "On - Hold",
      filter: true
    },
    {
      type: "onHoldCovid19",
      name: "On - Hold (COVID-19)",
      filter: true
    },
    {
      type: "onHoldByClient",
      name: "On - Hold door klant",
      filter: true
    },
    {
      type: "executed",
      name: "Uitgevoerd",
      filter: true
    },
    {
      type: "reportAvailable",
      name: "Rapport beschikbaar",
      filter: true
    },
    {
      type: "conformityAvailable",
      name: "Conformiteit beschikbaar",
      filter: true
    },
    {
      type: "completed",
      name: "Afgerond",
      filter: true
    },
    {
      type: "deleted",
      name: "Verwijderd",
      filter: false
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
      sort: false
    },
    {
      type: "street",
      name: "Straat + Nr",
      sort: false
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
    status: ['toContact', 'toPlan', 'proposalSent', 'planned', 'executed', 'reportAvailable', 'conformityAvailable', 'onHold', 'onHoldCovid19'],
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
    private formService: FormService,
    private toastr: ToastrService,
    private companyService: CompanyService) {
      
    }

  async getProjects() {
    await this.companyService.getCompanies()
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

  selectAllFilter(filterCat: string, selectAll: boolean, filterCatArray: string = '') {
    if (selectAll) {
      if (filterCat === 'company') {
        this.activeFilter[filterCat] = this.companyService.companies.map(el => el._id)
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
      if (!a[this.sortOptions.field]) return 1;
      if (!b[this.sortOptions.field]) return -1;

      let x = a[this.sortOptions.field].toLowerCase()
      let y = b[this.sortOptions.field].toLowerCase()

      if (x == y) return 0

      return (x < y) ? -1 : 1
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

  public formatDate(value) {
    return this.formService.formatDate(value)
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
