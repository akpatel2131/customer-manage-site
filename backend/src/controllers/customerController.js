const { readDb, writeDb } = require("../data/dbStore");

exports.addCustomer = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const db = await readDb();
    const newCustomer = {
      id: Date.now(),
      name,
      email,
      phone,
    };

    db.customers.push(newCustomer);
    await writeDb(db);

    res.json(newCustomer);
  } catch {
    res.status(500).json({ msg: "Unable to save customer" });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const db = await readDb();
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = 10;
    const totalItems = db.customers.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;
    const items = db.customers.slice(startIndex, startIndex + limit);

    const summary = {
      totalCustomers: totalItems,
      emailReady: db.customers.filter((customer) => customer.email.trim()).length,
      phoneReady: db.customers.filter((customer) => customer.phone.trim()).length,
    };

    res.json({
      items,
      pagination: {
        page: currentPage,
        limit,
        totalItems,
        totalPages,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
      summary,
    });
  } catch {
    res.status(500).json({ msg: "Unable to load customers" });
  }
};

exports.deleteCustomer = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const db = await readDb();
    const index = db.customers.findIndex((customer) => customer.id === id);

    if (index === -1) {
      return res.status(404).json({ msg: "Not found" });
    }

    db.customers.splice(index, 1);
    await writeDb(db);

    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Unable to delete customer" });
  }
};
