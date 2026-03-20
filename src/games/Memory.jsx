import { useState, useEffect, useCallback, useRef } from 'react'
import './Memory.css'

const DIFFICULTIES = [
  { label: 'Easy',   rows: 3, cols: 4 },
  { label: 'Normal', rows: 4, cols: 4 },
  { label: 'Hard',   rows: 4, cols: 5 },
]

const COLORS = [
  '#ef4444','#f97316','#eab308','#22c55e','#06b6d4',
  '#3b82f6','#8b5cf6','#ec4899','#14b8a6','#84cc16',
  '#f43f5e','#6366f1','#0ea5e9','#a855f7','#d946ef',
  '#0891b2','#65a30d','#7c3aed','#db2777','#ea580c',
]

function buildCards(rows, cols) {
  const pairs = (rows * cols) / 2
  const colorPool = [...COLORS].sort(() => Math.random() - 0.5).slice(0, pairs)
  const arr = [...colorPool, ...colorPool].sort(() => Math.random() - 0.5)
  return arr.map((color, i) => ({ id: i, pairId: colorPool.indexOf(color), color, matched: false }))
}

function fmt(s) {
  if (s < 60) return s + 's'
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
}

export default function Memory() {
  const [diff, setDiff] = useState(0)
  const [cards, setCards] = useState(() => buildCards(3, 4))
  const [flipped, setFlipped] = useState([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [started, setStarted] = useState(false)
  const [complete, setComplete] = useState(false)
  const timerRef = useRef(null)
  const startRef = useRef(null)

  const { rows, cols } = DIFFICULTIES[diff]

  const newGame = useCallback((d = diff) => {
    clearInterval(timerRef.current)
    const { rows, cols } = DIFFICULTIES[d]
    setCards(buildCards(rows, cols))
    setFlipped([])
    setLocked(false)
    setMoves(0)
    setElapsed(0)
    setStarted(false)
    setComplete(false)
  }, [diff])

  const changeDiff = (i) => {
    setDiff(i)
    newGame(i)
  }

  const flip = (id) => {
    if (locked) return
    if (flipped.includes(id)) return
    if (cards.find(c => c.id === id)?.matched) return

    if (!started) {
      setStarted(true)
      startRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
      }, 500)
    }

    const next = [...flipped, id]
    setFlipped(next)

    if (next.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = next.map(i => cards.find(c => c.id === i))
      if (a.pairId === b.pairId) {
        const updated = cards.map(c => next.includes(c.id) ? { ...c, matched: true } : c)
        setCards(updated)
        setFlipped([])
        if (updated.every(c => c.matched)) {
          clearInterval(timerRef.current)
          setComplete(true)
        }
      } else {
        setLocked(true)
        setTimeout(() => { setFlipped([]); setLocked(false) }, 950)
      }
    }
  }

  const bestKey = `mem_best_${diff}`
  const prevBest = complete ? localStorage.getItem(bestKey) : null
  const isNewBest = complete && (!prevBest || elapsed < parseInt(prevBest))
  if (complete && isNewBest) localStorage.setItem(bestKey, elapsed)

  useEffect(() => () => clearInterval(timerRef.current), [])

  return (
    <div className="game-wrapper">
      <div className="game-topbar">
        <div className="game-topbar-left">
          <span className="game-topbar-title">Memory</span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {DIFFICULTIES.map((d, i) => (
              <button key={i} className={`pill ${diff === i ? 'active' : ''}`} onClick={() => changeDiff(i)}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="game-topbar-right">
          <span className="stat"><strong>{moves}</strong> moves</span>
          <span className="stat" style={{ marginLeft: '0.5rem' }}><strong>{fmt(elapsed)}</strong></span>
          <button className="action-btn" style={{ marginLeft: '0.25rem' }} onClick={() => newGame()}>New</button>
        </div>
      </div>

      <div
        className={`memory-grid ${complete ? 'completed' : ''}`}
        style={{ '--cols': cols, '--rows': rows }}
      >
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || card.matched
          return (
            <div
              key={card.id}
              className={`memory-card ${isFlipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
              onClick={() => flip(card.id)}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front" />
                <div className="memory-card-back" style={{ background: card.color }} />
              </div>
            </div>
          )
        })}

        {complete && (
          <div className="memory-overlay">
            <div className="memory-result">
              {moves} moves &middot; {fmt(elapsed)}
            </div>
            {prevBest !== null && !isNewBest && (
              <div className="memory-best">Best: {fmt(parseInt(prevBest))}</div>
            )}
            {isNewBest && prevBest !== null && (
              <div className="memory-best new">New best</div>
            )}
            <button className="action-btn primary" onClick={() => newGame()}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  )
}
