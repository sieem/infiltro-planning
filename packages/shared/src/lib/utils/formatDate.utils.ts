import { visualDateFormat, visualDateTimeFormat } from './regex.util';
import * as moment from 'moment';

moment.locale('nl-be')

export const formatDate = (value: Date = new Date(), formatting = visualDateFormat, emptyReturn = false) => {
  const returnDate = moment(value, "YYYY-MM-DD").format(formatting)
  if (emptyReturn && returnDate === 'Invalid date') return ''
  else if (returnDate === 'Invalid date') return 'Nog te plannen'
  else return returnDate
}

export const formatDateTime = (value: Date = new Date(), formatting = visualDateTimeFormat) => {
  const returnDate = moment(value).format(formatting)
  if (returnDate === 'Invalid date') return 'Ongeldige datum'
  else return returnDate
}
