// Mock subscription management utilities
// In a real application, this would connect to a backend API

const SUBSCRIPTIONS_KEY = 'cafe_mehfil_subscriptions';

// Get all subscriptions
export const getSubscriptions = () => {
  if (typeof window === 'undefined') return [];
  const subscriptions = localStorage.getItem(SUBSCRIPTIONS_KEY);
  return subscriptions ? JSON.parse(subscriptions) : [];
};

// Get subscriptions for a specific user
export const getUserSubscriptions = (userId) => {
  const subscriptions = getSubscriptions();
  return subscriptions.filter(subscription => subscription.userId === userId);
};

// Get subscription by ID
export const getSubscriptionById = (subscriptionId) => {
  const subscriptions = getSubscriptions();
  return subscriptions.find(subscription => subscription.id === subscriptionId);
};

// Create subscription with payment
export const createSubscription = (userId, userName, userEmail, products, frequency, paymentMethod) => {
  const subscriptions = getSubscriptions();
  
  const startDate = new Date();
  const nextDueDate = calculateNextDueDate(startDate, frequency);
  
  // Calculate total amount from products
  const amount = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  
  const newSubscription = {
    id: crypto.randomUUID(),
    userId,
    userName,
    userEmail,
    products, // Array of {id, name, price, quantity, image}
    amount,
    frequency, // weekly, biweekly, monthly
    paymentMethod, // paypal, etransfer
    paymentStatus: paymentMethod === 'etransfer' ? 'awaiting_confirmation' : 'pending', // pending, awaiting_confirmation, confirmed, failed
    status: paymentMethod === 'etransfer' ? 'pending_payment' : 'active', // pending_payment, active, paused, cancelled
    startDate: startDate.toISOString(),
    nextDueDate: nextDueDate.toISOString(),
    lastPaymentDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  subscriptions.push(newSubscription);
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  
  return { success: true, subscription: newSubscription };
};

// Calculate next due date based on frequency
const calculateNextDueDate = (currentDate, frequency) => {
  const date = new Date(currentDate);
  
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  
  return date;
};

// Update subscription status
export const updateSubscriptionStatus = (subscriptionId, status, cancellationReason = null) => {
  const subscriptions = getSubscriptions();
  const subscriptionIndex = subscriptions.findIndex(subscription => subscription.id === subscriptionId);
  
  if (subscriptionIndex === -1) {
    return { success: false, error: 'Subscription not found' };
  }
  
  subscriptions[subscriptionIndex].status = status;
  subscriptions[subscriptionIndex].updatedAt = new Date().toISOString();
  
  // Store cancellation reason and date if cancelling
  if (status === 'cancelled') {
    subscriptions[subscriptionIndex].cancelledAt = new Date().toISOString();
    subscriptions[subscriptionIndex].cancellationReason = cancellationReason;
  }
  
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  
  return { success: true, subscription: subscriptions[subscriptionIndex] };
};

// Update payment status for subscription
export const updateSubscriptionPaymentStatus = (subscriptionId, paymentStatus) => {
  const subscriptions = getSubscriptions();
  const subscriptionIndex = subscriptions.findIndex(subscription => subscription.id === subscriptionId);
  
  if (subscriptionIndex === -1) {
    return { success: false, error: 'Subscription not found' };
  }
  
  subscriptions[subscriptionIndex].paymentStatus = paymentStatus;
  subscriptions[subscriptionIndex].updatedAt = new Date().toISOString();
  
  // Activate subscription if payment is confirmed and status is pending_payment
  if (paymentStatus === 'confirmed' && subscriptions[subscriptionIndex].status === 'pending_payment') {
    subscriptions[subscriptionIndex].status = 'active';
    subscriptions[subscriptionIndex].lastPaymentDate = new Date().toISOString();
  }
  
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  
  return { success: true, subscription: subscriptions[subscriptionIndex] };
};

// Process subscription payment (updates due date)
export const processSubscriptionPayment = (subscriptionId) => {
  const subscriptions = getSubscriptions();
  const subscriptionIndex = subscriptions.findIndex(subscription => subscription.id === subscriptionId);
  
  if (subscriptionIndex === -1) {
    return { success: false, error: 'Subscription not found' };
  }
  
  const subscription = subscriptions[subscriptionIndex];
  const now = new Date();
  
  subscription.lastPaymentDate = now.toISOString();
  subscription.nextDueDate = calculateNextDueDate(now, subscription.frequency).toISOString();
  subscription.updatedAt = now.toISOString();
  
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  
  return { success: true, subscription };
};

// Get subscriptions that are due or overdue
export const getDueSubscriptions = () => {
  const subscriptions = getSubscriptions();
  const now = new Date();
  
  return subscriptions.filter(subscription => {
    if (subscription.status !== 'active') return false;
    const dueDate = new Date(subscription.nextDueDate);
    return dueDate <= now;
  });
};

// Get subscriptions due within the next 7 days
export const getUpcomingDueSubscriptions = () => {
  const subscriptions = getSubscriptions();
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return subscriptions.filter(subscription => {
    if (subscription.status !== 'active') return false;
    const dueDate = new Date(subscription.nextDueDate);
    return dueDate > now && dueDate <= sevenDaysFromNow;
  });
};

// Get subscription status display text
export const getSubscriptionStatusDisplay = (status) => {
  const statusMap = {
    pending_payment: 'Pending Payment',
    active: 'Active',
    paused: 'Paused',
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

// Get frequency display text
export const getFrequencyDisplay = (frequency) => {
  const frequencyMap = {
    weekly: 'Weekly',
    biweekly: 'Every 2 Weeks',
    monthly: 'Monthly'
  };
  return frequencyMap[frequency] || frequency;
};

// Check if subscription is overdue
export const isSubscriptionOverdue = (subscription) => {
  if (subscription.status !== 'active') return false;
  const now = new Date();
  const dueDate = new Date(subscription.nextDueDate);
  return dueDate < now;
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
