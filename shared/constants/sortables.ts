import { ISortables } from "../../src/app/interfaces/sortables.interface";

export const sortables: ISortables[] = [
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
];
