import * as jwt from 'jsonwebtoken';

const Jwt = {
    generateTokenForUser(userData: { id: String }): String {
        return jwt.sign({
            userId: userData.id
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TTL
        });
    },
    getAuthToken(authorisation: String): String | null {
        return (authorisation != null) ? authorisation.split(' ')[1] : null;
    },
    getAuthUserId(authorisation: String): any {
        let userId = null;
        let token = this.getAuthToken(authorisation);
        if (token) {
            try {
                let jwt_token = jwt.verify(token, process.env.JWT_SECRET);
                if (jwt_token) {
                    userId = jwt_token.userId;
                }
            } catch (error) {
                throw error;
            }
        }
        return userId;
    }
}

export default Jwt;