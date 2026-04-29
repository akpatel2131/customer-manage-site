// routes/customerRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  addCustomer,
  getCustomers,
  deleteCustomer
} = require("../controllers/customerController");

router.post("/", auth, addCustomer);
router.get("/", auth, getCustomers);
router.delete("/:id", auth, deleteCustomer);

module.exports = router;