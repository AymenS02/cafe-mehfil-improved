'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ShoppingCart, Filter, Search, Package, Droplet, Wrench, Coffee } from "lucide-react";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const productCardRefs = useRef([]);

  const categories = [
    { id: "all", label: "All Products", icon: Package },
    { id: "cold-brew", label: "Cold Brew", icon: Coffee },
    { id: "creamers-syrups", label: "Creamers & Syrups", icon: Droplet },
    { id: "coffee-kits", label: "Coffee Kits", icon: Package },
    { id: "tools-gadgets", label: "Tools & Gadgets", icon: Wrench },
  ];

  const products = [
    {
      id: 1,
      name: "Classic Cold Brew",
      category: "cold-brew",
      price: 12.99,
      image: "/images/products/coldbrew.jpg",
      description: "Smooth, bold cold brew steeped for 24 hours",
      inStock: true,
    },
    {
      id: 2,
      name: "Vanilla Bean Cold Brew",
      category: "cold-brew",
      price: 14.99,
      image: "/images/products/coldbrew.jpg",
      description: "Cold brew infused with Madagascar vanilla",
      inStock: true,
    },
    {
      id: 3,
      name: "Caramel Creamer",
      category: "creamers-syrups",
      price: 8.99,
      image: "/images/products/creamers.jpg",
      description: "Rich caramel flavor for the perfect cup",
      inStock: true,
    },
    {
      id: 4,
      name: "Hazelnut Syrup",
      category: "creamers-syrups",
      price: 9.99,
      image: "/images/products/creamers.jpg",
      description: "Smooth hazelnut sweetness",
      inStock: true,
    },
    {
      id: 5,
      name: "Pour Over Starter Kit",
      category: "coffee-kits",
      price: 49.99,
      image: "/images/products/kits.jpg",
      description: "Everything you need for the perfect pour over",
      inStock: true,
    },
    {
      id: 6,
      name: "Complete Brewing Kit",
      category: "coffee-kits",
      price: 89.99,
      image: "/images/products/kits.jpg",
      description: "Professional-grade brewing essentials",
      inStock: true,
    },
    {
      id: 7,
      name: "Digital Coffee Scale",
      category: "tools-gadgets",
      price: 29.99,
      image: "/images/products/tools.jpg",
      description: "Precision scale for perfect measurements",
      inStock: false,
    },
    {
      id: 8,
      name: "Burr Grinder",
      category: "tools-gadgets",
      price: 79.99,
      image: "/images/products/tools.jpg",
      description: "Consistent grind for the best extraction",
      inStock: false,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // Product cards entrance animation
  useEffect(() => {
    const cards = productCardRefs.current.filter(Boolean);
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, [filteredProducts, selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleCardHover = (idx, isEntering) => {
    const card = productCardRefs.current[idx];
    if (!card) return;

    const img = card.querySelector(".product-image");
    const btn = card.querySelector(".add-to-cart-btn");

    if (isEntering) {
      gsap.to(card, {
        y: -8,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(img, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
      if (btn) {
        gsap.to(btn, {
          y: -4,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    } else {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(img, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      if (btn) {
        gsap.to(btn, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary to-accent text-bg py-24 px-8">
        <div ref={heroRef} className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Shop</h1>
          <p className="text-xl text-accent2 mb-8">
            Discover our curated collection of coffee essentials
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent2/70 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-accent text-bg placeholder-accent2/60 border border-accent4/40 focus:border-accent1 focus:outline-none transition"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-bg border-b border-secondary/20 sticky top-0 z-3">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-secondary" />
            <span className="text-sm font-semibold text-fg">Filter by category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                    selectedCategory === cat.id
                      ? "bg-primary text-bg shadow-md"
                      : "bg-bg text-fg border border-secondary/30 hover:bg-accent4/20 hover:border-accent4"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section ref={productsRef} className="max-w-6xl mx-auto px-8 py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-secondary/40 mx-auto mb-4" />
            <p className="text-fg/60 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <article
                key={product.id}
                ref={(el) => (productCardRefs.current[idx] = el)}
                onMouseEnter={() => handleCardHover(idx, true)}
                onMouseLeave={() => handleCardHover(idx, false)}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-shadow hover:shadow-xl border border-secondary/10"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-bg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover product-image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {!product.inStock && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-accent2 text-fg text-xs font-semibold rounded-lg shadow-md">
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-fg mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-secondary mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <button
                      disabled={!product.inStock}
                      className={`add-to-cart-btn flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                        product.inStock
                          ? "bg-primary text-bg hover:bg-accent shadow-md hover:shadow-lg"
                          : "bg-bg text-secondary/40 cursor-not-allowed border border-secondary/20"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.inStock ? "Add to Cart" : "Unavailable"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}