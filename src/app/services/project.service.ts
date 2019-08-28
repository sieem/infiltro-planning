import { Injectable } from '@angular/core';
import { FormService } from './form.service';

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
      name: "Offerte getekend",
      filter: true
    },
    {
      type: "toContact",
      name: "Te contacteren",
      filter: false
    },
    {
      type: "toPlan",
      name: "Te plannen",
      filter: false
    },
    {
      type: "proposalSent",
      name: "Voorstel doorgegeven",
      filter: false
    },
    {
      type: "planned",
      name: "Ingepland",
      filter: false
    },
    {
      type: "onHold",
      name: "On - Hold",
      filter: true
    },
    {
      type: "executed",
      name: "Uitgevoerd",
      filter: false
    },
    {
      type: "reportAvailable",
      name: "Rapport beschikbaar",
      filter: false
    },
    {
      type: "conformityAvailable",
      name: "Conformiteit beschikbaar",
      filter: false
    },
    {
      type: "completed",
      name: "Afgerond",
      filter: true
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
      sort: true
    },
    {
      type: "status",
      name: "Status",
      sort: true
    }
  ]

  private technicalFields = ["ATest", "v50Value", "protectedVolume", "EpbNumber"]

  constructor(private formService: FormService) { }

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
    return name || 'Onbekend'

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
