export enum UserRole {
    Unknown = '',
    Student = 'Student',
    Teacher = 'Teacher',
    CustomerAdmin = 'Customer Admin',
    PearsonAdmin = 'Pearson Admin',
    SalesRep = 'Sales Rep'
}

export const AllowedRoles: string[] = [
    UserRole.CustomerAdmin,
    UserRole.PearsonAdmin,
    UserRole.SalesRep
];
