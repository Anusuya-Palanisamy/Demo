import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { GetUsers, GetUsersVariables } from './types/GetUsers';

@Injectable({ providedIn: 'root' })
export class UserSearchGQL extends Query<GetUsers, GetUsersVariables> {
    document = gql`query GetUsers($orgIds: [String!]!, $userType: String!, $searchText: [String!]!, $limit: Float!, $offset: Float!){
    users(orgIds:$orgIds,userType:$userType,searchText:$searchText,limit:$limit,offset:$offset) {
            users{
                userId,
                firstName,
                lastName,
                userStatus,
                createdDate,
                organizationName,
                organizationId,
                orgRole,
                emailAddress,
                affiliationStatus,
                affiliationType,
                emailAddress
            }
            totalCount
        }
    }`;
}
