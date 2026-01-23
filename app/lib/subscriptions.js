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

// Create subscription
export const createSubscription = (userId, userName, userEmail, amount, frequency) => {
  const subscriptions = getSubscriptions();
  
  const startDate = new Date();
  const nextDueDate = calculateNextDueDate(startDate, frequency);
  
  const newSubscription = {
    id: crypto.randomUUID(),
    userId,
    userName,
    userEmail,
    amount,
    frequency, // monthly, quarterly, yearly
    status: 'active', // active, paused, cancelled
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
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  
  return date;
};

// Update subscription status
export const updateSubscriptionStatus = (subscriptionId, status) => {
  const subscriptions = getSubscriptions();
  const subscriptionIndex = subscriptions.findIndex(subscription => subscription.id === subscriptionId);
  
  if (subscriptionIndex === -1) {
    return { success: false, error: 'Subscription not found' };
  }
  
  subscriptions[subscriptionIndex].status = status;
  subscriptions[subscriptionIndex].updatedAt = new Date().toISOString();
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
    active: 'Active',
    paused: 'Paused',
    cancelled: 'Cancelled'
  };
  return statusMap[status] || status;
};

// Get frequency display text
export const getFrequencyDisplay = (frequency) => {
  const frequencyMap = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly'
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
