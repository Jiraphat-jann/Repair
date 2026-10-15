/**
 * Repair Shop Management System - RepairFlow OS
 * Interactive controller for 4-screen layout
 */

const STORAGE_KEY = 'repairflow_jobs_data_v1';

// Initial state matching the exact reference screenshot
const defaultJobs = [
  {
    id: 'FX-001',
    customerName: 'นายสมชาย ใจดี',
    phone: '081-234-xxxx',
    fullPhone: '081-234-5678',
    deviceType: 'โน้ตบุ๊ก',
    deviceModel: 'ASUS TUF F15',
    dashModel: 'ASUS TUF Dash F15',
    symptomSummary: 'เปิดไม่ติด มีไฟกระพริบ',
    symptomDetail: 'ช็อตเปิดไม่ติด ไฟไม่เข้า มีกลิ่นไหม้ภาคจ่ายไฟ',
    receivedTime: '10:30 น.',
    statusStep: 2, // 1: รอดำเนินการ, 2: กำลังซ่อม, 3: ซ่อมเสร็จ, 4: ส่งมอบแล้ว
    techNotes: 'เปลี่ยนชิป IC ไฟชาร์จ + ค่าแรง | รวม 1,500 บาท',
    timeline: [
      { step: 1, title: 'รับเครื่องเข้าระบบเรียบร้อย', time: '10:30 น.' },
      { step: 2, title: 'กำลังตรวจซ่อม / เปลี่ยนชิ้นส่วน (ปัจจุบัน)', time: '11:45 น.' },
      { step: 3, title: 'ทดสอบระบบหลังซ่อม / พร้อมรับเครื่อง', time: '-' },
      { step: 4, title: 'ส่งมอบเครื่องและรับประกันงานซ่อม', time: '-' }
    ]
  },
  {
    id: 'FX-002',
    customerName: 'นางสาววิภาดา มณีรัตน์',
    phone: '089-876-xxxx',
    fullPhone: '089-876-5432',
    deviceType: 'สมาร์ตโฟน',
    deviceModel: 'iPhone 13 Pro',
    dashModel: 'iPhone 13 Pro 128GB',
    symptomSummary: 'กระจกจอแตก ทัชสกรีนเพี้ยน',
    symptomDetail: 'กระจกจอแตก ทัชสกรีนไม่ตอบสนองบางจุด กล้องหน้าปกติ',
    receivedTime: '11:15 น.',
    statusStep: 2,
    techNotes: 'เปลี่ยนชุดหน้าจอเกรดแท้ + แถมติดฟิล์มกระจก | รวม 3,800 บาท',
    timeline: [
      { step: 1, title: 'รับเครื่องเข้าระบบเรียบร้อย', time: '11:15 น.' },
      { step: 2, title: 'กำลังตรวจซ่อม / เปลี่ยนชิ้นส่วน (ปัจจุบัน)', time: '12:00 น.' },
      { step: 3, title: 'ทดสอบระบบหลังซ่อม / พร้อมรับเครื่อง', time: '-' },
      { step: 4, title: 'ส่งมอบเครื่องและรับประกันงานซ่อม', time: '-' }
    ]
  }
];

const statusMeta = {
  1: { key: 'pending', label: 'รอดำเนินการ', badgeClass: 'status-pending', icon: '●', trackText: 'รอดำเนินการตรวจสอบอาการ' },
  2: { key: 'repairing', label: 'กำลังซ่อม', badgeClass: 'status-repairing', icon: '⚙', trackText: 'กำลังดำเนินการซ่อมเปลี่ยนอะไหล่' },
  3: { key: 'done', label: 'ซ่อมเสร็จ', badgeClass: 'status-done', icon: '✓', trackText: 'ซ่อมเสร็จเรียบร้อย พร้อมส่งมอบ' },
  4: { key: 'delivered', label: 'ส่งมอบแล้ว', badgeClass: 'status-delivered', icon: '📦', trackText: 'ส่งมอบเครื่องและรับประกันงานซ่อมแล้ว' }
};

