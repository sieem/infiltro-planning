import { Injectable } from '@angular/core';
import { IExecutors } from '../interfaces/executors.interface';
import { IProjectTypes } from '../interfaces/project-type.interface';
import { ISortables } from '../interfaces/sortables.interface';
import { IStatuses } from '../interfaces/statuses.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectEnumsService {
  projectTypes: IProjectTypes[] = [
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

  executors: IExecutors[] = [
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

  statuses: IStatuses[] = [
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

  sortables: ISortables[] = [
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

  constructor() { }

  statusName(type: string) {
    return this.statuses.find((status) => status.type === type)?.name || 'Onbekend';
  }

  executorName(type: string) {
    return this.executors.find((executor) => executor.type === type)?.name || 'Onbeslist';
  }

  projectTypeName(type: string) {
    return this.projectTypes.find((projectType) => projectType.type === type)?.name || 'Onbekend';
  }
}
