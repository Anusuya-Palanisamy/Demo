import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { NgModule } from '@angular/core';
import { LstUserService, LstAuthService } from '@lst/lst-auth';
import { environment } from '../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { PostMessagesService } from 'src/app/users/services/post-messaging.service';


/* eslint-disable  @typescript-eslint/restrict-template-expressions */
/* User service returns rbsToken of type 'any' and it cannot be used along with the template expression */
@NgModule({
    exports: [
        HttpClientModule
    ]
})
export class GraphQLModule {
    constructor(
        private apollo: Apollo,
        private httpLink: HttpLink,
        private router: Router,
        private lstUserService: LstUserService,
        private lstAuthService: LstAuthService,
        private readonly postMessageService: PostMessagesService
    ) {
        this.apollo.create({
            link: from([this.authMiddleware(), this.errorAfterware(), this.http()]),
            cache: new InMemoryCache(),
            defaultOptions: {
                watchQuery: { errorPolicy: 'all' },
                mutate: { errorPolicy: 'all' },
                query: { errorPolicy: 'all' }
            }
        });
    }

    private authMiddleware(): ApolloLink {
        return setContext((_, { headers }) => {
            // get the rbs token from session storage if it exists
            const rbsToken = this.lstUserService.getRbsToken();
            // return the headers to the context so httpLink can read them
            return {
                headers: {
                    ...headers,
                    authorization: rbsToken ? `Bearer ${rbsToken}` : '',
                    'Access-Control-Allow-Origin': '*'
                }
            };
        });
    }

    private http(): ApolloLink {
        const uri = environment.aggregationUrl;
        return this.httpLink.create({ uri });
    }

    private errorAfterware(): ApolloLink {
        return onError(({ graphQLErrors }) => {
            if (graphQLErrors && graphQLErrors.some(err => err.extensions.code === 'UNAUTHENTICATED')) {
                if (this.postMessageService.parentConn$) {
                    this.postMessageService.parentConn$.sendMessage('SESSION_TIMEOUT');
                }
            }
        });
    }
}
