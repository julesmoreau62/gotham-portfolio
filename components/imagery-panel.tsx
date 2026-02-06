"use client"

import { useState, useEffect, useCallback } from "react"
import {
  X,
  Camera,
  Building2,
  CalendarDays,
  Activity,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Aperture,
  Focus,
  ScanLine,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

/* ---- Photo asset catalogue ---- */
interface PhotoAsset {
  src: string
  title: string
  cat: string
}

const BASE = "/assets/photo"
const photos: PhotoAsset[] = [
  ...Array.from({ length: 15 }, (_, i) => ({
    src: `${BASE}/corporate-${i + 1}.jpg`,
    title: `CORP_INDUS_${String(i + 1).padStart(2, "0")}`,
    cat: "corporate",
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    src: `${BASE}/asi-${i + 1}.jpg`,
    title: `ASI_EVENT_${String(i + 1).padStart(2, "0")}`,
    cat: "events",
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    src: `${BASE}/football-${i + 1}.jpg`,
    title: `FOOTBALL_MATCH_${String(i + 1).padStart(2, "0")}`,
    cat: "sport",
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    src: `${BASE}/golf-${i + 1}.jpg`,
    title: `GOLF_TOUR_${String(i + 1).padStart(2, "0")}`,
    cat: "sport",
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    src: `${BASE}/kite-${i + 1}.jpg`,
    title: `KITESURF_OPS_${String(i + 1).padStart(2, "0")}`,
    cat: "sport",
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    src: `${BASE}/volleyball-${i + 1}.jpg`,
    title: `VOLLEY_CHAMP_${String(i + 1).padStart(2, "0")}`,
    cat: "sport",
  })),
]

interface Category {
  id: string
  label: string
  icon: typeof Camera
  color: string
  glowColor: string
  count: number
  coverIndex: number
  description: string
}

const CATEGORIES: Category[] = [
  {
    id: "corporate",
    label: "CORPORATE",
    icon: Building2,
    color: "hsl(217 91% 60%)",
    glowColor: "217 91% 60%",
    count: photos.filter((p) => p.cat === "corporate").length,
    coverIndex: 7,
    description: "Industrial & corporate photography. Professional environments, product shots, and business documentation.",
  },
  {
    id: "events",
    label: "EVENTS",
    icon: CalendarDays,
    color: "hsl(160 84% 39%)",
    glowColor: "160 84% 39%",
    count: photos.filter((p) => p.cat === "events").length,
    coverIndex: 1,
    description: "Tournament and event coverage. ASI Tournament, matchday operations, and competition documentation.",
  },
  {
    id: "sport",
    label: "SPORT",
    icon: Activity,
    color: "hsl(24 95% 53%)",
    glowColor: "24 95% 53%",
    count: photos.filter((p) => p.cat === "sport").length,
    coverIndex: 5,
    description: "Action sports photography. Football, golf, kitesurfing, and volleyball coverage across multiple events.",
  },
]

/* ---- Intro sequence ---- */
function CameraIntro({ onDone, isMobile }: { onDone: () => void; isMobile: boolean }) {
  const [phase, setPhase] = useState(0)
  const [shutterCount, setShutterCount] = useState(0)

  // Mobile: 1.2s / Desktop: 3.4s
  useEffect(() => {
    const timings = isMobile
      ? { t1: 120, t2: 450, t3: 900, t4: 1200 }
      : { t1: 300, t2: 1200, t3: 2400, t4: 3400 }
    
    const t1 = setTimeout(() => setPhase(1), timings.t1)
    const t2 = setTimeout(() => setPhase(2), timings.t2)
    const t3 = setTimeout(() => setPhase(3), timings.t3)
    const t4 = setTimeout(() => onDone(), timings.t4)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onDone, isMobile])

  useEffect(() => {
    if (phase < 2) return
    const iv = setInterval(() => {
      setShutterCount((p) => {
        if (p >= 50) { clearInterval(iv); return 50 }
        return p + 1
      })
    }, 25)
    return () => clearInterval(iv)
  }, [phase])

  return (
    <div className="absolute inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Viewfinder grid */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Rule of thirds */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-primary/10" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-primary/10" />
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-primary/10" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-primary/10" />
        {/* Corner brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/40" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/40" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/40" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/40" />
      </div>

      {/* Center focus ring */}
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`w-40 h-40 md:w-56 md:h-56 rounded-full border-2 transition-all duration-700 flex items-center justify-center ${phase >= 1 ? "border-primary/60 scale-100" : "border-primary/10 scale-150"}`}
        >
          {/* Inner ring */}
          <div
            className={`w-24 h-24 md:w-36 md:h-36 rounded-full border transition-all duration-500 flex items-center justify-center ${phase >= 2 ? "border-[hsl(var(--field-green))]/80" : "border-primary/20"}`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Focus point */}
            <div
              className={`transition-all duration-300 ${phase >= 2 ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
            >
              <Focus
                className="w-10 h-10 md:w-14 md:h-14"
                style={{
                  color: phase >= 2 ? "hsl(160 84% 39%)" : "hsl(217 91% 60%)",
                  filter: phase >= 2 ? "drop-shadow(0 0 12px hsl(160 84% 39%))" : "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Focus achieved text */}
        {phase >= 2 && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[hsl(var(--field-green))] tracking-[0.3em] whitespace-nowrap animate-pulse">
            FOCUS ACQUIRED
          </div>
        )}
      </div>

      {/* HUD overlay text */}
      <div className="absolute top-12 left-12 md:top-16 md:left-16">
        <div className={`text-[9px] font-mono text-muted-foreground tracking-wider transition-opacity duration-500 ${phase >= 1 ? "opacity-100" : "opacity-0"}`}>
          <div>LENS: SONY E 18-135mm f/3.5-5.6</div>
          <div className="mt-1">BODY: SONY a6400 // APS-C</div>
          <div className="mt-1">MODE: M // ISO AUTO</div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 md:bottom-16 md:right-16 text-right">
        <div className={`text-[9px] font-mono tracking-wider transition-opacity duration-500 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
          <div className="text-muted-foreground">
            SHUTTER: <span className="text-foreground tabular-nums">{shutterCount}</span> / 50
          </div>
          <div className="mt-1 text-muted-foreground">
            STATUS: <span className="text-[hsl(var(--field-green))]">{phase >= 3 ? "ARCHIVE READY" : "CAPTURING..."}</span>
          </div>
        </div>
      </div>

      {/* Flash burst on phase 3 */}
      {phase >= 3 && (
        <div className="absolute inset-0 bg-white/90 pointer-events-none animate-[flash_0.4s_ease-out_forwards]" />
      )}

      <style jsx>{`
        @keyframes flash {
          0% { opacity: 0.9; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/* ---- Lightbox viewer ---- */
function Lightbox({
  photo,
  allPhotos,
  onClose,
  onNavigate,
}: {
  photo: PhotoAsset
  allPhotos: PhotoAsset[]
  onClose: () => void
  onNavigate: (photo: PhotoAsset) => void
}) {
  const currentIdx = allPhotos.findIndex((p) => p.src === photo.src)

  const goPrev = useCallback(() => {
    const prev = currentIdx > 0 ? currentIdx - 1 : allPhotos.length - 1
    onNavigate(allPhotos[prev])
  }, [currentIdx, allPhotos, onNavigate])

  const goNext = useCallback(() => {
    const next = currentIdx < allPhotos.length - 1 ? currentIdx + 1 : 0
    onNavigate(allPhotos[next])
  }, [currentIdx, allPhotos, onNavigate])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose, goPrev, goNext])

  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-md flex flex-col" role="dialog" aria-modal="true">
      {/* Top bar */}
      <div className="h-10 border-b border-border/50 flex items-center justify-between px-4 md:px-6 shrink-0 bg-card/30">
        <div className="flex items-center gap-3">
          <ScanLine className="w-3 h-3 text-muted-foreground" />
          <span className="text-[9px] font-mono text-primary tracking-wider">{photo.title}</span>
          <span className="text-[8px] font-mono text-muted-foreground">
            {currentIdx + 1} / {allPhotos.length}
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all" aria-label="Close viewer">
          <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center relative p-4 overflow-hidden">
        {/* Nav buttons */}
        <button
          onClick={goPrev}
          className="absolute left-3 md:left-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border border-border/50 bg-card/50 backdrop-blur flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border border-border/50 bg-card/50 backdrop-blur flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>

        {/* Image with HUD frame */}
        <div className="relative max-w-full max-h-full">
          {/* Corner brackets */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary/50 z-10" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary/50 z-10" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-primary/50 z-10" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary/50 z-10" />

          <div className="relative bg-muted rounded">
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.title}
              width={1200}
              height={800}
              className="max-h-[75vh] max-w-[85vw] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="h-8 border-t border-border/30 flex items-center justify-between px-4 md:px-6 shrink-0 bg-card/20">
        <span className="text-[7px] font-mono text-muted-foreground tracking-wider">
          SECTOR: <span className="text-foreground uppercase">{photo.cat}</span>
        </span>
        <span className="text-[7px] font-mono text-muted-foreground">ESC to close // ARROWS to navigate</span>
      </div>
    </div>
  )
}

/* ---- Main panel ---- */
export function ImageryPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isMobile = useIsMobile()
  const [showIntro, setShowIntro] = useState(true)
  const [visible, setVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoAsset | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (open) {
      setShowIntro(true)
      setVisible(false)
      setActiveCategory(null)
      setLightboxPhoto(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !lightboxPhoto) onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose, lightboxPhoto])

  const handleIntroDone = useCallback(() => {
    setShowIntro(false)
    setTimeout(() => setVisible(true), 100)
  }, [])

  if (!open) return null

  const filteredPhotos = activeCategory ? photos.filter((p) => p.cat === activeCategory) : []
  const activeCatData = CATEGORIES.find((c) => c.id === activeCategory)

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {showIntro && <CameraIntro onDone={handleIntroDone} isMobile={isMobile} />}

      {!showIntro && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="h-10 md:h-11 flex items-center justify-between px-4 md:px-6 border-b border-border/50 bg-card/30 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-mono text-foreground tracking-[0.2em]">
                IMAGERY:{" "}
                <span className="text-muted-foreground">
                  {activeCategory ? activeCatData?.label : "ARCHIVES HUB"}
                </span>
              </span>
              {activeCategory && (
                <span className="text-[8px] font-mono text-muted-foreground">
                  // {filteredPhotos.length} FILES
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="h-7 px-3 flex items-center gap-1.5 border border-primary/30 text-primary text-[8px] font-mono tracking-wider hover:bg-primary/10 transition-all"
                >
                  <ChevronLeft className="w-3 h-3" />
                  HUB
                </button>
              )}
              <button
                onClick={onClose}
                className="h-7 px-3 flex items-center gap-1.5 border border-border/50 text-muted-foreground text-[8px] font-mono tracking-wider hover:bg-card hover:text-foreground hover:border-foreground/30 transition-all"
              >
                <X className="w-3 h-3" />
                CLOSE
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
            {/* Tactical grid bg */}
            <div className="absolute inset-0 pointer-events-none tactical-grid opacity-30" />

            {!activeCategory ? (
              /* ---- HUB VIEW: 3 category cards ---- */
              <div className="max-w-5xl mx-auto py-4 md:py-8">
                {/* Stats bar */}
                <div
                  className={`flex items-center justify-center gap-6 mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-tech font-bold text-foreground">{photos.length}</div>
                    <div className="text-[8px] font-mono text-muted-foreground tracking-wider">TOTAL FILES</div>
                  </div>
                  <div className="w-px h-8 bg-border/50" />
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-tech font-bold text-primary">3</div>
                    <div className="text-[8px] font-mono text-muted-foreground tracking-wider">SECTORS</div>
                  </div>
                  <div className="w-px h-8 bg-border/50" />
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-tech font-bold text-[hsl(var(--field-green))]">50+</div>
                    <div className="text-[8px] font-mono text-muted-foreground tracking-wider">FIELD SHOTS</div>
                  </div>
                </div>

                {/* Category grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                  {CATEGORIES.map((cat, idx) => {
                    const Icon = cat.icon
                    const coverPhoto = photos.filter((p) => p.cat === cat.id)[cat.coverIndex]
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`group relative cursor-pointer border rounded-lg overflow-hidden bg-card/50 text-left transition-all duration-700 hover:scale-[1.02] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                        style={{
                          transitionDelay: `${300 + idx * 150}ms`,
                          borderColor: "hsl(215 25% 22%)",
                          aspectRatio: "4/5",
                        }}
                      >
                        {/* Cover image */}
                        <div className="absolute inset-0 bg-muted">
                          <Image
                            src={coverPhoto?.src || "/placeholder.svg"}
                            alt={cat.label}
                            fill
                            className="object-cover opacity-30 group-hover:opacity-60 transition-all duration-700 grayscale group-hover:grayscale-0 scale-105 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                        {/* Glow */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ boxShadow: `inset 0 0 60px hsl(${cat.glowColor} / 0.1)` }}
                        />

                        {/* Scan line */}
                        <div
                          className="absolute left-0 w-full h-[1px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)`,
                            animation: "scan-line 2s linear infinite",
                          }}
                        />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                          <div
                            className="text-[9px] font-mono tracking-[0.3em] mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                            style={{ color: cat.color }}
                          >
                            SECTOR_{String(idx + 1).padStart(2, "0")}
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <h3 className="text-2xl md:text-3xl font-tech text-foreground uppercase tracking-tight leading-none">
                                {cat.label}
                              </h3>
                              <p className="text-[9px] font-mono text-muted-foreground mt-1.5 leading-relaxed max-w-[200px] hidden md:block">
                                {cat.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <Icon
                                className="w-6 h-6 text-muted-foreground/50 group-hover:text-foreground transition-colors duration-300"
                              />
                              <span className="text-[9px] font-mono text-muted-foreground tabular-nums">
                                {cat.count} files
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Corner accents */}
                        <div
                          className="absolute top-3 left-3 w-5 h-5 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ borderColor: cat.color }}
                        />
                        <div
                          className="absolute top-3 right-3 w-5 h-5 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ borderColor: cat.color }}
                        />
                      </button>
                    )
                  })}
                </div>

                {/* Equipment footer */}
                <div
                  className={`flex items-center justify-center gap-6 mt-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: "800ms" }}
                >
                  <div className="flex items-center gap-2">
                    <Aperture className="w-3 h-3 text-[hsl(var(--field-green))]" />
                    <span className="text-[8px] font-mono text-muted-foreground">SONY a6400</span>
                  </div>
                  <div className="w-px h-3 bg-border/40" />
                  <div className="flex items-center gap-2">
                    <Camera className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-mono text-muted-foreground">GoPro x2</span>
                  </div>
                  <div className="w-px h-3 bg-border/40" />
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-3 h-3 text-accent" />
                    <span className="text-[8px] font-mono text-muted-foreground">Lightroom // Premiere</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ---- GRID VIEW: filtered photos ---- */
              <div className="max-w-6xl mx-auto">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  {activeCatData && (
                    <>
                      <div
                        className="w-8 h-8 rounded border flex items-center justify-center"
                        style={{
                          borderColor: `hsl(${activeCatData.glowColor} / 0.4)`,
                          background: `hsl(${activeCatData.glowColor} / 0.08)`,
                        }}
                      >
                        <activeCatData.icon className="w-4 h-4" style={{ color: activeCatData.color }} />
                      </div>
                      <div>
                        <h2 className="font-tech text-lg text-foreground tracking-wider">{activeCatData.label}</h2>
                        <p className="text-[8px] font-mono text-muted-foreground">{activeCatData.description}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Photo grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                  {filteredPhotos.map((photo, idx) => (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setLightboxPhoto(photo)}
                      className="group relative aspect-square overflow-hidden border border-border/30 bg-muted hover:border-primary/50 transition-all duration-500 cursor-pointer"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        animation: "fade-slide-in 0.5s cubic-bezier(0.2, 1, 0.3, 1) forwards",
                        opacity: 0,
                      }}
                    >
                      <Image
                        src={photo.src || "/placeholder.svg"}
                        alt={photo.title}
                        fill
                        className={`object-cover transition-all duration-700 group-hover:scale-110 ${loadedImages.has(photo.src) ? "opacity-80 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0" : "opacity-0"}`}
                        onLoad={() => setLoadedImages((prev) => new Set(prev).add(photo.src))}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />

                      {/* Loading placeholder */}
                      {!loadedImages.has(photo.src) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <div className="w-4 h-4 border border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-foreground" />
                      </div>

                      {/* Title tag */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[7px] font-mono text-foreground/80 tracking-wider">{photo.title}</span>
                      </div>

                      {/* Corner bracket */}
                      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-primary/0 group-hover:border-primary/50 transition-all duration-300" />
                      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-primary/0 group-hover:border-primary/50 transition-all duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="h-6 flex items-center justify-between px-4 md:px-6 border-t border-border/30 bg-card/20 shrink-0">
            <span className="text-[7px] font-mono text-muted-foreground">
              ARCHIVE: <span className="text-[hsl(var(--field-green))]">DECLASSIFIED</span>
            </span>
            <span className="text-[7px] font-mono text-muted-foreground">
              FORMAT: JPEG // RAW BACKUP ON SITE
            </span>
          </footer>
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          allPhotos={filteredPhotos}
          onClose={() => setLightboxPhoto(null)}
          onNavigate={(p) => setLightboxPhoto(p)}
        />
      )}
    </div>
  )
}
