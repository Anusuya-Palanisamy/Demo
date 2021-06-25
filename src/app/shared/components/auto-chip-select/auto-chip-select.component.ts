import { SelectionModel, isDataSource } from '@angular/cdk/collections';
import { NgForOfContext } from '@angular/common';
import {
    AfterViewChecked, ChangeDetectorRef, Component, ContentChild,
    ElementRef, EventEmitter, Input, OnInit,
    Output, TemplateRef, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, Subject, Subscription, Observable } from 'rxjs';
import { AutoCompleteSelectDataSource, FilteredCollectionViewer, FilteredListRange, PagedResults } from './types';
import { ENTER } from '@angular/cdk/keycodes';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { UserConstants } from 'src/app/users/constants/user.constants';

@Component({
    selector: 'auto-chip-select',
    templateUrl: './auto-chip-select.component.html',
    styleUrls: ['./auto-chip-select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AutoChipSelectComponent<T> implements OnInit, FilteredCollectionViewer,
    AfterViewChecked {
    @Input()
    recordsPerPage = 100;

    @Input()
    minSearchLength = 2;

    @Input()
    inputDelay = 300;

    @Input()
    placeholder = 'Start typing to select values...';

    @Output()
    selectionChanged = new EventEmitter();

    @Output()
    clear = new EventEmitter();

    @Output()
    selectionRemoved = new EventEmitter();

    @Input()
    get dataSource(): AutoCompleteSelectDataSource<T> {
        return this._dataSource;
    }
    set dataSource(dataSource: AutoCompleteSelectDataSource<T>) {
        if (this._dataSource !== dataSource) {
            this._switchDataSource(dataSource);
        }
    }
    get selected(): T[] {
        return this.selectedValues.selected;
    }
    @ViewChild('autoCompleteInput', { static: false }) autoCompleteInput: ElementRef<HTMLInputElement>;

    /** Subject that emits when the component has been destroyed. */
    private _onDestroy = new Subject<void>();

    /** Subscription that listens for the data provided by the data source. */
    private _renderChangeSubscription: Subscription | null;
    addOnBlur = true;
    inputControl = new FormControl();

    separatorKeysCodes = [ENTER];
    private _dataSource: AutoCompleteSelectDataSource<T>;
    private _allSuggestions: T[] = [];
    private _filteredSuggestions: T[] = [];

    viewChange: BehaviorSubject<FilteredListRange> = new BehaviorSubject<
        FilteredListRange
    >({ start: 0, end: 0, limit: this.recordsPerPage });

    suggestions: BehaviorSubject<T[] | ReadonlyArray<T>> = new BehaviorSubject<
        T[] | ReadonlyArray<T>
    >([]);

    @ViewChild('auto', { static: false })
    autoComplete: MatAutocomplete;

    private currentView: FilteredListRange = {
        start: 0,
        end: 0,
        limit: this.recordsPerPage,
        total: 0,
        search: UserConstants.EMPTY
    };

    loading$: Subject<boolean> = new Subject<boolean>();

    selectedValues: SelectionModel<T> = new SelectionModel<T>(true);

    @ContentChild(TemplateRef, { static: true })
    optionTemplate: TemplateRef<NgForOfContext<T>>;

    isDisabled = false;

    private _switchDataSource(source: AutoCompleteSelectDataSource<T>): void {
        this.resetSuggestions();

        this.selectedValues.clear();

        if (isDataSource(this.dataSource)) {
            this.dataSource.disconnect(this);
        }

        // Stop listening for data from the previous data source.
        if (this._renderChangeSubscription) {
            this._renderChangeSubscription.unsubscribe();
            this._renderChangeSubscription = null;
        }

        this._dataSource = source;
    }

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.inputControl.valueChanges
            .pipe(
                takeUntil(this._onDestroy),
                filter(value => typeof value === 'string'),
                tap((value: string) => {
                    if (value.trim().length !== 0) {
                        this.resetSuggestions();
                    }
                }),
                filter((value: string) => value.trim().length >= this.minSearchLength),
                debounceTime(this.inputDelay)
            )
            .subscribe(inputValue => {
                this.requestSuggestions(inputValue);
            });
    }

    chipInputEnd(): void {
        this.autoCompleteInput.nativeElement.value = UserConstants.EMPTY;
    }

    onScroll(): void {
        this.requestSuggestions(this.currentView.search, this.currentView.end);
    }

    private resetSuggestions(): void {
        this.currentView.limit = this.recordsPerPage;
        this.currentView.start = 0;
        this.currentView.end = 0;
        this.currentView.total = 0;
        this._allSuggestions = [];
        this._filteredSuggestions = [];
        this.suggestions.next([]);
    }

    deselect(value: T): void {
        this.selectedValues.deselect(value);
        this.selectionRemoved.emit(value);
        this.requestSuggestions();
    }


    private requestSuggestions(search?: string, start = 0): void {
        if (
            search &&
            (!this.currentView.search || this.currentView.search !== search)
        ) {
            this.currentView.search = search;
            this.resetSuggestions();
        }
        this.currentView.start = start;
        if (
            this.currentView.end === 0 ||
            this.currentView.end !== this.currentView.total
        ) {
            this.viewChange.next(this.currentView);
        }
    }

    /** Set up a subscription for the data provided by the data source. */
    private _observeRenderChanges(): void {
        // If no data source has been set, there is nothing to observe for changes.
        if (!this.dataSource) {
            return;
        }

        let dataStream: Observable<PagedResults<T>> | undefined;

        if (isDataSource(this.dataSource)) {
            dataStream = this.dataSource.connect(this);
            this.dataSource.loading$
                .pipe(takeUntil(this._onDestroy))
                .subscribe(isLoading => {
                    this.loading$.next(isLoading);
                });
        }

        if (dataStream === undefined) {
            throw Error(UserConstants.DATASOURCE_ERROR);
        }

        this._renderChangeSubscription = dataStream
            .pipe(takeUntil(this._onDestroy))
            .subscribe(data => {
                this.currentView.start = data.start;
                this.currentView.end = data.end;
                this.currentView.total = data.total;
                this._allSuggestions.push(...data.items);
                // filter out any selections
                this._filterSuggestions();

                this.suggestions.next(this._filteredSuggestions);
                this.autoComplete.opened.emit();
            });
    }

    private _filterSuggestions(): void {
        this._filteredSuggestions = this._allSuggestions.filter(
            suggestion =>
                !this.selected
                    .map(item => JSON.stringify(item))
                    .includes(JSON.stringify(suggestion))
        );
    }

    ngAfterViewChecked(): void {
        // If there is a data source and row definitions, connect to the data source unless a
        // connection has already been made.
        if (this.dataSource && !this._renderChangeSubscription) {
            this._observeRenderChanges();
        }
        this.changeDetectorRef.detectChanges();
    }

    doClear(): void {
        this.selectedValues.clear();
        this.resetSuggestions();
        this.clear.emit();
    }

    optionSelected({ option }:  MatAutocompleteSelectedEvent): void {
        this.selectedValues.select(option.value);
        this.inputControl.reset(null);
        this.autoCompleteInput.nativeElement.value = UserConstants.EMPTY;
        this.selectionChanged.emit(option.value.id);
        this.resetSuggestions();
    }
}
