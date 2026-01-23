'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { getOrders, updateOrderStatus, updatePaymentStatus, getOrderStatusDisplay, getPaymentStatusDisplay } from '../lib/orders';
import { getUsers, createUser as createUserUtil } from '../lib/auth';
import { 
  getSubscriptions, 
  processSubscriptionPayment, 
  getDueSubscriptions,
  getUpcomingDueSubscriptions,
  getFrequencyDisplay,
  getSubscriptionStatusDisplay,
  formatDate,
  isSubscriptionOverdue
} from '../lib/subscriptions';
import { Shield, Users, Package, UserPlus, Check, X, AlertCircle, Calendar, Bell } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [dueSubscriptions, setDueSubscriptions] = useState([]);
  const [upcomingDueSubscriptions, setUpcomingDueSubscriptions] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin');
      return;
    }
    
    if (!isAdmin) {
      router.push('/');
      return;
    }

    loadData();
  }, [isAuthenticated, isAdmin, router]);

  const loadData = () => {
    const allOrders = getOrders();
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setUsers(getUsers());
    
    const allSubscriptions = getSubscriptions();
    setSubscriptions(allSubscriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setDueSubscriptions(getDueSubscriptions());
    setUpcomingDueSubscriptions(getUpcomingDueSubscriptions());
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const result = updateOrderStatus(orderId, newStatus);
    if (result.success) {
      loadData();
      setSuccess(`Order #${orderId} status updated to ${getOrderStatusDisplay(newStatus)}`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleUpdatePaymentStatus = (orderId, newStatus) => {
    const result = updatePaymentStatus(orderId, newStatus);
    if (result.success) {
      loadData();
      setSuccess(`Payment status updated for order #${orderId}`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');
    
    const result = createUserUtil(newUser.email, newUser.password, newUser.name, newUser.role);
    
    if (result.success) {
      setSuccess(`User ${newUser.name} created successfully`);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      setShowCreateUser(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
  };

  const handleProcessPayment = (subscriptionId) => {
    const result = processSubscriptionPayment(subscriptionId);
    if (result.success) {
      loadData();
      setSuccess(`Payment processed for subscription #${subscriptionId}`);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-bg py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg">Admin Dashboard</h1>
            <p className="text-secondary">Manage users and orders</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-secondary/20">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'text-primary border-b-2 border-primary'
                : 'text-secondary hover:text-fg'
            }`}
          >
            <Package className="w-5 h-5 inline mr-2" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'subscriptions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-secondary hover:text-fg'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Subscriptions ({subscriptions.length})
            {dueSubscriptions.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {dueSubscriptions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'users'
                ? 'text-primary border-b-2 border-primary'
                : 'text-secondary hover:text-fg'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Users ({users.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-secondary/10">
                <Package className="w-16 h-16 text-secondary/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-fg mb-2">No Orders Yet</h3>
                <p className="text-secondary">Orders will appear here once customers start placing them</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-fg mb-2">Order #{order.id}</h3>
                      <p className="text-sm text-secondary mb-1">
                        Customer: <span className="font-semibold">{order.userName}</span> ({order.userEmail})
                      </p>
                      <p className="text-sm text-secondary">
                        Placed: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary mb-2">${order.totalAmount.toFixed(2)}</p>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getOrderStatusDisplay(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="mb-4 p-4 bg-bg rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-fg mb-2">Payment Method</p>
                        <p className="text-sm text-secondary">
                          {order.paymentMethod === 'paypal' ? 'PayPal' : 'E-Transfer (Interac)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-fg mb-2">Payment Status</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            order.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                            order.paymentStatus === 'awaiting_confirmation' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getPaymentStatusDisplay(order.paymentStatus)}
                          </span>
                          {order.paymentMethod === 'etransfer' && order.paymentStatus === 'awaiting_confirmation' && (
                            <button
                              onClick={() => handleUpdatePaymentStatus(order.id, 'confirmed')}
                              className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors"
                            >
                              Confirm Payment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-fg mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-2 bg-bg rounded-lg">
                          <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-fg">{item.name}</p>
                            <p className="text-xs text-secondary">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <div className="text-sm font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Status Actions */}
                  <div>
                    <p className="text-sm font-semibold text-fg mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateOrderStatus(order.id, status)}
                          disabled={order.status === status}
                          className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                            order.status === status
                              ? 'bg-secondary/20 text-secondary cursor-not-allowed'
                              : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                          }`}
                        >
                          {getOrderStatusDisplay(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            {/* Reminders Section */}
            {(dueSubscriptions.length > 0 || upcomingDueSubscriptions.length > 0) && (
              <div className="space-y-4">
                {/* Due Now */}
                {dueSubscriptions.length > 0 && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Bell className="w-6 h-6 text-red-600" />
                      <h3 className="text-xl font-bold text-red-900">
                        Overdue Subscriptions ({dueSubscriptions.length})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {dueSubscriptions.map((subscription) => (
                        <div key={subscription.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-fg">{subscription.userName}</p>
                            <p className="text-sm text-secondary">{subscription.userEmail}</p>
                            <p className="text-sm text-red-600 font-semibold mt-1">
                              Due: {formatDate(subscription.nextDueDate)} - ${subscription.amount} ({getFrequencyDisplay(subscription.frequency)})
                            </p>
                          </div>
                          <button
                            onClick={() => handleProcessPayment(subscription.id)}
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Process Payment
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Due Soon */}
                {upcomingDueSubscriptions.length > 0 && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                      <h3 className="text-xl font-bold text-yellow-900">
                        Due Within 7 Days ({upcomingDueSubscriptions.length})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {upcomingDueSubscriptions.map((subscription) => (
                        <div key={subscription.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-fg">{subscription.userName}</p>
                            <p className="text-sm text-secondary">{subscription.userEmail}</p>
                            <p className="text-sm text-yellow-700 font-semibold mt-1">
                              Due: {formatDate(subscription.nextDueDate)} - ${subscription.amount} ({getFrequencyDisplay(subscription.frequency)})
                            </p>
                          </div>
                          <button
                            onClick={() => handleProcessPayment(subscription.id)}
                            className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            Process Early
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* All Subscriptions */}
            <div>
              <h3 className="text-xl font-bold text-fg mb-4">All Subscriptions</h3>
              {subscriptions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-secondary/10">
                  <Calendar className="w-16 h-16 text-secondary/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-fg mb-2">No Subscriptions Yet</h3>
                  <p className="text-secondary">Subscriptions will appear here once users start subscribing</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => {
                    const overdue = isSubscriptionOverdue(subscription);
                    return (
                      <div
                        key={subscription.id}
                        className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
                          overdue ? 'border-red-300' : 'border-secondary/10'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-fg mb-2">{subscription.userName}</h3>
                            <p className="text-sm text-secondary mb-1">{subscription.userEmail}</p>
                            <p className="text-sm text-secondary">
                              Created: {formatDate(subscription.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary mb-2">
                              ${subscription.amount}
                            </p>
                            <p className="text-sm text-secondary mb-2">
                              {getFrequencyDisplay(subscription.frequency)}
                            </p>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              subscription.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : subscription.status === 'paused'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {getSubscriptionStatusDisplay(subscription.status)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-bg rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-fg mb-1">Start Date</p>
                            <p className="text-sm text-secondary">{formatDate(subscription.startDate)}</p>
                          </div>
                          {subscription.status === 'active' && (
                            <div>
                              <p className="text-sm font-semibold text-fg mb-1">Next Due</p>
                              <p className={`text-sm font-semibold ${overdue ? 'text-red-600' : 'text-secondary'}`}>
                                {formatDate(subscription.nextDueDate)}
                                {overdue && ' (OVERDUE)'}
                              </p>
                            </div>
                          )}
                          {subscription.lastPaymentDate && (
                            <div>
                              <p className="text-sm font-semibold text-fg mb-1">Last Payment</p>
                              <p className="text-sm text-secondary">{formatDate(subscription.lastPaymentDate)}</p>
                            </div>
                          )}
                        </div>

                        {subscription.status === 'active' && (
                          <button
                            onClick={() => handleProcessPayment(subscription.id)}
                            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-accent transition-colors"
                          >
                            Process Payment
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* Create User Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCreateUser(!showCreateUser)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-bg font-semibold rounded-lg hover:bg-accent transition-colors shadow-md"
              >
                <UserPlus className="w-5 h-5" />
                Create New User
              </button>
            </div>

            {/* Create User Form */}
            {showCreateUser && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10 mb-6">
                <h3 className="text-xl font-bold text-fg mb-4">Create New User</h3>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-fg mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-fg mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-fg mb-2">Password</label>
                      <input
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-fg mb-2">Role</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-bg font-semibold rounded-lg hover:bg-accent transition-colors shadow-md"
                    >
                      Create User
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateUser(false);
                        setError('');
                        setNewUser({ name: '', email: '', password: '', role: 'user' });
                      }}
                      className="px-6 py-3 bg-secondary/20 text-secondary font-semibold rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List */}
            <div className="bg-white rounded-2xl shadow-lg border border-secondary/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-fg">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-fg">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-fg">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-fg">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/10">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-bg/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-fg">{u.name}</td>
                        <td className="px-6 py-4 text-sm text-secondary">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
