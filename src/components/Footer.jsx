import { useState } from 'react'
import '../styles/Footer.css'

export default function Footer() {
  const handleSendToWhatsApp = () => {
    const whatsappLink = `https://wa.me/919514083145`
    window.open(whatsappLink, '_blank')
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about-section">
          <h3>About R.G THATHA</h3>
          <p>
            With over 40 years of trusted service in the spice and dry goods business, 
            R.G THATHA has been a household name in Coimbatore. We pride ourselves on delivering 
            premium quality products to our valued customers across the region.
          </p>
          <p className="tagline">
            Your trusted partner for authentic spices and dry goods since 1984.
          </p>
        </div>

        <div className="footer-section payment-section">
          <h3>Payment</h3>
          <p className="payment-heading">Scan to pay with any UPI app</p>
          <div className="qr-code-container">
            <img 
              src="/assets/payment/qr-code.jpeg" 
              alt="UPI QR Code" 
              className="qr-code"
            />
          </div>
          <p className="upi-id">UPI ID: amutharajeshwaraguptha1956@oksbi</p>
          <button 
            className="payment-confirm-btn"
            onClick={handleSendToWhatsApp}
          >
            Send Payment Details
          </button>
        </div>

        <div className="footer-section contact-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p>
              <strong>Location:</strong><br />
              Coimbatore, Tamil Nadu
            </p>
            <p>
              <strong>Phone:</strong><br />
              <a href="tel:+919514083145">+91 9514083145</a>
            </p>
            <p>
              <strong>WhatsApp:</strong><br />
              <a href="https://wa.me/919514083145" target="_blank" rel="noopener noreferrer">
                Chat with us
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 R.G THATHA. All rights reserved.</p>
      </div>
    </footer>
  )
}
