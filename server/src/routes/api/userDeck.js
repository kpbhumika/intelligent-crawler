const express = require("express");
const Deck = require("../../models/Deck");
const { ValidationError } = require("objection");

const userDeckRouter = express.Router();

// fetch user decks
userDeckRouter.get("/", async (req, res) => {
  const userId = req.user.id;
  try {
    const decks = await Deck.query().where("userId", userId);
    return res.status(200).json({ decks });
  } catch (error) {
    console.error("Error fetching decks:", error);
    return res
      .status(500)
      .json({ errors: error.message || "Internal Server Error" });
  }
});

// Create a new deck
userDeckRouter.post("/", async (req, res) => {
  console.log(req.body);
  const {
    title,
    userId,
    description = "",
    categoryId,
    isPublic = false,
  } = req.body; // Add optional fields with default values

  // Basic validation to check if required fields are provided
  if (!title || !userId) {
    return res.status(400).json({ message: "Title and userId are required." });
  }

  const categoryIdInt = parseInt(categoryId, 10);

  try {
    // Use Knex and Objection to insert and fetch the newly created deck
    const deck = await Deck.query().insertAndFetch({
      title,
      userId,
      description,
      categoryId: categoryIdInt,
      isPublic,
    });

    // Respond with a 201 status and the created deck object
    res.status(201).json(deck);
  } catch (error) {
    console.error("Error creating deck:", error);

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

// Delete a deck
userDeckRouter.delete("/:deckId", async (req, res) => {
  const userId = req.user.id;
  const { deckId } = req.params;

  try {
    // Check if the deck exists and belongs to the user
    const deck = await Deck.query().findById(deckId).where("userId", userId);

    if (!deck) {
      return res
        .status(404)
        .json({ message: "Deck not found or not accessible." });
    }

    // Delete the deck
    await Deck.query().deleteById(deckId);

    // Respond with a success message
    return res.status(200).json({ message: "Deck deleted successfully." });
  } catch (error) {
    console.error("Error deleting deck:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

/// Update deck visibility
userDeckRouter.patch("/:deckId/visibility", async (req, res) => {
  const userId = req.user.id;
  const { deckId } = req.params;
  const { isPublic } = req.body;

  if (typeof isPublic !== "boolean") {
    return res
      .status(400)
      .json({ message: "isPublic must be a boolean value." });
  }

  // Check if the deck exists and belongs to the user
  const deck = await Deck.query().findById(deckId).where("userId", userId);

  if (!deck) {
    return res
      .status(404)
      .json({ message: "Deck not found or not accessible." });
  }

  // Update only the `isPublic` field of the deck
  const updatedDeck = await Deck.query().patchAndFetchById(deckId, {
    isPublic,
  });

  // Respond with the updated deck object
  return res.status(200).json({ deck: updatedDeck });
});

//edit deck
userDeckRouter.patch("/:deckId", async (req, res) => {
  const userId = req.user.id;
  const { deckId } = req.params;
  const { title, description, isPublic } = req.body;

  // Validate that at least one field is provided
  if (!title && !description) {
    return res.status(400).json({
      message: "At least one field (title or description) must be provided.",
    });
  }

  try {
    // Check if the deck exists and belongs to the user
    const deck = await Deck.query().findById(deckId).where("userId", userId);

    if (!deck) {
      return res
        .status(404)
        .json({ message: "Deck not found or not accessible." });
    }

    // Prepare the updated fields
    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (isPublic !== undefined) updatedData.isPublic = isPublic;

    // Update the deck and fetch the updated object
    const updatedDeck = await Deck.query().patchAndFetchById(
      deckId,
      updatedData,
    );

    // Respond with the updated deck object
    return res.status(200).json({ deck: updatedDeck });
  } catch (error) {
    console.error("Error updating deck:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

module.exports = userDeckRouter;
