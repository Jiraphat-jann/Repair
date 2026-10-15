import React, { useState } from 'react';
import { useRepair } from '../context/RepairContext';
import { Save, RotateCcw, CheckCircle2, Sparkles, User, Phone, Laptop, AlertCircle, Wrench } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Screen2NewJob() {
  const { addJob, setActiveSingleScreen, currentUser } = useRepair();

  const [formData, setFormData] = useState({
    customerName: 'นายสมศักดิ์ ขยันงาน',
    phone: '082-999-8877',
    deviceModel: 'iPad Air 5 (Wi-Fi / Space Gray)',
    symptoms: 'ชาร์จแบตเตอรี่ไม่เข้า เครื่องร้อนจัดเวลาเสียบสายชาร์จ',
    assignedTech: 'นายธีรภัทร ช่างซ่อมชำนาญการ'
  });

  // Technician's duty is waiting to receive/accept jobs, not front-desk customer intake
  if (currentUser?.role === 'tech') {
    return (
      <section className="window-card window-card-restricted" id="screenWindow2">
        <div className="window-header">
          <div className="traffic-lights">
            <span className="light red"></span>
            <span className="light yellow"></span>
            <span className="light green"></span>
          </div>
          <div className="window-title">📝 แบบฟอร์มบันทึกรับเครื่องซ่อมใหม่ (เฉพาะเจ้าหน้าที่หน้าร้าน)</div>
          <span className="role-lock-tag" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
            STAFF FRONT-DESK ONLY
          </span>
        </div>
        <div className="window-body restricted-access-body">
          <div className="restricted-icon-wrap" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.1)' }}>
            <Wrench size={42} className="text-emerald" />
          </div>
          <h3 className="restricted-title">หน้ารับเครื่องซ่อมจากลูกค้า (หน้าที่ของเจ้าหน้าที่หน้าร้าน)</h3>
          <p className="restricted-desc">
            ในฐานะช่างซ่อม คุณมีหน้าที่ <strong>รอรับงานที่หน้าร้านบันทึกส่งเข้ามา</strong><br />
            กรุณาไปที่หน้า Dashboard เพื่อดูคิวงานและ <strong>กดรับงานซ่อม</strong> เข้าสู่ขั้นตอนการซ่อม
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setActiveSingleScreen(1)}
          >
            <span>👉 ไปที่ Dashboard เพื่อดูคิวรอรับงาน</span>
          </button>
        </div>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.deviceModel.trim() || !formData.symptoms.trim()) {
      alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน');
      return;
    }

    addJob(formData);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {}

    // Reset form to template
    setFormData({
      customerName: '',
      phone: '',
      deviceModel: '',
      symptoms: '',
      assignedTech: 'นายธีรภัทร ช่างซ่อมชำนาญการ'
    });

    setActiveSingleScreen(1);
  };

  const handleResetForm = () => {
    setFormData({
      customerName: '',
      phone: '',
      deviceModel: '',
      symptoms: '',
      assignedTech: 'นายธีรภัทร ช่างซ่อมชำนาญการ'
    });
  };

  const handleFillSample = () => {
    setFormData({
      customerName: 'นายประสิทธิ์ มั่นคง',
      phone: '086-555-4321',
      deviceModel: 'MacBook Pro M1 14"',
      symptoms: 'พัดลมหมุนเสียงดัง เครื่องดับเองเวลาเปิดโปรแกรมตัดต่อ',
      assignedTech: 'นายธีรภัทร ช่างซ่อมชำนาญการ'
    });
  };

  return (
    <section className="window-card" id="screenWindow2">
      <div className="window-header">
        <div className="traffic-lights">
          <span className="light red"></span>
          <span className="light yellow"></span>
          <span className="light green"></span>
        </div>
        <div className="window-title">📝 แบบฟอร์มบันทึกรับเครื่องซ่อมใหม่</div>
        <button
          type="button"
          className="quick-sample-btn"
          onClick={handleFillSample}
          title="เติมข้อมูลตัวอย่างอัตโนมัติ"
        >
          <Sparkles size={14} />
          <span>เติมข้อมูลตัวอย่าง</span>
        </button>
      </div>

      <div className="window-body">
        <form onSubmit={handleSubmit} className="standard-form fullscreen-form">
          <div className="form-grid-2col">
            <div className="form-group">
              <label htmlFor="customerName">
                <User size={15} />
                <span>ชื่อ-นามสกุล ลูกค้า <span className="req-star">*</span></span>
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                placeholder="เช่น นายสมศักดิ์ ขยันงาน"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={15} />
                <span>เบอร์โทรศัพท์ติดต่อ <span className="req-star">*</span></span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="เช่น 082-999-8877"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="deviceModel">
              <Laptop size={15} />
              <span>ประเภท และ รุ่นอุปกรณ์ / ยี่ห้อ <span className="req-star">*</span></span>
            </label>
            <input
              type="text"
              id="deviceModel"
              name="deviceModel"
              placeholder="เช่น iPad Air 5 (Wi-Fi / Space Gray) หรือ MacBook Pro M2"
              value={formData.deviceModel}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="symptoms">
              <AlertCircle size={15} />
              <span>อาการเสียเบื้องต้น / รายละเอียดการส่งซ่อม <span className="req-star">*</span></span>
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              rows="4"
              placeholder="ระบุอาการเสีย สภาพภายนอกของตัวเครื่อง หรือประวัติการซ่อม..."
              value={formData.symptoms}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTech">
              <Wrench size={15} />
              <span>ช่างผู้รับผิดชอบงานซ่อม (มอบหมายงาน)</span>
            </label>
            <select
              id="assignedTech"
              name="assignedTech"
              value={formData.assignedTech}
              onChange={handleChange}
              className="select-custom"
            >
              <option value="นายสมชาย วิศวกรซ่อม">👑 นายสมชาย วิศวกรซ่อม (หัวหน้าช่าง)</option>
              <option value="นายธีรภัทร ช่างซ่อมชำนาญการ">🔧 นายธีรภัทร ช่างซ่อมชำนาญการ (ช่างเทคนิคฮาร์ดแวร์)</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleResetForm}
            >
              <RotateCcw size={15} />
              <span>ล้างข้อมูลในฟอร์ม</span>
            </button>
            <button type="submit" className="btn-save-job">
              <Save size={16} />
              <span>บันทึกรับเครื่องเข้าระบบ</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
