// Mock order management utilities
// In a real application, this would connect to a backend API

const ORDERS_KEY = 'cafe_mehfil_orders';

// Get all orders
export const getOrders = () => {
  if (typeof window === 'undefined') return [];
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

// Get orders for a specific user
export const getUserOrders = (userId) => {
  const orders = getOrders();
  return orders.filter(order => order.userId === userId);
};

// Get order by ID
export const getOrderById = (orderId) => {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
};

// Create order
export const createOrder = (userId, userName, userEmail, items, paymentMethod, totalAmount) => {
  const orders = getOrders();
  
  const newOrder = {
    id: crypto.randomUUID(),
    userId,
    userName,
    userEmail,
    items,
    paymentMethod,
    totalAmount,
    status: 'pending', // pending, confirmed, preparing, shipped, delivered, cancelled
    paymentStatus: paymentMethod === 'etransfer' ? 'awaiting_confirmation' : 'pending', // pending, awaiting_confirmation, confirmed, failed
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  return { success: true, order: newOrder };
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return { success: false, error: 'Order not found' };
  }
  
  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  return { success: true, order: orders[orderIndex] };
};

// Update payment status
export const updatePaymentStatus = (orderId, paymentStatus) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return { success: false, error: 'Order not found' };
  }
  
  orders[orderIndex].paymentStatus = paymentStatus;
  orders[orderIndex].updatedAt = new Date().toISOString();
  
  // If payment is confirmed, update order status to confirmed
  if (paymentStatus === 'confirmed' && orders[orderIndex].status === 'pending') {
    orders[orderIndex].status = 'confirmed';
  }
  
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  return { success: true, order: orders[orderIndex] };
};

// Get order status display text
export const getOrderStatusDisplay = (status) => {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return statusMap[status] || status;
};

// Get payment status display text
export const getPaymentStatusDisplay = (status) => {
  const statusMap = {
    pending: 'Pending',
    awaiting_confirmation: 'Awaiting Confirmation',
    confirmed: 'Confirmed',
    failed: 'Failed'
  };
  return statusMap[status] || status;
};
