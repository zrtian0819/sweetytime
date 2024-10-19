import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Styles from '@/styles/cart.module.scss';

export default function Cart(props) {
  return (
    <>
      <Header />
      <div>Cart</div>
      <Footer />
    </>
  );
}
