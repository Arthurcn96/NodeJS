import { Router } from 'express';
import { SendMailController } from './controllers/SendMailController';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();

//  Users Routes
router.post("/users", userController.create);

// Survey Routes
router.post("/survey", surveyController.create);
router.get("/survey", surveyController.show);

router.post("/sendMail", sendMailController.execute);

export{ router } ;