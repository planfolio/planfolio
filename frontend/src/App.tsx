import React from "react";
import { Header } from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/routes";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const {
    isAuthenticated,
    handleLoginClick,
    handleSignupClick,
    handleLoginSuccess,
    handleLogoutClick,
  } = useAuth();

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogoutClick={handleLogoutClick}
      />
      <main className="pt-4">
        <AppRoutes isAuthenticated={isAuthenticated} />
      </main>
      <Footer />
    </>
  );
};

export default App;
