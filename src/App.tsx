import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Welcome from './components/welcome';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './PrivateRoute';
import Inventory from './pages/Inventory';
import Products from './pages/Products';
import ContactSection from './components/contact';
import About from './pages/About';
import Contact from './pages/Contact';
import Brochures from './pages/Brochures';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen}
            onSearch={handleSearch}
          />

          <main className="relative pt-16">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Welcome />
                  <Features />
                  <ContactSection />
                </>
              } />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/products" 
                element={
                  <Products searchTerm={searchTerm} />
                } 
              />
              <Route 
                path="/inventory" 
                element={
                  <PrivateRoute>
                    <Inventory searchTerm={searchTerm} />
                  </PrivateRoute>
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/brochures" element={<Brochures />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;