import "./App.css";
import Login from "./auth/Login";
import Layout from "./layout/Layout";
import Profile from "./auth/Profile";
import Authenticate from "./auth/Authentication";
import { AuthProvider } from "./auth/provider/AuthProvider";
import Decks from "./components/Decks";
import Deck from "./components/Deck";
import DeckForm from "./components/DeckForm";
import Study from "./components/Study";
import FlashcardForm from "./components/FlashcardForm";
import PublicFlashcards from "./components/PublicFlashcards";
import HomePage from "./components/HomePage";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/decks/public/category",
      element: <Study />,
    },
    {
      path: "/decks/public/:deckId/flashcards",
      element: <PublicFlashcards />,
    },

    {
      path: "/profile",
      element: (
        <Authenticate>
          <Profile />
        </Authenticate>
      ),
    },
    {
      path: "/decks",
      element: (
        <Authenticate>
          <Decks />
        </Authenticate>
      ),
    },
    {
      path: "/decks/:deckId/flashcards",
      element: (
        <Authenticate>
          <Deck />
        </Authenticate>
      ),
    },
    {
      path: "/deck/add",
      element: (
        <Authenticate>
          <DeckForm />
        </Authenticate>
      ),
    },
    {
      path: "/decks/:deckId/flashcards/:flashcardId/edit",
      element: (
        <Authenticate>
          <FlashcardForm isEditing={true} />
        </Authenticate>
      ),
    },
    {
      path: "/decks/:deckId/edit",
      element: (
        <Authenticate>
          <DeckForm isEditing={true} />
        </Authenticate>
      ),
    },
    {
      path: "/decks/:deckId/add-flashcard",
      element: (
        <Authenticate>
          <FlashcardForm />
        </Authenticate>
      ),
    },
  ]);
  return (
    <AuthProvider>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </AuthProvider>
  );
}

export default App;
