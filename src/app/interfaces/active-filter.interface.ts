import { IExecutors } from "./executors.interface";
import { IStatuses } from "./statuses.interface";

export interface IActiveFilter {
  status: IStatuses['type'][],
  executor: IExecutors['type'][],
  company: string[],
}
