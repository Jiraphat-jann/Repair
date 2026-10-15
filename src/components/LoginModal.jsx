import React, { useState } from 'react';
import { useRepair } from '../context/RepairContext';
import { predefinedAccounts } from '../data/initialData';
import { X, ShieldCheck, User, Lock, KeyRound, ArrowRight, Zap, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, quickLogin, logout, currentUser } = useRepair();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!loginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (ลองกดปุ่มคลิกเดียวด้านล่าง หรือเลือกบัญชีตัวอย่าง)');
      }
    }, 250);
  };

  const handleFillDemo = (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMsg('');
  };

  const handleDirectQuickLogin = (role) => {
    setErrorMsg('');
    quickLogin(role);
  };

  return (
    <div className="modal-backdrop" onClick={() => setLoginModalOpen(false)}>
      <div className="modal-card login-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header login-header">
          <div className="modal-title-wrap">
            <div className="auth-icon-badge">
              <KeyRound size={22} className="auth-header-icon" />
            </div>
            <div>
              <h3>เข้าสู่ระบบ / สลับสิทธิ์ผู้ใช้งาน</h3>
              <p className="modal-subtitle">RepairFlow OS • เลือกระดับสิทธิ์ที่ต้องการใช้งาน</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={() => setLoginModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body login-body">
          {/* 1-Click Instant Login Cards (Recommended for Quick Testing) */}
          <div className="quick-login-section">
            <div className="section-label">
              <Zap size={14} className="label-icon text-amber" />
              <span>เข้าสู่ระบบด่วนใน 1 วินาที (คลิกเพื่อเข้าใช้งานทันที):</span>
            </div>

            <div className="quick-login-grid">
              {/* Admin Card */}
              <button
                type="button"
                className={`quick-login-card admin-card ${currentUser?.role === 'admin' ? 'is-active-user' : ''}`}
                onClick={() => handleDirectQuickLogin('admin')}
              >
                <div className="card-top-badge">
                  <span className="role-tag-admin">👑 สิทธิ์แอดมินสูงสุด (ADMIN)</span>
                  {currentUser?.role === 'admin' && <span className="current-badge">กำลังใช้งาน</span>}
                </div>
                <div className="card-user-info">
                  <div className="avatar-circle admin-avatar">👑</div>
                  <div className="user-details">
                    <strong className="user-name">นายสมชาย วิศวกรซ่อม</strong>
                    <span className="user-role-desc">หัวหน้าช่าง / เจ้าของร้าน (เข้าถึงได้ครบ 4 หน้า)</span>
                  </div>
                </div>
                <div className="card-action-hint">
                  <span>คลิกเพื่อเข้าสู่ระบบ Admin</span>
                  <ArrowRight size={14} />
                </div>
              </button>

              {/* Tech Card (ช่างซ่อมเทคนิค) */}
              <button
                type="button"
                className={`quick-login-card tech-card ${currentUser?.role === 'tech' ? 'is-active-user' : ''}`}
                onClick={() => handleDirectQuickLogin('tech')}
              >
                <div className="card-top-badge">
                  <span className="role-tag-tech">🔧 สิทธิ์ช่างซ่อมเทคนิค (TECH)</span>
                  {currentUser?.role === 'tech' && <span className="current-badge">กำลังใช้งาน</span>}
                </div>
                <div className="card-user-info">
                  <div className="avatar-circle tech-avatar">🔧</div>
                  <div className="user-details">
                    <strong className="user-name">นายธีรภัทร ช่างซ่อมชำนาญการ</strong>
                    <span className="user-role-desc">ช่างเทคนิคประจำร้าน (มีหน้าที่รอรับงานซ่อม / ตรวจซ่อมบอร์ด & อะไหล่)</span>
                  </div>
                </div>
                <div className="card-action-hint">
                  <span>คลิกเพื่อเข้าสู่ระบบ Tech (รอรับงานซ่อม)</span>
                  <ArrowRight size={14} />
                </div>
              </button>

              {/* Staff Card */}
              <button
                type="button"
                className={`quick-login-card staff-card ${currentUser?.role === 'staff' ? 'is-active-user' : ''}`}
                onClick={() => handleDirectQuickLogin('staff')}
              >
                <div className="card-top-badge">
                  <span className="role-tag-staff">👤 เจ้าหน้าที่หน้าร้าน (STAFF)</span>
                  {currentUser?.role === 'staff' && <span className="current-badge">กำลังใช้งาน</span>}
                </div>
                <div className="card-user-info">
                  <div className="avatar-circle staff-avatar">👤</div>
                  <div className="user-details">
                    <strong className="user-name">น.ส.วิภาดา พลอยใส</strong>
                    <span className="user-role-desc">พนักงานรับเครื่อง (รับงาน / เช็กคิว / พิมพ์ใบรับ)</span>
                  </div>
                </div>
                <div className="card-action-hint">
                  <span>คลิกเพื่อเข้าสู่ระบบ Staff</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            </div>
          </div>

          <div className="login-divider">
            <span>หรือ กรอกชื่อผู้ใช้และรหัสผ่าน</span>
          </div>

          {/* Traditional Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {errorMsg && (
              <div className="login-error-banner">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="loginUsername">
                <User size={14} />
                <span>ชื่อผู้ใช้ (Username)</span>
              </label>
              <input
                type="text"
                id="loginUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="เช่น admin, tech หรือ staff"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">
                <Lock size={14} />
                <span>รหัสผ่าน (Password)</span>
              </label>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="loginPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Quick Demo Credential chips */}
            <div className="demo-credentials-row">
              <span className="demo-hint-label">ทดลองกรอก:</span>
              <button
                type="button"
                className="credential-chip"
                onClick={() => handleFillDemo(predefinedAccounts[0])}
              >
                👑 admin / admin123
              </button>
              <button
                type="button"
                className="credential-chip chip-tech-demo"
                onClick={() => handleFillDemo(predefinedAccounts[1])}
              >
                🔧 tech / tech123
              </button>
              <button
                type="button"
                className="credential-chip"
                onClick={() => handleFillDemo(predefinedAccounts[2])}
              >
                👤 staff / staff123
              </button>
            </div>

            <div className="form-actions login-form-actions">
              <button
                type="button"
                className="btn-customer-mode"
                onClick={() => {
                  logout();
                  setLoginModalOpen(false);
                }}
                title="สลับเป็นโหมดลูกค้า (ไม่ต้องล็อกอิน)"
              >
                <span>โหมดลูกค้าทั่วไป</span>
              </button>

              <button
                type="submit"
                className="btn-login-submit"
                disabled={loading}
              >
                <ShieldCheck size={16} />
                <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
