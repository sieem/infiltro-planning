import { IExecutors } from "../../src/app/interfaces/executors.interface";

export const executors: IExecutors[] = [
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

export const executorName = (type: IExecutors['type'] | ''): string =>
  executors.find((executor) => executor.type === type)?.name ?? 'Onbeslist';
