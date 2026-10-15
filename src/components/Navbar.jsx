import React, { useState } from 'react';
import { useRepair } from '../context/RepairContext';
import { RotateCcw, Zap, LayoutDashboard, PlusCircle, Wrench, Smartphone, User, ShieldCheck, Lock, LogIn, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export default function Navbar() {
  const {
    activeSingleScreen,
    setActiveSingleScreen,
    currentUser,
    isAdmin,
    isTech,
    logout,
    quickLogin,
    setLoginModalOpen,
    resetData,
    counts
  } = useRepair();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="top-nav-bar">
      {/* Brand */}
      <div className="brand-group" onClick={() => setActiveSingleScreen(1)} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">
          <Zap className="logo-svg" size={22} />
        </div>
        <div className="brand-text">
          <div className="brand-title-row">
            <span className="brand-title">RepairFlow OS</span>
            <span className="react-badge">Vite + React</span>
          </div>
          <span className="brand-subtitle">ระบบบริหารจัดการและติดตามงานซ่อมอุปกรณ์</span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="main-nav-tabs">
        <button
          className={`nav-tab-btn ${activeSingleScreen === 1 ? 'active' : ''}`}
          onClick={() => setActiveSingleScreen(1)}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
          <span className="nav-tab-badge">{counts.all}</span>
        </button>

        {/* Screen 2: Front Desk Customer Intake (Staff & Admin duty) */}
        {currentUser?.role !== 'tech' && (
          <button
            className={`nav-tab-btn ${activeSingleScreen === 2 ? 'active' : ''}`}
            onClick={() => setActiveSingleScreen(2)}
            title="รับเครื่องซ่อมจากลูกค้า (หน้าที่พนักงานหน้าร้าน / Staff)"
          >
            <PlusCircle size={16} />
            <span>รับงานซ่อม (หน้าร้าน)</span>
          </button>
        )}

        {/* Screen 3: Technician Workbench (Tech & Admin duty) */}
        {(isAdmin || isTech) && (
          <button
            className={`nav-tab-btn ${activeSingleScreen === 3 ? 'active' : ''}`}
            onClick={() => setActiveSingleScreen(3)}
            title="จัดการและอัปเดตสถานะงานซ่อม (โต๊ะทำงานช่าง)"
          >
            <Wrench size={16} />
            <span>{isTech && !isAdmin ? 'โต๊ะช่าง & อัปเดตงาน' : 'อัปเดตสถานะ & ช่าง'}</span>
          </button>
        )}

        <button
          className={`nav-tab-btn ${activeSingleScreen === 4 ? 'active' : ''}`}
          onClick={() => setActiveSingleScreen(4)}
        >
          <Smartphone size={16} />
          <span>ลูกค้าติดตามงาน</span>
        </button>
      </nav>

      {/* Right Controls: User Auth & Reset Data */}
      <div className="nav-right-controls">
        {/* User Auth Profile Pill / Login Button */}
        <div className="auth-profile-wrapper">
          {currentUser ? (
            <div className="user-profile-menu">
              <button
                type="button"
                className={`user-profile-btn ${isAdmin ? 'is-admin-btn' : isTech ? 'is-tech-btn' : 'is-staff-btn'}`}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                title="คลิกเพื่อดูข้อมูลผู้ใช้ / สลับบัญชี"
              >
                <span className="user-avatar-badge">{currentUser.avatar}</span>
                <div className="user-meta-column">
                  <span className="user-nav-name">{currentUser.shortName || currentUser.name}</span>
                  <span className={`user-role-chip ${isAdmin ? 'chip-admin' : isTech ? 'chip-tech' : 'chip-staff'}`}>
                    {isAdmin ? '👑 ADMIN' : isTech ? '🔧 TECH' : '👤 STAFF'}
                  </span>
                </div>
                <ChevronDown size={14} className="dropdown-arrow" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div className="dropdown-overlay" onClick={() => setUserDropdownOpen(false)}></div>
                  <div className="user-dropdown-popover">
                    <div className="popover-user-card">
                      <div className="popover-avatar">{currentUser.avatar}</div>
                      <div className="popover-info">
                        <strong className="popover-name">{currentUser.name}</strong>
                        <span className="popover-role">{currentUser.roleLabel}</span>
                        <span className="popover-email">{currentUser.email}</span>
                      </div>
                    </div>

                    <div className="popover-actions">
                      <div className="popover-section-title">สลับบัญชีด่วน:</div>
                      {currentUser?.role !== 'admin' && (
                        <button
                          type="button"
                          className="dropdown-item-btn highlight-admin"
                          onClick={() => {
                            quickLogin('admin');
                            setUserDropdownOpen(false);
                          }}
                        >
                          <ShieldCheck size={16} />
                          <span>สลับเป็น Admin (หัวหน้าช่าง)</span>
                        </button>
                      )}

                      {currentUser?.role !== 'tech' && (
                        <button
                          type="button"
                          className="dropdown-item-btn highlight-tech"
                          onClick={() => {
                            quickLogin('tech');
                            setUserDropdownOpen(false);
                          }}
                        >
                          <Wrench size={16} />
                          <span>สลับเป็น ช่างเทคนิค (นายธีรภัทร)</span>
                        </button>
                      )}

                      {currentUser?.role !== 'staff' && (
                        <button
                          type="button"
                          className="dropdown-item-btn"
                          onClick={() => {
                            quickLogin('staff');
                            setUserDropdownOpen(false);
                          }}
                        >
                          <User size={16} />
                          <span>สลับเป็น Staff (พนักงานหน้าร้าน)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="dropdown-item-btn"
                        onClick={() => {
                          setLoginModalOpen(true);
                          setUserDropdownOpen(false);
                        }}
                      >
                        <Sparkles size={16} />
                        <span>หน้าต่างเข้าสู่ระบบ (Login Modal)</span>
                      </button>

                      <div className="dropdown-divider"></div>

                      <button
                        type="button"
                        className="dropdown-item-btn text-danger"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                      >
                        <LogOut size={16} />
                        <span>ออกจากระบบ (โหมดลูกค้า)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn-login-trigger"
              onClick={() => setLoginModalOpen(true)}
              title="เข้าสู่ระบบ Admin, Tech หรือ Staff"
            >
              <LogIn size={15} />
              <span className="btn-login-text">เข้าสู่ระบบ</span>
              <span className="btn-login-roles">(Admin/Tech/Staff)</span>
            </button>
          )}
        </div>

        {/* Reset Button (Only for Admin / Staff) */}
        {currentUser && (
          <button
            className="btn-secondary-sm"
            onClick={() => {
              if (window.confirm('ต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นใช่หรือไม่?')) {
                resetData();
              }
            }}
            title="รีเซ็ตข้อมูลเป็นค่าเริ่มต้น"
          >
            <RotateCcw size={14} />
            <span>รีเซ็ตข้อมูล</span>
          </button>
        )}
      </div>
    </header>
  );
}
