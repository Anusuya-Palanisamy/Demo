import {
    Directive,
    EventEmitter,
    Input,
    OnDestroy,
    Output
} from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export interface IAutoCompleteScrollEvent {
    autoComplete: MatAutocomplete;
    scrollEvent: Event;
}

@Directive({
    selector: 'mat-autocomplete[optionsScroll]'
})
export class OptionsScrollDirective implements OnDestroy {
    @Input() thresholdPercent = 0.99;
    @Output() optionsScroll = new EventEmitter<IAutoCompleteScrollEvent>();
    _onDestroy = new Subject();

    constructor(public autoComplete: MatAutocomplete) {
        this.autoComplete.opened
            .pipe(
                tap(() => {
                    // Note: When autocomplete raises opened, panel is not yet created (by Overlay)
                    // Note: The panel will be available on next tick
                    // Note: The panel wil NOT open if there are no options to display
                    setTimeout(() => {
                        if (!this.autoComplete.panel) {
                            return;
                        }
                        // Note: remove listner just for safety, in case the close event is skipped.
                        this.removeScrollEventListener();
                        this.autoComplete.panel.nativeElement.addEventListener(
                            'scroll',
                            this.onScroll.bind(this)
                        );
                    });
                }),
                takeUntil(this._onDestroy)
            )
            .subscribe();

        this.autoComplete.closed
            .pipe(
                tap(() => this.removeScrollEventListener()),
                takeUntil(this._onDestroy)
            )
            .subscribe();
    }

    private removeScrollEventListener(): void {
        if (this.autoComplete.panel) {
            this.autoComplete.panel.nativeElement.removeEventListener(
                'scroll',
                this.onScroll
            );
        }
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();

        this.removeScrollEventListener();
    }

    onScroll = (event: Event): void => {
        if (this.thresholdPercent === undefined) {
            this.optionsScroll.next({
                autoComplete: this.autoComplete,
                scrollEvent: event
            });
        } else {
            const threshold =
                (this.thresholdPercent *
                    100 *
                    this.autoComplete.panel.nativeElement.scrollHeight) /
                100;
            /* Disabled the below rule as the return type of native element of auto complete element is 'any'
               and cannot be used with '+' operator */               
            /* eslint-disable @typescript-eslint/restrict-plus-operands */ 
            const current =
                this.autoComplete.panel.nativeElement.scrollTop +
                this.autoComplete.panel.nativeElement.clientHeight;

            if (current > threshold) {
                this.optionsScroll.next({
                    autoComplete: this.autoComplete,
                    scrollEvent: event
                });
            }
        }
    }
}
