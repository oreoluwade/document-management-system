export default {
    isAuthenticated: false,
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
    }
};
