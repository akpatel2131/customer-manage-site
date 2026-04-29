const fs = require("fs/promises");
const path = require("path");

const dbFilePath = path.join(__dirname, "db.js");

function serializeDb(data) {
  return `// data/db.js
const users = ${JSON.stringify(data.users, null, 2)};
const customers = ${JSON.stringify(data.customers, null, 2)};

module.exports = { users, customers };
`;
}

async function readDb() {
  delete require.cache[require.resolve("./db")];
  const db = require("./db");

  return {
    users: Array.isArray(db.users) ? db.users : [],
    customers: Array.isArray(db.customers) ? db.customers : [],
  };
}

async function writeDb(data) {
  const normalizedData = {
    users: Array.isArray(data.users) ? data.users : [],
    customers: Array.isArray(data.customers) ? data.customers : [],
  };

  await fs.writeFile(dbFilePath, serializeDb(normalizedData), "utf8");
}

module.exports = {
  readDb,
  writeDb,
};
