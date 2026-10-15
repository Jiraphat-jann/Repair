import React from 'react';
import { useRepair } from '../context/RepairContext';
import { statusMeta } from '../data/initialData';
import { Search, Plus, User, Phone, Laptop, AlertCircle, FileText, Trash2, CheckCircle, Clock, Wrench, PackageCheck, DollarSign, TrendingUp, ShieldCheck, ArrowRight, Smartphone, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Screen1Dashboard() {
  const {
    filteredJobs,
    selectedJobId,
    setSelectedJobId,
    currentFilter,
    setCurrentFilter,
    searchQuery,
    setSearchQuery,
    counts,
    setActiveSingleScreen,
    setReceiptJob,
    deleteJob,
    isAdmin,
    isTech,
    currentUser,
    acceptJob,
    totalEstimatedRevenue,
    completedRevenue
  } = useRepair();

  const handleOpenNewJob = () => {
    setActiveSingleScreen(2);
  };

  const handleManageJob = (job) => {
    setSelectedJobId(job.id);
    setActiveSingleScreen(3);
  };

  const handleTrackJob = (job) => {
    setSelectedJobId(job.id);
    setActiveSingleScreen(4);
  };

  return (
    <section className="window-card" id="screenWindow1">
      <div className="window-header">
        <div className="traffic-lights">
          <span className="light red"></span>
          <span className="light yellow"></span>
          <span className="light green"></span>
        </div>
        <div className="window-title">📊 Dashboard & รายการงานซ่อมทั้งหมด</div>
        {isAdmin && <span className="header-admin-tag">👑 ADMIN VIEW</span>}
      </div>

      <div className="window-body">
        {/* Admin Metric Summary Bar (When Admin is logged in) */}
        {isAdmin && (
          <div className="admin-revenue-bar">
            <div className="revenue-card">
              <div className="rev-icon-wrap rev-green">
                <TrendingUp size={18} />
              </div>
              <div className="rev-details">
                <span className="rev-label">ยอดซ่อมเสร็จสิ้น / ชำระเงินแล้ว</span>
                <strong className="rev-value">฿{completedRevenue.toLocaleString()}</strong>
              </div>
            </div>
            <div className="revenue-card">
              <div className="rev-icon-wrap rev-blue">
                <DollarSign size={18} />
              </div>
              <div className="rev-details">
                <span className="rev-label">มูลค่างานซ่อมรวมทั้งหมดในระบบ</span>
                <strong className="rev-value">฿{totalEstimatedRevenue.toLocaleString()}</strong>
              </div>
            </div>
            <div className="revenue-card">
              <div className="rev-icon-wrap rev-amber">
                <Wrench size={18} />
              </div>
              <div className="rev-details">
                <span className="rev-label">งานค้างรอซ่อม & ดำเนินการ</span>
                <strong className="rev-value">{counts.pending + counts.repairing} รายการ</strong>
              </div>
            </div>
          </div>
        )}

        {/* Technician Duty Banner (เมื่อช่างเทคนิคล็อกอินเข้ามา มีหน้าที่รอรับงาน) */}
        {currentUser?.role === 'tech' && (
          <div className="tech-duty-banner">
            <div className="tech-duty-left">
              <span className="duty-pill">🔧 ช่าง {currentUser.shortName || currentUser.name}</span>
              <p className="duty-desc">
                คุณมีหน้าที่ <strong>รอรับงานซ่อมจากระบบ</strong> (มีคิวรอช่างรับงาน <strong>{counts.pending}</strong> รายการ)
              </p>
            </div>
            {counts.pending > 0 && (
              <button
                type="button"
                className="btn-jump-pending"
                onClick={() => setCurrentFilter('pending')}
              >
                <Zap size={14} />
                <span>ดูคิวรอรับงาน ({counts.pending})</span>
              </button>
            )}
          </div>
        )}

        {/* Search & Add Job / Workbench Row */}
        <div className="search-add-row">
          <div className="search-box">
            <Search className="search-icon-svg" size={16} />
            <input
              type="text"
              id="searchInput"
              placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, รหัสงาน (#FX-001) หรือรุ่น..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
          {currentUser?.role === 'tech' ? (
            <button className="btn-primary btn-tech-workbench" onClick={() => setActiveSingleScreen(3)}>
              <Wrench size={16} />
              <span>ไปที่โต๊ะทำงานช่าง</span>
            </button>
          ) : (
            <button className="btn-primary" onClick={handleOpenNewJob}>
              <Plus size={16} />
              <span>รับงานซ่อมใหม่</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('all')}
          >
            ทั้งหมด <span className="badge-count">{counts.all}</span>
          </button>
          <button
            className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('pending')}
          >
            รอช่างรับงาน <span className="badge-count">{counts.pending}</span>
          </button>
          <button
            className={`filter-btn ${currentFilter === 'repairing' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('repairing')}
          >
            กำลังซ่อม <span className="badge-count">{counts.repairing}</span>
          </button>
          <button
            className={`filter-btn ${currentFilter === 'done' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('done')}
          >
            ซ่อมเสร็จ <span className="badge-count">{counts.done}</span>
          </button>
          {counts.delivered > 0 && (
            <button
              className={`filter-btn ${currentFilter === 'delivered' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('delivered')}
            >
              ส่งมอบแล้ว <span className="badge-count">{counts.delivered}</span>
            </button>
          )}
        </div>

        {/* Job Cards Container */}
        <div className="job-list-container" id="jobListContainer">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={32} className="empty-icon" />
              <p>ไม่พบรายการงานซ่อมที่ตรงกับเงื่อนไข</p>
              {searchQuery && (
                <button className="btn-secondary-sm" onClick={() => setSearchQuery('')}>
                  ล้างคำค้นหา
                </button>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => {
              const meta = statusMeta[job.statusStep] || statusMeta[1];
              const isSelected = job.id === selectedJobId;

              return (
                <div
                  key={job.id}
                  className={`job-card ${isSelected ? 'active-job' : ''}`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <div className="job-card-header">
                    <div className="job-id-pill">
                      <span className="job-id-text">#{job.id}</span>
                      <span className="device-tag">{job.dashModel || job.deviceModel}</span>
                    </div>
                    <span className={`status-badge ${meta.badgeClass}`}>
                      <span className="badge-dot">{meta.icon}</span>
                      <span>{meta.label}</span>
                    </span>
                  </div>

                  <div className="job-card-body">
                    <div className="customer-info-line">
                      <User size={14} className="info-icon" />
                      <strong className="customer-name">{job.customerName}</strong>
                      <span className="phone-text">({job.fullPhone || job.phone})</span>
                    </div>
                    <div className="symptom-line">
                      <AlertCircle size={14} className="info-icon text-amber" />
                      <span className="symptom-text">{job.symptomDetail || job.symptomSummary}</span>
                    </div>
                    <div className="technician-line">
                      <Wrench size={13} className="info-icon text-emerald" />
                      <span className="tech-assigned-label">ช่างผู้ดูแล:</span>
                      <span className="tech-assigned-name">{job.assignedTech || 'นายธีรภัทร ช่างซ่อมชำนาญการ'}</span>
                    </div>
                  </div>

                  <div className="job-card-footer">
                    <div className="footer-left-info">
                      <span className="time-badge">
                        <Clock size={12} />
                        <span>รับ: {job.receivedTime}</span>
                      </span>
                      {job.totalPrice ? (
                        <span className="price-tag-badge">฿{Number(job.totalPrice).toLocaleString()}</span>
                      ) : null}
                    </div>

                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                      {job.statusStep === 1 && (isAdmin || isTech) ? (
                        <button
                          type="button"
                          className="btn-accept-job"
                          title="ช่างกดรับงานซ่อมนี้เข้าระบบทันที"
                          onClick={() => {
                            acceptJob(job.id, currentUser?.name);
                            try {
                              confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                            } catch (err) {}
                          }}
                        >
                          <Zap size={13} />
                          <span>กดรับงานนี้</span>
                        </button>
                      ) : (
                        (isAdmin || isTech) && (
                          <button
                            className="btn-quick-manage"
                            title="อัปเดตและจัดการสถานะงานซ่อม"
                            onClick={() => handleManageJob(job)}
                          >
                            <Wrench size={13} />
                            <span>จัดการสถานะ</span>
                          </button>
                        )
                      )}
                      <button
                        className="btn-quick-track"
                        title="ดูหน้าติดตามสถานะลูกค้า"
                        onClick={() => handleTrackJob(job)}
                      >
                        <Smartphone size={13} />
                        <span>ติดตาม</span>
                      </button>
                      <button
                        className="icon-action-btn"
                        title="พิมพ์ใบรับเครื่อง / ใบเสร็จ"
                        onClick={() => setReceiptJob(job)}
                      >
                        <FileText size={14} />
                      </button>
                      {isAdmin && (
                        <button
                          className="icon-action-btn text-danger"
                          title="ลบงานนี้"
                          onClick={() => {
                            if (window.confirm(`ต้องการลบงาน #${job.id} (${job.customerName}) หรือไม่?`)) {
                              deleteJob(job.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
