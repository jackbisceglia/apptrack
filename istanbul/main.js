const { pool } = require("./db");

const getAllFromTable = async (tableName, num) => {
  let query = `SELECT * FROM ${tableName}`;
  if (num) {
    query += ` ORDER BY "createdAt" LIMIT ${num};`;
  }
  const res = await pool.query(query);
  return pool.end().then(() => res.rows);
};

const HELP_MENU = `
The following args are accepted:
    -h -> Help Menu
    <tableName: required> -> Name of Table to pull from
    <numItems: optional> -> Number of Items to return (ordered by date created)
    <filterBy: optional> -> Accepts: boolean (T/F) for isIntern column on postings, or string ("INTERN", "NEWGRAD", "BOTH") for preferenceList column on users
`;

const main = async () => {
  if (process.argv[2] == "-h") {
    return console.log(HELP_MENU);
  }

  const arr = process.argv.slice(2);
  const table = arr[0];
  const numItems = arr[1];

  //   if (["true", "false", "INTERN", "NEWGRAD", "BOTH"].includes(arr[1])) {
  //     const orderBy = arr[1];
  //     const numItems = undefined;
  //   } else {
  //     const numItems = arr[1];
  //     const orderBy = arr.length > 2 ? arr[2] : undefined;
  //   }

  if (!["users", "postings"].includes(table)) {
    return console.log(
      "Invalid table name entered. We currently only have: 'users', and 'postings'"
    );
  }

  let res = await getAllFromTable(table, numItems);
  console.log(res);
  return;
};

main();
