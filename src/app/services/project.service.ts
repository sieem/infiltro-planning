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
      name: "Individueel appartement"
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

  constructor(private formService: FormService) { }

  public statusName(type: string) {
    let name
    this.statuses.forEach(status => {
      if (status.type === type) {
        name = status.name
      }
    })
    return name || 'Onbekend'
  }

  public  executorName(type: string) {
    let name
    this.executors.forEach(executor => {
      if (executor.type === type) {
        name = executor.name
      }
    })
    return name || 'Onbekend'

  }

  public projectTypeName(type: string) {
    let name
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
