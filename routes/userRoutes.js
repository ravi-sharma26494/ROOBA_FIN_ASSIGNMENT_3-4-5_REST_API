const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  aggregateUserData,
} = require("../controllers/userController");
const router = express.Router();

router.post("/user", createUser);
router.get("/users", getAllUsers);

router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);

router.get("/aggregateUserData", aggregateUserData);

module.exports = router;
