/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("federated_credentials", (table) => {
    table.integer("user_id").notNullable();
    table.text("provider").notNullable();
    table.text("subject").notNullable();
    table.primary(["provider", "subject"]); // Set composite primary key
  });
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("federated_credentials");
};
