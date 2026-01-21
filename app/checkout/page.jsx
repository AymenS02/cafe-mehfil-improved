'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../lib/orders';
import { CreditCard, Building2, Check, AlertCircle, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const total = getCartTotal();

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else if (cart.length === 0) {
      router.push('/cart');
    }
  }, [isAuthenticated, cart, router]);

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create order
      const result = createOrder(
        user.id,
        user.name,
        user.email,
        cart,
        paymentMethod,
        total
      );

      if (result.success) {
        // Clear cart
        clearCart();
        
        // Redirect to order confirmation
        router.push(`/account?order=${result.order.id}`);
      } else {
        setError(result.error || 'Failed to create order');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-2">Checkout</h1>
          <p className="text-secondary">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
                <h2 className="text-2xl font-bold text-fg mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-fg mb-2">Name</label>
                    <div className="px-4 py-3 bg-bg rounded-lg border border-secondary/30 text-fg">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-fg mb-2">Email</label>
                    <div className="px-4 py-3 bg-bg rounded-lg border border-secondary/30 text-fg">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10">
                <h2 className="text-2xl font-bold text-fg mb-4">Payment Method</h2>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {/* PayPal Option */}
                  <label className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/5'
                      : 'border-secondary/20 hover:border-secondary/40'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-fg">PayPal</span>
                      </div>
                      <p className="text-sm text-secondary">
                        You'll be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                    {paymentMethod === 'paypal' && (
                      <Check className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </label>

                  {/* E-Transfer Option */}
                  <label className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'etransfer'
                      ? 'border-primary bg-primary/5'
                      : 'border-secondary/20 hover:border-secondary/40'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="etransfer"
                      checked={paymentMethod === 'etransfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-fg">E-Transfer (Interac)</span>
                      </div>
                      <p className="text-sm text-secondary mb-2">
                        Send an e-transfer to: <span className="font-semibold">cafemehfilcoffee@gmail.com</span>
                      </p>
                      <p className="text-sm text-secondary">
                        Your order will be confirmed once we receive the payment. Please include your order number in the message.
                      </p>
                    </div>
                    {paymentMethod === 'etransfer' && (
                      <Check className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary/10 sticky top-8">
                <h2 className="text-xl font-bold text-fg mb-4">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-bg rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-fg truncate">{item.name}</p>
                        <p className="text-xs text-secondary">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t border-secondary/20">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="border-t border-secondary/20 pt-3">
                    <div className="flex justify-between text-lg font-bold text-fg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !paymentMethod}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-lg transition-all shadow-md ${
                    isSubmitting || !paymentMethod
                      ? 'bg-secondary text-bg cursor-not-allowed'
                      : 'bg-primary text-bg hover:bg-accent hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="block text-center text-secondary hover:text-primary transition-colors mt-4"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
