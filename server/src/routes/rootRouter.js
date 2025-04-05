const express = require("express");
const userDeckRouter = require("./api/userDeck.js");
const flashcardRouter = require("./api/flashcard.js");
const categoryRouter = require("./api/category.js");
const deckRouter = require("./api/deck.js");
const rootRouter = new express.Router();

rootRouter.use("/api/userDecks", userDeckRouter);
rootRouter.use("/api/flashcards", flashcardRouter);
rootRouter.use("/api/categories", categoryRouter);
rootRouter.use("/api/decks", deckRouter);

module.exports = rootRouter;
