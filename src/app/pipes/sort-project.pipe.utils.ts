import { IProject } from "../interfaces/project.interface";

export const sortProjects = (projects: IProject[], field: keyof IProject): IProject[] => {
  const projectsWithValueForSorting = projects.filter((project) => project[field]);
  const projectsWithoutValueForSorting = projects.filter((project) => !project[field]);

  projectsWithValueForSorting.sort((a, b) => sortingFn(a, b, field));

  if (field === 'datePlanned') {
    sortProjects(projectsWithoutValueForSorting, 'dateActive');
  }

  return [...projectsWithValueForSorting, ...projectsWithoutValueForSorting];
}

const sortingFn = (a: IProject, b: IProject, field: keyof IProject): 0 | 1 | -1 => {
  const x = String(a[field]).toLowerCase();
  const y = String(b[field]).toLowerCase();

  if (x === y) return 0;

  return x < y ? -1 : 1;
}
