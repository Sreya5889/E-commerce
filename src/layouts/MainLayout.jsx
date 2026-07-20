import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bgLight dark:bg-bgDark text-textLight dark:text-textDark transition-colors duration-300">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
