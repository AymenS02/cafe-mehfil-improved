'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronDown, Coffee, Truck, Calendar, Package, CreditCard, Mail, Users, Phone } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const heroRef = useRef(null);
  const faqRefs = useRef([]);

  const faqCategories = [
    {
      title: "Ordering & Delivery",
      icon: Truck,
      questions: [
        {
          question: "How does delivery work?",
          answer: "We deliver fresh, ready-made coffee directly to your door, office, or event location. Orders placed before 2 PM are delivered the same day within our service area. For events and bulk orders, we recommend ordering at least 48 hours in advance."
        },
        {
          question: "What areas do you deliver to?",
          answer: "We currently deliver within a 25-mile radius of our roastery. Enter your zip code at checkout to see if we deliver to your location. We're constantly expanding our delivery zones, so check back if you're not currently in our service area!"
        },
        {
          question: "Is there a minimum order requirement?",
          answer: "For individual deliveries, the minimum order is $15. For corporate and event orders, the minimum is $50. Free delivery is available on orders over $40 for individuals and $100 for businesses."
        },
        {
          question: "How is the coffee packaged for delivery?",
          answer: "Our coffee is packaged in insulated, eco-friendly containers that keep your drinks at the perfect temperature for up to 4 hours. We use biodegradable cups and compostable lids to minimize environmental impact."
        }
      ]
    },
    {
      title: "Products & Customization",
      icon: Coffee,
      questions: [
        {
          question: "What types of coffee do you offer?",
          answer: "We specialize in cold brew, nitro cold brew, iced coffee, and hot coffee. All our beverages are made from single-origin, ethically sourced beans roasted in-house. We also offer seasonal specialties and can customize blends for corporate clients."
        },
        {
          question: "Can I customize my order?",
          answer: "Absolutely! You can customize sweetness levels, milk alternatives (oat, almond, soy, coconut), and add flavor shots (vanilla, caramel, hazelnut, lavender). For bulk orders, we can create custom flavor profiles tailored to your preferences."
        },
        {
          question: "Do you offer dairy-free options?",
          answer: "Yes! We offer oat milk, almond milk, soy milk, and coconut milk at no extra charge. All our syrups and flavor additions are also available in sugar-free and vegan options."
        },
        {
          question: "How long does the coffee stay fresh?",
          answer: "Our cold brew stays fresh for up to 7 days when refrigerated. Hot coffee is best consumed within 2 hours of delivery. For events, we provide thermal carafes that keep coffee hot for up to 4 hours."
        }
      ]
    },
    {
      title: "Corporate & Event Services",
      icon: Users,
      questions: [
        {
          question: "Do you cater for corporate offices?",
          answer: "Yes! We offer daily, weekly, and monthly coffee delivery subscriptions for offices. Options include morning coffee drops, afternoon pick-me-ups, and all-day beverage stations with self-serve setups and supplies."
        },
        {
          question: "Can you handle large events?",
          answer: "We cater events of all sizes, from intimate meetings of 10 people to conferences of 500+. We provide mobile coffee bars, professional baristas, and full-service setups including cups, napkins, stirrers, and condiments."
        },
        {
          question: "How far in advance should I book for an event?",
          answer: "For events under 50 people, we recommend booking at least 5 business days in advance. For larger events (100+), please book 2-3 weeks ahead to ensure availability of our barista team and equipment."
        },
        {
          question: "Do you provide baristas for events?",
          answer: "Yes! For an additional fee, we provide trained baristas who will prepare and serve beverages at your event. They bring all necessary equipment and can create a custom menu for your guests."
        }
      ]
    },
    {
      title: "Subscriptions & Pricing",
      icon: Calendar,
      questions: [
        {
          question: "Do you offer subscription services?",
          answer: "Yes! Choose from weekly, bi-weekly, or monthly subscriptions and save up to 15%. Subscriptions include free delivery, early access to new products, and the flexibility to pause, skip, or modify deliveries anytime."
        },
        {
          question: "How does subscription pricing work?",
          answer: "Subscription pricing depends on frequency and volume. Individual plans start at $39/month for 4 deliveries. Corporate plans are customized based on team size and frequency. Contact us for a personalized quote."
        },
        {
          question: "Can I cancel my subscription?",
          answer: "You can cancel, pause, or modify your subscription at any time through your account dashboard. There are no cancellation fees, and you'll receive a full refund for any unused deliveries."
        },
        {
          question: "Do you offer discounts for bulk orders?",
          answer: "Yes! Orders of 20+ drinks receive a 10% discount, 50+ receive 15%, and 100+ receive 20%. We also offer special pricing for non-profits, schools, and community organizations."
        }
      ]
    },
    {
      title: "Payment & Security",
      icon: CreditCard,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, Amex, Discover), debit cards, Apple Pay, Google Pay, and PayPal. Corporate clients can set up invoicing with NET-30 payment terms."
        },
        {
          question: "Is my payment information secure?",
          answer: "Absolutely. We use industry-standard SSL encryption and PCI-compliant payment processing. Your payment information is never stored on our servers and is processed through secure payment gateways."
        },
        {
          question: "Can I get a receipt for my order?",
          answer: "Yes! A digital receipt is emailed to you immediately after purchase. You can also access all past receipts through your account dashboard. For corporate clients, we provide itemized monthly invoices."
        },
        {
          question: "Do you offer refunds?",
          answer: "If you're not satisfied with your order, contact us within 24 hours and we'll provide a full refund or replacement. We stand behind the quality of our coffee and your satisfaction is our priority."
        }
      ]
    },
    {
      title: "Contact & Support",
      icon: Phone,
      questions: [
        {
          question: "How can I track my order?",
          answer: "Once your order is dispatched, you'll receive a text message with real-time tracking. You can also track your delivery through your account dashboard or our mobile app."
        },
        {
          question: "What if I'm not home for the delivery?",
          answer: "You can provide delivery instructions at checkout (leave at door, with doorman, etc.). For corporate orders, we'll coordinate with your office manager. If we can't complete delivery, we'll contact you to reschedule."
        },
        {
          question: "How do I contact customer support?",
          answer: "Our support team is available Monday-Friday 7 AM - 7 PM and weekends 8 AM - 5 PM. Reach us via phone at (555) 123-BREW, email at hello@yourcoffee.com, or live chat on our website."
        },
        {
          question: "Do you have a mobile app?",
          answer: "Yes! Download our app for iOS or Android to place orders faster, track deliveries in real-time, save your favorite custom drinks, and access exclusive app-only promotions."
        }
      ]
    }
  ];

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

  // FAQ entrance animation
  useEffect(() => {
    const faqs = faqRefs.current.filter(Boolean);
    if (faqs.length > 0) {
      gsap.fromTo(
        faqs,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, []);

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const faqId = categoryIndex * 100 + questionIndex;
    setOpenIndex(openIndex === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary via-accent to-accent4 text-bg py-24 px-8">
        <div ref={heroRef} className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 p-4 bg-accent1/20 rounded-full">
            <Coffee className="w-12 h-12 text-accent1" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-accent2 max-w-2xl mx-auto">
            Everything you need to know about our coffee delivery service. Can't find what you're looking for? Feel free to reach out!
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <div
                key={categoryIndex}
                ref={(el) => (faqRefs.current[categoryIndex] = el)}
                className="bg-white rounded-2xl shadow-lg p-8 border border-secondary/10"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-secondary/20">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-fg">{category.title}</h2>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const faqId = categoryIndex * 100 + questionIndex;
                    const isOpen = openIndex === faqId;

                    return (
                      <div
                        key={questionIndex}
                        className="border border-secondary/10 rounded-xl overflow-hidden transition-all hover:border-accent4/40"
                      >
                        <button
                          onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                          className="w-full flex items-center justify-between p-5 text-left bg-bg/50 hover:bg-accent4/5 transition-colors"
                        >
                          <span className="font-semibold text-fg pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-secondary transition-transform flex-shrink-0 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <div className="p-5 pt-2 bg-white">
                            <p className="text-secondary leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-accent1 to-accent3 rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Our friendly support team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-bg transition-colors shadow-md"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}