/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  // Create the sequence if it does not exist
  await knex.raw("CREATE SEQUENCE IF NOT EXISTS users_id_seq;");

  return knex.schema.createTable("users", (table) => {
    table
      .increments("id")
      .primary()
      .notNullable()
      .defaultTo(knex.raw("nextval('users_id_seq')")); // Use increments for auto-incrementing ID with sequence
    table.string("name", 100).notNullable(); // Add name column
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now()); // Add createdAt timestamp
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now()); // Add updatedAt timestamp
  });
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("users");
};
