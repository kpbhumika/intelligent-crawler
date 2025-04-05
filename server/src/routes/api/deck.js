const express = require("express");
const Deck = require("../../models/Deck");

const deckRouter = express.Router();

// fetch public decks by categoryId
deckRouter.get("/", async (req, res) => {
  const categoryId = req.query.categoryId;

  try {
    // Start building the query for public decks
    let deckQuery = Deck.query().where("isPublic", true);

    // Apply categoryId filter only if it exists
    if (categoryId) {
      deckQuery = deckQuery.andWhere("categoryId", categoryId);
    }

    const decks = await deckQuery;
    return res.status(200).json({ decks });
  } catch (error) {
    console.error("Error fetching decks: ", error);
    return res
      .status(500)
      .json({ errors: error.message || "Internal Server Error" });
  }
});

// Fetch a single deck by its ID
deckRouter.get("/:deckId", async (req, res) => {
  const { deckId } = req.params;

  try {
    const deck = await Deck.query().findById(deckId);

    if (!deck) {
      return res.status(404).json({ errors: "Deck not found" });
    }

    return res.status(200).json(deck);
  } catch (error) {
    console.error("Error fetching deck: ", error);
    return res
      .status(500)
      .json({ errors: error.message || "Internal Server Error" });
  }
});

module.exports = deckRouter;
