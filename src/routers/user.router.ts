import config from "../config";
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
import { hashPassword } from "../middleware";

const router = Router();

router.get("/", getUsers);
router.get("/roles", getRoles);
router.get("/login", login);
router.get("/:id", getUser);
router.post("/", hashPassword, register);
router.patch("/", hashPassword, updateUser);
router.delete("/:id", deleteUser);

export default router;
