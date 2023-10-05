import { Router } from "express";
import { getRestaurants } from "../controllers/restaurant.controller";

const router = Router();

router.get("/", getRestaurants);
router.get("/roles", getRoles);
router.get("/login", login);
router.get("/:id", getUser);
router.post("/", register);
router.patch("/", updateUser);
router.delete("/:id", deleteUser);

export default router;
