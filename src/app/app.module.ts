import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LstAuthModule } from '@lst/lst-auth';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { lstAuthModuleOptions } from './app.constants';
import { KeepAliveService } from './auth/keepAlive.service';
import { CoreModule } from './core/core.module';
import { GraphQLModule } from './core/graphql/graphql.module';
import { CustomTranslateLoader } from './shared/translate/custom-translate-loader';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        AppRoutingModule,
        GraphQLModule,
        HttpClientModule,
        LstAuthModule.forRoot(lstAuthModuleOptions),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: CustomTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        KeepAliveService,
        Apollo,
        DatePipe
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
