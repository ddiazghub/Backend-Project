import { Router } from "express";
import {
  deleteUser,
  getRoles,
  getUser,
  getUsers,
  login,
  register,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/roles", getRoles);
router.get("/login", login);
router.get("/:id", getUser);
router.post("/", register);
router.patch("/", updateUser);
router.delete("/:id", deleteUser);

export default router;
