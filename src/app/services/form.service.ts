import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  // source: https://stackoverflow.com/questions/40513352/email-validation-using-form-builder-in-angular-2-latest-version
  public emailRegex: string = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  // source: https://stackoverflow.com/a/19605207
  public passwordRegex: string = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
  public postalCodeRegex: string = "[0-9]{4}"

  public dateFormat: string = 'YYYY-MM-DD'
  public visualDateFormat: string = 'dd DD-MM-YYYY'
  public mailDateFormat: string = 'dddd DD-MM-YYYY'

  constructor() {
    moment.locale('nl-be')
  }

  public checkInputField(form: any, field: string, submitted: boolean) {
    return form.get(field).invalid && (form.get(field).dirty || form.get(field).touched || submitted)
  }

  public formatDate(value) {
    let returnDate = moment(value).format(this.visualDateFormat)
    if (returnDate === 'Invalid date') return 'Nog te plannen'
    else return returnDate
  }
}
