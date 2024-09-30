import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./theme/themeSlice"; // Ensure this path is correct
import { loadState, saveState } from "../utils/localStorage"; // Adjust path if necessary

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    theme: themeReducer, // Add the theme reducer here
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    theme: store.getState().theme, // Save theme state to local storage
  });
});
