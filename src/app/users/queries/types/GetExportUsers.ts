/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetExportUsers
// ====================================================

export interface GetExportUsers_exportUsers_organization {
    __typename: "Organization";
    organizationId: string;
    name: string | null;
}

export interface GetExportUsers_exportUsers_enrollment_user {
    __typename: "User";
    firstName: string;
    lastName: string;
    userStatus: string;
}

export interface GetExportUsers_exportUsers_enrollment {
    __typename: "Enrollment";
    userId: string;
    user: GetExportUsers_exportUsers_enrollment_user | null;
}

export interface GetExportUsers_exportUsers_section {
    __typename: "Section";
    sectionId: string | null;
    sectionName: string | null;
}

export interface GetExportUsers_exportUsers {
    __typename: "ProductEnrollment";
    organization: GetExportUsers_exportUsers_organization | null;
    enrollment: GetExportUsers_exportUsers_enrollment | null;
    section: GetExportUsers_exportUsers_section[] | null;
}

export interface GetExportUsers {
    exportUsers: GetExportUsers_exportUsers[];
}

export interface GetExportUsersVariables {
    orgIds: string[];
    productId: string;
    limit: number;
    offset: number;
    userType: string;
    totalCount: number;
    userIds?: string[] | null;
}
