import userClass from '../class/user';
import JWT from 'jsonwebtoken';
import config from '../../config/config'

exports.createAdminOrUser = async (req, res) => {
    try {
        var user = new userClass(req.body);
        user.createAdminOrUser((success) => {
            res.status(success.code).send(success);
        }, (error) => {
            res.status(error.code).send(error);
        });
    } catch (err) {
        console.log("err:-", err)
        res.status(status_codes.INTERNAL_SERVER_ERROR).send(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.genericError, [], err));
    }
}

exports.login = async (req, res) => {
    try {
        var user = new userClass(req.body);
        user.login((success) => {
            res.status(success.code).send(success);
        }, (error) => {
            res.status(error.code).send(error);
        });
    } catch (err) {
        console.log("err:-", err)
        res.status(status_codes.INTERNAL_SERVER_ERROR).send(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.genericError, [], err));
    }
}

exports.importExlSheet = async (req, res) => {
    try {
        // console.log('req :>> ', req);
        // return
        var user = new userClass(req.body);
        user.importExlSheet((success) => {
            res.status(success.code).send(success);
        }, (error) => {
            res.status(error.code).send(error);
        });
    } catch (err) {
        // console.log("err:-", err)
        res.status(status_codes.INTERNAL_SERVER_ERROR).send(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.genericError, [], err));
    }
}

exports.allUserList = async (req, res) => {
    try {

        var user = new userClass(req.body);

        user.allUserList((success) => {
            res.status(success.code).send(success);
        }, (error) => {
            res.status(error.code).send(error);
        });
    } catch (err) {
        console.log("err:-", err)
        res.status(status_codes.INTERNAL_SERVER_ERROR).send(Response.sendResponse(status_codes.INTERNAL_SERVER_ERROR, custom_message.errorMessage.genericError, [], err));
    }
}



