import React, { useState, useEffect } from 'react'
import ProductCard from '@/components/product-card'
import Header from '@/components/header'

export default function CompView(props) {
  return (
    <div className="test-mode">
      <Header />
      <ProductCard />
    </div>
  )
}
