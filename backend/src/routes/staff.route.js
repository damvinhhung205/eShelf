import express from "express";
import auth from "../middlewares/auth.middleware.js";
import staffController from "../controllers/staff.controller.js";

const router = express.Router();

router.post("/register", staffController.create);
router.post("/login", staffController.login);

router.route("/")
    .post(staffController.create)
    .get(auth, staffController.findAll)
    .delete(auth, staffController.deleteAll);

router.route("/:id")
    .get(auth, staffController.findOne)
    .put(auth, staffController.update)
    .delete(auth, staffController.deleteOne);

export default router;