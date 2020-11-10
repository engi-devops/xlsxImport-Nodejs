import JWT from 'jsonwebtoken';
import Message from '../config/message';
import config from '../config/config'
import userModel from '../app/models/user.model'

exports.jwtValidationForImportElxsheet = (req, res, next) => {
    const exe = req.headers.authorization.split(' ');
    if (!exe) {
        res.status(403).send({
            code: 403,
            message: Message.errorMessage.tokenNotFoundOrExpire,
            data: [],
            err: []
        });
    } else {
        JWT.verify(exe[1], config.JWTSecret, (err, result) => {
            if (err) {
                // console.log('err :>> ', err);
                res.status(401).send({
                    code: 401,
                    message: Message.errorMessage.tokenNotFoundOrExpire,
                    data: [],
                    err: []
                });
            } else {
                // console.log('result :>> ', result);
                if (result && result._id)
                    userModel.findById({
                        "_id": result._id
                    }).then(async userModel => {
                        if (userModel.adminOrUser != 0) {
                            res.status(404).send({
                                code: 404,
                                message: Message.errorMessage.adminTokenNotFound,
                                data: [],
                                err: []
                            });
                        } else {
                            next();
                        }
                    })
            }
        })
    }
}