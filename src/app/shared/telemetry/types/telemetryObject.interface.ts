export interface ITelemetryObject {
    extensions: {
        area: string;
        page: string;
        description?: string;
        value?: string | number;
        [key: string]: string | number | Record<string, unknown>;
    };
    definition: {
        name: string;
    };
}
