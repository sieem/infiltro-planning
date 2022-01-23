import { Component, ElementRef, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from '../services/modal.service';

@Component({
    selector: 'infiltro-modal',
    template:
        `
    <div class="infiltro-modal">
      <div class="infiltro-modal-body">
        <ng-content></ng-content>
      </div>
    </div>
    <div class="infiltro-modal-background"></div>`
})

export class ModalDirective implements OnInit, OnDestroy {
    @Input() id: string | undefined;
    private element: any;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    @Output() hasClosed = new EventEmitter<any>();

    ngOnInit(): void {
        let modal = this;

        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click', function (e: any) {
            if (e.target.className === 'infiltro-modal') {
                modal.close();
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
    }

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('infiltro-modal-open');
    }

    // close modal
    close(): void {
        this.hasClosed.emit();
        this.element.style.display = 'none';
        document.body.classList.remove('infiltro-modal-open');
    }
}
