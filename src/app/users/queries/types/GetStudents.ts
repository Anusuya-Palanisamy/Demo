/* eslint-disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStudents
// ====================================================

export interface GetStudents_students_organization {
    __typename: "Organization";
    organizationId: string;
    name: string | null;
}

export interface GetStudents_students_enrollment_user {
    __typename: "User";
    firstName: string;
    lastName: string;
    userStatus: string;
}

export interface GetStudents_students_enrollment {
    __typename: "Enrollment";
    userId: string;
    user: GetStudents_students_enrollment_user | null;
}

export interface GetStudents_students_section {
    __typename: "Section";
    sectionId: string | null;
    sectionName: string | null;
}

export interface GetStudents_students {
    __typename: "ProductEnrollment";
    organization: GetStudents_students_organization | null;
    enrollment: GetStudents_students_enrollment | null;
    section: GetStudents_students_section[] | null;
}

export interface GetStudents {
    students: GetStudents_students[];
}

export interface GetStudentsVariables {
    orgIds: string[];
    productId: string;
    limit: number;
    offset: number;
    userIds?: string[] | null;
}
