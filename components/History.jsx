'use client';

import { useState, useMemo } from 'react';

const History = ({ orders = [], refunds = [] }) => {
  const [gameFilter, setGameFilter] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Static sample history data
  const staticHistoryData = [
    { id: 'static-1', date: '2026-04-01', seller: 'เพชร', buyer: 'ปุ', game: 'L2M', contact: 'DIS', payment: 'Banking', price: 7450, cost: 7300, profit: 150 },
    { id: 'static-2', date: '2026-04-01', seller: 'เพชร', buyer: 'Cora', game: 'L2M', contact: 'DIS', payment: 'Banking', price: 7450, cost: 7300, profit: 150 },
    { id: 'static-3', date: '2026-04-01', seller: 'เพชร', buyer: 'ณพนนท์', game: 'Free Fire', contact: 'FB', payment: 'Truemoney', price: 51, cost: 47, profit: 2.52 },
    { id: 'static-4', date: '2026-04-01', seller: 'เพชร', buyer: 'MiNosS', game: 'Odin', contact: 'FB', payment: 'Banking', price: 4592, cost: 4512, profit: 80 },
    { id: 'static-5', date: '2026-04-01', seller: 'น้ำ', buyer: 'รถแดง รถฟ้า', game: 'Roblox', contact: 'FB', payment: 'Truemoney', price: 96, cost: 77.70, profit: 15.52 },
    { id: 'static-6', date: '2026-04-01', seller: 'น้ำ', buyer: 'VanilLaz', game: 'AION2', contact: 'LINE', payment: 'Banking', price: 970, cost: 916.30, profit: 53.70 },
    { id: 'static-7', date: '2026-04-08', seller: 'น้ำ', buyer: 'สุรเชษฎ์', game: 'Roblox', contact: 'FB', payment: 'Banking', price: 150, cost: 129.50, profit: 20.50 },
  ];

  // Combine static and dynamic orders
  const allOrders = useMemo(() => {
    const combined = [...staticHistoryData];
    orders.forEach((order, idx) => {
      const effectivePrice = order.payment === 'Truemoney'
        ? order.price * 0.971
        : order.price;
      const profit = effectivePrice - order.cost;
      combined.unshift({
        id: `dynamic-${idx}`,
        ...order,
        effective_price: effectivePrice,
        profit: profit,
      });
    });
    return combined;
  }, [orders]);

  // Get unique games and sellers for filters
  const games = useMemo(() => {
    const unique = new Set(allOrders.map(o => o.game).filter(Boolean));
    return Array.from(unique).sort();
  }, [allOrders]);

  const sellers = useMemo(() => {
    const unique = new Set(allOrders.map(o => o.seller).filter(Boolean));
    return Array.from(unique).sort();
  }, [allOrders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      const matchGame = !gameFilter || order.game === gameFilter;
      const matchSeller = !sellerFilter || order.seller === sellerFilter;
      const matchSearch = !searchTerm || (
        (order.buyer && order.buyer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.game && order.game.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return matchGame && matchSeller && matchSearch;
    });
  }, [allOrders, gameFilter, sellerFilter, searchTerm]);

  // Calculate totals
  const totals = useMemo(() => {
    const stats = {
      orders: allOrders.length,
      sales: 0,
      profit: 0,
      refunds: refunds.length,
    };
    allOrders.forEach(order => {
      stats.sales += order.price;
      stats.profit += order.profit;
    });
    return stats;
  }, [allOrders, refunds]);

  // Export CSV
  const handleExportCSV = () => {
    let csv = 'Date,Seller,Buyer,Game,Channel,Payment,Price,Cost,Profit\n';
    filteredOrders.forEach(order => {
      csv += `${order.date},${order.seller},${order.buyer},"${order.game}",${order.contact},${order.payment},${order.price},${order.cost},${order.profit}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `sales_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    return date.toLocaleDateString('th-TH', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

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
        <KPICard label="Total Orders" value={totals.orders} />
        <KPICard label="Total Sales" value={totals.sales.toFixed(2)} unit=" ฿" />
        <KPICard label="Total Profit" value={totals.profit.toFixed(2)} unit=" ฿" />
        <KPICard label="Refunds" value={totals.refunds} />
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <h3 style={{
          color: '#a78bfa',
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: 'bold',
        }}>
          Filters
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <div>
            <label style={{
              color: '#e2e8f0',
              fontSize: '12px',
              display: 'block',
              marginBottom: '6px',
              fontWeight: '500',
            }}>
              Game
            </label>
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
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
              <option value="">All Games</option>
              {games.map(game => (
                <option key={game} value={game}>{game}</option>
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
              Seller
            </label>
            <select
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
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
              <option value="">All Sellers</option>
              {sellers.map(seller => (
                <option key={seller} value={seller}>{seller}</option>
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
              Search Buyer/Game
            </label>
            <input
              type="text"
              placeholder="Search..."
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
        </div>
      </div>

      {/* Export Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={handleExportCSV}
          style={{
            backgroundColor: '#8b5cf6',
            border: 'none',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontFamily: 'Kanit',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#a78bfa';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#8b5cf6';
          }}
        >
          Export CSV ({filteredOrders.length} records)
        </button>
      </div>

      {/* Orders Table */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b',
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No records found</p>
            <p style={{ fontSize: '13px' }}>Try adjusting your filters</p>
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
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr key={order.id} style={{
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
                      color: order.profit >= 0 ? '#4ade80' : '#f472b6',
                    }}>
                      <span style={{
                        backgroundColor: order.profit >= 0 ? 'rgba(74,222,128,0.15)' : 'rgba(244,114,182,0.15)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                      }}>
                        {order.profit >= 0 ? '+' : ''}{order.profit.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
