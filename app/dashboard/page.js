'use client'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { ToastProvider, useToast } from '@/components/ToastProvider'
import Overview from '@/components/Overview'
import SalesForm from '@/components/SalesForm'
import SalesTable from '@/components/SalesTable'
import DailySales from '@/components/DailySales'
import History from '@/components/History'
import Refund from '@/components/Refund'
import Stock from '@/components/Stock'
import Rate from '@/components/Rate'
import {
  getOrders, createOrder, deleteOrder,
  getRefunds, createRefund, deleteRefund, updateRefundStatus,
  getStock, updateStock, createCustomStock, deleteStock,
  getStockLogs, createStockLog,
  getRates, updateRate, createRateLog, getRateLogs,
} from '@/lib/supabase'

function DashboardContent() {
  const toast = useToast()
  const [activePage, setActivePage] = useState('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data state
  const [orders, setOrders] = useState([])
  const [refunds, setRefunds] = useState([])
  const [stock, setStock] = useState([])
  const [stockLogs, setStockLogs] = useState([])
  const [rates, setRates] = useState([])
  const [rateLogs, setRateLogs] = useState([])

  // Load all data
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [ordersData, refundsData, stockData, stockLogsData, ratesData, rateLogsData] = await Promise.all([
        getOrders(),
        getRefunds(),
        getStock(),
        getStockLogs(),
        getRates(),
        getRateLogs(),
      ])
      setOrders(ordersData || [])
      setRefunds(refundsData || [])
      setStock(stockData || [])
      setStockLogs(stockLogsData || [])
      setRates(ratesData || [])
      setRateLogs(rateLogsData || [])
    } catch (err) {
      toast('❌ โหลดข้อมูลล้มเหลว: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ============== ORDER HANDLERS ==============
  const handleSaveOrder = async (orderData, stockDeduct = null) => {
    setLoading(true)
    try {
      const newOrder = await createOrder(orderData)
      setOrders(prev => [newOrder, ...prev])

      // Deduct stock if selected
      if (stockDeduct) {
        const { stockId, stockQty } = stockDeduct
        const item = stock.find(s => String(s.id) === String(stockId))
        if (item) {
          const newQty = item.quantity - stockQty
          const updated = await updateStock(stockId, newQty)
          setStock(prev => prev.map(s => String(s.id) === String(stockId) ? updated : s))
          const log = await createStockLog({
            stock_key: item.key_name,
            stock_name: item.name,
            action: 'ใช้',
            quantity: stockQty,
            note: `ขาย ${orderData.game} ให้ ${orderData.buyer}`,
          })
          setStockLogs(prev => [log, ...prev])
        }
      }

      toast('✅ บันทึกรายการสำเร็จ!')
    } catch (err) {
      toast('❌ บันทึกล้มเหลว: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOrder = async (id) => {
    setLoading(true)
    try {
      await deleteOrder(id)
      setOrders(prev => prev.filter(o => o.id !== id))
      toast('🗑️ ลบรายการแล้ว', 'info')
    } catch (err) {
      toast('❌ ลบล้มเหลว: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // ============== REFUND HANDLERS ==============
  const handleSaveRefund = async (refundData) => {
    setLoading(true)
    try {
      const newRefund = await createRefund(refundData)
      setRefunds(prev => [newRefund, ...prev])
      toast('↩️ บันทึกรายการคืนเงินสำเร็จ!')
    } catch (err) {
      toast('❌ บันทึกล้มเหลว: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRefund = async (id) => {
    setLoading(true)
    try {
      await deleteRefund(id)
      setRefunds(prev => prev.filter(r => r.id !== id))
      toast('🗑️ ลบรายการแล้ว', 'info')
    } catch (err) {
      toast('❌ ลบล้มเหลว: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRefundStatus = async (id, status) => {
    try {
      const updated = await updateRefundStatus(id, status)
      setRefunds(prev => prev.map(r => r.id === id ? updated : r))
      toast('✅ อัปเดตสถานะแล้ว')
    } catch (err) {
      toast('❌ อัปเดตล้มเหลว: ' + err.message, 'error')
    }
  }

  // ============== STOCK HANDLERS ==============
  const handleAddStock = async (stockId, qty, note) => {
    const item = stock.find(s => s.id === stockId)
    if (!item) return
    try {
      const newQty = item.quantity + qty
      const updated = await updateStock(stockId, newQty)
      setStock(prev => prev.map(s => s.id === stockId ? updated : s))
      const log = await createStockLog({ stock_key: item.key_name, stock_name: item.name, action: 'เพิ่ม', quantity: qty, note })
      setStockLogs(prev => [log, ...prev])
      toast(`📦 เพิ่ม Stock ${item.name} สำเร็จ`)
    } catch (err) {
      toast('❌ เพิ่ม Stock ล้มเหลว: ' + err.message, 'error')
    }
  }

  const handleUseStock = async (stockId, qty, note) => {
    const item = stock.find(s => s.id === stockId)
    if (!item) return
    if (item.quantity < qty) { toast('⚠️ Stock ไม่พอ', 'error'); return }
    try {
      const newQty = item.quantity - qty
      const updated = await updateStock(stockId, newQty)
      setStock(prev => prev.map(s => s.id === stockId ? updated : s))
      const log = await createStockLog({ stock_key: item.key_name, stock_name: item.name, action: 'ใช้', quantity: qty, note })
      setStockLogs(prev => [log, ...prev])
      toast(`📤 ใช้ Stock ${item.name} สำเร็จ`)
    } catch (err) {
      toast('❌ ใช้ Stock ล้มเหลว: ' + err.message, 'error')
    }
  }

  const handleAddCustomStock = async (itemData) => {
    try {
      const newItem = await createCustomStock({ ...itemData, is_custom: true })
      setStock(prev => [...prev, newItem])
      toast('✅ เพิ่มสินค้าใหม่สำเร็จ!')
    } catch (err) {
      toast('❌ เพิ่มสินค้าล้มเหลว: ' + err.message, 'error')
    }
  }

  const handleDeleteCustomStock = async (id) => {
    try {
      await deleteStock(id)
      setStock(prev => prev.filter(s => s.id !== id))
      toast('🗑️ ลบสินค้าแล้ว', 'info')
    } catch (err) {
      toast('❌ ลบล้มเหลว: ' + err.message, 'error')
    }
  }

  // ============== RATE HANDLERS ==============
  const handleSaveRate = async (id, cost, sell) => {
    const item = rates.find(r => r.id === id)
    if (!item) return
    try {
      const updated = await updateRate(id, cost, sell)
      setRates(prev => prev.map(r => r.id === id ? updated : r))
      const log = await createRateLog({ name: item.name, cost_per_100: cost, sell_per_100: sell })
      setRateLogs(prev => [log, ...prev])
      toast(`💱 บันทึกเรท ${item.name} สำเร็จ!`)
    } catch (err) {
      toast('❌ บันทึกเรทล้มเหลว: ' + err.message, 'error')
    }
  }

  // ============== RENDER ==============
  const pages = {
    overview: <Overview orders={orders} refunds={refunds} />,
    sales: (
      <div>
        <SalesForm onSave={handleSaveOrder} loading={loading} stock={stock} />
        <SalesTable orders={orders} onDelete={handleDeleteOrder} />
      </div>
    ),
    daily: <DailySales orders={orders} />,
    history: <History orders={orders} refunds={refunds} />,
    refund: (
      <Refund
        refunds={refunds}
        onSave={handleSaveRefund}
        onDelete={handleDeleteRefund}
        onUpdateStatus={handleUpdateRefundStatus}
        loading={loading}
      />
    ),
    stock: (
      <Stock
        stock={stock}
        logs={stockLogs}
        onAdd={handleAddStock}
        onUse={handleUseStock}
        onAddCustom={handleAddCustomStock}
        onDeleteCustom={handleDeleteCustomStock}
        loading={loading}
      />
    ),
    rate: (
      <Rate
        rates={rates}
        logs={rateLogs}
        onSave={handleSaveRate}
        loading={loading}
      />
    ),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Header onMenuToggle={() => setSidebarCollapsed(prev => !prev)} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          active={activePage}
          onNavigate={setActivePage}
          collapsed={sidebarCollapsed}
        />
        <main style={{ flex: 1, padding: '22px 24px', overflowX: 'hidden', minWidth: 0 }}>
          {loading && (
            <div style={{
              position: 'fixed', bottom: 80, right: 22, zIndex: 998,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 8, padding: '6px 14px', fontSize: '0.78rem', color: '#a78bfa',
            }}>
              ⏳ กำลังบันทึก...
            </div>
          )}
          <div key={activePage} style={{ animation: 'fadeIn 0.25s ease-out' }}>
            {pages[activePage]}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  )
}
