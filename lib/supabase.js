import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============== ORDERS ==============
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) throw error
}

// ============== REFUNDS ==============
export async function getRefunds() {
  const { data, error } = await supabase
    .from('refunds')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createRefund(refund) {
  const { data, error } = await supabase
    .from('refunds')
    .insert([refund])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteRefund(id) {
  const { error } = await supabase.from('refunds').delete().eq('id', id)
  if (error) throw error
}

export async function updateRefundStatus(id, status) {
  const { data, error } = await supabase
    .from('refunds')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ============== STOCK ==============
export async function getStock() {
  const { data, error } = await supabase
    .from('stock')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function updateStock(id, qty) {
  const { data, error } = await supabase
    .from('stock')
    .update({ quantity: qty })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createCustomStock(item) {
  const { data, error } = await supabase
    .from('stock')
    .insert([item])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStock(id) {
  const { error } = await supabase.from('stock').delete().eq('id', id)
  if (error) throw error
}

// ============== STOCK LOGS ==============
export async function getStockLogs() {
  const { data, error } = await supabase
    .from('stock_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function createStockLog(log) {
  const { data, error } = await supabase
    .from('stock_logs')
    .insert([log])
    .select()
    .single()
  if (error) throw error
  return data
}

// ============== RATES ==============
export async function getRates() {
  const { data, error } = await supabase
    .from('rates')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function updateRate(id, cost, sell) {
  const { data, error } = await supabase
    .from('rates')
    .update({ cost_per_100: cost, sell_per_100: sell, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createRateLog(log) {
  const { data, error } = await supabase
    .from('rate_logs')
    .insert([log])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getRateLogs() {
  const { data, error } = await supabase
    .from('rate_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data
}

// ============== STATS ==============
export async function getDashboardStats() {
  const [ordersRes, refundsRes] = await Promise.all([
    supabase.from('orders').select('price, cost, profit, payment, date, seller, game'),
    supabase.from('refunds').select('amount, status'),
  ])
  return {
    orders: ordersRes.data || [],
    refunds: refundsRes.data || [],
  }
}
