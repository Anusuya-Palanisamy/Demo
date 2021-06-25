import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { GetStudents, GetStudentsVariables } from './types/GetStudents';

@Injectable({ providedIn: 'root' })
export class StudentListGQL extends Query<GetStudents, GetStudentsVariables> {
    document = gql`query GetStudents($orgIds: [String!]!, $productId: String!, $limit: Float!, $offset: Float!, $userIds: [String!]){
    students(productId:$productId,userRequestFilter:{limit:$limit,offset:$offset,
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
