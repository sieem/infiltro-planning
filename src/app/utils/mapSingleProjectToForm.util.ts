import moment from 'moment';
import { dateFormat } from 'shared/utils/regex.util';
import { IProject } from '../interfaces/project.interface';

export const mapToForm = (formData: IProject) => ({
  _id: formData._id,
  company: formData.company,
  dateCreated: moment(formData.dateCreated).format(dateFormat),
  projectType: formData.projectType,
  houseAmount: formData.houseAmount,
  projectName: formData.projectName,
  client: formData.client,
  street: formData.street,
  city: formData.city,
  postalCode: formData.postalCode,
  extraInfoAddress: formData.extraInfoAddress,
  name: formData.name,
  tel: formData.tel,
  email: formData.email,
  extraInfoContact: formData.extraInfoContact,
  EpbReporter: formData.EpbReporter,
  ATest: formData.ATest,
  v50Value: formData.v50Value,
  protectedVolume: formData.protectedVolume,
  EpbNumber: formData.EpbNumber,
  executor: formData.executor,
  datePlanned: moment(formData.datePlanned).format(dateFormat),
  hourPlanned: formData.hourPlanned,
  status: formData.status,
  dateActive: formData.dateActive ? moment(formData.dateActive).format(dateFormat) : 'Nog niet actief',
});
