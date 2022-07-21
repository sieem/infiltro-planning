import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  checkInputField(form: any, field: string, submitted: boolean) {
    return form.get(field).invalid && (form.get(field).dirty || form.get(field).touched || submitted)
  }
}
