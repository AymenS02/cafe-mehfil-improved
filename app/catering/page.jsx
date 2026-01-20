'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Calculator, Coffee, Users, Package, Truck, DollarSign, IceCream, Wine } from "lucide-react";

// ==================== CONFIG ====================
const CFG = {
  basePriceBySize: { 12: 4.00, 16: 4.50, 20: 5.50 },
  containerUpcharge: {
    plastic_cup: 0.00,
    bubble_tea_sealed: 0.50,
    plastic_can_sealed: 1.50
  },
  packageMultiplier: {
    build_your_own: 1.0,
    hybrid: 1.0,
    ready_made: 1.0
  },
  ice: {
    bagPrice: 2.99,
    bagWeightG: 2300,
    markup: 1.5,
    gramsBySize: { 12: 150, 16: 200, 20: 250 }
  },
  cupsAddon: {
    cupCostBySize: { 12: 0.09, 16: 0.09, 20: 0.14 },
    lidCost: 0.04,
    strawCost: 0.01,
    markup: 1.5
  },
  delivery: {
    roundStep: 5
  }
};

// ==================== HELPERS ====================
const ceil = (n) => Math.ceil(n);
const roundUpCents = (n) => Math.ceil(n * 100) / 100;
const roundUpToStep = (value, step) => Math.ceil(value / step) * step;

// ==================== MAIN QUOTE FUNCTION ====================
function calcCateringQuote(input) {
  const attendees = Math.max(0, Number(input.attendees || 0));
  const expectedDrinkers = Math.max(0, Number(input.expectedDrinkers || 0));
  const drinkers = Math.min(attendees, expectedDrinkers);
  const cupsPerDrinker = Number(input.cupsPerDrinker || 1);
  const cupsNeeded = ceil(drinkers * cupsPerDrinker);

  const oz = Number(input.cupSizeOz);
  const container = input.containerType;
  const packageStyle = input.packageStyle;

  const pricePerCup = CFG.basePriceBySize[oz] + CFG.containerUpcharge[container];
  let drinkSubtotal = cupsNeeded * pricePerCup;
  drinkSubtotal *= CFG.packageMultiplier[packageStyle];

  // Add-ons only relevant for BYO or Hybrid
  const addOnsAllowed = (packageStyle === "build_your_own" || packageStyle === "hybrid");

  let iceTotal = 0;
  if (addOnsAllowed && input.includeIce) {
    const grams = CFG.ice.gramsBySize[oz];
    const iceCostPerCup = (CFG.ice.bagPrice * (grams / CFG.ice.bagWeightG)) * CFG.ice.markup;
    iceTotal = cupsNeeded * iceCostPerCup;
  }

  let cupsAddonTotal = 0;
  if (addOnsAllowed && input.includeCups) {
    const packCostPerCup =
      (CFG.cupsAddon.cupCostBySize[oz] + CFG.cupsAddon.lidCost + CFG.cupsAddon.strawCost) * CFG.cupsAddon.markup;
    cupsAddonTotal = cupsNeeded * packCostPerCup;
  }

  let deliveryFee = 0;
  if (input.fulfillmentMethod === "delivery") {
    const distanceOneWayKm = Number(input.distanceOneWayKm || 0);
    const gasPricePerLitre = Number(input.gasPricePerLitre || 0);
    const vehicleKmPerLitre = Number(input.vehicleKmPerLitre || 1);
    const roundTripKm = distanceOneWayKm * 2;
    const litresUsed = roundTripKm / vehicleKmPerLitre;
    const fuelCost = litresUsed * gasPricePerLitre;
    deliveryFee = roundUpToStep(fuelCost, CFG.delivery.roundStep);
  }

  const total = roundUpCents(drinkSubtotal + iceTotal + cupsAddonTotal + deliveryFee);

  return {
    cupsNeeded,
    pricePerCup: roundUpCents(pricePerCup),
    drinkSubtotal: roundUpCents(drinkSubtotal),
    iceTotal: roundUpCents(iceTotal),
    cupsAddonTotal: roundUpCents(cupsAddonTotal),
    deliveryFee: roundUpCents(deliveryFee),
    total
  };
}

