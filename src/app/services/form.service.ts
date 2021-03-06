import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  // source: https://stackoverflow.com/questions/40513352/email-validation-using-form-builder-in-angular-2-latest-version
  public emailRegex: string = "[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-z0-9](?:[A-z0-9-]*[A-z0-9])?\.)+[A-z0-9](?:[A-z0-9-]*[A-z0-9])?"
  // source: https://stackoverflow.com/a/19605207
  public passwordRegex: string = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
  public postalCodeRegex: string = "[0-9]{4}"

  public dateFormat: string = 'YYYY-MM-DD'
  public visualDateFormat: string = 'dd DD-MM-YYYY'
  public visualDateTimeFormat: string = 'dd DD-MM-YYYY HH:mm'
  public mailDateFormat: string = 'dddd DD-MM-YYYY'

  constructor() {
    moment.locale('nl-be')
  }

  public checkInputField(form: any, field: string, submitted: boolean) {
    return form.get(field).invalid && (form.get(field).dirty || form.get(field).touched || submitted)
  }

  public formatDate(value: Date = new Date(), formatting = this.visualDateFormat, emptyReturn = false) {
    let returnDate = moment(value, "YYYY-MM-DD").format(formatting)
    if (emptyReturn && returnDate === 'Invalid date') return ''
    else if (returnDate === 'Invalid date') return 'Nog te plannen'
    else return returnDate
  }

  public formatDateTime(value: Date = new Date(), formatting = this.visualDateTimeFormat) {
    let returnDate = moment(value).format(formatting)
    if (returnDate === 'Invalid date') return 'Ongeldige datum'
    else return returnDate
  }
}
