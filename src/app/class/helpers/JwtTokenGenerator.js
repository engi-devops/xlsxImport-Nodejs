import jwt from 'jsonwebtoken'
import config from '../../../config/config'

class JwtTokenGenerator {
    static createToken(_id, email, adminOrUser) {
        var secreteKey = config.JWTSecret;
        return "JWT " + jwt.sign({
            _id: _id,
            email: email,
            adminOrUser: adminOrUser
        }, secreteKey, {
            expiresIn: config.JWTExpireTime
        });
    }
}
module.exports = JwtTokenGenerator;