/**
 * Home page component
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Premium Fashion for
              <br />
              <span className="text-gray-600">Modern Lifestyle</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover our curated collection of high-quality clothing and accessories 
              designed for the contemporary individual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                </Button>
              </Link>
              <Link href="/collections">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find exactly what you&apos;re looking for
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4 group-hover:shadow-lg transition-shadow">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="text-lg font-medium">Men&apos;s Collection</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Men</h3>
              <p className="text-gray-600">Discover masculine elegance</p>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4 group-hover:shadow-lg transition-shadow">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="text-lg font-medium">Women&apos;s Collection</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Women</h3>
              <p className="text-gray-600">Embrace timeless sophistication</p>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4 group-hover:shadow-lg transition-shadow">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="text-lg font-medium">Accessories</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Accessories</h3>
              <p className="text-gray-600">Complete your perfect look</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-gray-300 mb-8">
            Subscribe to get special offers, free giveaways, and insider updates
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button variant="secondary">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
