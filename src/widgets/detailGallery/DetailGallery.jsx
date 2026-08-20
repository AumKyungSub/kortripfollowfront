import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

// Gallery image manifest generated from location and theme detail images
import galleryManifest from '@/shared/data/gallery-manifest.json'

// Swiper API
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination } from 'swiper/modules'

// Swiper styles
import 'swiper/css'

// Page css
import './DetailGallery.style.css'

const DetailGallery = ({data, isFullMobile}) => {
    const {t} = useTranslation()
    const [activeImageIndex, setActiveImageIndex] = useState(null)

    const imageBaseUrl = data?.img?.link ?? ''
    const derivedGalleryLink = imageBaseUrl
        ? `${imageBaseUrl.slice(0, imageBaseUrl.lastIndexOf('/') + 1)}gallery/`
        : ''
    const galleryLink = data?.img?.galleryLink ?? derivedGalleryLink
    const galleryPath = galleryLink
        ? new URL(galleryLink, window.location.origin).pathname
        : ''
    const normalizedGalleryPath = galleryPath
        ? `${galleryPath.replace(/\/+$/, '')}/`
        : ''
    const images = galleryManifest[normalizedGalleryPath] ?? []
    const visibleDesktopImages = images.slice(0, 4)
    const remainingImageCount = Math.max(images.length - visibleDesktopImages.length, 0)
    const isModalOpen = activeImageIndex !== null

    const closeModal = useCallback(() => setActiveImageIndex(null), [])

    const showPreviousImage = useCallback(() => {
        setActiveImageIndex((currentIndex) => (
            currentIndex === null ? null : (currentIndex - 1 + images.length) % images.length
        ))
    }, [images.length])

    const showNextImage = useCallback(() => {
        setActiveImageIndex((currentIndex) => (
            currentIndex === null ? null : (currentIndex + 1) % images.length
        ))
    }, [images.length])

    useEffect(() => {
        if (!isModalOpen) return undefined

        const previousBodyOverflow = document.body.style.overflow
        const previousHtmlOverflow = document.documentElement.style.overflow
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') closeModal()
            if (event.key === 'ArrowLeft' && images.length > 1) showPreviousImage()
            if (event.key === 'ArrowRight' && images.length > 1) showNextImage()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousBodyOverflow
            document.documentElement.style.overflow = previousHtmlOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [closeModal, images.length, isModalOpen, showNextImage, showPreviousImage])

    const openModal = (index) => setActiveImageIndex(index)

    const modal = isModalOpen && createPortal(
        <div
            className="detailGalleryModal"
            role="dialog"
            aria-modal="true"
            aria-label={t('locationPage.recommend.modalLabel')}
            onClick={closeModal}
        >
            <div className="detailGalleryModalTop">
                <span>
                    {t('locationPage.recommend.photoCount', {
                        current: activeImageIndex + 1,
                        total: images.length,
                    })}
                </span>
                <button
                    type="button"
                    className="detailGalleryModalClose"
                    aria-label={t('locationPage.recommend.close')}
                    onClick={(event) => {
                        event.stopPropagation()
                        closeModal()
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {images.length > 1 && (
                <button
                    type="button"
                    className="detailGalleryModalArrow detailGalleryModalArrow--previous"
                    aria-label={t('locationPage.recommend.previous')}
                    onClick={(event) => {
                        event.stopPropagation()
                        showPreviousImage()
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
            )}

            <img
                className="detailGalleryModalImage"
                src={images[activeImageIndex]}
                alt={t('locationPage.recommend.imageAlt', {number: activeImageIndex + 1})}
                onClick={closeModal}
            />

            {images.length > 1 && (
                <button
                    type="button"
                    className="detailGalleryModalArrow detailGalleryModalArrow--next"
                    aria-label={t('locationPage.recommend.next')}
                    onClick={(event) => {
                        event.stopPropagation()
                        showNextImage()
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            )}
        </div>,
        document.body,
    )

    return (
        <>
            <section className="detailGalleryWrap">
                <div className="detailGalleryHeader">
                    <div className="detailGalleryTitle">
                        <p className="preTitle14px600b54a2f">
                          <span className="preTitle14px600b54a2fLine"></span>
                          Gallery
                        </p>
                        <div className="detailGalleryTitleCover">
                            <p className="title18px20px700">{t('locationPage.recommend.title')}</p>
                            <span className="detailGalleryCount">({images.length})</span>
                        </div>
                    </div>

                    {images.length > 0 && (
                        <button type="button" className="detailGalleryViewAll" onClick={() => openModal(0)}>
                            {t('locationPage.recommend.viewAll')}
                            <span aria-hidden="true">›</span>
                        </button>
                    )}
                </div>

                {images.length === 0 ? (
                    <p className="detailGalleryEmpty">{t('locationPage.recommend.empty')}</p>
                ) : (
                    <div className="detailGalleryCover">
                        {!isFullMobile ? (
                            <div className="detailGalleryDesktopGrid">
                                {visibleDesktopImages.map((image, index) => {
                                    const showMoreOverlay = index === 3 && remainingImageCount > 0

                                    return (
                                        <button
                                            type="button"
                                            className="detailGalleryItem"
                                            key={image}
                                            onClick={() => openModal(index)}
                                        >
                                            <img
                                                src={image}
                                                alt={t('locationPage.recommend.imageAlt', {number: index + 1})}
                                            />
                                            {showMoreOverlay && (
                                                <span className="detailGalleryMoreOverlay">
                                                    <strong>+{remainingImageCount}</strong>
                                                    <span>{t('locationPage.recommend.more')}</span>
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <Swiper
                                effect="coverflow"
                                grabCursor
                                centeredSlides
                                slidesPerView="auto"
                                loop={images.length > 1}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                pagination={false}
                                modules={[EffectCoverflow, Pagination]}
                                className="mySwiper recommendSwiper"
                            >
                                {images.map((image, index) => (
                                    <SwiperSlide key={image} className="recoSwiper">
                                        <button
                                            type="button"
                                            className="detailGalleryMobileItem"
                                            onClick={() => openModal(index)}
                                        >
                                            <img
                                                src={image}
                                                alt={t('locationPage.recommend.imageAlt', {number: index + 1})}
                                            />
                                        </button>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                )}
            </section>
            {modal}
        </>
    )
}

export default DetailGallery
