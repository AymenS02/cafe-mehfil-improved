'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { 
  createSubscription, 
  getUserSubscriptions, 
  updateSubscriptionStatus,
  getFrequencyDisplay,
  getSubscriptionStatusDisplay,
  formatDate,
  isSubscriptionOverdue
} from '../lib/subscriptions';
import { Check, Calendar, DollarSign, Clock, AlertCircle, Plus, Minus, Package, Coffee, Trash2 } from 'lucide-react';

// Available coffee products for subscription
const COFFEE_PRODUCTS = [
  {
    id: 1,
    name: "Classic Cold Brew",
    price: 12.99,
    image: "/images/products/coldbrew.jpg",
    description: "Smooth, bold cold brew steeped for 24 hours",
  },
  {
    id: 2,
    name: "Vanilla Bean Cold Brew",
    price: 14.99,
    image: "/images/products/coldbrew.jpg",
    description: "Cold brew infused with Madagascar vanilla",
  },
  {
    id: 3,
    name: "Caramel Creamer",
    price: 8.99,
    image: "/images/products/creamers.jpg",
    description: "Rich caramel flavor for the perfect cup",
  },
  {
    id: 4,
    name: "Hazelnut Syrup",
    price: 9.99,
    image: "/images/products/creamers.jpg",
    description: "Smooth hazelnut sweetness",
  },
  {
    id: 5,
    name: "Pour Over Starter Kit",
    price: 49.99,
    image: "/images/products/kits.jpg",
    description: "Everything you need for the perfect pour over",
  },
  {
    id: 6,
    name: "Complete Brewing Kit",
    price: 89.99,
    image: "/images/products/kits.jpg",
    description: "Professional-grade brewing essentials",
  },
];

const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly', description: 'Delivered every week' },
  { value: 'biweekly', label: 'Every 2 Weeks', description: 'Delivered every two weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Delivered once a month' }
];

