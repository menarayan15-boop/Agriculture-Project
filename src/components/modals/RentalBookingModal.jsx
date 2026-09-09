import React, { useState } from 'react';
import { bookEquipment } from '../../services/api';

export function RentalBookingModal({ equipment, onClose }) {
  const [hours, setHours] = useState(4);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!equipment) return null;

  const totalCost = (equipment.rate_hourly || 800) * hours;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await bookEquipment({
      equipment_id: equipment.id,
      name,
      phone,
      hours,
      date
    });
    setSubmitting(false);
    if (res.success) {
      setBookingStatus(res.message);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content card" style={{ maxWidth: '520px', width: '92%', padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 18, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#17211B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#D97706' }}>🚜</span> Book {equipment.name}
          </h3>
          <button className="btn-close" onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
        </div>

        {bookingStatus ? (
          <div style={{ margin: '2rem 0', textAlign: 'center', color: '#15803D' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#15803D' }}></i>
            <h4 style={{ color: '#15803D', fontWeight: 700 }}>{bookingStatus}</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Booking Duration (Hours):</label>
              <input type="number" min="1" max="72" value={hours} onChange={e => setHours(parseInt(e.target.value) || 1)} className="form-control" style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#17211B' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Booking Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-control" style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#17211B' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Renter Farmer Name:</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-control" placeholder="e.g. Gurpreet Singh" style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#17211B' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Phone Number:</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="form-control" placeholder="+91 98000 12345" style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#17211B' }} />
            </div>

            <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '12px 16px', borderRadius: '12px', margin: '1.2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>Total Estimated Cost:</span>
              <strong style={{ color: '#15803D', fontSize: '1.25rem', fontWeight: 800 }}>₹{totalCost.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#F3F4F6', color: '#4B5563', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 10, border: 'none', background: '#15803D', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>{submitting ? 'Confirming...' : 'Confirm Rental Booking'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

