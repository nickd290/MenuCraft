import { useState, useEffect, useRef, RefObject } from 'react'

/**
 * usePanZoom - Enhanced pan/zoom for canvas
 * Provides space+drag panning and keyboard zoom controls
 */

interface UsePanZoomOptions {
  canvasRef: RefObject<HTMLDivElement>
  docRef: RefObject<HTMLDivElement>
  initialFit?: boolean
}

export function usePanZoom({ canvasRef, docRef, initialFit = true }: UsePanZoomOptions) {
  const [scale, setScale] = useState(1)
  const [fit, setFit] = useState(initialFit)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const isPanning = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const scrollStart = useRef({ x: 0, y: 0 })
  const spacePressed = useRef(false)

  // Fit-to-view logic - fits entire page (width AND height) into viewport
  // Menu should be centered and fill most of the canvas
  useEffect(() => {
    if (!fit) return

    const onResize = () => {
      if (!canvasRef.current || !docRef.current) return

      const viewportWidth = canvasRef.current.clientWidth
      const viewportHeight = canvasRef.current.clientHeight
      const docWidth = docRef.current.offsetWidth
      const docHeight = docRef.current.offsetHeight

      // If dimensions are 0, wait for next frame
      if (viewportWidth === 0 || docWidth === 0) {
        requestAnimationFrame(onResize)
        return
      }

      // Calculate scale: fit to 85% of viewport (15% padding for breathing room)
      // Ensure minimum scale of 0.6 to keep text readable
      const scaleForWidth = (viewportWidth * 0.85) / docWidth
      const scaleForHeight = (viewportHeight * 0.85) / docHeight
      const fitScale = Math.max(0.6, Math.min(3, Math.min(scaleForWidth, scaleForHeight)))

      setScale(fitScale)
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(onResize, 100)

    // Watch for DOM changes (paper size changes, content changes)
    const observer = new ResizeObserver(() => {
      onResize()
    })

    if (docRef.current) {
      observer.observe(docRef.current)
    }

    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [fit, canvasRef, docRef])

  // Space+drag panning
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        spacePressed.current = true
        canvas.style.cursor = 'grab'
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        spacePressed.current = false
        if (!isPanning.current) {
          canvas.style.cursor = 'default'
        }
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      if (spacePressed.current) {
        isPanning.current = true
        canvas.style.cursor = 'grabbing'
        startPos.current = { x: e.clientX, y: e.clientY }
        scrollStart.current = { x: canvas.scrollLeft, y: canvas.scrollTop }
        e.preventDefault()
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isPanning.current) {
        const dx = e.clientX - startPos.current.x
        const dy = e.clientY - startPos.current.y
        canvas.scrollLeft = scrollStart.current.x - dx
        canvas.scrollTop = scrollStart.current.y - dy
        setPan({ x: canvas.scrollLeft, y: canvas.scrollTop })
      }
    }

    const onMouseUp = () => {
      if (isPanning.current) {
        isPanning.current = false
        canvas.style.cursor = spacePressed.current ? 'grab' : 'default'
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [canvasRef])

  // Keyboard zoom shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === '=' || e.key === '+') {
          setFit(false)
          setScale(s => Math.min(3, s * 1.1))
          e.preventDefault()
        }
        if (e.key === '-') {
          setFit(false)
          setScale(s => Math.max(0.1, s / 1.1))
          e.preventDefault()
        }
        if (e.key === '0') {
          setFit(false)
          setScale(1)
          e.preventDefault()
        }
        if (e.key === '1') {
          setFit(true)
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const zoomIn = () => {
    setFit(false)
    setScale(s => Math.min(3, s * 1.1))
  }

  const zoomOut = () => {
    setFit(false)
    setScale(s => Math.max(0.1, s / 1.1))
  }

  const resetZoom = () => {
    setFit(false)
    setScale(1)
  }

  const fitToWidth = () => {
    setFit(true)
  }

  return {
    scale,
    pan,
    fit,
    setFit,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToWidth
  }
}