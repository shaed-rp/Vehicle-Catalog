'use client'

import { useState } from 'react'
import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useAppStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (vehicleId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(vehicleId)
    } else {
      updateCartQuantity(vehicleId, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // TODO: Implement checkout flow
    setTimeout(() => {
      setIsCheckingOut(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Shopping Cart
                </h2>
                <button
                  onClick={() => onOpenChange(false)}
                  className="relative -mr-2 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Cart Items */}
              {cart.items.length === 0 ? (
                <div className="mt-8 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start shopping to add vehicles to your cart.
                  </p>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cart.items.map((item) => (
                        <li key={`${item.vehicleId}-${item.priceLevel}`} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            {item.vehicle.primaryPhotoUrl ? (
                              <img
                                src={item.vehicle.primaryPhotoUrl}
                                alt={item.vehicle.model}
                                className="h-full w-full object-cover object-center"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">No Image</span>
                              </div>
                            )}
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  {item.vehicle.modelYear} {item.vehicle.make} {item.vehicle.model}
                                </h3>
                                <p className="ml-4">{formatCurrency(item.totalPrice)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.vehicle.trim} • {item.vehicle.driveType}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Level {item.priceLevel} Pricing
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuantityChange(item.vehicleId, item.quantity - 1)}
                                  className="p-1 rounded-full hover:bg-gray-100"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-gray-900">Qty {item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.vehicleId, item.quantity + 1)}
                                  className="p-1 rounded-full hover:bg-gray-100"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.vehicleId)}
                                className="font-medium text-red-600 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatCurrency(cart.totalValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Savings</span>
                      <span className="text-green-600">-{formatCurrency(cart.totalSavings)}</span>
                    </div>
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatCurrency(cart.totalEffectiveValue)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full"
                    >
                      {isCheckingOut ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Proceed to Checkout
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      className="w-full"
                    >
                      Clear Cart
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="text-xs text-gray-500">
                    <p>• All prices include applicable incentives</p>
                    <p>• Delivery times vary by location</p>
                    <p>• Contact your fleet manager for bulk orders</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 