export default function SubscriptionsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/subscriptions');
    }
  }, [isAuthenticated, router]);

  // Load user's subscriptions
  const loadSubscriptions = useCallback(() => {
    if (user) {
      const subscriptions = getUserSubscriptions(user.id);
      setMySubscriptions(subscriptions);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSubscriptions();
    }
  }, [isAuthenticated, user, loadSubscriptions]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    } else {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      ));
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      setError('Please select at least one product for your subscription');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = createSubscription(
        user.id,
        user.name,
        user.email,
        selectedProducts,
        selectedFrequency
      );

      if (result.success) {
        setSuccess('Coffee subscription created successfully!');
        setSelectedProducts([]);
        setSelectedFrequency('monthly');
        loadSubscriptions();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to create subscription');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = (subscriptionId, newStatus) => {
    const result = updateSubscriptionStatus(subscriptionId, newStatus);
    if (result.success) {
      loadSubscriptions();
      setSuccess(`Subscription ${newStatus} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to update subscription');
    }
  };

  return (
    <div className="min-h-screen bg-bg py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-2">Coffee Subscriptions</h1>
          <p className="text-secondary">Get your favorite coffee delivered on a recurring basis</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{success}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create New Subscription - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
              <h2 className="text-2xl font-bold text-fg mb-4 flex items-center gap-2">
                <Coffee className="w-6 h-6 text-primary" />
                Select Coffee Products
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COFFEE_PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="border-2 border-secondary/30 rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-bg rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-fg text-sm mb-1">{product.name}</h3>
                        <p className="text-xs text-secondary mb-2">{product.description}</p>
                        <p className="text-lg font-bold text-primary mb-2">${product.price}</p>
                        <button
                          type="button"
                          onClick={() => handleAddProduct(product)}
                          className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg font-semibold hover:bg-accent transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
                <h2 className="text-2xl font-bold text-fg mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  Your Subscription Box
                </h2>
                
                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 bg-bg rounded-lg"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-fg">{product.name}</p>
                        <p className="text-sm text-secondary">${product.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-secondary/20 text-fg rounded-lg hover:bg-secondary/30 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold text-fg">{product.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="ml-2 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${(product.price * product.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subscription Details - Right Column (1/3 width) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10 sticky top-4">
              <h2 className="text-2xl font-bold text-fg mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Delivery Schedule
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Frequency Selection */}
                <div>
                  <label className="block text-sm font-semibold text-fg mb-3">
                    Delivery Frequency
                  </label>
                  <div className="space-y-2">
                    {FREQUENCY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedFrequency(option.value)}
                        className={`w-full py-3 px-4 rounded-lg border-2 font-semibold text-left transition-all flex flex-col ${
                          selectedFrequency === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-secondary/30 text-fg hover:border-primary/50'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          {option.label}
                          {selectedFrequency === option.value && (
                            <Check className="w-5 h-5" />
                          )}
                        </span>
                        <span className="text-xs text-secondary mt-1">{option.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {selectedProducts.length > 0 && (
                  <div className="bg-bg p-4 rounded-lg border border-secondary/30">
                    <p className="text-secondary text-sm mb-1">Total per delivery:</p>
                    <p className="text-3xl font-bold text-fg mb-2">
                      ${getTotalAmount().toFixed(2)}
                    </p>
                    <p className="text-xs text-secondary">
                      {selectedProducts.reduce((sum, p) => sum + p.quantity, 0)} items • {getFrequencyDisplay(selectedFrequency)}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || selectedProducts.length === 0}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Start Subscription'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* My Subscriptions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
          <h2 className="text-2xl font-bold text-fg mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            My Active Subscriptions
          </h2>

          {mySubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-secondary/50 mx-auto mb-3" />
              <p className="text-secondary">You don't have any subscriptions yet.</p>
              <p className="text-secondary text-sm mt-1">Create your first subscription to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mySubscriptions.map((subscription) => {
                const overdue = isSubscriptionOverdue(subscription);
                return (
                  <div
                    key={subscription.id}
                    className={`p-4 rounded-lg border-2 ${
                      subscription.status === 'active'
                        ? overdue 
                          ? 'border-red-300 bg-red-50'
                          : 'border-green-300 bg-green-50'
                        : 'border-secondary/30 bg-bg'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-lg text-fg">${subscription.amount.toFixed(2)}</p>
                        <p className="text-sm text-secondary">
                          {getFrequencyDisplay(subscription.frequency)} delivery
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : subscription.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getSubscriptionStatusDisplay(subscription.status)}
                      </span>
                    </div>

                    {/* Products in subscription */}
                    <div className="mb-3 space-y-2">
                      {subscription.products && subscription.products.map((product, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4 text-secondary" />
                          <span className="text-fg">{product.quantity}x {product.name}</span>
                          <span className="text-secondary">@ ${product.price}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-1 text-sm mb-3 border-t border-secondary/20 pt-3">
                      <p className="text-secondary">
                        <span className="font-semibold">Started:</span> {formatDate(subscription.startDate)}
                      </p>
                      {subscription.status === 'active' && (
                        <p className={`${overdue ? 'text-red-600 font-semibold' : 'text-secondary'}`}>
                          <span className="font-semibold">Next Delivery:</span> {formatDate(subscription.nextDueDate)}
                          {overdue && ' (Overdue)'}
                        </p>
                      )}
                      {subscription.lastPaymentDate && (
                        <p className="text-secondary">
                          <span className="font-semibold">Last Delivery:</span> {formatDate(subscription.lastPaymentDate)}
                        </p>
                      )}
                    </div>

                    {subscription.status === 'active' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(subscription.id, 'paused')}
                          className="flex-1 py-2 px-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold hover:bg-yellow-200 transition-colors"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(subscription.id, 'cancelled')}
                          className="flex-1 py-2 px-3 bg-red-100 text-red-800 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    
                    {subscription.status === 'paused' && (
                      <button
                        onClick={() => handleUpdateStatus(subscription.id, 'active')}
                        className="w-full py-2 px-3 bg-green-100 text-green-800 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors"
                      >
                        Resume
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
