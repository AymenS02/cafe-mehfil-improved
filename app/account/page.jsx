'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, getOrderStatusDisplay, getPaymentStatusDisplay } from '../lib/orders';
import { User, LogOut, Package, Clock, CheckCircle, XCircle, Truck, ShoppingBag } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const newOrderId = searchParams.get('order');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      const userOrders = getUserOrders(user.id);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      // Show new order if present
      if (newOrderId) {
        const newOrder = userOrders.find(o => o.id === newOrderId);
        if (newOrder) {
          setSelectedOrder(newOrder);
        }
      }
    }
  }, [isAuthenticated, user, router, newOrderId]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-secondary" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-bg py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-2">My Account</h1>
          <p className="text-secondary">Manage your orders and account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-secondary/20">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-fg">{user.name}</h2>
                  <p className="text-sm text-secondary">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Package className="w-5 h-5" />
                    <span>My Orders</span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full p-3 flex items-center gap-2 text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Order Confirmation Message */}
            {newOrderId && selectedOrder && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">Order Placed Successfully!</h3>
                    <p className="text-sm text-green-800 mb-2">
                      Thank you for your order. Your order number is <strong>#{selectedOrder.id}</strong>
                    </p>
                    {selectedOrder.paymentMethod === 'etransfer' && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900 font-semibold mb-1">
                          Payment Instructions:
                        </p>
                        <p className="text-sm text-blue-800">
                          Send an e-transfer of <strong>${selectedOrder.totalAmount.toFixed(2)}</strong> to{' '}
                          <strong>cafemehfilcoffee@gmail.com</strong>
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Include order #{selectedOrder.id} in your message
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders List */}
            <div className="bg-white rounded-2xl shadow-lg border border-secondary/10 overflow-hidden">
              <div className="p-6 border-b border-secondary/20">
                <h2 className="text-2xl font-bold text-fg">Order History</h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 text-secondary/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-fg mb-2">No Orders Yet</h3>
                  <p className="text-secondary mb-6">Start shopping to place your first order</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-bg font-semibold rounded-lg hover:bg-accent transition-colors shadow-md"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-secondary/10">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-fg">Order #{order.id}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                              {getOrderStatusDisplay(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-secondary">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                          <p className="text-xs text-secondary">
                            Payment: {getPaymentStatusDisplay(order.paymentStatus)}
                          </p>
                        </div>
                      </div>

                      {/* Order Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon('pending')}
                            <span className="text-sm font-medium">Ordered</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon('confirmed')}
                            <span className="text-sm font-medium">Confirmed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon('preparing')}
                            <span className="text-sm font-medium">Preparing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon('shipped')}
                            <span className="text-sm font-medium">Shipped</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon('delivered')}
                            <span className="text-sm font-medium">Delivered</span>
                          </div>
                        </div>
                        <div className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              order.status === 'pending' ? 'w-1/5 bg-yellow-500' :
                              order.status === 'confirmed' ? 'w-2/5 bg-green-500' :
                              order.status === 'preparing' ? 'w-3/5 bg-blue-500' :
                              order.status === 'shipped' ? 'w-4/5 bg-blue-500' :
                              order.status === 'delivered' ? 'w-full bg-green-500' :
                              'w-0'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="mb-4 p-3 bg-bg rounded-lg">
                        <p className="text-sm font-semibold text-fg mb-1">Payment Method</p>
                        <p className="text-sm text-secondary">
                          {order.paymentMethod === 'paypal' ? 'PayPal' : 'E-Transfer (Interac)'}
                        </p>
                        {order.paymentMethod === 'etransfer' && order.paymentStatus === 'awaiting_confirmation' && (
                          <p className="text-xs text-yellow-700 mt-1">
                            ⏳ Waiting for e-transfer confirmation
                          </p>
                        )}
                      </div>

                      {/* Order Items */}
                      <div>
                        <p className="text-sm font-semibold text-fg mb-2">Items ({order.items.length})</p>
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
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-fg truncate">{item.name}</p>
                                <p className="text-xs text-secondary">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                              </div>
                              <div className="text-sm font-bold text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
