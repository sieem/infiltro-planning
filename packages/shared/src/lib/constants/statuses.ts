import { IStatuses } from "../interfaces/statuses.interface";

export const statuses: IStatuses[] = [
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
];

export const statusesForMap: (IStatuses['type'] | '')[] = ['toPlan', 'planned', 'toContact', 'proposalSent'];

export const statusName = (type: IStatuses['type'] | '') =>
 statuses.find((status) => status.type === type)?.name ?? 'Onbekend';
