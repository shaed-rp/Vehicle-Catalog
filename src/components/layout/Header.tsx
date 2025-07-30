'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronDown,
  User,
  Settings,
  HelpCircle
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { SearchBar } from '@/components/search/SearchBar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { cart, cartOpen, setCartOpen } = useAppStore()

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="https://vmqwsttnqnlynxwrmeeg.supabase.co/storage/v1/object/public/oem-logos/nissan-logo-white.svg"
                alt="Nissan Fleet"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">Fleet Catalog</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/vehicles" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Vehicles
            </Link>
            <Link 
              href="/filters" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Filters
            </Link>
            <Link 
              href="/comparison" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Compare
            </Link>
            <Link 
              href="/orders" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Orders
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <SearchBar 
              placeholder="Search vehicles, models, or ask questions..."
              onSearch={(query) => {
                // Handle search
                console.log('Search:', query)
              }}
              onNaturalLanguageQuery={(query) => {
                // Handle natural language query
                console.log('Natural language query:', query)
              }}
              suggestions={[]}
              filters={{}}
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* User menu */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <SearchBar 
              placeholder="Search vehicles, models, or ask questions..."
              onSearch={(query) => {
                console.log('Search:', query)
                setIsSearchOpen(false)
              }}
              onNaturalLanguageQuery={(query) => {
                console.log('Natural language query:', query)
                setIsSearchOpen(false)
              }}
              suggestions={[]}
              filters={{}}
            />
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/vehicles" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vehicles
              </Link>
              <Link 
                href="/filters" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Filters
              </Link>
              <Link 
                href="/comparison" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Compare
              </Link>
              <Link 
                href="/orders" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium w-full">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </button>
                <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
                <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium w-full">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        open={cartOpen} 
        onOpenChange={setCartOpen}
      />
    </header>
  )
} 