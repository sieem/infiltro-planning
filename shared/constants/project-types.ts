import { IProjectTypes } from "../../src/app/interfaces/project-type.interface";

export const projectTypes: IProjectTypes[] = [
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
];


export const projectTypeName = (type: IProjectTypes['type'] | ''): string =>
  projectTypes.find((projectType) => projectType.type === type)?.name ?? 'Onbekend';
