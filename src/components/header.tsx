"use client"
import React, { useState } from 'react';
import { ArrowRight, MapPin, Award, Calendar, BookOpen, Building, Star, Search, Menu, X, ChevronDown, User, Mail, Phone } from 'lucide-react';

// Logo Component
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">IE</div>
    <div className="text-xl font-bold text-blue-600">Indian<span className="text-blue-800">EduHub</span></div>
  </div>
);

// Header Component
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-blue-800 font-medium">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Universities</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Courses</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About Us</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
        </nav>
        <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};
export default Header;