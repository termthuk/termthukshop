'use client';

import { useState } from 'react';

const SalesForm = ({ onSave, loading = false }) => {
  const [formData, setFormData] = useState({
    date: '2026-04-08',
    seller: '',
    game: '',
    customGame: '',
    buyer: '',
    contact: 'FB',
    payment: 'Banking',
    price: '',
    cost: '',
    note: '',
  });

  const [errors, setErrors] = useState({});

  const games = [
    'Roblox',
    'Free Fire',
    'L2M',
    'AION2',
    'Heartopia',
    'YMIR',
    '7K',
    'King Shot',
    'NC',
    'ROOC',
    'Odin',
    'ROV',
    'Darkwar Survival',
    'Dunk City',
    'อื่นๆ',
  ];

  const sellers = ['น้ำ', 'เพชร', 'ออฟ'];
  const contacts = ['FB', 'LINE', 'DIS'];
  const payments = ['Banking', 'Truemoney'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.seller) newErrors.seller = 'Seller is required';
    if (!formData.game) newErrors.game = 'Game is required';
    if (formData.game === 'อื่นๆ' && !formData.customGame) newErrors.customGame = 'Custom game name is required';
    if (!formData.buyer) newErrors.buyer = 'Buyer is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.cost) newErrors.cost = 'Cost is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const effectivePrice = formData.payment === 'Truemoney'
      ? parseFloat(formData.price) * 0.971
      : parseFloat(formData.price);

    const profit = effectivePrice - parseFloat(formData.cost);

    const orderData = {
      date: formData.date,
      seller: formData.seller,
      game: formData.game === 'อื่นๆ' ? formData.customGame : formData.game,
      buyer: formData.buyer,
      contact: formData.contact,
      payment: formData.payment,
      price: parseFloat(formData.price),
      effective_price: effectivePrice,
      cost: parseFloat(formData.cost),
      profit: profit,
      note: formData.note,
    };

    await onSave(orderData);
    setFormData({
      date: '2026-04-08',
      seller: '',
      game: '',
      customGame: '',
      buyer: '',
      contact: 'FB',
      payment: 'Banking',
      price: '',
      cost: '',
      note: '',
    });
  };

  const handleClear = () => {
    setFormData({
      date: '2026-04-08',
      seller: '',
      game: '',
      customGame: '',
      buyer: '',
      contact: 'FB',
      payment: 'Banking',
      price: '',
      cost: '',
      note: '',
    });
    setErrors({});
  };

  const effectivePrice = formData.payment === 'Truemoney'
    ? (parseFloat(formData.price) || 0) * 0.971
    : (parseFloat(formData.price) || 0);

  const profit = effectivePrice - (parseFloat(formData.cost) || 0);
  const profitColor = profit >= 0 ? '#4ade80' : '#f472b6';

  return (
    <div style={{
      backgroundColor: '#07070f',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: 'Kanit',
    }}>
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <h2 style={{ color: '#a78bfa', marginBottom: '24px', fontSize: '20px', fontWeight: 'bold' }}>Add New Sales Order</h2>

        <form onSubmit={handleSubmit}>
          {/* Date */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
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
                border: `1px solid ${errors.date ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                borderRadius: '8px',
                color: '#e2e8f0',
                fontFamily: 'Kanit',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Seller */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Seller *
            </label>
            <select
              name="seller"
              value={formData.seller}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'rgba(139,92,246,0.1)',
                border: `1px solid ${errors.seller ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                borderRadius: '8px',
                color: '#e2e8f0',
                fontFamily: 'Kanit',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Select Seller</option>
              {sellers.map(seller => (
                <option key={seller} value={seller}>{seller}</option>
              ))}
            </select>
            {errors.seller && <p style={{ color: '#f472b6', fontSize: '12px', marginTop: '4px' }}>{errors.seller}</p>}
          </div>

          {/* Game */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
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

          {/* Custom Game */}
          {formData.game === 'อื่นๆ' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Game Name *
              </label>
              <input
                type="text"
                name="customGame"
                placeholder="Enter game name"
                value={formData.customGame}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: `1px solid ${errors.customGame ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              {errors.customGame && <p style={{ color: '#f472b6', fontSize: '12px', marginTop: '4px' }}>{errors.customGame}</p>}
            </div>
          )}

          {/* Buyer */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
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

          {/* Contact & Payment Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
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
                {contacts.map(contact => (
                  <option key={contact} value={contact}>{contact}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Payment
              </label>
              <select
                name="payment"
                value={formData.payment}
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
                {payments.map(payment => (
                  <option key={payment} value={payment}>{payment}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Cost Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Price (฿) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: `1px solid ${errors.price ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              {errors.price && <p style={{ color: '#f472b6', fontSize: '12px', marginTop: '4px' }}>{errors.price}</p>}
            </div>

            <div>
              <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Cost (฿) *
              </label>
              <input
                type="number"
                name="cost"
                step="0.01"
                placeholder="0.00"
                value={formData.cost}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: `1px solid ${errors.cost ? '#f472b6' : 'rgba(139,92,246,0.22)'}`,
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              {errors.cost && <p style={{ color: '#f472b6', fontSize: '12px', marginTop: '4px' }}>{errors.cost}</p>}
            </div>
          </div>

          {/* Profit Display */}
          <div style={{
            backgroundColor: 'rgba(139,92,246,0.1)',
            border: `1px solid ${profitColor}`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontSize: '13px' }}>Profit Calculation:</span>
              <span style={{ color: profitColor, fontWeight: 'bold', fontSize: '16px' }}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(2)} ฿
              </span>
            </div>
            {formData.payment === 'Truemoney' && (
              <p style={{ color: '#38bdf8', fontSize: '12px', marginTop: '8px' }}>
                * Price after 2.9% VAT deduction: {effectivePrice.toFixed(2)} ฿
              </p>
            )}
          </div>

          {/* Note */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#e2e8f0', fontSize: '14px', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Note
            </label>
            <textarea
              name="note"
              placeholder="Additional notes..."
              value={formData.note}
              onChange={handleChange}
              rows={3}
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
                resize: 'vertical',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              style={{
                padding: '10px 16px',
                backgroundColor: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.22)',
                borderRadius: '8px',
                color: '#a78bfa',
                fontFamily: 'Kanit',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
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
              {loading ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesForm;
