import React, { useState } from 'react';
import { useRepair } from '../context/RepairContext';
import { statusMeta } from '../data/initialData';
import { Check, Clock, PhoneCall, Sparkles, ShieldCheck, Search, ArrowRight, Smartphone, Laptop, Tablet, User, AlertCircle, Wrench } from 'lucide-react';

export default function Screen4Tracking() {
  const { selectedJob, jobs, setSelectedJobId, setContactModalOpen, showToast } = useRepair();
  const [trackSearch, setTrackSearch] = useState('');

  const handleTrackSearch = (e) => {
    e.preventDefault();
    if (!trackSearch.trim()) return;

    const q = trackSearch.toLowerCase().trim();
    const found = jobs.find(
      j => j.id.toLowerCase().includes(q) ||
           j.customerName.toLowerCase().includes(q) ||
           j.phone.toLowerCase().includes(q) ||
           (j.fullPhone && j.fullPhone.toLowerCase().includes(q))
    );

    if (found) {
      setSelectedJobId(found.id);
      showToast(`🔍 พบข้อมูลงานซ่อม #${found.id} (${found.customerName})`, 'success');
      setTrackSearch('');
    } else {
      showToast(`❌ ไม่พบงานซ่อมที่ตรงกับ "${trackSearch}" กรุณาตรวจสอบรหัสหรือเบอร์โทร`, 'error');
    }
  };

  const currentMeta = selectedJob ? (statusMeta[selectedJob.statusStep] || statusMeta[1]) : null;

  return (
    <section className="window-card" id="screenWindow4">
      <div className="window-header">
        <div className="traffic-lights">
          <span className="light red"></span>
          <span className="light yellow"></span>
          <span className="light green"></span>
        </div>
        <div className="window-title">📱 หน้าเช็กและติดตามสถานะงานซ่อม (Customer Tracking)</div>
        <div className="live-pulse-badge">
          <span className="pulsing-green-dot"></span>
          <span>LIVE TRACK</span>
        </div>
      </div>

      <div className="window-body tracking-body">
        {/* Customer Search Bar */}
        <form onSubmit={handleTrackSearch} className="customer-track-search">
          <div className="track-search-input-wrap">
            <Search size={16} className="track-search-icon" />
            <input
              type="text"
              placeholder="ค้นหาสถานะงานซ่อมด้วย รหัสงาน (เช่น #FX-001) หรือ เบอร์โทรศัพท์ที่แจ้งไว้..."
              value={trackSearch}
              onChange={(e) => setTrackSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-track-submit">
            <Search size={15} />
            <span>ค้นหางานซ่อม</span>
          </button>
        </form>

        {!selectedJob ? (
          <div className="empty-state">
            <p>กรุณาเลือกรหัสงานซ่อม หรือพิมพ์ค้นหาด้านบน</p>
          </div>
        ) : (
          <div className="tracking-workspace-grid">
            {/* Left Column: Job Summary & Shop Contact */}
            <div className="tracking-col-left">
              {/* Tracking Header Banner */}
              <div className="tracking-summary-card">
                <div className="tracking-job-title" id="trackJobTitle">
                  งานซ่อม <span className="highlight-id">#{selectedJob.id}: {selectedJob.dashModel || selectedJob.deviceModel}</span>
                </div>
                <div className="tracking-customer-meta">
                  <span className="cust-lbl">ผู้ส่งซ่อม:</span>
                  <strong>{selectedJob.customerName}</strong>
                  <span className="phone-sub">({selectedJob.phone})</span>
                </div>
                <div className="tracking-tech-meta">
                  <Wrench size={13} className="text-emerald" />
                  <span className="cust-lbl">ช่างผู้รับผิดชอบ:</span>
                  <strong className="text-emerald">{selectedJob.assignedTech || 'นายธีรภัทร ช่างซ่อมชำนาญการ'}</strong>
                </div>
                <div className="tracking-current-status">
                  สถานะปัจจุบัน: <strong className={`status-text-highlight ${currentMeta.badgeClass}`}>{currentMeta.trackText}</strong>
                </div>
              </div>

              {/* Note / Guarantee summary */}
              {selectedJob.techNotes && (
                <div className="tracking-note-box">
                  <div className="note-header">
                    <ShieldCheck size={16} className="note-icon" />
                    <span>หมายเหตุจากช่าง & การรับประกัน:</span>
                  </div>
                  <div className="note-text">{selectedJob.techNotes}</div>
                  {selectedJob.warrantyDays ? (
                    <div className="warranty-tag-note">
                      🛡️ รับประกันงานซ่อม {selectedJob.warrantyDays} วันหลังส่งมอบ
                    </div>
                  ) : null}
                </div>
              )}

              {/* Bottom Contact Button */}
              <div className="tracking-contact-footer">
                <button
                  type="button"
                  className="btn-contact-shop"
                  onClick={() => setContactModalOpen(true)}
                >
                  <PhoneCall size={16} />
                  <span>ติดต่อศูนย์บริการ / สอบถามข้อมูลเพิ่มเติม</span>
                </button>
              </div>
            </div>

            {/* Right Column: Timeline Steps */}
            <div className="tracking-col-right">
              <div className="timeline-card-wrapper">
                <div className="timeline-card-header">
                  <span>⏱️ ลำดับความคืบหน้าการซ่อมบำรุง</span>
                </div>
                <div className="tracking-timeline" id="trackingTimeline">
                  {selectedJob.timeline.map((item) => {
                    const stepNum = item.step;
                    const isCompleted = stepNum < selectedJob.statusStep;
                    const isActive = stepNum === selectedJob.statusStep;
                    const isPending = stepNum > selectedJob.statusStep;

                    let itemClass = 'pending';
                    if (isCompleted) itemClass = 'completed';
                    if (isActive) itemClass = 'active';

                    return (
                      <div key={stepNum} className={`timeline-item ${itemClass}`}>
                        <div className="timeline-marker">
                          {isCompleted && <span className="marker-icon"><Check size={14} strokeWidth={3} /></span>}
                          {isActive && <span className="marker-dot"></span>}
                          {isPending && <span className="marker-circle"></span>}
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-title">
                            {item.title}
                            {isActive && <span className="current-step-tag">ขั้นตอนปัจจุบัน</span>}
                          </div>
                          <div className="timeline-time">
                            <Clock size={12} className="timeline-time-icon" />
                            <span>{item.time || '-'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
