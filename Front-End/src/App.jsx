import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Candidat Pages
import CandidatDashboard from './pages/candidat/Dashboard';
import MesCandidatures from './pages/candidat/MesCandidatures';
import PostulerAnnonce from './pages/candidat/PostulerAnnonce';

// Recruteur Pages
import RecruteurDashboard from './pages/recruteur/Dashboard';
import MesAnnonces from './pages/recruteur/MesAnnonces';
import CreateAnnonce from './pages/recruteur/CreateAnnonce';
import EditAnnonce from './pages/recruteur/EditAnnonce';
import CandidaturesAnnonce from './pages/recruteur/CandidaturesAnnonce';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Profile Page Route */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute role="Administrateur" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Candidat Routes */}
              <Route element={<ProtectedRoute role="Candidat" />}>
                <Route path="/candidat/dashboard" element={<CandidatDashboard />} />
                <Route path="/candidat/candidatures" element={<MesCandidatures />} />
                <Route path="/candidat/postuler/:id" element={<PostulerAnnonce />} />
              </Route>

              {/* Recruteur Routes */}
              <Route element={<ProtectedRoute role="Recruteur" />}>
                <Route path="/recruteur/dashboard" element={<RecruteurDashboard />} />
                <Route path="/recruteur/annonces" element={<MesAnnonces />} />
                <Route path="/recruteur/annonces/create" element={<CreateAnnonce />} />
                <Route path="/recruteur/annonces/edit/:id" element={<EditAnnonce />} />
                <Route path="/recruteur/annonces/:id/candidatures" element={<CandidaturesAnnonce />} />
              </Route>

              {/* Home Page Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;