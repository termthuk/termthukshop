'use client';

import { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const DailySales = ({ orders = [] }) => {
  const [expandedDates, setExpandedDates] = useState({});

  // Base daily data
  const baseDailyData = {
    '2026-04-01': { orders: 74, profit: 3483 },
    '2026-04-02': { orders: 58, profit: 1684 },
    '2026-04-03': { orders: 88, profit: 1951 },
    '2026-04-04': { orders: 8, profit: 151 },
    '2026-04-05': { orders: 62, profit: 1902 },
    '2026-04-06': { orders: 58, profit: 1952 },
    '2026-04-07': { orders: 61, profit: 2117 },
    '2026-04-08': { orders: 18, profit: 3717 },
  };

  // Add new orders to daily data
  const dailyStats = useMemo(() => {
    const stats = JSON.parse(JSON.stringify(baseDailyData));

    orders.forEach(order => {
      const dateKey = order.date;
      const effectivePrice = order.payment === 'Truemoney'
        ? order.price * 0.971
        : order.price;
      const profit = effectivePrice - order.cost;

      if (!stats[dateKey]) {
        stats[dateKey] = { orders: 0, profit: 0 };
      }
      stats[dateKey].orders += 1;
      stats[dateKey].profit += profit;
    });

    return stats;
  }, [orders]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalOrders = 0;
    let totalSales = 0;
    let totalProfit = 0;

    Object.values(dailyStats).forEach(day => {
      totalOrders += day.orders;
      totalProfit += day.profit;
    });

    // For sales, we need to estimate based on profit + cost
    // Using average: totalSales approximation
    totalSales = 441011.64 + orders.reduce((sum, order) => sum + order.price, 0);

    return { totalOrders, totalSales, totalProfit };
  }, [dailyStats, orders]);

  // Chart data
  const chartLabels = ['01', '02', '03', '04', '05', '06', '07', '08'];
  const chartOrders = chartLabels.map(day => dailyStats[`2026-04-${day}`]?.orders || 0);
  const chartProfits = chartLabels.map(day => dailyStats[`2026-04-${day}`]?.profit || 0);

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

  const toggleExpand = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date],
    }));
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
        <KPICard label="Total Orders" value={totals.totalOrders} />
        <KPICard label="Total Sales" value={totals.totalSales.toFixed(2)} unit=" ฿" />
        <KPICard label="Total Profit" value={totals.totalProfit.toFixed(2)} unit=" ฿" />
      </div>

      {/* Chart */}
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
          Daily Orders & Profit (Apr 2026)
        </h3>
        <Bar data={barChartData} options={barChartOptions} height={250} />
      </div>

      {/* Daily Accordion */}
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
          Daily Breakdown
        </h3>

        {Object.entries(dailyStats).map(([date, stats]) => (
          <div key={date} style={{ marginBottom: '12px', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
            <button
              onClick={() => toggleExpand(date)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.22)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontFamily: 'Kanit',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(139,92,246,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(139,92,246,0.1)';
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span>{date}</span>
                <span style={{
                  marginLeft: '16px',
                  color: '#a78bfa',
                  fontSize: '13px',
                  fontWeight: 'bold',
                }}>
                  {stats.orders} orders
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
                  +{stats.profit.toFixed(2)} ฿
                </span>
                <span style={{ color: '#a78bfa' }}>
                  {expandedDates[date] ? '▼' : '▶'}
                </span>
              </div>
            </button>

            {expandedDates[date] && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '0 0 8px 8px',
                marginTop: '8px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', color: '#e2e8f0' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Orders</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.orders}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Profit</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80' }}>+{stats.profit.toFixed(2)} ฿</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySales;
