'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Mail, Phone, MapPin, Clock, Send, Coffee, Building2, Users, Package, MessageSquare, Calendar } from "lucide-react";

const WEB3FORMS_KEY = "a305236b-9653-4090-b21c-ec086de8cf47";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRefs = useRef([]);

  const categories = [
    { value: "individual", label: "Individual Order", icon: Coffee },
    { value: "corporate", label: "Corporate Services", icon: Building2 },
    { value: "event", label: "Event Catering", icon: Users },
    { value: "subscription", label: "Subscription Inquiry", icon: Calendar },
    { value: "product", label: "Product Question", icon: Package },
    { value: "support", label: "Customer Support", icon: MessageSquare },
    { value: "other", label: "Other", icon: Coffee },
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "(555) 123-BREW",
      link: "tel:+15551232739",
      description: "Mon-Fri 7AM-7PM, Sat-Sun 8AM-5PM"
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@yourcoffee.com",
      link: "mailto:hello@yourcoffee.com",
      description: "We respond within 24 hours"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "123 Coffee Lane, Hamilton, ON",
      link: "https://maps.google.com",
      description: "Visit our roastery & café"
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "Mon-Fri: 7AM - 7PM",
      value2: "Sat-Sun: 8AM - 5PM",
      description: "Delivery & pickup available"
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

  // Info cards entrance animation
  useEffect(() => {
    const cards = infoRefs.current.filter(Boolean);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: "",
      });
    } else {
      setSubmitStatus("error");
    }
  } catch (error) {
    console.error(error);
    setSubmitStatus("error");
  } finally {
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 5000);
  }
};


  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary via-accent to-accent4 text-bg py-24 px-8">
        <div ref={heroRef} className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 p-4 bg-accent1/20 rounded-full">
            <MessageSquare className="w-12 h-12 text-accent1" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-accent2 max-w-2xl mx-auto">
            Have a question or ready to order? We'd love to hear from you. Our team is here to help make your coffee experience exceptional.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div
                key={index}
                ref={(el) => (infoRefs.current[index] = el)}
                className="bg-white rounded-xl shadow-lg p-6 border border-secondary/10 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-fg mb-2">{info.label}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-secondary hover:text-primary transition-colors font-medium mb-1"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-secondary font-medium mb-1">{info.value}</p>
                  )}
                  {info.value2 && (
                    <p className="text-secondary font-medium mb-1">{info.value2}</p>
                  )}
                  <p className="text-sm text-secondary/70 mt-2">{info.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content: Form + Map */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div ref={formRef}>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-secondary/10">
              <h2 className="text-3xl font-bold text-fg mb-2">Send Us a Message</h2>
              <p className="text-secondary mb-6">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-fg mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-fg mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-fg mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-fg mb-2">
                    What can we help you with? *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-fg mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-fg mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-secondary/30 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-fg resize-none"
                    placeholder="Tell us more about your needs..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-bg transition-all shadow-md ${
                    isSubmitting
                      ? "bg-secondary cursor-not-allowed"
                      : "bg-primary hover:bg-accent hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === "error" && (
                  <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
                    <p className="text-red-700 font-medium text-center">
                      ✕ Something went wrong. Please try again.
                    </p>
                  </div>
                )}

              </form>
            </div>
          </div>

          {/* Right Column: Map + Quick Info */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-secondary/10">
              <div className="aspect-[4/3] bg-secondary/10 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.234567890123!2d-79.8711!3d43.2557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDE1JzIwLjUiTiA3OcKwNTInMTYuMCJX!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>

            {/* Quick Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-secondary/10">
              <h3 className="text-2xl font-bold text-fg mb-4">What We Can Help With</h3>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <div
                      key={cat.value}
                      className="flex items-center gap-3 p-3 rounded-lg bg-bg/50 hover:bg-accent4/10 transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-fg">{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-br from-accent1 to-accent3 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Need Immediate Assistance?</h3>
              <p className="mb-4 text-white/90">
                For urgent orders or same-day delivery inquiries, call us directly.
              </p>
              <a
                href="tel:+15551232739"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-bg transition-colors shadow-md"
              >
                <Phone className="w-5 h-5" />
                (555) 123-BREW
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}