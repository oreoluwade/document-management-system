export default {
    auth: {
        isAuthenticated: false
    },
    user: {
        details: {
            id: '',
            roleId: '',
            username: '',
            Documents: []
        },
        documents: [],
        selectedDocument: {}
    },
    admin: {
        users: [],
        documents: [],
        roles: []
    },
    documents: []
};
