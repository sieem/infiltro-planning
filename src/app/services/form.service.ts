import { Injectable } from '@angular/core';
import moment from 'moment';
import { visualDateFormat, visualDateTimeFormat } from '../utils/regex.util';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor() {
    moment.locale('nl-be')
  }

  checkInputField(form: any, field: string, submitted: boolean) {
    return form.get(field).invalid && (form.get(field).dirty || form.get(field).touched || submitted)
  }

  formatDate(value: Date = new Date(), formatting = visualDateFormat, emptyReturn = false) {
    let returnDate = moment(value, "YYYY-MM-DD").format(formatting)
    if (emptyReturn && returnDate === 'Invalid date') return ''
    else if (returnDate === 'Invalid date') return 'Nog te plannen'
    else return returnDate
  }

  formatDateTime(value: Date = new Date(), formatting = visualDateTimeFormat) {
    let returnDate = moment(value).format(formatting)
    if (returnDate === 'Invalid date') return 'Ongeldige datum'
    else return returnDate
  }
}
