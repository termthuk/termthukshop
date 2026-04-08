'use client';

import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const Overview = ({ orders = [], refunds = [] }) => {
  // Base data
  const baseData = {
    totalOrders: 497,
    totalSales: 441011.64,
    totalCost: 418250.64,
    netProfit: 22761,
  };

  // Calculate new order totals
  const newOrderStats = useMemo(() => {
    let stats = { count: 0, sales: 0, cost: 0, profit: 0 };
    orders.forEach(order => {
      const price = order.payment === 'Truemoney'
        ? order.price * 0.971
        : order.price;
      const profit = price - order.cost;
      stats.count += 1;
      stats.sales += price;
      stats.cost += order.cost;
      stats.profit += profit;
    });
    return stats;
  }, [orders]);

  const totals = {
    orders: baseData.totalOrders + newOrderStats.count,
    sales: baseData.totalSales + newOrderStats.sales,
    cost: baseData.totalCost + newOrderStats.cost,
    profit: baseData.netProfit + newOrderStats.profit,
  };

  const margin = ((totals.profit / totals.sales) * 100).toFixed(2);

  // Daily data for charts
  const dailyData = {
    '2026-04-01': { orders: 74, profit: 3483 },
    '2026-04-02': { orders: 58, profit: 1684 },
    '2026-04-03': { orders: 88, profit: 1951 },
    '2026-04-04': { orders: 8, profit: 151 },
    '2026-04-05': { orders: 62, profit: 1902 },
    '2026-04-06': { orders: 58, profit: 1952 },
    '2026-04-07': { orders: 61, profit: 2117 },
    '2026-04-08': { orders: 18, profit: 3717 },
  };

  const chartLabels = ['01', '02', '03', '04', '05', '06', '07', '08'];
  const chartOrders = [74, 58, 88, 8, 62, 58, 61, 18];
  const chartProfits = [3483, 1684, 1951, 151, 1902, 1952, 2117, 3717];

  const barChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Orders',
        data: chartOrders,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        yAxisID: 'y',
        type: 'bar',
      },
      {
        label: 'Profit (฿)',
        data: chartProfits,
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
        type: 'linear',
        display: true,
        position: 'left',
        ticks: { color: '#64748b', font: { family: 'Kanit' } },
        grid: { color: 'rgba(139,92,246,0.1)' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: { color: '#38bdf8', font: { family: 'Kanit' } },
        grid: { drawOnChartArea: false },
      },
      x: {
        ticks: { color: '#a78bfa', font: { family: 'Kanit' } },
        grid: { color: 'rgba(139,92,246,0.1)' },
      },
    },
  };

  const doughnutChartData = {
    labels: ['Banking', 'TrueMoney'],
    datasets: [
      {
        data: [21459, 1302],
        backgroundColor: ['rgba(139, 92, 246, 0.8)', 'rgba(56, 189, 248, 0.8)'],
        borderColor: ['rgba(139, 92, 246, 1)', 'rgba(56, 189, 248, 1)'],
        borderWidth: 1,
      },
    ],
  };

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

  const gameProfit = [
    { name: 'YMIR', profit: 9741 },
    { name: 'L2M', profit: 3734 },
    { name: 'Roblox', profit: 2848 },
    { name: 'AION2', profit: 2780 },
    { name: 'ROOC', profit: 804 },
    { name: 'Heartopia', profit: 761 },
    { name: '7K', profit: 558 },
    { name: 'NC', profit: 514 },
  ];

  const contactChannels = [
    { name: 'Facebook', count: 348, color: '#8b5cf6' },
    { name: 'LINE', count: 95, color: '#38bdf8' },
    { name: 'Discord', count: 54, color: '#a78bfa' },
  ];

  const staff = [
    { name: 'น้ำ', orders: 288, profit: 15971 },
    { name: 'เพชร', orders: 208, profit: 6090 },
    { name: 'ออฟ', orders: 1, profit: 700 },
  ];

  const paymentMethods = [
    { name: 'Banking', orders: 377 },
    { name: 'Truemoney', orders: 120 },
  ];

  const currencies = [
    { name: 'XBOX', count: 171, color: '#8b5cf6' },
    { name: 'Itune01', count: 67, color: '#4ade80' },
    { name: 'MYCARD', count: 58, color: '#f472b6' },
  ];

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
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard label="Total Orders" value={totals.orders} />
        <KPICard label="Total Sales" value={totals.sales.toFixed(2)} unit=" ฿" />
        <KPICard label="Total Cost" value={totals.cost.toFixed(2)} unit=" ฿" />
        <KPICard label="Net Profit" value={totals.profit.toFixed(2)} unit=" ฿" />
        <KPICard label="Margin %" value={margin} unit="%" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#0f0f1e',
          border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <h3 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Daily Orders & Profit (Apr 2026)</h3>
          <Bar data={barChartData} options={barChartOptions} height={250} />
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', color: '#e2e8f0', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.22)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#a78bfa', fontWeight: 'bold' }}>Game</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#a78bfa', fontWeight: 'bold' }}>Profit (฿)</th>
              </tr>
            </thead>
            <tbody>
              {gameProfit.map((game, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                  <td style={{ padding: '12px' }}>{game.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#4ade80' }}>{game.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          {contactChannels.map((channel, idx) => (
            <div key={idx} style={{
              backgroundColor: 'rgba(139,92,246,0.1)',
              border: `1px solid ${channel.color}`,
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{channel.name}</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: channel.color }}>{channel.count}</p>
            </div>
          ))}
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
        {staff.map((member, idx) => (
          <div key={idx} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#e2e8f0' }}>
              <span>{member.name}</span>
              <span style={{ color: '#a78bfa' }}>{member.orders} orders / {member.profit.toLocaleString()} ฿</span>
            </div>
            <div style={{ backgroundColor: 'rgba(139,92,246,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                backgroundColor: '#8b5cf6',
                height: '100%',
                width: `${(member.orders / 300) * 100}%`,
              }} />
            </div>
          </div>
        ))}
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
          {paymentMethods.map((method, idx) => (
            <div key={idx} style={{
              backgroundColor: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.22)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{method.name}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' }}>{method.orders}</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>orders</p>
            </div>
          ))}
        </div>
      </div>

      {/* Currencies */}
      <div style={{
        backgroundColor: '#0f0f1e',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h3 style={{ color: '#a78bfa', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Currencies</h3>
        {currencies.map((currency, idx) => (
          <div key={idx} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#e2e8f0' }}>
              <span>{currency.name}</span>
              <span style={{ color: currency.color }}>{currency.count}</span>
            </div>
            <div style={{ backgroundColor: 'rgba(139,92,246,0.1)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                backgroundColor: currency.color,
                height: '100%',
                width: `${(currency.count / 200) * 100}%`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
