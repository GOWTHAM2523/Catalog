import { useState } from 'react'
import '../styles/ImageModal.css'

export default function ImageModal({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [imageLoadError, setImageLoadError] = useState({})

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleImageError = (index) => {
    setImageLoadError((prev) => ({
      ...prev,
      [index]: true
    }))
  }

  // Check if all images failed
  const allImagesFailed = images.every((_, index) => imageLoadError[index])
  const currentImage = images[currentIndex]
  const isNoImageAvailable = imageLoadError[currentIndex]

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Main Image Display */}
        <div className={`modal-image-container ${allImagesFailed ? 'full-screen' : ''}`}>
          {allImagesFailed || isNoImageAvailable ? (
            <div className="no-image-display">
              <img
                src="/assets/no-image/No_Image_Available.jpg"
                alt="No Image Available"
                className="modal-image"
              />
            </div>
          ) : (
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              onError={() => handleImageError(currentIndex)}
              className="modal-image"
            />
          )}
        </div>

        {/* Navigation Arrows - hide if all images failed */}
        {!allImagesFailed && (
          <>
            <button className="modal-nav-btn modal-prev" onClick={goToPrevious}>
              ❮
            </button>
            <button className="modal-nav-btn modal-next" onClick={goToNext}>
              ❯
            </button>
          </>
        )}

        {/* Image Info - hide if all images failed */}
        {!allImagesFailed && (
          <div className="modal-info">
            <span className="modal-counter">
              {currentIndex + 1} / {images.length}
            </span>
            <span className="modal-title">
              {currentImage.alt} {isNoImageAvailable ? '(Not Available)' : ''}
            </span>
          </div>
        )}

        {/* Slider/Thumbnails - hide if all images failed */}
        {!allImagesFailed && (
          <div className="modal-slider">
            {images.map((image, index) => {
              const isThisImageError = imageLoadError[index]
              return (
                <div
                  key={index}
                  className={`modal-thumbnail ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  title={image.alt}
                >
                  {isThisImageError ? (
                    <img
                      src="/assets/no-image/No_Image_Available.jpg"
                      alt={`Slide ${index + 1}`}
                    />
                  ) : (
                    <img
                      src={image.src}
                      alt={`Slide ${index + 1}`}
                      onError={() => handleImageError(index)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
