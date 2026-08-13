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
      <div className="modal-content card" style={{ maxWidth: '540px', width: '92%', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3><i className="fa-solid fa-tractor" style={{ color: '#f97316' }}></i> Book Equipment: {equipment.name}</h3>
          <button className="btn-close" onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
        </div>

        {bookingStatus ? (
          <div style={{ margin: '2rem 0', textAlign: 'center', color: '#4ade80' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <h4>{bookingStatus}</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: '1.2rem' }}>
            <div className="form-group">
              <label>Booking Duration (Hours):</label>
              <input type="number" min="1" max="72" value={hours} onChange={e => setHours(parseInt(e.target.value) || 1)} className="form-control" />
            </div>

            <div className="form-group">
              <label>Booking Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-control" />
            </div>

            <div className="form-group">
              <label>Renter Farmer Name:</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-control" placeholder="e.g. Gurpreet Singh" />
            </div>

            <div className="form-group">
              <label>Phone Number:</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="form-control" placeholder="+91 98000 12345" />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', margin: '1rem 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Estimated Cost:</span>
              <strong style={{ color: '#4ade80', fontSize: '1.2rem' }}>₹{totalCost.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Confirming...' : 'Confirm Rental Booking'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
