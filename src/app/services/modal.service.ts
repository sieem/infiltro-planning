import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = [];

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id?: string) {
    if (!id) {
      throw new Error(`Couldn't remove modal, since id is undefined`)
    }
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id?: string) {
    if (!id) {
      throw new Error(`Couldn't remove modal, since id is undefined`)
    }
    let modal: any = this.modals.filter(x => x.id === id)[0];
    modal.open();
  }

  close(id?: string) {
    if (!id) {
      throw new Error(`Couldn't remove modal, since id is undefined`)
    }
    let modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }
}
