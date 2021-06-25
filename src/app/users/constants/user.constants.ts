import { DatePipe } from '@angular/common';

export const UserConstants = {
    CHAR_COMMA: ',',
    CHAR_COMMA_SPACE: ', ',
    ORG_ID: 'orgId',
    SPACE: ' ',
    SEPARATOR: ' | ',
    PRODUCT_ID: 'productId',
    EMPTY: '',

    // boolean
    TRUE: true,
    FALSE: false,

    // numbers
    ZERO: 0,
    ONE: 1,

    UER_TYPE: 'userType',
    USER_TYPE_TEACHER: 't',
    USER_TYPE_STUDENT: 's',
    PAGE_SIZE: 50,
    exportProductOptions: ['Export All', 'Export Filtered'],
    studentExportFileHeaders: ['Student Name', 'Organization', 'Class Name'],
    teacherExportFileHeaders: ['Teacher Name', 'Organization', 'Class Name'],
    charHyphen: '-',
    exported: 'export-',
    students: 'students-',
    teachers: 'teachers-',
    dateToday: new DatePipe('en-US').transform(new Date(), 'MMddyyyy'),
    EXPORT_ALL: 'Export All',
    DATASOURCE_ERROR: 'Provided data source is not valid',
    MAX_LENGTH: 5000
};
