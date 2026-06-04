'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import WhatsAppIcon from '@/components/store/WhatsAppIcon'
import { site } from '@/lib/site'
import type { HeroSlide } from '@/lib/types'

export default function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const slide = slides[active]

  function move(delta: number) {
    setActive((current) => (current + delta + slides.length) % slides.length)
  }

  return (
    <div className="hero-carousel">
      <div className="hero-slide">
        <Image src={slide.image} alt={slide.imageAlt} fill className="hero-slide-image" priority />
        <div className="hero-slide-overlay" />
        <div className="hero-slide-content">
          <div className="hero-copy">
            <p className="hero-eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>
            <div className="hero-actions">
              <Link href={slide.href} target={slide.href.startsWith('http') ? '_blank' : undefined} className="hero-primary-action">
                {slide.cta}
              </Link>
              {!slide.href.startsWith('http') && (
                <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="hero-whatsapp-action">
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <button type="button" className="hero-control hero-control-left" aria-label="Anterior" onClick={() => move(-1)}>
          <ChevronLeft size={22} />
        </button>
        <button type="button" className="hero-control hero-control-right" aria-label="Siguiente" onClick={() => move(1)}>
          <ChevronRight size={22} />
        </button>

        <div className="hero-dots" aria-label="Banners">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Ver banner ${index + 1}`}
              className={index === active ? 'is-active' : ''}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
