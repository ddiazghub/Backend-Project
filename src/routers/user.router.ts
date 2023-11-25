import config from "../config";
import { Router } from "express";

import {
  deleteUser,
  getRoles,
  getUser,
  getUsers,
  login,
  mfaAuth,
  register,
  updateUser,
} from "../controllers/user.controller";
import { authByKey, authenticate, hashPassword } from "../middleware";
import { User } from "../models/user.model";

const router = Router();
const authorize = authByKey(User, "_id");

router.get("/", getUsers);
router.get("/roles", getRoles);
router.get("/login", login);
router.get("/:id", getUser);
router.post("/", hashPassword, register);
router.post("/auth", mfaAuth);
router.patch("/", authenticate, authorize.update, hashPassword, updateUser);
router.delete("/:id", authenticate, authorize.delete, deleteUser);

export default router;
