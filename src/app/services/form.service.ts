import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  // source: https://stackoverflow.com/questions/40513352/email-validation-using-form-builder-in-angular-2-latest-version
  public emailRegex: string = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  // source: https://stackoverflow.com/a/19605207
  public passwordRegex: string = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
  public postalCodeRegex: string = "B-[0-9]{4}"

  public dateFormat: string = 'YYYY-MM-DD'

  public projectTypes: any = [
    {
      "type": "house",
      "name": "Woning"
    },
    {
      "type": "stairs",
      "name": "Traphal"
    },
    {
      "type": "apartment",
      "name": "Individueel appartement"
    }
  ]

  public executors: any = [
    {
      "type": "roel",
      "name": "Roel"
    },
    {
      "type": "david",
      "name": "David"
    },
    {
      "type": "together",
      "name": "Samen"
    }
  ]

  public statuses: any = [
    {
      "type": "toContact",
      "name": "Te contacteren"
    },
    {
      "type": "toPlan",
      "name": "Te plannen"
    },
    {
      "type": "planned",
      "name": "Ingepland"
    },
    {
      "type": "proposalSent",
      "name": "Voorstel doorgegeven"
    },
    {
      "type": "onHold",
      "name": "On - Hold"
    },
    {
      "type": "executed",
      "name": "Uitgevoerd"
    },
    {
      "type": "reportAvailable",
      "name": "Rapport beschikbaar"
    },
    {
      "type": "conformityAvailable",
      "name": "Conformiteit beschikbaar"
    }
  ]

  constructor() { }

  public checkInputField(form: any, field: string, submitted: boolean) {
    return form.get(field).invalid && (form.get(field).dirty || form.get(field).touched || submitted)
  }
}
