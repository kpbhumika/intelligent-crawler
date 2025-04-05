// routes/flashcards.js
const express = require("express");
const Flashcard = require("../../models/Flashcard");
const Deck = require("../../models/Deck");
const { ValidationError } = require("objection");

const flashcardRouter = express.Router();

// Fetch a single flashcard by its ID
flashcardRouter.get("/:flashcardId", async (req, res) => {
  const { flashcardId } = req.params;

  try {
    const flashcard = await Flashcard.query().findById(flashcardId);

    if (!flashcard) {
      return res.status(404).json({ errors: "Deck not found" });
    }

    return res.status(200).json(flashcard);
  } catch (error) {
    console.error("Error fetching flashcard: ", error);
    return res
      .status(500)
      .json({ errors: error.message || "Internal Server Error" });
  }
});

// Fetch all flashcards for a deck
flashcardRouter.get("/", async (req, res) => {
  const deckId = req.query.deckId;
  try {
    const deck = await Deck.query().findById(deckId).select("title");

    const flashcards = await Flashcard.query().where("deckId", deckId);
    return res.status(200).json({ deckTitle: deck.title, flashcards });
  } catch (error) {
    console.error("Error fetching decks:", error);
    return res
      .status(500)
      .json({ errors: error.message || "Internal Server Error" });
  }
});

// Create a new flashcard
flashcardRouter.post("/", async (req, res) => {
  const { question, answer, deckId } = req.body;

  // Basic validation to check if required fields are provided
  if (!question || !answer || !deckId) {
    return res
      .status(400)
      .json({ message: "Question, answer, and deckId are required." });
  }

  try {
    // Use Knex and Objection to insert and fetch the newly created flashcard
    const flashcard = await Flashcard.query().insertAndFetch({
      question,
      answer,
      deckId,
    });

    // Respond with a 201 status and the created flashcard object
    res.status(201).json(flashcard);
  } catch (error) {
    console.error("Error creating flashcard:", error);

    // Enhanced error handling: Check if error is validation-related or server-related
    if (error instanceof ValidationError) {
      res
        .status(400)
        .json({ message: "Validation error", details: error.data });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

// Delete a specific flashcard by ID
flashcardRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to delete the flashcard by its ID
    const deletedRows = await Flashcard.query().deleteById(id);

    if (deletedRows === 0) {
      // No flashcard was found with the given ID
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res.status(200).json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Update a specific flashcard by ID
flashcardRouter.patch("/:flashcardId", async (req, res) => {
  const { flashcardId } = req.params;
  const { question, answer } = req.body;

  // Basic validation to ensure question and answer are provided
  if (!question || !answer) {
    return res
      .status(400)
      .json({ message: "Question and answer are required." });
  }

  try {
    // Find the flashcard by ID to ensure it exists
    const flashcard = await Flashcard.query().findById(flashcardId);

    if (!flashcard) {
      // If flashcard does not exist
      return res.status(404).json({ message: "Flashcard not found" });
    }

    // Update the flashcard with the new data
    const updatedFlashcard = await Flashcard.query().patchAndFetchById(
      flashcardId,
      { question, answer },
    );

    // Respond with the updated flashcard
    res.status(200).json({ flashcard: updatedFlashcard });
  } catch (error) {
    console.error("Error updating flashcard:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = flashcardRouter;
