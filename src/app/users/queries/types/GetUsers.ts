/* eslint-disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUsers
// ====================================================

export interface GetUsers_users_users {
    __typename: "User";
    userId: string;
    firstName: string;
    lastName: string;
    userStatus: string;
    createdDate: string;
    organizationName: string[] | null;
    organizationId: string[] | null;
    orgRole: string[] | null;
    emailAddress: string[] | null;
    affiliationStatus: string[] | null;
    affiliationType: string[] | null;
}

export interface GetUsers_users {
    __typename: "UserSearchResult";
    users: GetUsers_users_users[] | null;
    totalCount: number;
}

export interface GetUsers {
    users: GetUsers_users;
}

export interface GetUsersVariables {
    orgIds: string[];
    userType: string;
    searchText: string[];
    limit: number;
    offset: number;
}
