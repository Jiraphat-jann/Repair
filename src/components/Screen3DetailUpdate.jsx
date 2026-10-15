import React, { useState, useEffect } from 'react';
import { useRepair } from '../context/RepairContext';
import { statusMeta, techniciansList } from '../data/initialData';
import { Check, CheckCircle, Clock, AlertTriangle, ArrowRight, FileText, Send, Lock, Shield, Sparkles, DollarSign, ShieldCheck, Wrench, RefreshCw, User, Phone, Search, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Screen3DetailUpdate() {
  const { jobs, selectedJobId, setSelectedJobId, selectedJob, updateJobStatus, acceptJob, currentUser, setReceiptJob, isAdmin, isTech, quickLogin, setLoginModalOpen, showToast } = useRepair();

  const [pickedStatus, setPickedStatus] = useState(2);
  const [techNotes, setTechNotes] = useState('');
  const [partsCost, setPartsCost] = useState(0);
  const [laborCost, setLaborCost] = useState(0);
  const [warrantyDays, setWarrantyDays] = useState(90);
  const [assignedTech, setAssignedTech] = useState(selectedJob?.assignedTech || 'นายธีรภัทร ช่างซ่อมชำนาญการ');
  const [searchJobQuery, setSearchJobQuery] = useState('');

  // Sync with selected job
  useEffect(() => {
    if (selectedJob) {
      setPickedStatus(selectedJob.statusStep);
      setTechNotes(selectedJob.techNotes || '');
      setPartsCost(selectedJob.partsCost !== undefined ? selectedJob.partsCost : 0);
      setLaborCost(selectedJob.laborCost !== undefined ? selectedJob.laborCost : 0);
      setWarrantyDays(selectedJob.warrantyDays || 90);
      setAssignedTech(selectedJob.assignedTech || (currentUser?.role === 'tech' ? currentUser.name : 'นายธีรภัทร ช่างซ่อมชำนาญการ'));
    }
  }, [selectedJob, currentUser]);

  // Access Control: Screen 3 requires Admin / Technician
  if (!isAdmin && !isTech) {
    return (
      <section className="window-card window-card-restricted" id="screenWindow3">
        <div className="window-header">
          <div className="traffic-lights">
            <span className="light red"></span>
            <span className="light yellow"></span>
            <span className="light green"></span>
          </div>
          <div className="window-title">🛠️ จัดการ & อัปเดตสถานะงานซ่อม (ต้องใช้สิทธิ์ช่าง / Admin)</div>
          <span className="role-lock-tag">
            <Lock size={12} />
            <span>TECH / ADMIN REQUIRED</span>
          </span>
        </div>
        <div className="window-body restricted-access-body">
          <div className="restricted-icon-wrap">
            <Lock size={42} className="lock-icon" />
          </div>
          <h3 className="restricted-title">หน้านี้จำกัดสิทธิ์สำหรับ ช่างซ่อม / Admin</h3>
          <p className="restricted-desc">
            คุณสามารถกดเข้าสู่ระบบช่างเทคนิค หรือแอดมิน เพื่อปลดล็อกฟังก์ชันการอัปเดตสถานะงานซ่อมและจัดการค่าบริการ
          </p>

          <div className="admin-quick-unlock-card">
            <div className="unlock-info">
              <span className="admin-crown-icon">🔧</span>
              <div>
                <strong>บัญชีช่างเทคนิค & แอดมินร้านซ่อม</strong>
                <p>สิทธิ์อัปเดตสถานะ 4 ขั้นตอน, ปรับราคาซ่อม, บันทึกหมายเหตุ, ออกใบเสร็จ</p>
              </div>
            </div>
            <div className="unlock-buttons-row">
              <button
                type="button"
                className="btn-unlock-role btn-unlock-tech"
                onClick={() => {
                  quickLogin('tech');
                  showToast('🔧 เข้าสู่ระบบช่างเทคนิคสำเร็จ! ปลดล็อกหน้าอัปเดตงานแล้ว', 'success');
                }}
              >
                <Wrench size={16} />
                <span>เข้าสู่ระบบ ช่างเทคนิค (นายธีรภัทร)</span>
              </button>
              <button
                type="button"
                className="btn-unlock-role"
                onClick={() => {
                  quickLogin('admin');
                  showToast('👑 เข้าสู่ระบบ Admin สำเร็จ! ปลดล็อกเต็มระบบแล้ว', 'success');
                }}
              >
                <Shield size={16} />
                <span>เข้าสู่ระบบ Admin (นายสมชาย)</span>
              </button>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => setLoginModalOpen(true)}
              >
                เปิดหน้าต่างล็อกอิน
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleSearchJob = (e) => {
    e.preventDefault();
    if (!searchJobQuery.trim()) return;

    const q = searchJobQuery.toLowerCase().trim();
    const found = jobs.find(
      j => j.id.toLowerCase().includes(q) ||
           j.customerName.toLowerCase().includes(q) ||
           j.phone.toLowerCase().includes(q) ||
           (j.fullPhone && j.fullPhone.toLowerCase().includes(q)) ||
           (j.deviceModel && j.deviceModel.toLowerCase().includes(q))
    );

    if (found) {
      setSelectedJobId(found.id);
      showToast(`🔍 พบข้อมูลงานซ่อม #${found.id} (${found.customerName})`, 'success');
      setSearchJobQuery('');
    } else {
      showToast(`❌ ไม่พบงานซ่อมที่ตรงกับ "${searchJobQuery}" กรุณาตรวจสอบรหัสหรือเบอร์โทร`, 'error');
    }
  };

  const currentMeta = selectedJob ? (statusMeta[selectedJob.statusStep] || statusMeta[1]) : null;
  const calculatedTotal = Number(partsCost || 0) + Number(laborCost || 0);

  const handleUpdate = () => {
    if (!selectedJob) return;
    updateJobStatus(selectedJob.id, pickedStatus, techNotes, {
      partsCost: Number(partsCost),
      laborCost: Number(laborCost),
      warrantyDays: Number(warrantyDays),
      assignedTech: assignedTech
    });

    if (pickedStatus === 3 || pickedStatus === 4) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }
  };

  return (
    <section className="window-card" id="screenWindow3">
      <div className="window-header">
        <div className="traffic-lights">
          <span className="light red"></span>
          <span className="light yellow"></span>
          <span className="light green"></span>
        </div>
        <div className="window-title">🛠️ จัดการ & อัปเดตสถานะงานซ่อม ({isAdmin ? 'Admin Panel' : 'Technician Panel'})</div>
        <div className="header-admin-tools">
          <span className={`admin-status-pill ${isAdmin ? 'admin-pill' : 'tech-pill'}`}>
            {isAdmin ? '👑 ADMIN MODE' : '🔧 TECH MODE'}
          </span>
          {selectedJob && (
            <button
              type="button"
              className="quick-sample-btn"
              onClick={() => setReceiptJob(selectedJob)}
              title="ดูใบรับซ่อม / ใบเสร็จ"
            >
              <FileText size={14} />
              <span>พิมพ์ใบเสร็จ / ใบรับซ่อม</span>
            </button>
          )}
        </div>
      </div>

      <div className="window-body">
        {/* Job Search Bar (ค้นหาและเลือกงานซ่อม) */}
        <form onSubmit={handleSearchJob} className="customer-track-search">
          <div className="track-search-input-wrap">
            <Search size={16} className="track-search-icon" />
            <input
              type="text"
              placeholder="ค้นหางานซ่อมด้วย รหัสงาน (เช่น #FX-001), ชื่อลูกค้า หรือ เบอร์โทรศัพท์..."
              value={searchJobQuery}
              onChange={(e) => setSearchJobQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-track-submit">
            <Search size={15} />
            <span>ค้นหางานซ่อม</span>
          </button>
        </form>

        {!selectedJob ? (
          <div className="empty-state">
            <p>กรุณาพิมพ์ค้นหารหัสงานซ่อมด้านบน</p>
          </div>
        ) : (
          <div className="admin-workspace-grid">
            {/* Left Column: Job Info & Status Progression */}
            <div className="admin-workspace-col left-col">
              {/* If job is in status 1 (รอดำเนินการ), show Quick Claim Banner for Technician / Admin */}
              {selectedJob.statusStep === 1 && (
                <div className="pending-job-claim-banner">
                  <div className="claim-banner-info">
                    <div className="claim-icon-pulse">
                      <Zap size={22} />
                    </div>
                    <div>
                      <h4 className="claim-title">⚡ งานนี้อยู่ในคิวรอช่างรับงาน (สถานะ: รอดำเนินการ)</h4>
                      <p className="claim-desc">
                        หน้าร้านบันทึกส่งเครื่องเข้ามาในคิวแล้ว ช่างสามารถกดรับงานนี้เพื่อเข้าสู่สถานะ "กำลังซ่อม" และเริ่มลงมือตรวจเช็คได้ทันที
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-claim-job-now"
                    onClick={() => {
                      const techName = currentUser?.name || assignedTech;
                      acceptJob(selectedJob.id, techName);
                      setPickedStatus(2);
                      setAssignedTech(techName);
                    }}
                  >
                    <Zap size={16} />
                    <span>⚡ กดรับงานซ่อมนี้ทันที</span>
                  </button>
                </div>
              )}

              {/* Job Details Header Box */}
              <div className="detail-info-box" id="detailInfoBox">
                <div className="detail-top-bar">
                  <div className="job-code-badge">
                    <span className="code-label">รหัสงาน:</span>
                    <strong className="code-val">#{selectedJob.id}</strong>
                    <span className="model-chip">{selectedJob.dashModel || selectedJob.deviceModel}</span>
                  </div>
                  <span className={`status-badge ${currentMeta.badgeClass}`}>
                    <span className="badge-dot">{currentMeta.icon}</span>
                    <span>{currentMeta.label}</span>
                  </span>
                </div>

                <div className="detail-meta-grid">
                  <div className="detail-meta-col">
                    <span className="meta-lbl">ลูกค้า:</span>
                    <strong className="meta-val">{selectedJob.customerName}</strong>
                  </div>
                  <div className="detail-meta-col">
                    <span className="meta-lbl">เบอร์โทร:</span>
                    <span className="meta-val">{selectedJob.fullPhone || selectedJob.phone}</span>
                  </div>
                  <div className="detail-meta-col">
                    <span className="meta-lbl">เวลารับเครื่อง:</span>
                    <span className="meta-val">{selectedJob.receivedTime}</span>
                  </div>
                  <div className="detail-meta-col tech-assignment-col">
                    <span className="meta-lbl">ช่างผู้รับผิดชอบ:</span>
                    <select
                      className="meta-select-tech"
                      value={assignedTech}
                      onChange={(e) => setAssignedTech(e.target.value)}
                      title="คลิกเพื่อมอบหมายหรือเปลี่ยนช่างผู้รับผิดชอบงานนี้"
                    >
                      {techniciansList.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.avatar} {t.name} ({t.badge})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="symptom-detail-row">
                  <span className="meta-lbl">อาการเสีย:</span>
                  <span className="symptom-val">{selectedJob.symptomDetail || selectedJob.symptomSummary}</span>
                </div>
              </div>

              {/* Status Picker Section */}
              <div className="status-picker-section">
                <div className="picker-header">
                  <span>⚙️ เปลี่ยนสถานะงานซ่อม:</span>
                  <span className="sub-hint">เลือกลำดับขั้นตอนงานซ่อม</span>
                </div>

                <div className="status-steps-grid">
                  {[1, 2, 3, 4].map((stepId) => {
                    const meta = statusMeta[stepId];
                    const isSelected = pickedStatus === stepId;
                    const isCurrentInDb = selectedJob.statusStep === stepId;

                    return (
                      <button
                        key={stepId}
                        type="button"
                        className={`step-btn ${isSelected ? 'active' : ''} ${isCurrentInDb ? 'is-current' : ''}`}
                        onClick={() => setPickedStatus(stepId)}
                      >
                        <span className="step-num">{stepId}.</span> {meta.label}
                        {isSelected && <span className="check-mark">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Tech Notes & Action */}
            <div className="admin-workspace-col right-col">
              {/* Technician Note */}
              <div className="form-group tech-notes-group">
                <label htmlFor="techNotesInput">
                  <Wrench size={15} />
                  <span>บันทึกช่าง / รายละเอียดอะไหล่และการซ่อม</span>
                </label>
                <textarea
                  id="techNotesInput"
                  rows="3"
                  placeholder="ระบุอะไหล่ที่เปลี่ยน, อาการที่แก้ไข, ผลการตรวจเช็กวงจร..."
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                />
              </div>

              {/* Cost & Warranty Estimation (Admin Only) */}
              <div className="pricing-warranty-section">
                <div className="pricing-grid">
                  <div className="pricing-col">
                    <label htmlFor="partsCostInput">ค่าอะไหล่ (บาท)</label>
                    <input
                      type="number"
                      id="partsCostInput"
                      min="0"
                      step="50"
                      value={partsCost}
                      onChange={(e) => setPartsCost(e.target.value)}
                    />
                  </div>
                  <div className="pricing-col">
                    <label htmlFor="laborCostInput">ค่าบริการ/ค่าแรง (บาท)</label>
                    <input
                      type="number"
                      id="laborCostInput"
                      min="0"
                      step="50"
                      value={laborCost}
                      onChange={(e) => setLaborCost(e.target.value)}
                    />
                  </div>
                  <div className="pricing-col total-col">
                    <label>ยอดรวมสุทธิ</label>
                    <div className="total-display">
                      <span className="total-amount">{calculatedTotal.toLocaleString()}</span>
                      <span className="currency-unit">บาท</span>
                    </div>
                  </div>
                </div>

                <div className="warranty-select-row">
                  <label>
                    <ShieldCheck size={15} className="text-emerald" />
                    <span>ระยะเวลารับประกันงานซ่อม:</span>
                  </label>
                  <div className="warranty-chips">
                    {[30, 60, 90, 180, 365].map((days) => (
                      <button
                        key={days}
                        type="button"
                        className={`warranty-chip ${warrantyDays === days ? 'active' : ''}`}
                        onClick={() => setWarrantyDays(days)}
                      >
                        {days === 365 ? '1 ปี' : `${days} วัน`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <div className="action-full-row">
                <button
                  type="button"
                  className="btn-update-status"
                  onClick={handleUpdate}
                >
                  <Send size={16} />
                  <span>บันทึกและอัปเดตสถานะงานซ่อม</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
