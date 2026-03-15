import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import UserController from '../controllers/user.controller.js';

const router = express.Router();

router.post("/register", UserController.create);
router.post("/login", UserController.login);

router.route("/")
    .post(UserController.create)
    .get(auth, UserController.findAll)
    .delete(auth, UserController.deleteAll)

router.route("/:id")
    .get(auth, UserController.findOne)
    .put(auth, UserController.update)
    .delete(auth, UserController.deleteOne)

export default router;