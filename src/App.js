import React from "react";
import AppNavigator from "./Navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store";
import './App.css';
function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <div className="App">
          <AppNavigator />
        </div>
      </Provider>
    </AuthProvider>
  );
}

export default App;
