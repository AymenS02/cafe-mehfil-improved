"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Footer } from "./components/Footer";

// ---- HERO IMAGE PATHS ----
const heroImages = Array.from(
  { length: 10 },
  (_, i) => `/images/hero/img${i + 1}.jpg`
);

export default function Home() {
  const imagesRef = useRef([]);
  const storySectionRef = useRef(null);
  const storyTextRef = useRef(null);

  // ---- HERO IMAGE ROTATION ----
  useEffect(() => {
    if (!imagesRef.current.length) return;

    imagesRef.current.forEach((el, i) => {
      gsap.set(el, {
        autoAlpha: i === 0 ? 1 : 0,
        rotate: -15,
        scale: 0.75,
      });
    });

    const tl = gsap.timeline({ repeat: -1 });

    imagesRef.current.forEach((_, i) => {
      const current = imagesRef.current[i];
      const next = imagesRef.current[(i + 1) % imagesRef.current.length];

      tl.to(
        current,
        {
          duration: 0.8,
          autoAlpha: 0,
          rotate: -18,
          scale: 0.7,
          ease: "power2.inOut",
        },
        `step-${i}`
      )
        .fromTo(
          next,
          {
            autoAlpha: 0,
            rotate: -10,
            scale: 0.8,
          },
          {
            duration: 0.8,
            autoAlpha: 1,
            rotate: -15,
            scale: 0.75,
            ease: "power2.inOut",
          },
          `step-${i}+=0.1`
        )
        .to({}, { duration: 0.5 });
    });

    return () => {
      tl.kill();
    };
  }, []);

  // ---- SPLITTEXT-LIKE ANIMATION FOR ABOUT/STORY ----
  useEffect(() => {
    const section = storySectionRef.current;
    const container = storyTextRef.current;
    if (!section || !container) return;

    // 1. Split paragraphs into spans per word
    const paragraphs = Array.from(container.querySelectorAll("p"));
    const wordSpans = [];

    paragraphs.forEach((p) => {
      const text = p.textContent || "";
      const words = text.split(" ").filter(Boolean);

      // clear original text
      p.textContent = "";

      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + (index !== words.length - 1 ? " " : "");
        span.style.display = "inline-block"; // allow transform
        span.style.opacity = "0";
        p.appendChild(span);
        p.appendChild(document.createTextNode(" ")); // space between words
        wordSpans.push(span);
      });
    });

    // 2. Create animation timeline
    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      wordSpans,
      {
        opacity: 0,
        y: "1.2em",
      },
      {
        opacity: 1,
        y: "0em",
        ease: "power3.out",
        duration: 0.6,
        stagger: 0.03,
      }
    );

    // 3. Simple scroll trigger (manual, no plugin)
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Trigger when section is ~50% into view
      if (rect.top < vh * 0.7 && rect.bottom > vh * 0.3) {
        if (tl.progress() === 0) {
          tl.play();
          window.removeEventListener("scroll", handleScroll);
        }
      }
    };

    handleScroll(); // run once in case already in view
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center overflow-x-hidden ">
      {/* Hero Section */}
      <section className="relative w-screen h-svh p-8 flex flex-col justify-center items-center overflow-x-hidden text-primary">
        <div className="hero-header-wrapper">
          <div className="relative -translate-x-[20%] z-1">
            <h1 className="text-[20vw] leading-[0.9] font-bold">Cafe</h1>
          </div>

          <div className="relative translate-x-[20%] z-3">
            <h1 className="text-[20vw] leading-[0.9] font-bold">Mehfil</h1>
          </div>

          <div>
            <h2 className="relative translate-y-[20%] z-3 text-[5vw] font-bold">
              كيفي محفل
            </h2>
          </div>
        </div>

        <div className="absolute bottom-10 w-full p-8 flex justify-between">
          <div className="absolute left-12 h-4 max-md:hidden">
            <Image
              width={75}
              height={75}
              src="/images/global/symbols.png"
              alt=""
            />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <p className="mn">Caffine by Mehfil / 2025</p>
          </div>

          <div className="absolute right-8">
            <p className="mn">Caffine Mode: ON</p>
          </div>
        </div>

        {/* Rotating hero images */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[22vw] w-[40vw] z-2">
          <div className="relative h-full w-full">
            {heroImages.map((src, i) => (
              <div
                key={src}
                ref={(el) => {
                  if (el) imagesRef.current[i] = el;
                }}
                className="absolute inset-0"
              >
                <Image
                  src={src}
                  width={800}
                  height={400}
                  alt=""
                  className="object-cover rounded-2xl border-[0.1em] border-black w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="w-screen min-h-svh p-8 md:p-16 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full">
          <h2 className="text-[8vw] md:text-[6vw] font-bold text-primary mb-16 text-center">
            Our Collection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Cold Brew */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary/20">
              <div className="absolute top-4 right-4 text-4xl">☕</div>
              <h3 className="text-4xl font-bold text-primary mb-4">
                Cold Brew
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Smooth, refreshing, and perfectly crafted. Our signature cold
                brew blends for every mood.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  Explore →
                </span>
                <span className="text-xs text-gray-400">Available Now</span>
              </div>
            </div>

            {/* Creamers & Syrups */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary/20">
              <div className="absolute top-4 right-4 text-4xl">🍯</div>
              <h3 className="text-4xl font-bold text-primary mb-4">
                Creamers & Syrups
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Elevate your coffee experience with our handcrafted creamers and
                artisan syrups.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  Explore →
                </span>
                <span className="text-xs text-gray-400">Available Now</span>
              </div>
            </div>

            {/* Coffee Kits */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary/20">
              <div className="absolute top-4 right-4 text-4xl">📦</div>
              <h3 className="text-4xl font-bold text-primary mb-4">
                Coffee Kits
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Everything you need for the perfect brew. Complete kits for
                coffee enthusiasts.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  Explore →
                </span>
                <span className="text-xs text-gray-400">Available Now</span>
              </div>
            </div>

            {/* Tools & Gadgets */}
            <div className="group relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-lg border-2 border-dashed border-primary/30 opacity-75">
              <div className="absolute top-4 right-4 text-4xl grayscale">
                🔧
              </div>
              <h3 className="text-4xl font-bold text-gray-600 mb-4">
                Tools & Gadgets
              </h3>
              <p className="text-lg text-gray-500 mb-4">
                Premium brewing tools and innovative gadgets for the ultimate
                coffee setup.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">
                  Coming Soon
                </span>
                <span className="text-xs text-primary font-bold">
                  STAY TUNED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About/Story Section with SplitText animation */}
      <section
        ref={storySectionRef}
        className="w-screen min-h-svh p-8 md:p-16 flex items-center justify-center bg-primary text-white relative overflow-hidden"
      >
        <div className="absolute top-10 left-10 text-[15vw] opacity-10 font-bold">
          محفل
        </div>
        <div className="max-w-4xl z-10 relative">
          <h2 className="text-[8vw] md:text-[6vw] font-bold mb-8">
            The Mehfil Story
          </h2>

          {/* This wrapper is what we split/animate */}
          <div
            ref={storyTextRef}
            className="space-y-6 text-lg md:text-xl leading-relaxed"
          >
            <p>
              Mehfil (محفل) means "gathering" in Urdu - a space where friends
              and family come together over conversation and connection.
            </p>
            <p>
              At Cafe Mehfil, we believe coffee is more than a beverage. It's
              the catalyst for meaningful moments, creative breakthroughs, and
              shared experiences.
            </p>
            <p className="text-2xl font-bold">
              Every cup tells a story. What's yours?
            </p>
          </div>

          <div className="mt-12 flex gap-4">
            <button className="px-8 py-3 bg-white text-primary font-bold rounded-full hover:scale-105 transition-transform">
              Our Story
            </button>
            <button className="px-8 py-3 border-2 border-white font-bold rounded-full hover:bg-white hover:text-primary transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Featured/Highlights Section */}
      <section className="w-screen min-h-svh p-8 md:p-16 flex flex-col justify-center items-center relative">
        <div className="max-w-7xl w-full">
          <h2 className="text-[8vw] md:text-[6vw] font-bold text-primary mb-16 text-center">
            Why Mehfil?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8">
              <div className="text-6xl mb-6">🌱</div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Sustainably Sourced
              </h3>
              <p className="text-gray-600">
                Every bean is ethically sourced from farmers who share our
                passion for quality and sustainability.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Artisan Crafted
              </h3>
              <p className="text-gray-600">
                Small-batch roasting and handcrafted recipes ensure every
                product meets our high standards.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8">
              <div className="text-6xl mb-6">❤️</div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Community First
              </h3>
              <p className="text-gray-600">
                Built by coffee lovers, for coffee lovers. Join our growing
                community of caffeine enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter/CTA Section */}
      <section className="w-screen min-h-[70vh] p-8 md:p-16 flex flex-col justify-center items-center">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-[7vw] md:text-[5vw] font-bold text-primary mb-6">
            Join the Gathering
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get exclusive updates, early access to new products, and special
            offers delivered to your inbox.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-6 py-4 rounded-full border-2 border-primary w-full md:w-96 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:scale-105 transition-transform whitespace-nowrap">
              Subscribe
            </button>
          </div>

          <p className="text-sm text-gray-500">
            We respect your inbox. Unsubscribe anytime. No spam, just good
            coffee vibes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}