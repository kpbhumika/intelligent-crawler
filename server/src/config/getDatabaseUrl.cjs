const getDatabaseUrl = (nodeEnv) => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/flashwiz",
      test: "postgres://postgres:postgres@localhost:5432/flashwiz",
      e2e: "postgres://postgres:postgres@localhost:5432/flashwiz",
    }[nodeEnv] || process.env.DATABASE_URL
  );
};

module.exports = getDatabaseUrl;
