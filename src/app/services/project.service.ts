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
      name: "Contract getekend"
    },
    {
      type: "toContact",
      name: "Te contacteren"
    },
    {
      type: "toPlan",
      name: "Te plannen"
    },
    {
      type: "proposalSent",
      name: "Voorstel doorgegeven"
    },
    {
      type: "planned",
      name: "Ingepland"
    },
    {
      type: "onHold",
      name: "On - Hold"
    },
    {
      type: "executed",
      name: "Uitgevoerd"
    },
    {
      type: "reportAvailable",
      name: "Rapport beschikbaar"
    },
    {
      type: "conformityAvailable",
      name: "Conformiteit beschikbaar"
    },
    {
      type: "completed",
      name: "Afgerond"
    }
  ]

  public sortables: any = [
    {
      type: "company",
      name: "Bedrijf"
    },
    {
      type: "dateCreated",
      name: "Datum aanvraag"
    },
    {
      type: "projectType",
      name: "Type"
    },
    {
      type: "projectName",
      name: "Referentie"
    },
    {
      type: "street",
      name: "Straat + Nr"
    },
    {
      type: "city",
      name: "Gemeente"
    },
    {
      type: "postalCode",
      name: "Postcode"
    },
    {
      type: "name",
      name: "Naam contactpersoon"
    },
    {
      type: "tel",
      name: "Telefoonnummer contactpersoon"
    },
    {
      type: "email",
      name: "E-mail contactpersoon"
    },
    {
      type: "executor",
      name: "Uitvoerder"
    },
    {
      type: "datePlanned",
      name: "Datum ingepland"
    },
    {
      type: "hourPlanned",
      name: "Uur ingepland"
    },
    {
      type: "status",
      name: "Status"
    }
  ]

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
}
