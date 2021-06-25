import { User } from '../datasource/user-list.datasource';

export const MOCK_USER_DATA: User[] = [{
    userName: 'teststudentjun11, teststudentjun11',
    organizationName: 'A7ND1BasicSchool1',
    className: '10a1f1ba498044ce9b7b976a761a06d2',
    userStatus: 'A'
}];

const ENROLLMENT = {
    'userId': 'ffffffff5ee22ac6c96ff70033733b41',
    'user': {
        'firstName': 'teststudentjun11',
        'lastName': 'teststudentjun11',
        'userStatus': 'A',
        '__typename': 'User'
    },
    '__typename': 'Enrollment'
};

const DELETED_ENROLLMENT = {
    'userId': 'ffffffff5ee22ac6c96ff70033733b41',
    'user': null,
    '__typename': 'Enrollment'
};

const SECTIONS = [
    {
        'sectionId': '10a1f1ba498044ce9b7b976a761a06d2',
        'sectionName': 'Btest'
    }
];

const ORGANIZATION = {
    'organizationId': '8a97b1ce692b37e40169a412a1961836',
    'name': 'A7ND1BasicSchool1'
};

const MOCK_ENROLLMENT = {
    'organization': ORGANIZATION,
    'enrollment': ENROLLMENT,
    'section': SECTIONS
};

export const MOCK_STUDENT_DATA_RESPONSE = {
    'data': {
        'students': [MOCK_ENROLLMENT]
    }
};

export const MOCK_TEACHER_DATA_RESPONSE = {
    'data': {
        'teachers': [{
            'organization': ORGANIZATION,
            'enrollment': ENROLLMENT,
            'section': SECTIONS
        },
        {
            'organization': ORGANIZATION,
            'enrollment': DELETED_ENROLLMENT,
            'section': SECTIONS
        }]
    }
};

export const MOCK_EXPORT_USERS = {
    'data': {
        'exportUsers': [{
            'organization': ORGANIZATION,
            'enrollment': ENROLLMENT,
            'section': SECTIONS
        }]
    }
};

export const MOCK_USER_SEARCH_RESPONSE = {
    'data': {
        'users': {
            'users': [{
                userId: 'ffffffff5ee22ac6c96ff70033733b41',
                firstName: 'teststudentjun11',
                lastName: 'teststudentjun11'
            }]
        }
    }
};

export const MOCK_ERROR_RESPONSE = {
    'error': {
        'message': 'Error'
    }
};
