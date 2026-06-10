import * as React from 'react';

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  totalAmount: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
}

export const OrderConfirmationEmail: React.FC<Readonly<OrderConfirmationEmailProps>> = ({
  orderId,
  customerName,
  totalAmount,
  items,
}) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#000', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>Silsila</h1>
    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>Order Confirmed</h2>
    <p>Dear {customerName},</p>
    <p>Thank you for your order! Your pieces of timeless elegance are being prepared for shipping.</p>
    
    <div style={{ margin: '30px 0', border: '1px solid #eee', padding: '20px' }}>
      <p style={{ margin: '0', fontWeight: 'bold' }}>Order ID: {orderId}</p>
      <div style={{ marginTop: '20px' }}>
        {items.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
            <span>{item.title} x {item.quantity}</span>
            <span>₹{item.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span>Total</span>
        <span>₹{totalAmount.toLocaleString()}</span>
      </div>
    </div>
    
    <p style={{ fontSize: '12px', color: '#666', marginTop: '40px' }}>
      If you have any questions, please reply to this email or contact our support.
    </p>
    <p style={{ fontSize: '12px', color: '#666' }}>
      © {new Date().getFullYear()} Silsila Silver Jewellery. All rights reserved.
    </p>
  </div>
);
