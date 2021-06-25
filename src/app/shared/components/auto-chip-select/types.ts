import { Observable } from 'rxjs';

export interface Suggestion {
    id: string;
    suggestionViewValue: string;
}

export interface PagedResults<T> {
    total: number;
    start: number;
    end: number;
    items: T[];
}

export interface FilteredListRange {
    start: number;
    end: number;
    limit: number;
    total?: number;
    search?: string;
}

export interface FilteredCollectionViewer {
    viewChange: Observable<FilteredListRange>;
}

export interface AutoCompleteSelectDataSource<T> {
    loading$: Observable<boolean>;
    minSearchLength: number;

    connect(
        collectionViewer: FilteredCollectionViewer
    ): Observable<PagedResults<T & Suggestion>>;

    disconnect(collectionViewer: FilteredCollectionViewer): void;
}
