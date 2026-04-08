'use client';

import { useState, useMemo } from 'react';

const Rate = ({
  rates = [
    { id: 'razer', key_name: 'razer', name: 'Razer Gold 🪙', cost_per_100: 95, sell_per_100: 100, color: '#38bdf8' },
    { id: 'itune', key_name: 'itune', name: 'iTunes/Apple 🍎', cost_per_100: 28.50, sell_per_100: 30, color: '#4ade80' },
    { id: 'mycard', key_name: 'mycard', name: 'MyCard 🃏', cost_per_100: 92, sell_per_100: 97.50, color: '#8b5cf6' },
    { id: 'ooc', key_name: 'ooc', name: 'OOC/ROOC 🌊', cost_per_100: 155, sell_per_100: 161, color: '#f472b6' },
  ],
  logs = [],
  onSave,
  loading = false,
}) => {
  const [editingRateId, setEditingRateId] = useState(null);
  const [editData, setEditData] = useState({ cost: '', sell: '' });

  const handleEditStart = (rate) => {
    setEditingRateId(rate.id);
    setEditData({
      cost: rate.cost_per_100.toString(),
      sell: rate.sell_per_100.toString(),
    });
  };

  const handleEditCancel = () => {
    setEditingRateId(null);
    setEditData({ cost: '', sell: '' });
  };

  const handleSaveRate = async (rateId) => {
    if (editData.cost && editData.sell) {
      await onSave(
        rateId,
        parseFloat(editData.cost),
        parseFloat(editData.sell)
      );
      setEditingRateId(null);
    }
  };

  const calculateMetrics = (cost, sell) => {
    const profit = sell - cost;
    const margin = ((profit / cost) * 100).toFixed(2);
    return { profit: profit.toFixed(2), margin };
  };

  const warningMessage = 'การเปลี่ยนเรทจะส่งผลต่อการคำนวณต้นทุน...';

  return (
    <div style={{
      backgroundColor: '#07070f',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: 'Kanit',
    }}>
      {/* Warning Banner */}
      <div style={{
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        border: '1px solid rgba(250, 204, 21, 0.5)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <p style={{ color: '#facc15', fontSize: '14px', margin: 0, fontWeight: '500' }}>
          {warningMessage}
        </p>
      </div>

      {/* Rate Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {rates.map(rate => {
          const isEditing = editingRateId === rate.id;
          const cost = isEditing ? parseFloat(editData.cost || 0) : rate.cost_per_100;
          const sell = isEditing ? parseFloat(editData.sell || 0) : rate.sell_per_100;
          const metrics = calculateMetrics(cost || rate.cost_per_100, sell || rate.sell_per_100);

          return (
            <div
              key={rate.id}
              style={{
                backgroundColor: '#0f0f1e',
                border: `1px solid ${rate.color}`,
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3 style={{
                color: '#e2e8f0',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}>
                {rate.name}
              </h3>

              {isEditing ? (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{
                      color: '#64748b',
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: '6px',
                      fontWeight: '500',
                    }}>
                      Cost per 100
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editData.cost}
                      onChange={(e) => setEditData(prev => ({ ...prev, cost: e.target.value }))}
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

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      color: '#64748b',
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: '6px',
                      fontWeight: '500',
                    }}>
                      Sell per 100
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editData.sell}
                      onChange={(e) => setEditData(prev => ({ ...prev, sell: e.target.value }))}
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

                  {/* Live Metrics */}
                  <div style={{
                    backgroundColor: 'rgba(139,92,246,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Profit</p>
                        <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '16px' }}>
                          +{metrics.profit} ฿
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Margin %</p>
                        <p style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '16px' }}>
                          {metrics.margin}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={handleEditCancel}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(139,92,246,0.1)',
                        border: '1px solid rgba(139,92,246,0.22)',
                        borderRadius: '8px',
                        color: '#a78bfa',
                        fontFamily: 'Kanit',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveRate(rate.id)}
                      disabled={loading}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: rate.color,
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontFamily: 'Kanit',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                      }}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '6px' }}>Cost per 100</p>
                      <p style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '18px' }}>
                        {rate.cost_per_100.toFixed(2)} ฿
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '6px' }}>Sell per 100</p>
                      <p style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '18px' }}>
                        {rate.sell_per_100.toFixed(2)} ฿
                      </p>
                    </div>
                  </div>

                  {/* Metrics Display */}
                  <div style={{
                    backgroundColor: 'rgba(139,92,246,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Profit</p>
                        <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '14px' }}>
                          +{(rate.sell_per_100 - rate.cost_per_100).toFixed(2)} ฿
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Margin %</p>
                        <p style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '14px' }}>
                          {(((rate.sell_per_100 - rate.cost_per_100) / rate.cost_per_100) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEditStart(rate)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: rate.color,
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontFamily: 'Kanit',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = '0.9';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = '1';
                    }}
                  >
                    Edit Rate
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Rate History Log */}
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
          Rate Change History
        </h3>

        {logs.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
            No rate changes recorded yet
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#e2e8f0',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.22)' }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#a78bfa',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}>
                    Date
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    color: '#a78bfa',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}>
                    Currency
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    color: '#a78bfa',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}>
                    Old Cost
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    color: '#a78bfa',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}>
                    New Cost
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    color: '#a78bfa',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}>
                    Old Sell
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    color: '#a78bfa',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}>
                    New Sell
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 20).map((log, idx) => {
                  const logDate = log.date || (log.created_at ? new Date(log.created_at).toLocaleDateString('th-TH') : '-');
                  const logName = log.currency || log.name || '-';
                  const costVal = log.old_cost ?? log.cost_per_100 ?? 0;
                  const sellVal = log.old_sell ?? log.sell_per_100 ?? 0;
                  const newCostVal = log.new_cost ?? log.cost_per_100 ?? 0;
                  const newSellVal = log.new_sell ?? log.sell_per_100 ?? 0;
                  return (
                    <tr key={idx} style={{
                      borderBottom: '1px solid rgba(139,92,246,0.1)',
                      backgroundColor: idx % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'transparent',
                    }}>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{logDate}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{logName}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>
                        {Number(costVal).toFixed(2)}
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: newCostVal > costVal ? '#f472b6' : '#4ade80',
                        fontWeight: 'bold',
                      }}>
                        {Number(newCostVal).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px' }}>
                        {Number(sellVal).toFixed(2)}
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        color: newSellVal > sellVal ? '#4ade80' : '#f472b6',
                        fontWeight: 'bold',
                      }}>
                        {Number(newSellVal).toFixed(2)}
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

export default Rate;