class RepairApp {
  constructor() {
    this.jobs = this.loadData();
    this.selectedJobId = 'FX-001';
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.selectedStatusPicker = 2;
    this.currentViewMode = 'grid'; // 'grid' or 'single'
    this.activeSingleScreen = 1;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load storage, using default data', e);
    }
    return JSON.parse(JSON.stringify(defaultJobs));
  }

  saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.jobs));
  }

  initElements() {
    // Top Nav
    this.btnViewGrid = document.getElementById('btnViewGrid');
    this.btnViewSingle = document.getElementById('btnViewSingle');
    this.singleScreenTabs = document.getElementById('singleScreenTabs');
    this.screenTabs = document.querySelectorAll('.screen-tab');
    this.btnResetData = document.getElementById('btnResetData');
    this.mainContainer = document.getElementById('mainContainer');

    // Windows
    this.windowCards = {
      1: document.getElementById('screenWindow1'),
      2: document.getElementById('screenWindow2'),
      3: document.getElementById('screenWindow3'),
      4: document.getElementById('screenWindow4')
    };

    // Screen 1: Dashboard
    this.searchInput = document.getElementById('searchInput');
    this.btnOpenNewJobModal = document.getElementById('btnOpenNewJobModal');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.jobListContainer = document.getElementById('jobListContainer');
    this.countAll = document.getElementById('countAll');
    this.countPending = document.getElementById('countPending');
    this.countRepairing = document.getElementById('countRepairing');
    this.countDone = document.getElementById('countDone');

    // Screen 2: Form
    this.newJobForm = document.getElementById('newJobForm');
    this.inputCustomerName = document.getElementById('inputCustomerName');
    this.inputCustomerPhone = document.getElementById('inputCustomerPhone');
    this.inputDeviceModel = document.getElementById('inputDeviceModel');
    this.inputSymptoms = document.getElementById('inputSymptoms');
    this.inputInitEstimate = document.getElementById('inputInitEstimate');
    this.btnCancelNewJob = document.getElementById('btnCancelNewJob');

    // Screen 3: Details & Status
    this.detailJobId = document.getElementById('detailJobId');
    this.detailCustomerName = document.getElementById('detailCustomerName');
    this.detailCustomerPhone = document.getElementById('detailCustomerPhone');
    this.detailSymptoms = document.getElementById('detailSymptoms');
    this.detailCurrentBadge = document.getElementById('detailCurrentBadge');
    this.detailCurrentStatusText = document.getElementById('detailCurrentStatusText');
    this.statusStepButtons = document.querySelectorAll('.step-btn');
    this.techNotesInput = document.getElementById('techNotesInput');
    this.btnUpdateJobStatus = document.getElementById('btnUpdateJobStatus');

    // Screen 4: Customer Tracking
    this.trackJobTitle = document.getElementById('trackJobTitle');
    this.trackStatusHighlight = document.getElementById('trackStatusHighlight');
    this.trackingTimeline = document.getElementById('trackingTimeline');
    this.btnContactShop = document.getElementById('btnContactShop');

    // Modals & Toasts
    this.contactModal = document.getElementById('contactModal');
    this.btnCloseContactModal = document.getElementById('btnCloseContactModal');
    this.btnConfirmContact = document.getElementById('btnConfirmContact');
    this.toastNotification = document.getElementById('toastNotification');
    this.toastMessage = document.getElementById('toastMessage');
  }

  bindEvents() {
    // View mode switches
    this.btnViewGrid.addEventListener('click', () => this.setViewMode('grid'));
    this.btnViewSingle.addEventListener('click', () => this.setViewMode('single'));

    // Single screen tabs
    this.screenTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const screenNum = parseInt(tab.dataset.screen, 10);
        this.setSingleScreen(screenNum);
      });
    });

    // Reset Data
    this.btnResetData.addEventListener('click', () => {
      if (confirm('ต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นตามภาพตัวอย่างหรือไม่?')) {
        this.jobs = JSON.parse(JSON.stringify(defaultJobs));
        this.selectedJobId = 'FX-001';
        this.saveData();
        this.render();
        this.showToast('รีเซ็ตข้อมูลเรียบร้อยแล้ว');
      }
    });

    // Search
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderJobList();
    });

    // Filter tabs
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderJobList();
      });
    });

    // Open Add Job
    this.btnOpenNewJobModal.addEventListener('click', () => {
      if (this.currentViewMode === 'single') {
        this.setSingleScreen(2);
      }
      this.inputCustomerName.focus();
      this.showToast('กรอกข้อมูลใน SCREEN 2 เพื่อบันทึกรับงานใหม่');
    });

    // Cancel Form
    this.btnCancelNewJob.addEventListener('click', () => {
      this.newJobForm.reset();
      this.showToast('ยกเลิกการกรอกข้อมูล');
      if (this.currentViewMode === 'single') {
        this.setSingleScreen(1);
      }
    });

    // Submit Form (New Job)
    this.newJobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCreateJob();
    });

    // Status Step Buttons in Screen 3
    this.statusStepButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.statusId, 10);
        this.setStatusPicker(step);
      });
    });

    // Update Status Action
    this.btnUpdateJobStatus.addEventListener('click', () => {
      this.handleUpdateStatus();
    });

    // Contact Modal
    this.btnContactShop.addEventListener('click', () => {
      this.contactModal.classList.add('show');
    });
    this.btnCloseContactModal.addEventListener('click', () => {
      this.contactModal.classList.remove('show');
    });
    this.btnConfirmContact.addEventListener('click', () => {
      this.contactModal.classList.remove('show');
    });
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    if (mode === 'grid') {
      this.btnViewGrid.classList.add('active');
      this.btnViewSingle.classList.remove('active');
      this.singleScreenTabs.classList.add('hidden');
      this.mainContainer.classList.remove('single-view');
      this.mainContainer.classList.add('grid-view');
    } else {
      this.btnViewGrid.classList.remove('active');
      this.btnViewSingle.classList.add('active');
      this.singleScreenTabs.classList.remove('hidden');
      this.mainContainer.classList.remove('grid-view');
      this.mainContainer.classList.add('single-view');
      this.setSingleScreen(this.activeSingleScreen);
    }
  }

  setSingleScreen(screenNum) {
    this.activeSingleScreen = screenNum;
    this.screenTabs.forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.dataset.screen, 10) === screenNum);
    });

    Object.keys(this.windowCards).forEach(key => {
      const card = this.windowCards[key];
      if (parseInt(key, 10) === screenNum) {
        card.classList.add('active-single');
      } else {
        card.classList.remove('active-single');
      }
    });
  }

  getSelectedJob() {
    return this.jobs.find(j => j.id === this.selectedJobId) || this.jobs[0];
  }

  handleCreateJob() {
    const name = this.inputCustomerName.value.trim();
    const phone = this.inputCustomerPhone.value.trim();
    const device = this.inputDeviceModel.value.trim();
    const symptoms = this.inputSymptoms.value.trim();
    const estimate = this.inputInitEstimate.value.trim();

    if (!name || !phone || !device || !symptoms) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Generate Next ID: #FX-003, #FX-004, ...
    const maxNum = this.jobs.reduce((max, job) => {
      const match = job.id.match(/\d+/);
      const val = match ? parseInt(match[0], 10) : 0;
      return Math.max(max, val);
    }, 0);
    const newId = `FX-${String(maxNum + 1).padStart(3, '0')}`;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

    const newJob = {
      id: newId,
      customerName: name,
      phone: phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-xxxx'),
      fullPhone: phone,
      deviceType: device.includes('iPad') || device.includes('iPhone') ? 'Apple Device' : 'อุปกรณ์',
      deviceModel: device,
      dashModel: device,
      symptomSummary: symptoms.length > 35 ? symptoms.substring(0, 32) + '...' : symptoms,
      symptomDetail: symptoms,
      receivedTime: timeStr,
      statusStep: 1, // Start at รอดำเนินการ
      techNotes: estimate ? `ตรวจรับเครื่อง | ประเมิน ${estimate}` : 'รับเครื่องเข้าระบบ รอช่างตรวจเช็ก',
      timeline: [
        { step: 1, title: 'รับเครื่องเข้าระบบเรียบร้อย', time: timeStr },
        { step: 2, title: 'กำลังตรวจซ่อม / เปลี่ยนชิ้นส่วน (ปัจจุบัน)', time: '-' },
        { step: 3, title: 'ทดสอบระบบหลังซ่อม / พร้อมรับเครื่อง', time: '-' },
        { step: 4, title: 'ส่งมอบเครื่องและรับประกันงานซ่อม', time: '-' }
      ]
    };

    this.jobs.unshift(newJob);
    this.selectedJobId = newId;
    this.saveData();

    this.render();
    this.showToast(`บันทึกรับงานใหม่สำเร็จ! รหัส ${newId}`);

    if (this.currentViewMode === 'single') {
      this.setSingleScreen(1);
    }
  }

  setStatusPicker(step) {
    this.selectedStatusPicker = step;
    this.statusStepButtons.forEach(btn => {
      const btnStep = parseInt(btn.dataset.statusId, 10);
      btn.classList.toggle('active', btnStep === step);
      const checkSpan = btn.querySelector('.check-mark');
      if (btnStep === step) {
        if (!checkSpan) {
          const mark = document.createElement('span');
          mark.className = 'check-mark';
          mark.textContent = ' ✓';
          btn.appendChild(mark);
        }
      } else {
        if (checkSpan) checkSpan.remove();
      }
    });
  }

  handleUpdateStatus() {
    const job = this.getSelectedJob();
    if (!job) return;

    job.statusStep = this.selectedStatusPicker;
    job.techNotes = this.techNotesInput.value.trim();

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

    // Update timeline times
    if (job.timeline && job.timeline[job.statusStep - 1]) {
      if (job.timeline[job.statusStep - 1].time === '-') {
        job.timeline[job.statusStep - 1].time = timeStr;
      }
    }

    this.saveData();
    this.render();
    this.showToast(`อัปเดตสถานะงาน #${job.id} เป็น "${statusMeta[job.statusStep].label}" แล้ว`);
  }

  selectJob(jobId) {
    this.selectedJobId = jobId;
    const job = this.getSelectedJob();
    if (job) {
      this.selectedStatusPicker = job.statusStep;
    }
    this.render();
    this.showToast(`เลือกดูข้อมูลงาน #${jobId}`);
  }

  showToast(message) {
    this.toastMessage.textContent = message;
    this.toastNotification.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastNotification.classList.remove('show');
    }, 3200);
  }

  render() {
    this.renderCounts();
    this.renderJobList();
    this.renderScreen3Details();
    this.renderScreen4Tracking();
  }

  renderCounts() {
    const total = this.jobs.length;
    const pending = this.jobs.filter(j => j.statusStep === 1).length;
    const repairing = this.jobs.filter(j => j.statusStep === 2).length;
    const done = this.jobs.filter(j => j.statusStep === 3 || j.statusStep === 4).length;

    this.countAll.textContent = total;
    this.countPending.textContent = pending;
    this.countRepairing.textContent = repairing;
    this.countDone.textContent = done;
  }

  renderJobList() {
    let filtered = [...this.jobs];

    // Filter by tab
    if (this.currentFilter === 'pending') {
      filtered = filtered.filter(j => j.statusStep === 1);
    } else if (this.currentFilter === 'repairing') {
      filtered = filtered.filter(j => j.statusStep === 2);
    } else if (this.currentFilter === 'done') {
      filtered = filtered.filter(j => j.statusStep === 3 || j.statusStep === 4);
    }

    // Search query
    if (this.searchQuery) {
      filtered = filtered.filter(j => {
        return j.id.toLowerCase().includes(this.searchQuery) ||
          j.customerName.toLowerCase().includes(this.searchQuery) ||
          j.phone.includes(this.searchQuery) ||
          (j.fullPhone && j.fullPhone.includes(this.searchQuery)) ||
          j.deviceModel.toLowerCase().includes(this.searchQuery);
      });
    }

    if (filtered.length === 0) {
      this.jobListContainer.innerHTML = `
        <div style="text-align: center; padding: 32px 10px; color: #64748b; font-size: 0.88rem;">
          ไม่พบรายการงานซ่อมที่ตรงกับเงื่อนไข
        </div>
      `;
      return;
    }

    this.jobListContainer.innerHTML = filtered.map(job => {
      const meta = statusMeta[job.statusStep] || statusMeta[1];
      const isSelected = job.id === this.selectedJobId;
      const deviceIcon = job.deviceModel.toLowerCase().includes('phone') || job.deviceModel.toLowerCase().includes('iphone') 
        ? '📱' 
        : job.deviceModel.toLowerCase().includes('pad') 
        ? '📲' 
        : '💻';

      return `
        <div class="job-card ${isSelected ? 'selected-job' : ''}" data-job-id="${job.id}">
          <div class="job-card-header">
            <div class="job-title-group">
              <span class="job-id">#${job.id}</span>
              <span class="customer-name">${job.customerName}</span>
            </div>
            <span class="status-badge ${meta.badgeClass}">
              <span class="badge-dot">${meta.icon}</span> ${meta.label}
            </span>
          </div>

          <div class="job-device-row">
            <span class="device-icon">${deviceIcon}</span>
            <span class="device-text">${job.deviceModel}</span>
            <span class="symptom-text">| อาการ: ${job.symptomSummary}</span>
          </div>

          <div class="job-card-footer">
            <div class="job-meta-info">
              เบอร์โทร: ${job.phone} | รับเมื่อ: ${job.receivedTime}
            </div>
            <a href="javascript:void(0)" class="job-action-link" data-action-job="${job.id}">
              จัดการงาน &rarr;
            </a>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events on cards
    this.jobListContainer.querySelectorAll('.job-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const jobId = card.dataset.jobId;
        this.selectJob(jobId);
        if (this.currentViewMode === 'single' && !e.target.classList.contains('job-action-link')) {
          this.setSingleScreen(3);
        }
      });
    });

    this.jobListContainer.querySelectorAll('.job-action-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const jobId = link.dataset.actionJob;
        this.selectJob(jobId);
        if (this.currentViewMode === 'single') {
          this.setSingleScreen(3);
        }
      });
    });
  }

  renderScreen3Details() {
    const job = this.getSelectedJob();
    if (!job) return;

    this.detailJobId.textContent = `#${job.id} (${job.deviceModel})`;
    this.detailCustomerName.textContent = job.customerName;
    this.detailCustomerPhone.textContent = job.phone;
    this.detailSymptoms.textContent = job.symptomDetail || job.symptomSummary;

    const meta = statusMeta[job.statusStep] || statusMeta[1];
    this.detailCurrentBadge.className = `status-badge ${meta.badgeClass}`;
    this.detailCurrentBadge.querySelector('.badge-dot').textContent = meta.icon;
    this.detailCurrentStatusText.textContent = meta.label;

    this.setStatusPicker(job.statusStep);
    this.techNotesInput.value = job.techNotes || '';
  }

  renderScreen4Tracking() {
    const job = this.getSelectedJob();
    if (!job) return;

    const meta = statusMeta[job.statusStep] || statusMeta[1];
    this.trackJobTitle.innerHTML = `งานซ่อม <span class="highlight-id">#${job.id}: ${job.dashModel || job.deviceModel}</span>`;
    this.trackStatusHighlight.textContent = meta.trackText;

    // Build timeline items
    const stepTitles = [
      'รับเครื่องเข้าระบบเรียบร้อย',
      job.statusStep === 2 ? 'กำลังตรวจซ่อม / เปลี่ยนชิ้นส่วน (ปัจจุบัน)' : 'กำลังตรวจซ่อม / เปลี่ยนชิ้นส่วน',
      job.statusStep === 3 ? 'ทดสอบระบบหลังซ่อม / พร้อมรับเครื่อง (ปัจจุบัน)' : 'ทดสอบระบบหลังซ่อม / พร้อมรับเครื่อง',
      job.statusStep === 4 ? 'ส่งมอบเครื่องและรับประกันงานซ่อม (เรียบร้อย)' : 'ส่งมอบเครื่องและรับประกันงานซ่อม'
    ];

    const currentStep = job.statusStep;

    const timelineHtml = stepTitles.map((title, index) => {
      const stepNum = index + 1;
      let stateClass = 'pending';
      let markerContent = '<span class="marker-circle"></span>';

      if (stepNum < currentStep) {
        stateClass = 'completed';
        markerContent = '<span class="marker-icon">✓</span>';
      } else if (stepNum === currentStep) {
        stateClass = 'active';
        markerContent = '<span class="marker-dot"></span>';
      }

      const stepTime = (job.timeline && job.timeline[index] && job.timeline[index].time) ? job.timeline[index].time : '-';

      return `
        <div class="timeline-item ${stateClass}" data-step="${stepNum}">
          <div class="timeline-marker">
            ${markerContent}
          </div>
          <div class="timeline-content">
            <div class="timeline-title">${title}</div>
            <div class="timeline-time">${stepTime}</div>
          </div>
        </div>
      `;
    }).join('');

    this.trackingTimeline.innerHTML = timelineHtml;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.repairApp = new RepairApp();
});
