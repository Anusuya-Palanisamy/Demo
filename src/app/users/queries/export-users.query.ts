import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { GetExportUsers, GetExportUsersVariables } from './types/GetExportUsers';

@Injectable({ providedIn: 'root' })
export class ExportUsersGQL extends Query<GetExportUsers, GetExportUsersVariables> {
    document = gql`query GetExportUsers($orgIds: [String!]!, $productId: String!, $limit: Float!, $offset: Float!,
        $userType: String!, $totalCount: Float!, $userIds: [String!]){
        exportUsers(productId:$productId,userRequestFilter:{limit:$limit,offset:$offset,
            orgIds:$orgIds, userIds:$userIds}, totalCount:$totalCount,userType:$userType){
            organization {
                organizationId,
                name
            }
            enrollment{userId,
                user{
                    firstName,
                    lastName,
                    userStatus
                }
            }
            section{
                sectionId,
                sectionName
            }
        }
    }`;
}
