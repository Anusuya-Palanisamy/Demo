/* eslint-disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTeachers
// ====================================================

export interface GetTeachers_teachers_organization {
    __typename: "Organization";
    organizationId: string;
    name: string | null;
}

export interface GetTeachers_teachers_enrollment_user {
    __typename: "User";
    firstName: string;
    lastName: string;
    userStatus: string;
}

export interface GetTeachers_teachers_enrollment {
    __typename: "Enrollment";
    userId: string;
    user: GetTeachers_teachers_enrollment_user | null;
}

export interface GetTeachers_teachers_section {
    __typename: "Section";
    sectionId: string | null;
    sectionName: string | null;
}

export interface GetTeachers_teachers {
    __typename: "ProductEnrollment";
    organization: GetTeachers_teachers_organization | null;
    enrollment: GetTeachers_teachers_enrollment | null;
    section: GetTeachers_teachers_section[] | null;
}

export interface GetTeachers {
    teachers: GetTeachers_teachers[];
}

export interface GetTeachersVariables {
    orgIds: string[];
    productId: string;
    limit: number;
    offset: number;
    userIds?: string[] | null;
}
