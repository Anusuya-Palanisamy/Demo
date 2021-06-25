import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import {
    TranslateLoader,
    TranslateModule,
    TranslateService
} from '@ngx-translate/core';
import { CustomTranslateLoader } from '../translate/custom-translate-loader';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: CustomTranslateLoader
            }
        })
    ],
    exports: [TranslateModule]
})
export class TestingModule {
    constructor(translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }
}
