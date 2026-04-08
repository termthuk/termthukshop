'use client';

import { useState } from 'react';

const Stock = ({
  stock = [
    { id: 'razer', key_name: 'razer', name: 'Razer Gold', icon: '🪙', quantity: 4500, max_quantity: 5000, color: '#38bdf8', is_custom: false },
    { id: 'itune', key_name: 'itune', name: 'iTunes/Apple', icon: '🍎', quantity: 1509, max_quantity: 3500, color: '#4ade80', is_custom: false },
    { id: 'mycard', key_name: 'mycard', name: 'MyCard', icon: '🃏', quantity: 0, max_quantity: 500, color: '#8b5cf6', is_custom: false },
    { id: 'ooc', key_name: 'ooc', name: 'OOC/ROOC', icon: '🌊', quantity: 0, max_quantity: 200, color: '#f472b6', is_custom: false },
  ],
  logs = [],
  onAdd,
  onUse,
  onAddCustom,
  onDeleteCustom,
  loading = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'use', 'addCustom'
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [modalData, setModalData] = useState({ quantity: '', note: '' });
  const [customName, setCustomName] = useState('');
  const [customMax, setCustomMax] = useState('');

  const handleOpenModal = (mode, stockId = null) => {
    setModalMode(mode);
    setSelectedStockId(stockId);
    setModalData({ quantity: '', note: '' });
    setCustomName('');
    setCustomMax('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = async () => {
    if (modalMode === 'addCustom') {
      if (customName && customMax) {
        await onAddCustom({ key_name: customName.toLowerCase().replace(/\s+/g, '_'), name: customName, max_quantity: parseInt(customMax) });
        setModalOpen(false);
      }
    } else {
      if (modalData.quantity) {
        const qty = parseInt(modalData.quantity);
        if (modalMode === 'add') {
          await onAdd(selectedStockId, qty, modalData.note);
        } else if (modalMode === 'use') {
          await onUse(selectedStockId, qty, modalData.note);
        }
        setModalOpen(false);
      }
    }
  };

  const totalValue = stock.reduce((sum, item) => sum + item.quantity, 0);

  const KPICard = ({ label, value, unit = '' }) => (
    <div style={{
      backgroundColor: '#0f0f1e',
      border: '1px solid rgba(139,92,246,0.22)',
      borderRadius: '12px',
      padding: '20px',
      fontFamily: 'Kanit',
      color: '#e2e8f0',
    }}>
      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}{unit && <span style={{ fontSize: '16px' }}>{unit}</span>}
      </p>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#07070f',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: 'Kanit',
    }}>
      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {stock.map(item => (
          <KPICard
            key={item.id}
            label={item.name}
            value={`${item.quantity}/${item.max_quantity}`}
          />
        ))}
      </div>

      {/* Stock Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {stock.map(item => {
          const percentage = (item.quantity / item.max_quantity) * 100;
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#0f0f1e',
                border: `1px solid ${item.color}`,
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</p>
                  <p style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '14px' }}>{item.name}</p>
                </div>
                {item.is_custom && (
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this custom stock?')) {
                        onDeleteCustom(item.id);
                      }
                    }}
                    style={{
                      backgroundColor: 'rgba(244,114,182,0.2)',
                      border: '1px solid #f472b6',
                      color: '#f472b6',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontFamily: 'Kanit',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>

              <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>
                {item.quantity.toLocaleString()} / {item.max_quantity.toLocaleString()}
              </p>

              <div style={{
                backgroundColor: 'rgba(139,92,246,0.1)',
                borderRadius: '4px',
                height: '8px',
                marginBottom: '16px',
                overflow: 'hidden',
              }}>
                <div style={{
                  backgroundColor: item.color,
                  height: '100%',
                  width: `${Math.min(percentage, 100)}%`,
                }} />
              </div>

              <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>
                {percentage.toFixed(1)}%
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => handleOpenModal('add', item.id)}
                  style={{
                    backgroundColor: 'rgba(74,222,128,0.2)',
                    border: '1px solid #4ade80',
                    color: '#4ade80',
                    padding: '8px',
                    borderRadius: '6px',
                    fontFamily: 'Kanit',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#4ade80';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(74,222,128,0.2)';
                    e.target.style.color = '#4ade80';
                  }}
                >
                  + Add
                </button>
                <button
                  onClick={() => handleOpenModal('use', item.id)}
                  style={{
                    backgroundColor: 'rgba(244,114,182,0.2)',
                    border: '1px solid #f472b6',
                    color: '#f472b6',
                    padding: '8px',
                    borderRadius: '6px',
                    fontFamily: 'Kanit',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f472b6';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(244,114,182,0.2)';
                    e.target.style.color = '#f472b6';
                  }}
                >
                  - Use
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Custom Stock Button */}
        <div
          style={{
            backgroundColor: 'rgba(139,92,246,0.1)',
            border: '2px dashed rgba(139,92,246,0.22)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            minHeight: '220px',
          }}
          onClick={() => handleOpenModal('addCustom')}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#8b5cf6';
            e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.22)';
            e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.1)';
          }}
        >
          <div style={{ textAlign: 'center', color: '#a78bfa' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>+</p>
            <p style={{ fontWeight: '500', fontSize: '14px' }}>Add Custom Stock</p>
          </div>
        </div>
      </div>

      {/* Stock Log */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h3 style={{
          color: '#a78bfa',
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: 'bold',
        }}>
          Stock Movement Log
        </h3>

        {logs.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No stock movements yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#e2e8f0',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.22)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Item</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Quantity</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 10).map((log, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{log.date}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{log.item_name}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: log.type === 'add' ? 'rgba(74,222,128,0.2)' : 'rgba(244,114,182,0.2)',
                        color: log.type === 'add' ? '#4ade80' : '#f472b6',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}>
                        {log.type === 'add' ? '+' : '-'} {log.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: log.type === 'add' ? '#4ade80' : '#f472b6' }}>
                      {log.type === 'add' ? '+' : '-'}{log.quantity}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>{log.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#0f0f1e',
            border: '1px solid rgba(139,92,246,0.22)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3 style={{
              color: '#a78bfa',
              marginBottom: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}>
              {modalMode === 'add' && 'Add Stock'}
              {modalMode === 'use' && 'Use Stock'}
              {modalMode === 'addCustom' && 'Add Custom Stock'}
            </h3>

            {modalMode === 'addCustom' ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    color: '#e2e8f0',
                    fontSize: '12px',
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '500',
                  }}>
                    Stock Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Diamond Points"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
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

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    color: '#e2e8f0',
                    fontSize: '12px',
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '500',
                  }}>
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
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
              </>
            ) : (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    color: '#e2e8f0',
                    fontSize: '12px',
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '500',
                  }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={modalData.quantity}
                    onChange={(e) => setModalData(prev => ({ ...prev, quantity: e.target.value }))}
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

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    color: '#e2e8f0',
                    fontSize: '12px',
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '500',
                  }}>
                    Note
                  </label>
                  <textarea
                    placeholder="Optional note..."
                    value={modalData.note}
                    onChange={(e) => setModalData(prev => ({ ...prev, note: e.target.value }))}
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
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.22)',
                  borderRadius: '8px',
                  color: '#a78bfa',
                  fontFamily: 'Kanit',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
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
                {loading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
