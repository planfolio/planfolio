import React, { useEffect } from "react";
import AppRoutes from "./routes/routes";
import { Header } from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { useAuthStore } from "./store/useAuthStore";

const App: React.FC = () => {
  const { fetchMe } = useAuthStore();

  // 1) 앱 최초 마운트 시 인증 복원 시도
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
