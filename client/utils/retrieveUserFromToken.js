import jwt from 'jsonwebtoken';

export const retrieveUserFromToken = token => {
    return jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            return err;
        } else {
            if (decoded) {
                const { username, id, roleId } = decoded;
                return { username, id, roleId };
            }
        }
    });
};
