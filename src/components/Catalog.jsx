import { useState, useEffect } from 'react'
import englishData from '../json/english.json'
import tamilData from '../json/tamil.json'
import tanglishData from '../json/tanglish.json'
import ImageModal from './ImageModal'
import '../styles/Catalog.css'
import '../styles/Footer.css'

export default function Catalog() {
  const [language, setLanguage] = useState('english')
  const [products, setProducts] = useState([])
  const [selectedImages, setSelectedImages] = useState(null)
  const [imageStartIndex, setImageStartIndex] = useState(0)
  const [imagesLoadStatus, setImagesLoadStatus] = useState({})
  const [quantities, setQuantities] = useState({})
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  // Map ID to Tanglish folder names
  const idToTanglishFolder = {
    1: 'Paatham',
    2: 'Munthiri',
    3: 'Pistha',
    4: 'Thiratchai',
    5: 'Thiratchai',
    6: 'Kirambu',
    7: 'Kirambu',
    8: 'Pattai',
    9: 'Pattai',
    10: 'Milagu',
    11: 'Milagu',
    12: 'Seeragam',
    13: 'Seeragam',
    14: 'Soambu',
    15: 'Soambu',
    16: 'Kasakasa',
    17: 'Sukku',
    18: 'Sundakka_Vathal',
    19: 'Sundakka_Vathal',
    20: 'Moor_Milagai',
    21: 'Moor_Milagai',
    22: 'Sukkuttikkai',
    23: 'Kalpaasi',
    24: 'Anisi_Poo',
    25: 'Biryani_Ilai',
    26: 'Soda_Uppu',
    27: 'Cherry',
    28: 'Javarisi_Vathal',
    29: 'Color_Koddal',
    30: 'Bat_Fryums',
    31: 'Elakkay',
    32: 'Mixed',
    33: 'Mixed',
    34: 'Heart_Fryums',
  }

  useEffect(() => {
    const dataMap = {
      english: englishData,
      tamil: tamilData,
      tanglish: tanglishData
    }
    setProducts(dataMap[language] || [])
    console.log('Loaded products for', language, dataMap[language])
  }, [language])

  const getProductName = (product) => {
    return product.product_name
  }

  const getProductType = (product) => {
    return product.product_type
  }

  const getPrice = (product) => {
    return product.price_per_product
  }

  const getSlotCount = (product) => {
    return product.slot_count
  }

  const getSlotPrice = (product) => {
    return product.slot_total_price
  }

  const getVariant = (product) => {
    return product.variant
  }

  // Helper to get normalized product name for folder
  const normalizeName = (name) => {
    if (!name) return ''
    // Replace spaces with underscore and remove characters not in A-Z a-z 0-9 _ -
    return name
      .toString()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')
  }

  // Get folder based on product ID (always uses Tanglish names)
  const getImageFolder = (product) => {
    const id = product.id
    const tanglishName = idToTanglishFolder[id]
    const folder = normalizeName(tanglishName)
    console.log('getImageFolder -> id:', id, 'tanglishName:', tanglishName, 'folder:', folder)
    return folder
  }

  const safeNumberForFilename = (val) => {
    if (val === undefined || val === null) return '0'
    return String(val).toString().replace(/[^\d.]/g, '')
  }

  const getSingleImage = (product) => {
    const price = safeNumberForFilename(getPrice(product))
    const folder = getImageFolder(product)
    const imagePath = `/assets/${folder}/Single(Rs_${price}).jpg`
    return imagePath
  }

  const getSlotImage = (product) => {
    const slotPrice = safeNumberForFilename(getSlotPrice(product))
    const folder = getImageFolder(product)
    const imagePath = `/assets/${folder}/Slot(Rs_${slotPrice}).jpg`
    return imagePath
  }

  const handleImageError = (productId, imageType) => {
    setImagesLoadStatus((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [imageType]: 'failed'
      }
    }))
  }

  const handleImageLoad = (productId, imageType) => {
    setImagesLoadStatus((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [imageType]: 'loaded'
      }
    }))
  }

  const areAllImagesFailed = (productId) => {
    const status = imagesLoadStatus[productId] || {}
    return status.single === 'failed' && status.slot === 'failed'
  }

  const openImageModal = (product, startIndex) => {
    if (areAllImagesFailed(product.id)) {
      return // Don't open modal if both images failed
    }
    const singleImg = getSingleImage(product)
    const slotImg = getSlotImage(product)
    const images = [
      { src: singleImg, alt: 'Single', isNoImage: false },
      { src: slotImg, alt: 'Slot', isNoImage: false }
    ]
    setSelectedImages(images)
    setImageStartIndex(startIndex)
  }

  const closeImageModal = () => {
    setSelectedImages(null)
  }

  const updateQuantity = (productId, value) => {
    const qty = Math.max(1, parseInt(value) || 1)
    setQuantities((prev) => ({
      ...prev,
      [productId]: qty
    }))
    
    // Automatically add to cart when quantity changes
    addToCartAutomatically(productId, qty)
  }

  const addToCartAutomatically = (productId, quantity) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const existingItem = cart.find(item => item.id === productId)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
  }

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1
    addToCartAutomatically(product.id, quantity)
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
    // Reset quantity when removed from cart
    setQuantities(prev => ({
      ...prev,
      [productId]: 1
    }))
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handlePlaceOrder = () => {
    if (cart.length === 0) return

    // Format cart items for WhatsApp message
    const cartMessage = cart
      .map((item) => `${item.product_name} - Qty: ${item.quantity} - ₹${item.price_per_product * item.quantity}`)
      .join('%0A')

    const totalPrice = cart.reduce((sum, item) => sum + (item.price_per_product * item.quantity), 0)
    const message = `Order%20Request:%0A${cartMessage}%0A%0ATotal:%20₹${totalPrice}`

    const whatsappLink = `https://wa.me/919514083145?text=${message}`
    window.open(whatsappLink, '_blank')
  }

  const handleShareProduct = (product) => {
    // Create a shareable product URL with details
    const productDetails = encodeURIComponent(
      `🎁 *${product.product_name}*\n\n` +
      `📦 Type: ${product.product_type}\n` +
      `💰 Price: ₹${product.price_per_product}\n` +
      `📊 Variant: ${product.variant}\n` +
      `🎯 Slots: ${product.slot_count}\n` +
      `💵 Slot Price: ₹${product.slot_total_price}\n\n` +
      `✨ Check out this amazing product from *R.G THATHA*!\n\n` +
      `🛍️ Visit our catalog to order: https://rg-thatha.netlify.app/`
    )
    
    const whatsappLink = `https://wa.me/?text=${productDetails}`
    window.open(whatsappLink, '_blank')
  }

  return (
    <div className="catalog-container">
      <div className="header">
        <h1>Product Catalog</h1>
        <div className="language-switcher">
          <button
            className={language === 'english' ? 'active' : ''}
            onClick={() => setLanguage('english')}
          >
            English
          </button>
          <button
            className={language === 'tamil' ? 'active' : ''}
            onClick={() => setLanguage('tamil')}
          >
            Tamil
          </button>
          <button
            className={language === 'tanglish' ? 'active' : ''}
            onClick={() => setLanguage('tanglish')}
          >
            Tanglish
          </button>
        </div>
      </div>

      {/* Cart Icon in Bottom Right */}
      <div className="cart-icon-container">
        <button
          className={`cart-icon-btn ${cartTotal > 0 ? 'active' : ''}`}
          onClick={() => setShowCart(!showCart)}
        >
          🛒
          {cartTotal > 0 && (
            <span className={`cart-badge ${cartTotal > 0 ? 'blink' : ''}`}>
              {cartTotal}
            </span>
          )}
        </button>
      </div>

      {/* Contact Icons in Bottom Left */}
      <div className="contact-icons-container">
        <a
          href="tel:+919514083145"
          className="contact-icon-btn call-btn"
          title="Call us"
        >
          ☎️
        </a>
        <a
          href="https://wa.me/919514083145"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-icon-btn whatsapp-btn"
          title="Chat on WhatsApp"
        >
          💬
        </a>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button
              className="cart-close"
              onClick={() => setShowCart(false)}
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.product_name}</h4>
                    <p>₹{item.price_per_product}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="cart-qty-btn"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value) || 0)}
                      className="cart-qty-input"
                      min="1"
                    />
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="cart-qty-btn"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cart-remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ₹{item.price_per_product * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <strong>Total: </strong>
                <strong>₹{cart.reduce((sum, item) => sum + (item.price_per_product * item.quantity), 0)}</strong>
              </div>
              <button className="checkout-btn" onClick={handlePlaceOrder}>
                Place The Order
              </button>
            </div>
          )}
        </div>
      )}

      <div className="products-grid">
        {products.map((product, index) => {
          const allFailed = areAllImagesFailed(product.id)
          const quantity = quantities[product.id] || 1
          const inCart = cart.some(item => item.id === product.id)
          
          return (
            <div key={index} className="product-card">
              <div className="product-image-group">
                {allFailed ? (
                  <div className="product-image product-image-full no-click">
                    <img
                      src="/assets/no-image/No_Image_Available.jpg"
                      alt="No Images Available"
                    />
                  </div>
                ) : (
                  <>
                    {/* Single Image */}
                    <div
                      className="product-image"
                      onClick={() => openImageModal(product, 0)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={getSingleImage(product)}
                        alt="Single"
                        onError={() => handleImageError(product.id, 'single')}
                        onLoad={() => handleImageLoad(product.id, 'single')}
                      />
                      <div className="img-label">Single</div>
                      <div className="img-overlay">
                        <span className="img-zoom-icon">🔍</span>
                      </div>
                    </div>
                    {/* Slot Image */}
                    <div
                      className="product-image"
                      onClick={() => openImageModal(product, 1)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={getSlotImage(product)}
                        alt="Slot"
                        onError={() => handleImageError(product.id, 'slot')}
                        onLoad={() => handleImageLoad(product.id, 'slot')}
                      />
                      <div className="img-label">Slot</div>
                      <div className="img-overlay">
                        <span className="img-zoom-icon">🔍</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="product-info">
                <div className="product-info-header">
                  <div>
                    <h3>{getProductName(product)}</h3>
                    <p className="product-type">{getProductType(product)}</p>
                  </div>
                  <button
                    className="share-btn"
                    onClick={() => handleShareProduct(product)}
                    title="Share product"
                  >
                    📤
                  </button>
                </div>

                <div className="product-details">
                  <div className="detail-item">
                    <span className="label">Price:</span>
                    <span className="price">₹{getPrice(product)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Variant:</span>
                    <span className="value">{getVariant(product)}</span>
                  </div>
                </div>

                <div className="slot-info">
                  <div className="slot-box">
                    <span className="slot-label">Slots</span>
                    <span className="slot-count">{getSlotCount(product)}</span>
                  </div>
                  <div className="slot-box">
                    <span className="slot-label">Slot Price</span>
                    <span className="slot-price">₹{getSlotPrice(product)}</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      value={quantity}
                      onChange={(e) => updateQuantity(product.id, e.target.value)}
                      min="1"
                    />
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={`add-btn ${inCart ? 'in-cart' : ''}`}
                    onClick={() => handleAddToCart(product)}
                    title={inCart ? 'In Cart' : 'Add to Cart'}
                  >
                    {inCart ? '✓' : '🛒'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedImages && (
        <ImageModal
          images={selectedImages}
          initialIndex={imageStartIndex}
          onClose={closeImageModal}
        />
      )}
    </div>
  )
}
