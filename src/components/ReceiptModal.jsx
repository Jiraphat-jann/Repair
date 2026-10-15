import React from 'react';
import { useRepair } from '../context/RepairContext';
import { statusMeta } from '../data/initialData';
import { Printer, X, ShieldCheck, QrCode, CheckCircle, FileText } from 'lucide-react';

export default function ReceiptModal() {
  const { receiptJob, setReceiptJob } = useRepair();

  if (!receiptJob) return null;

  const meta = statusMeta[receiptJob.statusStep] || statusMeta[1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={() => setReceiptJob(null)}>
      <div className="modal-card receipt-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <FileText className="modal-header-icon" size={20} />
            <h3>ใบรับซ่อม / ใบเสร็จรับเงินบริการ</h3>
          </div>
          <button
            type="button"
            className="btn-close-modal"
            onClick={() => setReceiptJob(null)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body printable-area">
          <div className="receipt-paper">
            <div className="receipt-header">
              <h2>RepairFlow Tech Service</h2>
              <p className="sub">ศูนย์บริการและซ่อมบำรุงอุปกรณ์ไอทีมาตรฐาน (Admin & Technician Pro)</p>
              <div className="divider-dashed"></div>
            </div>

            <div className="receipt-grid">
              <div className="receipt-row">
                <span className="receipt-label">หมายเลขใบรับงาน:</span>
                <span className="receipt-value-bold">#{receiptJob.id}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">วันที่/เวลา รับเครื่อง:</span>
                <span className="receipt-value">{receiptJob.receivedTime}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">ชื่อลูกค้า:</span>
                <span className="receipt-value-bold">{receiptJob.customerName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">เบอร์โทรศัพท์:</span>
                <span className="receipt-value">{receiptJob.fullPhone || receiptJob.phone}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">อุปกรณ์ / รุ่น:</span>
                <span className="receipt-value-bold">{receiptJob.dashModel || receiptJob.deviceModel}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">อาการเสียที่ระบุ:</span>
                <span className="receipt-value">{receiptJob.symptomDetail || receiptJob.symptomSummary}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">สถานะปัจจุบัน:</span>
                <span className={`receipt-status-pill ${meta.badgeClass}`}>{meta.label}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">ช่างผู้ดูแลงานซ่อม:</span>
                <span className="receipt-value-bold">{receiptJob.assignedTech || 'นายธีรภัทร ช่างซ่อมชำนาญการ'}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">บันทึกช่าง / การซ่อม:</span>
                <span className="receipt-value">{receiptJob.techNotes || '-'}</span>
              </div>
            </div>

            {/* Price Breakdown */}
            {receiptJob.totalPrice ? (
              <div className="receipt-price-box">
                <div className="divider-dashed"></div>
                <div className="price-item-row">
                  <span>ค่าอะไหล่ / ชิ้นส่วน:</span>
                  <span>฿{(receiptJob.partsCost || 0).toLocaleString()}</span>
                </div>
                <div className="price-item-row">
                  <span>ค่าบริการ / ค่าแรงช่าง:</span>
                  <span>฿{(receiptJob.laborCost || 0).toLocaleString()}</span>
                </div>
                <div className="price-item-row grand-total">
                  <strong>ยอดชำระสุทธิ:</strong>
                  <strong className="text-emerald">฿{(receiptJob.totalPrice || 0).toLocaleString()} บาท</strong>
                </div>
              </div>
            ) : null}

            <div className="divider-dashed"></div>

            <div className="receipt-footer-terms">
              <div className="qr-box">
                <QrCode size={52} className="qr-icon" />
                <span className="qr-caption">สแกนติดตามงาน</span>
              </div>
              <div className="terms-text">
                <p>📌 กรุณานำใบรับซ่อมหรือแสดงรหัส #{receiptJob.id} เมื่อมารับเครื่อง</p>
                <p>🛡️ รับประกันงานซ่อมและเปลี่ยนอะไหล่ {receiptJob.warrantyDays || 90} วัน</p>
                <p>📞 ฝ่ายบริการลูกค้า: 081-999-0001 (เปิดบริการ 09:00 - 20:00 น.)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setReceiptJob(null)}
          >
            ปิด
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>พิมพ์เอกสาร (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
