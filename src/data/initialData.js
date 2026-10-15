export const STORAGE_KEY = 'repairflow_jobs_data_react_v1';
export const USER_STORAGE_KEY = 'repairflow_auth_user_v1';

export const predefinedAccounts = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'นายสมชาย วิศวกรซ่อม (Admin / หัวหน้าช่าง)',
    shortName: 'สมชาย (Admin)',
    role: 'admin',
    roleLabel: 'ผู้ดูแลระบบ & หัวหน้าช่าง',
    roleBadge: 'ADMIN',
    avatar: '👑',
    email: 'admin@repairflow.tech',
    phone: '081-999-0001'
  },
  {
    username: 'tech',
    password: 'tech123',
    name: 'นายธีรภัทร ช่างซ่อมชำนาญการ (Tech / ช่างซ่อมเทคนิค)',
    shortName: 'ธีรภัทร (Tech)',
    role: 'tech',
    roleLabel: 'ช่างเทคนิคประจำร้าน (มีหน้าที่รอรับงานและตรวจซ่อม)',
    roleBadge: 'TECH',
    avatar: '🔧',
    email: 'tech@repairflow.tech',
    phone: '086-777-0003'
  },
  {
    username: 'staff',
    password: 'staff123',
    name: 'น.ส.วิภาดา พลอยใส (Staff / พนักงานรับเครื่อง)',
    shortName: 'วิภาดา (Staff)',
    role: 'staff',
    roleLabel: 'เจ้าหน้าที่หน้าร้าน (Front Desk)',
    roleBadge: 'STAFF',
    avatar: '👤',
    email: 'staff@repairflow.tech',
    phone: '089-888-0002'
  }
];

export const techniciansList = [
  {
    id: 'tech-01',
    name: 'นายสมชาย วิศวกรซ่อม',
    roleName: 'หัวหน้าช่าง / วิศวกรอิเล็กทรอนิกส์',
    avatar: '👑',
    badge: 'หัวหน้าช่าง'
  },
  {
    id: 'tech-02',
    name: 'นายธีรภัทร ช่างซ่อมชำนาญการ',
    roleName: 'ช่างเทคนิคฮาร์ดแวร์ & วงจร',
    avatar: '🔧',
    badge: 'ช่างประจำร้าน'
  }
];

export const defaultJobs = [
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
    assignedTech: 'นายธีรภัทร ช่างซ่อมชำนาญการ',
    techNotes: 'เปลี่ยนชิป IC ไฟชาร์จ + ค่าแรง | รวม 1,500 บาท',
    partsCost: 1000,
    laborCost: 500,
    totalPrice: 1500,
    warrantyDays: 90,
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
    statusStep: 3,
    assignedTech: 'นายสมชาย วิศวกรซ่อม',
    techNotes: 'เปลี่ยนชุดหน้าจอเกรดแท้ + แถมติดฟิล์มกระจก | รวม 3,800 บาท',
    partsCost: 3200,
    laborCost: 600,
    totalPrice: 3800,
    warrantyDays: 90,
    timeline: [
      { step: 1, title: 'รับเครื่องเข้าระบบเรียบร้อย', time: '11:15 น.' },
      { step: 2, title: 'กำลังตรวจซ่อม / เปลี่ยนชิ้นส่วน', time: '12:00 น.' },
      { step: 3, title: 'ทดสอบระบบหลังซ่อม / พร้อมรับเครื่อง (ปัจจุบัน)', time: '13:30 น.' },
      { step: 4, title: 'ส่งมอบเครื่องและรับประกันงานซ่อม', time: '-' }
    ]
  },
  {
    id: 'FX-003',
    customerName: 'นายประสิทธิ์ วัฒนา',
    phone: '084-555-xxxx',
    fullPhone: '084-555-1234',
    deviceType: 'แท็บเล็ต',
    deviceModel: 'iPad Pro 11"',
    dashModel: 'iPad Pro 11 M2 (2022)',
    symptomSummary: 'แบตเตอรี่เสื่อม บวมดันหน้าจอ',
    symptomDetail: 'แบตเตอรี่บวมดันหน้าจอเผยอ ใช้งานได้ไม่ถึง 30 นาทีเครื่องดับ',
    receivedTime: '13:00 น.',
    statusStep: 1,
    assignedTech: 'นายธีรภัทร ช่างซ่อมชำนาญการ',
    techNotes: 'รอเปิดเครื่องตรวจเช็กแบตเตอรี่เทียบและทำความสะอาดภายใน',
    partsCost: 2200,
    laborCost: 400,
    totalPrice: 2600,
    warrantyDays: 90,
    timeline: [
      { step: 1, title: 'รับเครื่องเข้าระบบเรียบร้อย (ปัจจุบัน)', time: '13:00 น.' },
      { step: 2, title: 'กำลังตรวจซ่อม / เปลี่ยนชิ้นส่วน', time: '-' },
      { step: 3, title: 'ทดสอบระบบหลังซ่อม / พร้อมรับเครื่อง', time: '-' },
      { step: 4, title: 'ส่งมอบเครื่องและรับประกันงานซ่อม', time: '-' }
    ]
  }
];

export const statusMeta = {
  1: {
    key: 'pending',
    label: 'รอดำเนินการ',
    badgeClass: 'status-pending',
    icon: '●',
    trackText: 'รอดำเนินการตรวจสอบอาการและประเมินราคา',
    color: '#38bdf8'
  },
  2: {
    key: 'repairing',
    label: 'กำลังซ่อม',
    badgeClass: 'status-repairing',
    icon: '⚙',
    trackText: 'กำลังดำเนินการซ่อมเปลี่ยนอะไหล่และตรวจสอบวงจร',
    color: '#f59e0b'
  },
  3: {
    key: 'done',
    label: 'ซ่อมเสร็จ',
    badgeClass: 'status-done',
    icon: '✓',
    trackText: 'ซ่อมเสร็จเรียบร้อย ผ่านการทดสอบแล้ว พร้อมรับเครื่อง',
    color: '#10b981'
  },
  4: {
    key: 'delivered',
    label: 'ส่งมอบแล้ว',
    badgeClass: 'status-delivered',
    icon: '📦',
    trackText: 'ส่งมอบเครื่องและเริ่มนับระยะเวลารับประกันงานซ่อม',
    color: '#a855f7'
  }
};
