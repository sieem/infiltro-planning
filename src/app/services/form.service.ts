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

  public formatDate(value) {
    let returnDate = moment(value, "YYYY-MM-DD").format(this.visualDateFormat)
    if (returnDate === 'Invalid date') return 'Nog te plannen'
    else return returnDate
  }

  public formatDateTime(value) {
    let returnDate = moment(value).format(this.visualDateTimeFormat)
    if (returnDate === 'Invalid date') return 'Ongeldige datum'
    else return returnDate
  }

  public removeElementInArray(array: any, id: string) {
    return array.filter(el => el._id !== id)
  }

  public updateElementInArray(array: any, element: any) {
    for (const key in array) {
      if (array[key]._id === element._id) {
        array[key] = element
        return array
      }
    }
    return array
  }

  newlineToBr(value) {
    if (value && typeof value == "string")
      return value.replace(/\n/g, "<br>")
  }
}
