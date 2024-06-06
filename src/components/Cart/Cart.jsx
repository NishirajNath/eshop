import React from 'react';
import './Cart.css';
export default function Cart({ isOpen, onClose })
{
  if (!isOpen) return null;
  
  return(
    <>
      <div className='Cart'>
        <h3>My Cart</h3>
        <button className='Cart-close' onClick={onClose}>X</button>
      </div>
    </>
  );
}