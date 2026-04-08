'use client';

import { useState, useMemo } from 'react';

const SalesTable = ({ orders = [], onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const term = searchTerm.toLowerCase();
      return (
        (order.buyer && order.buyer.toLowerCase().includes(term)) ||
        (order.game && order.game.toLowerCase().includes(term)) ||
        (order.seller && order.seller.toLowerCase().includes(term))
      );
    });
  }, [orders, searchTerm]);

  const handleDelete = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      onDelete(orderId);
    }
  };

  const getContactColor = (contact) => {
    const colors = {
      'FB': '#8b5cf6',
      'LINE': '#38bdf8',
      'DIS': '#a78bfa',
    };
    return colors[contact] || '#64748b';
  };

  const getPaymentColor = (payment) => {
    return payment === 'Banking' ? '#4ade80' : '#38bdf8';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

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
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#a78bfa', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Sales Records</h2>
          <span style={{
            backgroundColor: '#8b5cf6',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            {filteredOrders.length} {filteredOrders.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search by buyer, game, or seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Table */}
        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b',
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No sales records found</p>
            <p style={{ fontSize: '13px' }}>Try adjusting your search terms</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#e2e8f0',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(139,92,246,0.22)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Seller</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Buyer</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Game</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Channel</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Payment</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Cost</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Profit</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#a78bfa', fontWeight: 'bold', fontSize: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => {
                  const profit = (order.effective_price || order.price) - order.cost;
                  const profitColor = profit >= 0 ? '#4ade80' : '#f472b6';

                  return (
                    <tr key={order.id || idx} style={{
                      borderBottom: '1px solid rgba(139,92,246,0.1)',
                      backgroundColor: idx % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent',
                    }}>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{formatDate(order.date)}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{order.seller}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{order.buyer}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{order.game}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: getContactColor(order.contact),
                          color: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                        }}>
                          {order.contact}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: getPaymentColor(order.payment),
                          color: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                        }}>
                          {order.payment === 'Banking' ? 'Bank' : 'True'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: '#a78bfa' }}>
                        {order.price.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: '#38bdf8' }}>
                        {order.cost.toFixed(2)}
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: profitColor,
                      }}>
                        <span style={{
                          backgroundColor: profit >= 0 ? 'rgba(74,222,128,0.15)' : 'rgba(244,114,182,0.15)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          display: 'inline-block',
                        }}>
                          {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(order.id)}
                          style={{
                            backgroundColor: 'rgba(244,114,182,0.2)',
                            border: '1px solid #f472b6',
                            color: '#f472b6',
                            padding: '6px 10px',
                            borderRadius: '4px',
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
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTable;
