import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TelemetryConfigService } from './telemetry-config.service';


@NgModule({
    imports: [CommonModule],
    declarations: [],
    providers: [TelemetryConfigService]
})
export class TelemetryModule {}
