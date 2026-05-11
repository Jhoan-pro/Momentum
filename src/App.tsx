import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { HabitsProvider } from "./context/HabitsContext";
import { Login } from "./pages/Login";
import { CreateAccount } from "./pages/CreateAccount";
import { Dashboard } from "./pages/Dashboard";
// Ruta protegida: solo accesible si hay sesión activa
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

// Ruta pública: redirige al home si ya hay sesión
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? <>{children}</> : <Navigate to="/home" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/create-account" element={<PublicRoute><CreateAccount /></PublicRoute>} />
      <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <HabitsProvider>
          <AppRoutes />
        </HabitsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;