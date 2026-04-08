'use client';

import { useState, useMemo } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(...registerables);

const Overview = ({ orders = [], refunds = [] }) => {
  // Filter state
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'day', 'month', 'year'
  const [selectedDate, setSelectedDate] = useState('2026-04-08');
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Get available years/months from orders
  const availableYears = useMemo(() => {
    const years = new Set();
    orders.forEach(o => {
      if (o.date) years.add(o.date.substring(0, 4));
    });
    if (years.size === 0) years.add('2026');
    return [...years].sort().reverse();
  }, [orders]);

  const availableMonths = useMemo(() => {
    const months = new Set();
    orders.forEach(o => {
      if (o.date) months.add(o.date.substring(0, 7));
    });
    if (months.size === 0) months.add('2026-04');
    return [...months].sort().reverse();
  }, [orders]);

  // Filter orders based on mode
  const filteredOrders = useMemo(() => {
    if (filterMode === 'all') return orders;
    return orders.filter(order => {
      if (!order.date) return false;
      if (filterMode === 'day') return order.date === selectedDate;
      if (filterMode === 'month') return order.date.startsWith(selectedMonth);
      if (filterMode === 'year') return order.date.startsWith(selectedYear);
      return true;
    });
  }, [orders, filterMode, selectedDate, selectedMonth, selectedYear]);

  // Calculate stats from filtered orders
  const stats = useMemo(() => {
    let totalSales = 0, totalCost = 0, totalProfit = 0;
    const gameMap = {};
    const sellerMap = {};
    const contactMap = {};
    const paymentMap = {};
    const dailyMap = {};

    filteredOrders.forEach(order => {
      const price = parseFloat(order.price) || 0;
      const cost = parseFloat(order.cost) || 0;
      const profit = parseFloat(order.profit) || (price - cost);

      totalSales += price;
      totalCost += cost;
      totalProfit += profit;

      // Game stats
      const game = order.game || 'Unknown';
      if (!gameMap[game]) gameMap[game] = { orders: 0, profit: 0 };
      gameMap[game].orders += 1;
      gameMap[game].profit += profit;

      // Seller stats
      const seller = order.seller || 'Unknown';
      if (!sellerMap[seller]) sellerMap[seller] = { orders: 0, profit: 0 };
      sellerMap[seller].orders += 1;
      sellerMap[seller].profit += profit;

      // Contact stats
      const contact = order.contact || 'Unknown';
      if (!contactMap[contact]) contactMap[contact] = 0;
      contactMap[contact] += 1;

      // Payment stats
      const payment = order.payment || 'Unknown';
      if (!paymentMap[payment]) paymentMap[payment] = { orders: 0, profit: 0 };
      paymentMap[payment].orders += 1;
      paymentMap[payment].profit += profit;

      // Daily stats
      const date = order.date || 'Unknown';
      if (!dailyMap[date]) dailyMap[date] = { orders: 0, profit: 0 };
      dailyMap[date].orders += 1;
      dailyMap[date].profit += profit;
    });

    const margin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(2) : '0.00';

    const gameProfit = Object.entries(gameMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.profit - a.profit);

    const staffPerf = Object.entries(sellerMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.orders - a.orders);

    const contactChannels = Object.entries(contactMap)
      .map(([name, count]) => ({ name: name === 'FB' ? 'Facebook' : name === 'DIS' ? 'Discord' : name, count }))
      .sort((a, b) => b.count - a.count);

    const payments = Object.entries(paymentMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.orders - a.orders);

    const dailySorted = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b));

    return {
      totalOrders: filteredOrders.length,
      totalSales, totalCost, totalProfit, margin,
      gameProfit, staffPerf, contactChannels, payments, dailySorted,
    };
  }, [filteredOrders]);

  // Chart data
  const barChartData = useMemo(() => {
    const labels = stats.dailySorted.map(([date]) => {
      if (filterMode === 'year') return date.substring(5, 7);
      return date.substring(8, 10);
    });
    const ordersData = stats.dailySorted.map(([, d]) => d.orders);
    const profitsData = stats.dailySorted.map(([, d]) => d.profit);

    return {
      labels: labels.length > 0 ? labels : ['--'],
      datasets: [
        {
          label: 'Orders',
          data: ordersData.length > 0 ? ordersData : [0],
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1,
          yAxisID: 'y',
          type: 'bar',
        },
        {
          label: 'Profit (฿)',
          data: profitsData.length > 0 ? profitsData : [0],
          borderColor: 'rgba(56, 189, 248, 1)',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          borderWidth: 2,
          yAxisID: 'y1',
          type: 'line',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [stats.dailySorted, filterMode]);

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        labels: { color: '#a78bfa', font: { family: 'Kanit', size: 12 } },
      },
    },
    scales: {
      y: {
        type: 'linear', display: true, position: 'left',
        ticks: { color: '#64748b', font: { family: 'Kanit' } },
        grid: { color: 'rgba(139,92,246,0.1)' },
      },
      y1: {
        type: 'linear', display: true, position: 'right',
        ticks: { color: '#38bdf8', font: { family: 'Kanit' } },
        grid: { drawOnChartArea: false },
      },
      x: {
        ticks: { color: '#a78bfa', font: { family: 'Kanit' } },
        grid: { color: 'rgba(139,92,246,0.1)' },
      },
    },
  };

  const doughnutChartData = useMemo(() => {
    const bankingProfit = stats.payments.find(p => p.name === 'Banking')?.profit || 0;
    const trueProfit = stats.payments.find(p => p.name === 'Truemoney')?.profit || 0;
    return {
      labels: ['Banking', 'TrueMoney'],
      datasets: [{
        data: [bankingProfit, trueProfit],
        backgroundColor: ['rgba(139, 92, 246, 0.8)', 'rgba(56, 189, 248, 0.8)'],
        borderColor: ['rgba(139, 92, 246, 1)', 'rgba(56, 189, 248, 1)'],
        borderWidth: 1,
      }],
    };
  }, [stats.payments]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#a78bfa', font: { family: 'Kanit', size: 12 } },
      },
    },
  };

  const contactColors = { 'Facebook': '#8b5cf6', 'LINE': '#38bdf8', 'Discord': '#a78bfa' };

  // Filter label
  const getFilterLabel = () => {
    if (filterMode === 'all') return 'ทั้งหมด';
    if (filterMode === 'day') return `วันที่ ${selectedDate}`;
    if (filterMode === 'month') {
      const [y, m] = selectedMonth.split('-');
      const monthNames = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return `เดือน ${monthNames[parseInt(m)]} ${y}`;
    }
    if (filterMode === 'year') return `ปี ${selectedYear}`;
    return '';
  };

  const inputStyle = {
    padding: '8px 12px',
    backgroundColor: 'rgba(139,92,246,0.1)',
    border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontFamily: 'Kanit',
    fontSize: '13px',
    boxSizing: 'border-box',
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
    <div style={{ backgroundColor: '#07070f', minHeight: '100vh', padding: '24px', fontFamily: 'Kanit' }}>

      {/* Date Filter */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 'bold' }}>🔍 ตัวกรอง:</span>
          {['all', 'day', 'month', 'year'].map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              style={{
                padding: '8px 16px',
                backgroundColor: filterMode === mode ? '#8b5cf6' : 'rgba(139,92,246,0.1)',
                border: filterMode === mode ? '1px solid #8b5cf6' : '1px solid rgba(139,92,246,0.22)',
                borderRadius: '8px',
                color: filterMode === mode ? '#ffffff' : '#a78bfa',
                fontFamily: 'Kanit',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {mode === 'all' ? 'ทั้งหมด' : mode === 'day' ? 'รายวัน' : mode === 'month' ? 'รายเดือน' : 'รายปี'}
            </button>
          ))}
        </div>

        {/* Date Picker */}
        {filterMode !== 'all' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {filterMode === 'day' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={inputStyle}
              />
            )}
            {filterMode === 'month' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={inputStyle}
              />
            )}
            {filterMode === 'year' && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={inputStyle}
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            )}
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              📊 แสดงผล: <span style={{ color: '#38bdf8', fontWeight: '500' }}>{getFilterLabel()}</span>
              {' '}({stats.totalOrders} รายการ)
            </span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard label="Total Orders" value={stats.totalOrders} />
        <KPICard label="Total Sales" value={stats.totalSales.toFixed(2)} unit=" ฿" />
        <KPICard label="Total Cost" value={stats.totalCost.toFixed(2)} unit=" ฿" />
        <KPICard label="Net Profit" value={stats.totalProfit.toFixed(2)} unit=" ฿" />
        <KPICard label="Margin %" value={stats.margin} unit="%" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#0f0f1e',
          border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h3 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
            {filterMode === 'year' ? 'Monthly' : 'Daily'} Orders & Profit ({getFilterLabel()})
          </h3>
          {stats.dailySorted.length > 0 ? (
            <Bar data={barChartData} options={barChartOptions} height={250} />
          ) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>ไม่มีข้อมูลในช่วงเวลาที่เลือก</p>
          )}
        </div>

        <div style={{
          backgroundColor: '#0f0f1e',
          border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h3 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Payment Channel</h3>
          <div style={{ width: '100%', height: '200px' }}>
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Game Profit Table */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <h3 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Top Game Profits</h3>
        {stats.gameProfit.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', color: '#e2e8f0', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.22)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold', fontSize: '13px' }}>Game</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#a78bfa', fontWeight: 'bold', fontSize: '13px' }}>Orders</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#a78bfa', fontWeight: 'bold', fontSize: '13px' }}>Profit (฿)</th>
                </tr>
              </thead>
              <tbody>
                {stats.gameProfit.map((game, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{game.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#a78bfa' }}>{game.orders}</td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#4ade80', fontSize: '13px', fontWeight: 'bold' }}>
                      {game.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>ไม่มีข้อมูล</p>
        )}
      </div>

      {/* Contact Channels */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <h3 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Contact Channels</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {stats.contactChannels.length > 0 ? stats.contactChannels.map((channel, idx) => (
            <div key={idx} style={{
              backgroundColor: 'rgba(139,92,246,0.1)',
              border: `1px solid ${contactColors[channel.name] || '#a78bfa'}`,
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{channel.name}</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: contactColors[channel.name] || '#a78bfa' }}>{channel.count}</p>
            </div>
          )) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>ไม่มีข้อมูล</p>
          )}
        </div>
      </div>

      {/* Staff Performance */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <h3 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Staff Performance</h3>
        {stats.staffPerf.length > 0 ? stats.staffPerf.map((member, idx) => {
          const maxOrders = Math.max(...stats.staffPerf.map(s => s.orders), 1);
          return (
            <div key={idx} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#e2e8f0' }}>
                <span>{member.name}</span>
                <span style={{ color: '#a78bfa' }}>{member.orders} orders / {member.profit.toFixed(2)} ฿</span>
              </div>
              <div style={{ backgroundColor: 'rgba(139,92,246,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                  backgroundColor: '#8b5cf6',
                  height: '100%',
                  width: `${(member.orders / maxOrders) * 100}%`,
                }} />
              </div>
            </div>
          );
        }) : (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>ไม่มีข้อมูล</p>
        )}
      </div>

      {/* Payment Methods */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <h3 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Payment Methods</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {stats.payments.map((method, idx) => (
            <div key={idx} style={{
              backgroundColor: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.22)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{method.name}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>{method.orders}</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>orders / {method.profit.toFixed(2)} ฿</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
