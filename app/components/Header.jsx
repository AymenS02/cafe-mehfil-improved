'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import './Header.css';
import Link from 'next/link';

export default function Header() {
  // Removed the useEffect that force-set navOverlay z-index

  useEffect(() => {
    const menuToggleBtn = document.querySelector(".menu-toggle-btn");
    const navOverlay = document.querySelector(".nav-overlay");
    const openLabel = document.querySelector(".open-label");
    const closeLabel = document.querySelector(".close-label");
    const navItems = document.querySelectorAll(".nav-item");
    let isMenuOpen = false;
    let isAnimating = false;
    let scrollY = 0;

    const handleClick = () => {
      if (isAnimating) {
        gsap.killTweensOf([navOverlay, openLabel, closeLabel, navItems]);
        isAnimating = false;
      }

      if (!isMenuOpen) {
        isAnimating = true;

        navOverlay.style.pointerEvents = "all";
        menuToggleBtn.classList.add("menu-open");
        scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";

        gsap.to(openLabel, {
          y: "-1rem",
          duration: 0.3,
        });

        gsap.to(closeLabel, {
          y: "-1rem",
          duration: 0.3,
        });

        gsap.to(navOverlay, {
          opacity: 1,
          duration: 0.3,
          onComplete: () => {
            isAnimating = false;
          },
        });

        gsap.to([navItems, ".nav-footer-item-header", ".nav-footer-item-copy"], {
          opacity: 1,
          y: "0%",
          duration: 0.75,
          stagger: 0.075,
          ease: "power4.out",
        });

        isMenuOpen = true;
      } else {
        isAnimating = true;
        navOverlay.style.pointerEvents = "none";
        menuToggleBtn.classList.remove("menu-open");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);

        gsap.to(openLabel, {
          y: "0rem",
          duration: 0.3,
        });

        gsap.to(closeLabel, {
          y: "0rem",
          duration: 0.3,
        });

        gsap.to(navOverlay, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.set(
              [navItems, ".nav-footer-item-header", ".nav-footer-item-copy"],
              {
                opacity: 0,
                y: "100%",
              }
            );
            isAnimating = false;
          },
        });

        isMenuOpen = false;
      }
    };

    menuToggleBtn?.addEventListener("click", handleClick);

    return () => {
      menuToggleBtn?.removeEventListener("click", handleClick);
    };
  }, []);

  // Close the menu when clicking any internal link inside the overlay
  useEffect(() => {
    const navOverlay = document.querySelector(".nav-overlay");
    if (!navOverlay) return;

    const onOverlayClick = (e) => {
      const anchor = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";

      // Skip external/protocol links
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      const menuToggleBtn = document.querySelector(".menu-toggle-btn");
      if (menuToggleBtn && menuToggleBtn.classList.contains("menu-open")) {
        // Use the existing click handler so all animations/cleanup run
        try {
          menuToggleBtn.click();
        } catch {
          // best-effort fallback
          menuToggleBtn.classList.remove("menu-open");
          const navOverlayEl = document.querySelector(".nav-overlay");
          if (navOverlayEl) navOverlayEl.style.pointerEvents = "none";
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.width = "";
        }
      }
      // Do not preventDefault; allow navigation to proceed
    };

    navOverlay.addEventListener("click", onOverlayClick);
    return () => navOverlay.removeEventListener("click", onOverlayClick);
  }, []);

  // Also ensure the menu is closed whenever the route changes
  const pathname = usePathname();
  useEffect(() => {
    const menuToggleBtn = document.querySelector(".menu-toggle-btn");
    if (menuToggleBtn && menuToggleBtn.classList.contains("menu-open")) {
      try {
        menuToggleBtn.click();
      } catch {
        // minimal fallback cleanup
        const navOverlay = document.querySelector(".nav-overlay");
        menuToggleBtn.classList.remove("menu-open");
        if (navOverlay) navOverlay.style.pointerEvents = "none";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
      }
    }
  }, [pathname]);

  return (
    <>
      <nav>
        <div className="logo">
          <div className="logo-container">
            <p className="mn"><Link href="/">Cafe ✦ Mehfil</Link></p>
          </div>
        </div>
        <div className="menu-toggle-btn md:hidden">
          <div className="menu-toggle-btn-wrapper">
            <p className="mn open-label">Menu</p>
            <p className="mn close-label">Close</p>
          </div>
        </div>

        <div className="z-200 overflow-visible relative p-2 bg-bg2 flex gap-2 max-md:hidden">
          <div className="menu-toggle-btn-wrapper">
            <p className="mn"><Link href="/">HOME</Link></p>
          </div>
          <div className="menu-toggle-btn-wrapper">
            <p className="mn"><Link href="/shop">SHOP</Link></p>
          </div>
          <div className="menu-toggle-btn-wrapper">
            <p className="mn"><Link href="/faq">FAQ</Link></p>
          </div>
          <div className="menu-toggle-btn-wrapper">
            <p className="mn"><Link href="/about">ABOUT US</Link></p>
          </div>
          <div className="menu-toggle-btn-wrapper">
            <p className="mn"><Link href="/contact">CONTACT</Link></p>
          </div>

        </div>
      </nav>

      <div className="nav-overlay">
        <div className="nav-items">
          <div className="nav-item active">
            <p><Link href="/">HOME</Link></p>
          </div>
          <div className="nav-item">
            <p><Link href="/shop">SHOP</Link></p>
          </div>
          {/* <div className="nav-item">
            <p><Link href="/locations">LOCATIONS</Link></p>
          </div>
          <div className="nav-item">
            <p><Link href="/business">BUSINESS</Link></p>
          </div>
          <div className="nav-item">
            <p><Link href="/subscriptions">SUBSCRIPTIONS</Link></p>
          </div> */}
          <div className="nav-item">
            <p><Link href="/faq">FAQ</Link></p>
          </div>
          <div className="nav-item">
            <p><Link href="/about">ABOUT US</Link></p>
          </div>
          <div className="nav-item">
            <p><Link href="/contact">CONTACT</Link></p>
          </div>
        </div>
        <div className="nav-footer">
          <div className="nav-footer-item">
            <div className="nav-footer-item-header">
              <p className="mn">Find Me</p>
            </div>
            <div className="nav-footer-item-copy">
              <p className="mn"><a href="#" target="_blank" rel="noreferrer">Instagram</a></p>
              <p className="mn"><a href="#" target="_blank" rel="noreferrer">289-788-3215</a></p>
            </div>
          </div>
          <div className="nav-footer-item">
            <div className="nav-footer-item-copy">
              <p className="mn">ℝ — May 2025 // Reserved Rights</p>
            </div>
          </div>
          <div className="nav-footer-item">
            <div className="nav-footer-item-header">
              <p className="mn">Say Hi</p>
            </div>
            <div className="nav-footer-item-copy">
              <p className="mn">
                <a href="mailto:cafemehfilcoffee@gmail.com" target="_blank" rel="noreferrer">
                  cafemehfilcoffee@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}