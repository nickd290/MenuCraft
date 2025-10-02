import { useState, useEffect, useRef, RefObject } from 'react'

export function getFitScale(viewportPx: number, docWidthPx: number, gutter = 48) {
  return Math.max(0.1, Math.min(3, (viewportPx - gutter) / docWidthPx))
}

interface UseZoomOptions {
  canvasRef: RefObject<HTMLDivElement>
  docRef: RefObject<HTMLDivElement>
  initialFit?: boolean
}

export function useZoom({ canvasRef, docRef, initialFit = true }: UseZoomOptions) {
  const [scale, setScale] = useState(1)
  const [fit, setFit] = useState(initialFit)

  // Fit-to-width logic
  useEffect(() => {
    if (!fit) return

    const onResize = () => {
      const viewport = canvasRef.current?.clientWidth ?? 1200
      const docWidth = docRef.current?.offsetWidth ?? 816 // 8.5x11 @ 96dpi ≈ 816px
      setScale(getFitScale(viewport, docWidth))
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [fit, canvasRef, docRef])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        // Zoom in: Cmd/Ctrl + or =
        if (e.key === '=' || e.key === '+') {
          setFit(false)
          setScale(s => Math.min(3, s * 1.1))
          e.preventDefault()
        }
        // Zoom out: Cmd/Ctrl -
        if (e.key === '-') {
          setFit(false)
          setScale(s => Math.max(0.1, s / 1.1))
          e.preventDefault()
        }
        // Reset to 100%: Cmd/Ctrl 0
        if (e.key === '0') {
          setFit(false)
          setScale(1)
          e.preventDefault()
        }
        // Fit to width: Cmd/Ctrl 1
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
    fit,
    setFit,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToWidth
  }
}

// Pan with space+drag
interface UsePanOptions {
  canvasRef: RefObject<HTMLDivElement>
}

export function usePan({ canvasRef }: UsePanOptions) {
  const isPanning = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const scrollStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        canvas.style.cursor = 'grab'
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        canvas.style.cursor = 'default'
        isPanning.current = false
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.code === 'Space' || (e.target === canvas && e.button === 0)) {
        const spacePressed = (e as any).spaceKey || false
        if (spacePressed || canvas.style.cursor === 'grab') {
          isPanning.current = true
          canvas.style.cursor = 'grabbing'
          startPos.current = { x: e.clientX, y: e.clientY }
          scrollStart.current = { x: canvas.scrollLeft, y: canvas.scrollTop }
          e.preventDefault()
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isPanning.current) {
        const dx = e.clientX - startPos.current.x
        const dy = e.clientY - startPos.current.y
        canvas.scrollLeft = scrollStart.current.x - dx
        canvas.scrollTop = scrollStart.current.y - dy
      }
    }

    const onMouseUp = () => {
      if (isPanning.current) {
        isPanning.current = false
        canvas.style.cursor = canvas.style.cursor === 'grabbing' ? 'grab' : 'default'
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
}