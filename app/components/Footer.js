import React from 'react'

export const Footer = () => {
  return (
    <div className='w-screen'>
      <div className="relative bg-primary rounded-2xl m-8 text-white shadow-2xl">
        <div className="m-2 absolute top-0 left-0 w-4 h-4 rounded-full bg-accent4 border-2 border-dotted border-accent2"></div>
        <div className="m-2 absolute bottom-0 left-0 w-4 h-4 rounded-full bg-accent4 border-2 border-dotted border-accent2"></div>
        <div className="m-2 absolute bottom-0 right-0 w-4 h-4 rounded-full bg-accent4 border-2 border-dotted border-accent2"></div>
        <div className="m-2 absolute top-0 right-0 w-4 h-4 rounded-full bg-accent4 border-2 border-dotted border-accent2"></div>

        
        <div className='p-8 md:p-16'>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-4">Cafe Mehfil</h3>
              <p className="text-white/80">كيفي محفل</p>
              <p className="text-sm text-white/60 mt-4">
                Caffeine by Mehfil / 2025
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-white/80">
                <li>Cold Brew</li>
                <li>Creamers & Syrups</li>
                <li>Coffee Kits</li>
                <li>All Products</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-white/80">
                <li>Our Story</li>
                <li>Sustainability</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-white/80">
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Facebook</li>
                <li>TikTok</li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
            <p>© 2025 Cafe Mehfil. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Shipping & Returns</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
