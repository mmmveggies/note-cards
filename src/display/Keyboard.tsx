const intInRange = (x: number, min: number, max: number) => (
  Math.max(min, Math.min(max, Math.round(x)))
)

const A0 = 21
const MINLEN = 11
const MAXLEN = 88
const MAXSTART = MAXLEN - MINLEN

enum KeyType {
  black = 'black',
  white = 'white',
}

// thanks https://upload.wikimedia.org/wikipedia/commons/1/15/PianoKeyboard.svg
const styles: Record<KeyType, React.CSSProperties> = {
  [KeyType.black]: { fill: 'black', stroke: 'black' },
  [KeyType.white]: { fill: 'white', stroke: 'black' },
}
const widths = {
  [KeyType.black]: 14 + 1/3,
  [KeyType.white]: 23,
}
const heights = {
  [KeyType.black]: 80,
  [KeyType.white]: 120,
}

const overlaps = [ 0, 2/3, 0, 1/3, 0, 0, 3/4, 0, 2/4, 0, 1/4, 0 ]

const isBlack = (midi: number) => (
  Boolean(overlaps[midi % overlaps.length])
)

const getAdjust = (midi: number, unit = widths.black) => {
  const delta = overlaps[midi % overlaps.length] || 0
  return delta * unit
}

class KeyData {
  type = isBlack(this.midi) ? KeyType.black : KeyType.white

  sort = this.type === KeyType.black ? 1 : 0

  constructor(
    public midi: number,
    public offset: number,
  ) {}
}

export interface KeyboardProps {
  /** Total keys, default `88` */
  length?: number

  /** Start midi number, default `21` aka A0 */
  start?: number

  renderKey?: (keyData: KeyData, original: React.ReactNode) => React.ReactNode
}

const defaultRenderKey: NonNullable<KeyboardProps['renderKey']> = (keyData) => (
  <rect
    key={keyData.midi}
    x={keyData.offset}
    y={0}
    width={widths[keyData.type]}
    height={heights[keyData.type]}
    style={styles[keyData.type]}
  />
)

export function Keyboard({
  length: _length = MAXLEN,
  start: _start = A0,
  renderKey = (_, original) => original,
}: KeyboardProps) {
  const length = intInRange(_length, MINLEN, MAXLEN)
  const start = intInRange(_start, 0, MAXSTART)
  const startWhite = isBlack(start) ? start - 1 : start
  const end = start + length
  const endWhite = isBlack(end) ? end : 1 + end
  const lengthWhite = endWhite - startWhite

  const midiNotes = Array.from({ length: lengthWhite })
    .map((_, i) => startWhite + i)
    .map((midi) => ({
      midi,
      type: isBlack(midi) ? KeyType.black : KeyType.white,
    }))

  const offsets = midiNotes.reduce((arr, { type }) => {
    const prev = arr[arr.length - 1]
    const next = prev + (type === KeyType.white ? widths.white : 0)
    return [...arr, next]
  }, [0])

  const allKeyData = midiNotes
    .map(({ midi }, i) => new KeyData(
      midi,
      offsets[i] - getAdjust(midi),
    ))
    .sort((a, b) => a.sort - b.sort)

  return (
    <svg
      style={{ width: '100%' }}
      viewBox={`0 0 ${offsets[offsets.length - 1]} ${heights.white}`}
    >
      {allKeyData.map((keyData) => (
        renderKey(keyData, defaultRenderKey(keyData, null as any))
      ))}
    </svg>
  )
}