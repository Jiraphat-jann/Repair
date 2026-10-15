import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultJobs, STORAGE_KEY, USER_STORAGE_KEY, predefinedAccounts, statusMeta } from '../data/initialData';

const RepairContext = createContext();

export function RepairProvider({ children }) {
  // Jobs state
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load localStorage jobs', e);
    }
    return defaultJobs;
  });

  const [selectedJobId, setSelectedJobId] = useState(() => {
    return defaultJobs[0]?.id || 'FX-001';
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Failed to load user auth', e);
    }
    // Default to admin account for instant ready-to-use experience
    return predefinedAccounts[0]; // Admin by default
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('single'); // 'grid' | 'single' (default to 'single' for ready app)
  const [activeSingleScreen, setActiveSingleScreen] = useState(1);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [receiptJob, setReceiptJob] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Save jobs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [jobs]);

  // Save current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  }, [currentUser]);

  // Ensure selectedJobId is valid
  useEffect(() => {
    if (jobs.length > 0 && !jobs.some(j => j.id === selectedJobId)) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const userRole = currentUser ? currentUser.role : 'customer';
  const isAdmin = userRole === 'admin';
  const isTech = userRole === 'tech' || userRole === 'admin';
  const isStaff = userRole === 'staff' || userRole === 'admin';
  const isLoggedIn = !!currentUser;

  // Auto-redirect away from screens if not authorized
  useEffect(() => {
    if (!isAdmin && !isTech && activeSingleScreen === 3) {
      setActiveSingleScreen(1);
    }
    // Technician's duty is to wait and accept jobs in workshop, not front-desk customer intake
    if (userRole === 'tech' && activeSingleScreen === 2) {
      setActiveSingleScreen(1);
    }
  }, [isAdmin, isTech, userRole, activeSingleScreen]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Login handler
  const login = (username, password) => {
    const matched = predefinedAccounts.find(
      acc => acc.username.toLowerCase() === username.trim().toLowerCase() && acc.password === password
    );

    if (matched) {
      setCurrentUser(matched);
      setLoginModalOpen(false);
      showToast(`🎉 ยินดีต้อนรับ ${matched.name} เข้าสู่ระบบ!`, 'success');
      return { success: true, user: matched };
    } else {
      showToast(`❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง`, 'error');
      return { success: false, message: 'Invalid credentials' };
    }
  };

  // Quick 1-click login
  const quickLogin = (roleType) => {
    const account = predefinedAccounts.find(a => a.role === roleType) || predefinedAccounts[0];
    setCurrentUser(account);
    setLoginModalOpen(false);
    showToast(`⚡ เข้าสู่ระบบสำเร็จ: ${account.name}`, 'success');
    return account;
  };

  // Switch to Customer mode (Logout)
  const logout = () => {
    setCurrentUser(null);
    showToast('👋 ออกจากระบบแล้ว สลับเป็นโหมดลูกค้าทั่วไป', 'info');
    if (activeSingleScreen === 3) {
      setActiveSingleScreen(1);
    }
  };

  // Direct role setter helper
  const setUserRole = (role) => {
    if (role === 'admin') {
      setCurrentUser(predefinedAccounts[0]);
    } else if (role === 'tech') {
      setCurrentUser(predefinedAccounts[1]);
    } else if (role === 'staff' || role === 'user') {
      setCurrentUser(predefinedAccounts[2]);
    } else {
      setCurrentUser(null);
    }
  };

  const canAccessScreen = (screenNum) => {
    if (screenNum === 3 && !isAdmin && !isTech) return false;
    if (screenNum === 2 && userRole === 'tech') return false;
    return true;
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0] || null;

  const getNextJobId = () => {
    const num = jobs.length + 1;
    return `FX-${String(num).padStart(3, '0')}`;
  };

  const addJob = (jobData) => {
    const newId = getNextJobId();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

    const partsCost = Number(jobData.partsCost) || 0;
    const laborCost = Number(jobData.laborCost) || 0;
    const totalPrice = partsCost + laborCost;

    const newJob = {
      id: newId,
      customerName: jobData.customerName.trim(),
      phone: jobData.phone.trim().replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-xxxx'),
      fullPhone: jobData.phone.trim(),
      deviceType: jobData.deviceModel.toLowerCase().includes('phone') || jobData.deviceModel.toLowerCase().includes('iphone') ? 'สมาร์ตโฟน' : 'อุปกรณ์ไอที',
      deviceModel: jobData.deviceModel.trim(),
      dashModel: jobData.deviceModel.trim(),
      symptomSummary: jobData.symptoms.length > 30 ? jobData.symptoms.substring(0, 30) + '...' : jobData.symptoms,
      symptomDetail: jobData.symptoms.trim(),
      receivedTime: timeStr,
      statusStep: 1, // 1: รอดำเนินการ
      assignedTech: jobData.assignedTech || 'นายธีรภัทร ช่างซ่อมชำนาญการ',
      techNotes: jobData.techNotes || 'รอช่างเปิดตรวจเช็กอาการ',
      partsCost: partsCost,
      laborCost: laborCost,
      totalPrice: totalPrice,
      warrantyDays: jobData.warrantyDays || 90,
      timeline: [
        { step: 1, title: 'รับเครื่องเข้าระบบเรียบร้อย', time: timeStr },
        { step: 2, title: 'กำลังตรวจซ่อม / เปลี่ยนชิ้นส่วน', time: '-' },
        { step: 3, title: 'ทดสอบระบบหลังซ่อม / พร้อมรับเครื่อง', time: '-' },
        { step: 4, title: 'ส่งมอบเครื่องและรับประกันงานซ่อม', time: '-' }
      ]
    };

    setJobs(prev => [newJob, ...prev]);
    setSelectedJobId(newId);
    showToast(`✅ บันทึกรับงานใหม่สำเร็จ [ รหัส #${newId} ]`);
  };

  const updateJobStatus = (id, newStep, notes, priceData = {}) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

    setJobs(prev => prev.map(job => {
      if (job.id !== id) return job;

      const updatedTimeline = job.timeline.map(item => {
        if (item.step === newStep) {
          return { ...item, time: timeStr };
        }
        return item;
      });

      const partsCost = priceData.partsCost !== undefined ? Number(priceData.partsCost) : (job.partsCost || 0);
      const laborCost = priceData.laborCost !== undefined ? Number(priceData.laborCost) : (job.laborCost || 0);
      const totalPrice = partsCost + laborCost;
      const warrantyDays = priceData.warrantyDays !== undefined ? Number(priceData.warrantyDays) : (job.warrantyDays || 90);
      const assignedTech = priceData.assignedTech !== undefined ? priceData.assignedTech : (job.assignedTech || 'นายธีรภัทร ช่างซ่อมชำนาญการ');

      return {
        ...job,
        statusStep: newStep,
        techNotes: notes !== undefined ? notes : job.techNotes,
        assignedTech,
        partsCost,
        laborCost,
        totalPrice,
        warrantyDays,
        timeline: updatedTimeline
      };
    }));

    const statusLabel = statusMeta[newStep]?.label || '';
    showToast(`🔄 อัปเดตสถานะ #${id} เป็น "${statusLabel}" เรียบร้อยแล้ว`);
  };

  // Technician accepts/claims a job to work on
  const acceptJob = (id, technicianName) => {
    const tech = technicianName || (currentUser?.name ? currentUser.name.split(' (')[0] : 'นายธีรภัทร ช่างซ่อมชำนาญการ');
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

    setJobs(prev => prev.map(job => {
      if (job.id !== id) return job;

      const updatedTimeline = job.timeline.map(item => {
        if (item.step === 2) {
          return { ...item, title: 'ช่างรับงานแล้ว / กำลังตรวจซ่อมและเปลี่ยนชิ้นส่วน', time: timeStr };
        }
        return item;
      });

      return {
        ...job,
        statusStep: 2, // 2: กำลังซ่อม
        assignedTech: tech,
        techNotes: job.techNotes && job.techNotes !== 'รอช่างเปิดตรวจเช็กอาการ' ? job.techNotes : `ช่าง ${tech} รับงานเข้าระบบแล้ว กำลังเริ่มตรวจซ่อม`,
        timeline: updatedTimeline
      };
    }));

    showToast(`⚡ ช่างรับงาน #${id} เรียบร้อยแล้ว! สถานะเปลี่ยนเป็น "กำลังซ่อม"`, 'success');
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    showToast(`🗑️ ลบงานซ่อม #${id} เรียบร้อยแล้ว`, 'info');
  };

  const resetData = () => {
    setJobs(defaultJobs);
    setSelectedJobId('FX-001');
    setCurrentFilter('all');
    setSearchQuery('');
    showToast('🔄 รีเซ็ตข้อมูลตั้งต้นเรียบร้อยแล้ว');
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const matchFilter = (() => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'pending') return job.statusStep === 1;
      if (currentFilter === 'repairing') return job.statusStep === 2;
      if (currentFilter === 'done') return job.statusStep === 3;
      if (currentFilter === 'delivered') return job.statusStep === 4;
      return true;
    })();

    const matchSearch = (() => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        job.id.toLowerCase().includes(q) ||
        job.customerName.toLowerCase().includes(q) ||
        job.phone.toLowerCase().includes(q) ||
        (job.fullPhone && job.fullPhone.toLowerCase().includes(q)) ||
        job.deviceModel.toLowerCase().includes(q) ||
        job.symptomDetail.toLowerCase().includes(q)
      );
    })();

    return matchFilter && matchSearch;
  });

  const counts = {
    all: jobs.length,
    pending: jobs.filter(j => j.statusStep === 1).length,
    repairing: jobs.filter(j => j.statusStep === 2).length,
    done: jobs.filter(j => j.statusStep === 3).length,
    delivered: jobs.filter(j => j.statusStep === 4).length
  };

  // Calculate Admin Revenue statistics
  const totalEstimatedRevenue = jobs.reduce((sum, j) => sum + (Number(j.totalPrice) || 0), 0);
  const completedRevenue = jobs
    .filter(j => j.statusStep === 3 || j.statusStep === 4)
    .reduce((sum, j) => sum + (Number(j.totalPrice) || 0), 0);

  return (
    <RepairContext.Provider value={{
      jobs,
      filteredJobs,
      selectedJobId,
      setSelectedJobId,
      selectedJob,
      currentFilter,
      setCurrentFilter,
      searchQuery,
      setSearchQuery,
      viewMode,
      setViewMode,
      activeSingleScreen,
      setActiveSingleScreen,
      // Authentication
      currentUser,
      userRole,
      isAdmin,
      isTech,
      isStaff,
      isLoggedIn,
      loginModalOpen,
      setLoginModalOpen,
      login,
      quickLogin,
      logout,
      setUserRole,
      canAccessScreen,
      // Modals & Actions
      contactModalOpen,
      setContactModalOpen,
      receiptJob,
      setReceiptJob,
      toast,
      showToast,
      addJob,
      updateJobStatus,
      acceptJob,
      deleteJob,
      resetData,
      counts,
      totalEstimatedRevenue,
      completedRevenue
    }}>
      {children}
    </RepairContext.Provider>
  );
}

export function useRepair() {
  const context = useContext(RepairContext);
  if (!context) {
    throw new Error('useRepair must be used within a RepairProvider');
  }
  return context;
}