// ==================== COMPONENT ====================
export default function CateringPage() {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const quoteRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    attendees: 50,
    expectedDrinkers: 50,
    cupsPerDrinker: 1,
    cupSizeOz: 12,
    containerType: "plastic_cup",
    packageStyle: "ready_made",
    includeIce: false,
    includeCups: false,
    fulfillmentMethod: "pickup",
    distanceOneWayKm: 0,
    gasPricePerLitre: 1.5,
    vehicleKmPerLitre: 10
  });

  const [quote, setQuote] = useState(null);

  // Hero entrance animation
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }
  }, []);

  // Form entrance animation
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }
      );
    }
  }, []);

  // Quote entrance animation
  useEffect(() => {
    if (quote && quoteRef.current) {
      gsap.fromTo(
        quoteRef.current,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [quote]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const result = calcCateringQuote(formData);
    setQuote(result);
  };

  const addOnsAllowed = formData.packageStyle === "build_your_own" || formData.packageStyle === "hybrid";
  const isDelivery = formData.fulfillmentMethod === "delivery";

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary via-accent to-accent4 text-bg py-24 px-8">
        <div ref={heroRef} className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 p-4 bg-accent1/20 rounded-full">
            <Calculator className="w-12 h-12 text-accent1" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Catering Quote Calculator
          </h1>
          <p className="text-xl text-accent2 max-w-2xl mx-auto">
            Get a transparent, instant quote for your event. Configure your order and see exactly what you&apos;ll pay.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Column */}
          <div ref={formRef}>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-secondary/10">
              <h2 className="text-3xl font-bold text-fg mb-6 flex items-center gap-3">
                <Coffee className="w-8 h-8 text-primary" />
                Configure Your Order
              </h2>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Event Volume Section */}
                <div className="space-y-4 pb-6 border-b border-secondary/20">
                  <h3 className="text-xl font-semibold text-fg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Event Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="attendees" className="block text-sm font-semibold text-fg mb-2">
                        Number of Attendees *
                      </label>
                      <input
                        type="number"
                        id="attendees"
                        name="attendees"
                        required
                        min="0"
                        value={formData.attendees}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                      />
                    </div>

                    <div>
                      <label htmlFor="expectedDrinkers" className="block text-sm font-semibold text-fg mb-2">
                        Expected Coffee Drinkers *
                      </label>
                      <input
                        type="number"
                        id="expectedDrinkers"
                        name="expectedDrinkers"
                        required
                        min="0"
                        max={formData.attendees}
                        value={formData.expectedDrinkers}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                      />
                      {formData.expectedDrinkers > formData.attendees && (
                        <p className="text-xs text-red-500 mt-1">Cannot exceed attendees</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cupsPerDrinker" className="block text-sm font-semibold text-fg mb-2">
                      Cups Per Drinker *
                    </label>
                    <select
                      id="cupsPerDrinker"
                      name="cupsPerDrinker"
                      required
                      value={formData.cupsPerDrinker}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                    >
                      <option value="1">1 cup</option>
                      <option value="1.25">1.25 cups</option>
                      <option value="1.5">1.5 cups</option>
                      <option value="1.75">1.75 cups</option>
                      <option value="2">2 cups</option>
                    </select>
                  </div>
                </div>

                {/* Product Selection Section */}
                <div className="space-y-4 pb-6 border-b border-secondary/20">
                  <h3 className="text-xl font-semibold text-fg flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Product Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cupSizeOz" className="block text-sm font-semibold text-fg mb-2">
                        Cup Size *
                      </label>
                      <select
                        id="cupSizeOz"
                        name="cupSizeOz"
                        required
                        value={formData.cupSizeOz}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                      >
                        <option value="12">12 oz</option>
                        <option value="16">16 oz</option>
                        <option value="20">20 oz</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="containerType" className="block text-sm font-semibold text-fg mb-2">
                        Container Type *
                      </label>
                      <select
                        id="containerType"
                        name="containerType"
                        required
                        value={formData.containerType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                      >
                        <option value="plastic_cup">Plastic Cup</option>
                        <option value="bubble_tea_sealed">Bubble Tea Sealed</option>
                        <option value="plastic_can_sealed">Plastic Can Sealed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="packageStyle" className="block text-sm font-semibold text-fg mb-2">
                      Package Style *
                    </label>
                    <select
                      id="packageStyle"
                      name="packageStyle"
                      required
                      value={formData.packageStyle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                    >
                      <option value="build_your_own">Build Your Own</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="ready_made">Ready Made</option>
                    </select>
                  </div>
                </div>

                {/* Add-ons Section (conditional) */}
                {addOnsAllowed && (
                  <div className="space-y-4 pb-6 border-b border-secondary/20">
                    <h3 className="text-xl font-semibold text-fg flex items-center gap-2">
                      <Wine className="w-5 h-5 text-primary" />
                      Add-Ons
                    </h3>
                    <p className="text-sm text-secondary">
                      Available for Build Your Own and Hybrid packages
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-bg/50">
                        <input
                          type="checkbox"
                          id="includeIce"
                          name="includeIce"
                          checked={formData.includeIce}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-secondary/30 text-primary focus:ring-primary"
                        />
                        <label htmlFor="includeIce" className="font-medium text-fg flex items-center gap-2">
                          <IceCream className="w-4 h-4" />
                          Include Ice
                        </label>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-bg/50">
                        <input
                          type="checkbox"
                          id="includeCups"
                          name="includeCups"
                          checked={formData.includeCups}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-secondary/30 text-primary focus:ring-primary"
                        />
                        <label htmlFor="includeCups" className="font-medium text-fg flex items-center gap-2">
                          <Coffee className="w-4 h-4" />
                          Include Cups, Lids & Straws
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fulfillment Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-fg flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Fulfillment
                  </h3>

                  <div>
                    <label htmlFor="fulfillmentMethod" className="block text-sm font-semibold text-fg mb-2">
                      Fulfillment Method *
                    </label>
                    <select
                      id="fulfillmentMethod"
                      name="fulfillmentMethod"
                      required
                      value={formData.fulfillmentMethod}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>

                  {/* Delivery Details (conditional) */}
                  {isDelivery && (
                    <div className="space-y-4 p-4 bg-accent4/10 rounded-lg border border-accent4/30">
                      <p className="text-sm font-medium text-fg">Delivery Details</p>
                      
                      <div>
                        <label htmlFor="distanceOneWayKm" className="block text-sm font-semibold text-fg mb-2">
                          Distance One-Way (km) *
                        </label>
                        <input
                          type="number"
                          id="distanceOneWayKm"
                          name="distanceOneWayKm"
                          required={isDelivery}
                          min="0"
                          step="0.1"
                          value={formData.distanceOneWayKm}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="gasPricePerLitre" className="block text-sm font-semibold text-fg mb-2">
                            Gas Price ($/L) *
                          </label>
                          <input
                            type="number"
                            id="gasPricePerLitre"
                            name="gasPricePerLitre"
                            required={isDelivery}
                            min="0"
                            step="0.01"
                            value={formData.gasPricePerLitre}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                          />
                        </div>

                        <div>
                          <label htmlFor="vehicleKmPerLitre" className="block text-sm font-semibold text-fg mb-2">
                            Vehicle (km/L) *
                          </label>
                          <input
                            type="number"
                            id="vehicleKmPerLitre"
                            name="vehicleKmPerLitre"
                            required={isDelivery}
                            min="1"
                            step="0.1"
                            value={formData.vehicleKmPerLitre}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-bg bg-primary hover:bg-accent hover:shadow-lg transition-all shadow-md"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Quote
                </button>
              </form>
            </div>
          </div>

          {/* Quote Display Column */}
          <div>
            {quote ? (
              <div ref={quoteRef} className="bg-white rounded-2xl shadow-lg p-8 border border-secondary/10 sticky top-24">
                <h2 className="text-3xl font-bold text-fg mb-6 flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-accent4" />
                  Your Quote
                </h2>

                <div className="space-y-4">
                  {/* Summary */}
                  <div className="pb-4 border-b border-secondary/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-secondary font-medium">Cups Needed:</span>
                      <span className="text-fg font-bold text-lg">{quote.cupsNeeded}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary font-medium">Price Per Cup:</span>
                      <span className="text-fg font-bold">${quote.pricePerCup.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-fg font-medium">Drinks Subtotal:</span>
                      <span className="text-fg font-semibold">${quote.drinkSubtotal.toFixed(2)}</span>
                    </div>

                    {quote.iceTotal > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-fg font-medium flex items-center gap-2">
                          <IceCream className="w-4 h-4" />
                          Ice:
                        </span>
                        <span className="text-fg font-semibold">${quote.iceTotal.toFixed(2)}</span>
                      </div>
                    )}

                    {quote.cupsAddonTotal > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-fg font-medium flex items-center gap-2">
                          <Coffee className="w-4 h-4" />
                          Cups & Supplies:
                        </span>
                        <span className="text-fg font-semibold">${quote.cupsAddonTotal.toFixed(2)}</span>
                      </div>
                    )}

                    {quote.deliveryFee > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-fg font-medium flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Delivery:
                        </span>
                        <span className="text-fg font-semibold">${quote.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t-2 border-primary/30">
                    <div className="flex justify-between items-center">
                      <span className="text-fg font-bold text-xl">Total:</span>
                      <span className="text-primary font-bold text-3xl">${quote.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <a
                      href="/contact"
                      className="w-full block text-center px-6 py-3 bg-accent4 text-white font-semibold rounded-lg hover:bg-accent3 transition-colors shadow-md"
                    >
                      Place Order
                    </a>
                  </div>
                </div>

                {/* Info Note */}
                <div className="mt-6 p-4 bg-accent1/10 rounded-lg border border-accent1/30">
                  <p className="text-sm text-secondary">
                    <strong className="text-fg">Note:</strong> This is an estimate. Final pricing will be confirmed when you place your order. Syrup sweetness and creamer amounts are standard.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-secondary/10 sticky top-24">
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-secondary/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary mb-2">
                    Configure Your Order
                  </h3>
                  <p className="text-secondary/70">
                    Fill out the form to see your quote
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Info Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-accent1 to-accent3 rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Transparent Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Cup Sizes */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Cup Sizes</h3>
              <div className="space-y-2 text-white/90">
                <p>12oz: $4.00 base</p>
                <p>16oz: $4.50 base</p>
                <p>20oz: $5.50 base</p>
              </div>
            </div>

            {/* Container Types */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Containers</h3>
              <div className="space-y-2 text-white/90">
                <p>Plastic Cup: +$0.00</p>
                <p>Bubble Tea: +$0.50</p>
                <p>Plastic Can: +$1.50</p>
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Add-Ons</h3>
              <div className="space-y-2 text-white/90">
                <p>Ice: Calculated per cup</p>
                <p>Cups/Supplies: Based on size</p>
                <p>Delivery: Distance-based</p>
              </div>
            </div>
          </div>

          <p className="text-white/90 text-center">
            All prices are calculated transparently. No hidden fees. What you see is what you pay.
          </p>
        </div>
      </section>
    </div>
  );
}
