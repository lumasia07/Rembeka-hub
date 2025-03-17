import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { VendorShowcase } from './components/VendorShowcase';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/profilePage';
import HubRegistrationForm from './pages/createHub';
import Dashboard from './pages/dashBoard';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans">
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Hero />
                  <FeaturedProducts />
                  <VendorShowcase />
                  <Features />
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create-hub" element={<HubRegistrationForm />} />
            <Route path="/dashboard" element={<Dashboard/>} />

          </Routes>
        </main>
      </div>
      <ToastContainer />
    </Router>
  );
}