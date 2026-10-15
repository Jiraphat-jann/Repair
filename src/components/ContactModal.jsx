import React from 'react';
import { useRepair } from '../context/RepairContext';
import { Phone, MessageSquare, Clock, MapPin, X, Store, CheckCircle } from 'lucide-react';

export default function ContactModal() {
  const { contactModalOpen, setContactModalOpen } = useRepair();

  if (!contactModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setContactModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Store className="modal-header-icon" size={20} />
            <h3>ข้อมูลติดต่อศูนย์บริการร้านซ่อม</h3>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={() => setContactModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="shop-highlight-card">
            <h4>TechFix Pro Service & Repair Center</h4>
            <p>ศูนย์ซ่อมคอมพิวเตอร์ โน้ตบุ๊ก สมาร์ตโฟน และอุปกรณ์ไอทีครบวงจร</p>
          </div>

          <div className="shop-info-list">
            <div className="shop-info-row">
              <Phone size={18} className="contact-info-icon text-blue" />
              <div className="info-col">
                <span className="info-label">เบอร์โทรสายด่วน:</span>
                <a href="tel:0891234567" className="tel-link">089-123-4567 (กดโทรออกได้ทันที)</a>
              </div>
            </div>

            <div className="shop-info-row">
              <MessageSquare size={18} className="contact-info-icon text-green" />
              <div className="info-col">
                <span className="info-label">LINE Official:</span>
                <span className="info-val line-id">@techfix_service</span>
              </div>
            </div>

            <div className="shop-info-row">
              <Clock size={18} className="contact-info-icon text-amber" />
              <div className="info-col">
                <span className="info-label">เวลาเปิดทำการ:</span>
                <span className="info-val">จันทร์ - เสาร์ (09:30 - 19:30 น.)</span>
              </div>
            </div>

            <div className="shop-info-row">
              <MapPin size={18} className="contact-info-icon text-purple" />
              <div className="info-col">
                <span className="info-label">ที่ตั้งร้าน:</span>
                <span className="info-val">อาคารศูนย์การค้าไอทีมอลล์ ชั้น 3 โซน A ห้อง 308</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-primary full-width"
            onClick={() => setContactModalOpen(false)}
          >
            <CheckCircle size={16} />
            <span>ตกลง / ปิดหน้าต่าง</span>
          </button>
        </div>
      </div>
    </div>
  );
}
