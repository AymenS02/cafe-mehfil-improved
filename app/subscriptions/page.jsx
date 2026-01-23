'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Check, Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';

const SUBSCRIPTION_AMOUNTS = [10, 25, 50, 100, 150, 200];
const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly (3 months)' },
  { value: 'yearly', label: 'Yearly' }
];

export default function SubscriptionsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
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
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSubscriptions();
    }
  }, [isAuthenticated, user]);

  const loadSubscriptions = () => {
    if (user) {
      const subscriptions = getUserSubscriptions(user.id);
      setMySubscriptions(subscriptions);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const getFinalAmount = () => {
    if (customAmount) {
      return parseInt(customAmount);
    }
    return selectedAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = getFinalAmount();
    if (!amount || amount < 5) {
      setError('Please select or enter an amount of at least $5');
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
        amount,
        selectedFrequency
      );

      if (result.success) {
        setSuccess('Subscription created successfully!');
        setSelectedAmount(null);
        setCustomAmount('');
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-2">Subscriptions</h1>
          <p className="text-secondary">Support Cafe Mehfil with a recurring subscription</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Subscription */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
            <h2 className="text-2xl font-bold text-fg mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" />
              Create New Subscription
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-semibold text-fg mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {SUBSCRIPTION_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountClick(amount)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                        selectedAmount === amount
                          ? 'border-primary bg-primary text-white'
                          : 'border-secondary/30 text-fg hover:border-primary/50'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg font-semibold">$</span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Or enter custom amount"
                    className="w-full pl-8 pr-4 py-3 border-2 border-secondary/30 rounded-lg focus:border-primary focus:outline-none text-fg"
                  />
                </div>
              </div>

              {/* Frequency Selection */}
              <div>
                <label className="block text-sm font-semibold text-fg mb-3">
                  Billing Frequency
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {FREQUENCY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedFrequency(option.value)}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold text-left transition-all flex items-center justify-between ${
                        selectedFrequency === option.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-secondary/30 text-fg hover:border-primary/50'
                      }`}
                    >
                      <span>{option.label}</span>
                      {selectedFrequency === option.value && (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {getFinalAmount() && (
                <div className="bg-bg p-4 rounded-lg border border-secondary/30">
                  <p className="text-secondary text-sm mb-1">You will be charged:</p>
                  <p className="text-2xl font-bold text-fg">
                    ${getFinalAmount()}/{selectedFrequency === 'monthly' ? 'mo' : selectedFrequency === 'quarterly' ? 'qtr' : 'yr'}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !getFinalAmount()}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Subscription'}
              </button>
            </form>
          </div>

          {/* My Subscriptions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
            <h2 className="text-2xl font-bold text-fg mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              My Subscriptions
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
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-lg text-fg">${subscription.amount}</p>
                          <p className="text-sm text-secondary">
                            {getFrequencyDisplay(subscription.frequency)}
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
                      
                      <div className="space-y-1 text-sm mb-3">
                        <p className="text-secondary">
                          <span className="font-semibold">Started:</span> {formatDate(subscription.startDate)}
                        </p>
                        {subscription.status === 'active' && (
                          <p className={`${overdue ? 'text-red-600 font-semibold' : 'text-secondary'}`}>
                            <span className="font-semibold">Next Due:</span> {formatDate(subscription.nextDueDate)}
                            {overdue && ' (Overdue)'}
                          </p>
                        )}
                        {subscription.lastPaymentDate && (
                          <p className="text-secondary">
                            <span className="font-semibold">Last Payment:</span> {formatDate(subscription.lastPaymentDate)}
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
    </div>
  );
}
