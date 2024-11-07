'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Package } from 'lucide-react'

// Mock product data
const products = [
  { id: 1, name: "Wireless Headphones", price: 129.99, category: "Electronics", image: "/placeholder.svg?height=200&width=200&text=Headphones" },
  { id: 2, name: "Smartphone", price: 699.99, category: "Electronics", image: "/placeholder.svg?height=200&width=200&text=Smartphone" },
  { id: 3, name: "Running Shoes", price: 89.99, category: "Sports", image: "/placeholder.svg?height=200&width=200&text=Shoes" },
  { id: 4, name: "Yoga Mat", price: 29.99, category: "Sports", image: "/placeholder.svg?height=200&width=200&text=Yoga+Mat" },
  { id: 5, name: "Bestselling Novel", price: 14.99, category: "Books", image: "/placeholder.svg?height=200&width=200&text=Novel" },
  { id: 6, name: "Cookbook", price: 24.99, category: "Books", image: "/placeholder.svg?height=200&width=200&text=Cookbook" },
  { id: 7, name: "T-shirt", price: 19.99, category: "Clothing", image: "/placeholder.svg?height=200&width=200&text=T-shirt" },
  { id: 8, name: "Jeans", price: 49.99, category: "Clothing", image: "/placeholder.svg?height=200&width=200&text=Jeans" },
]

const categories = ["All", "Electronics", "Sports", "Books", "Clothing"]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold text-primary">ShopNow</span>
          </div>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">Search Products</h1>
          <div className="flex w-full md:w-auto space-x-4">
            <div className="relative flex-grow md:flex-grow-0">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pr-10"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-gray-600">No products found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}