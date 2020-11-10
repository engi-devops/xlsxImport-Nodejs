import {
    Router
} from 'express';
import userController from '../controllers/user.controller';
import jwtValidator from '../../middlewares/jwtValidation';

const router = Router();

router.post('/createAdminOrUser', userController.createAdminOrUser);
router.post('/login', userController.login);
router.get('/allUserList', userController.allUserList);


router.post('/importExlSheet', jwtValidator.jwtValidationForImportElxsheet, userController.importExlSheet);

module.exports = router;