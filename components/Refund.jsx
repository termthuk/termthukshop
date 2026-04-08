'use client';

import { useState } from 'react';

const Refund = ({ refunds = [], onSave, onDelete, onUpdateStatus, loading = false }) => {
  const [formData, setFormData] = useState({
    date: '2026-04-08',
    buyer: '',
    game: '',
    contact: 'FB',
    amount: '',
    type: 'refund',
    status: 'pending',
    reason: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const games = [
    'Roblox', 'Free Fire', 'L2M', 'AION2', 'Heartopia', 'YMIR', '7K',
    'King Shot', 'NC', 'ROOC', 'Odin', 'ROV', 'Darkwar Survival', 'Dunk City'
  ];

  const contacts = ['FB', 'LINE', 'DIS'];
  const types = [
    { value: 'refund', label: 'คืนเงิน' },
    { value: 'claim', label: 'เคลมสินค้า' },
    { value: 'resend', label: 'ส่งใหม่' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.buyer) newErrors.buyer = 'Buyer is required';
    if (!formData.game) newErrors.game = 'Game is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave({
      date: formData.date,
      buyer: formData.buyer,
      game: formData.game,
      contact: formData.contact,
      amount: parseFloat(formData.amount),
      type: formData.type,
      status: formData.status,
      reason: formData.reason,
      slip: imagePreview,
    });

    setFormData({
      date: '2026-04-08',
      buyer: '',
      game: '',
      contact: 'FB',
      amount: '',
      type: 'refund',
      status: 'pending',
      reason: '',
    });
    setImagePreview(null);
  };

  const statusIcons = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌',
  };

  const statusLabels = {
    pending: 'รอ',
    approved: 'อนุมัติ',
    rejected: 'ปฏิเสธ',
  };

  const statusColors = {
    pending: '#facc15',
    approved: '#4ade80',
    rejected: '#f472b6',
  };

  const typeLabels = {
    refund: 'คืนเงิน',
    claim: 'เคลมสินค้า',
    resend: 'ส่งใหม่',
  };

  return (
    <div style={{
      backgroundColor: '#07070f',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: 'Kanit',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Form */}
        <div style={{
          backgroundColor: '#0f0f1e',
          border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h2 style={{ color: '#a78bfa', marginBottom: '24px', fontSize: '18px', fontWeight: 'bold' }}>New Refund Request</h2>

          <form onSubmit={handleSubmit}>
            {/* Date */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '12px',
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
              }}>
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.22)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Buyer */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '12px',
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
              }}>
                Buyer *
              </label>
              <input
                type="text"
                name="buyer"
                placeholder="Enter buyer name"
                value={formData.buyer}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: `1px solid ${errors.buyer ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              {errors.buyer && <p style={{ color: '#f472b6', fontSize: '12px', marginTop: '4px' }}>{errors.buyer}</p>}
            </div>

            {/* Game */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '12px',
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
              }}>
                Game *
              </label>
              <select
                name="game"
                value={formData.game}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: `1px solid ${errors.game ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select Game</option>
                {games.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
              {errors.game && <p style={{ color: '#f472b6', fontSize: '12px', marginTop: '4px' }}>{errors.game}</p>}
            </div>

            {/* Contact & Type Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{
                  color: '#e2e8f0',
                  fontSize: '12px',
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                }}>
                  Contact
                </label>
                <select
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.22)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontFamily: 'Kanit',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  {contacts.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  color: '#e2e8f0',
                  fontSize: '12px',
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '500',
                }}>
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.22)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontFamily: 'Kanit',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  {types.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '12px',
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
              }}>
                Amount (฿) *
              </label>
              <input
                type="number"
                name="amount"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: `1px solid ${errors.amount ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              {errors.amount && <p style={{ color: '#f472b6', fontSize: '12px', marginTop: '4px' }}>{errors.amount}</p>}
            </div>

            {/* Status Buttons */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '12px',
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
              }}>
                Status
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {['pending', 'approved', 'rejected'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, status }))}
                    style={{
                      padding: '10px',
                      backgroundColor: formData.status === status ? statusColors[status] : 'rgba(139,92,246,0.1)',
                      border: `1px solid ${statusColors[status]}`,
                      borderRadius: '8px',
                      color: formData.status === status ? '#000' : statusColors[status],
                      fontFamily: 'Kanit',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    {statusIcons[status]} {statusLabels[status]}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '12px',
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
              }}>
                Reason *
              </label>
              <textarea
                name="reason"
                placeholder="Explain the reason for this request..."
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: `1px solid ${errors.reason ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
              {errors.reason && <p style={{ color: '#f472b6', fontSize: '12px', marginTop: '4px' }}>{errors.reason}</p>}
            </div>

            {/* Slip Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '12px',
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
              }}>
                Upload Slip
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.22)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              {imagePreview && (
                <div style={{ marginTop: '12px' }}>
                  <img
                    src={imagePreview}
                    alt="Slip Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      border: '1px solid rgba(139,92,246,0.22)',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#8b5cf6',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontFamily: 'Kanit',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Refunds List */}
        <div style={{
          backgroundColor: '#0f0f1e',
          border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h2 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>Refund Requests</h2>

          {refunds.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#64748b',
            }}>
              <p>No refund requests yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {refunds.map((refund, idx) => (
                <div key={refund.id || idx} style={{
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.22)',
                  borderRadius: '8px',
                  padding: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <p style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '4px' }}>{refund.buyer}</p>
                      <p style={{ color: '#64748b', fontSize: '12px' }}>{refund.game} • {refund.amount.toFixed(2)} ฿</p>
                    </div>
                    <span style={{
                      backgroundColor: statusColors[refund.status],
                      color: refund.status === 'pending' ? '#000' : '#fff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}>
                      {statusIcons[refund.status]} {statusLabels[refund.status]}
                    </span>
                  </div>

                  <p style={{ color: '#38bdf8', fontSize: '12px', marginBottom: '8px' }}>{typeLabels[refund.type]}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {['pending', 'approved', 'rejected'].map(status => (
                      <button
                        key={status}
                        onClick={() => onUpdateStatus(refund.id, status)}
                        style={{
                          padding: '6px',
                          backgroundColor: statusColors[status],
                          color: status === 'pending' ? '#000' : '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          fontFamily: 'Kanit',
                          fontSize: '11px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          opacity: 0.7,
                        }}
                        onMouseOver={(e) => { e.target.style.opacity = '1'; }}
                        onMouseOut={(e) => { e.target.style.opacity = '0.7'; }}
                      >
                        {statusIcons[status]} {statusLabels[status]}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm('Delete this refund request?')) {
                        onDelete(refund.id);
                      }
                    }}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '6px',
                      backgroundColor: 'rgba(244,114,182,0.2)',
                      border: '1px solid #f472b6',
                      color: '#f472b6',
                      borderRadius: '4px',
                      fontFamily: 'Kanit',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f472b6';
                      e.target.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(244,114,182,0.2)';
                      e.target.style.color = '#f472b6';
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Refund;
