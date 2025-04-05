/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("session", (table) => {
    table.string("sid").notNullable();
    table.json("sess").notNullable();
    table.timestamp("expire", { precision: 6 }).notNullable();
    table.primary(["sid"]); // Set primary key
  });
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("session");
};
