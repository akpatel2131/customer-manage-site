const { customers } = require("../data/db");

exports.addCustomer = (req, res) => {
  const { name, email, phone } = req.body;

  const newCustomer = {
    id: Date.now(),
    name,
    email,
    phone
  };

  customers.push(newCustomer);
  res.json(newCustomer);
};

exports.getCustomers = (req, res) => {
  res.json(customers);
};

exports.deleteCustomer = (req, res) => {
  const id = Number(req.params.id);
  const index = customers.findIndex(c => c.id === id);

  if (index === -1) return res.status(404).json({ msg: "Not found" });

  customers.splice(index, 1);
  res.json({ msg: "Deleted" });
};