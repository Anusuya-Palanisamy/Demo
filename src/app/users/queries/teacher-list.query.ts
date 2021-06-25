import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { GetTeachers, GetTeachersVariables } from './types/GetTeachers';

@Injectable({ providedIn: 'root' })
export class TeacherListGQL extends Query<GetTeachers, GetTeachersVariables> {
    document = gql`query GetTeachers($orgIds: [String!]!, $productId: String!, $limit: Float!, $offset: Float!, $userIds: [String!]){
    teachers(productId:$productId,userRequestFilter:{limit:$limit,offset:$offset,
        orgIds:$orgIds,userIds:$userIds} ){
            organization {
                organizationId
                name
            }
            enrollment{
                userId
                user{
                    firstName
                    lastName
                    userStatus
                }
            }
            section{
                sectionId
                sectionName
            }
        }
    }`;
}
