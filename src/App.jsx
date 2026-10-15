import React from 'react';
import { useRepair } from './context/RepairContext';
import Navbar from './components/Navbar';
import Screen1Dashboard from './components/Screen1Dashboard';
import Screen2NewJob from './components/Screen2NewJob';
import Screen3DetailUpdate from './components/Screen3DetailUpdate';
import Screen4Tracking from './components/Screen4Tracking';
import ContactModal from './components/ContactModal';
import ReceiptModal from './components/ReceiptModal';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';

export default function App() {
  const { activeSingleScreen, isAdmin, isTech } = useRepair();

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area - Full Application View */}
      <main className="main-container single-app-container">
        <div className="single-screen-wrapper">
          {activeSingleScreen === 1 && <Screen1Dashboard />}
          {activeSingleScreen === 2 && <Screen2NewJob />}
          {activeSingleScreen === 3 && (isAdmin || isTech) && <Screen3DetailUpdate />}
          {activeSingleScreen === 4 && <Screen4Tracking />}
        </div>
      </main>

      {/* Overlays / Modals */}
      <ContactModal />
      <ReceiptModal />
      <LoginModal />
      <Toast />
    </div>
  );
}
