import type { CastResult } from '../lib/cast'

type Props = {
  lines: boolean[]
  changingLines?: number[]
  compact?: boolean
}

/** Renders I Ching hexagram lines from bottom (index 0) to top. */
export function HexagramGlyph({ lines, changingLines = [], compact }: Props) {
  // Display top line first (visual top = line 6). changingLines are 1–6 from bottom.
  const display = [...lines].reverse()
  const isChanging = (displayIndex: number) => changingLines.includes(6 - displayIndex)

  return (
    <div className={`hex-glyph${compact ? ' hex-glyph--compact' : ''}`} aria-hidden>
      {display.map((yang, i) => (
        <div
          key={i}
          className={`hex-line${yang ? ' hex-line--yang' : ' hex-line--yin'}${isChanging(i) ? ' hex-line--changing' : ''}`}
        >
          {yang ? (
            <span className="hex-bar" />
          ) : (
            <>
              <span className="hex-bar hex-bar--half" />
              <span className="hex-gap" />
              <span className="hex-bar hex-bar--half" />
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export function HexagramCard({ cast, title }: { cast: CastResult; title?: string }) {
  return (
    <div className="sigil-card">
      <HexagramGlyph lines={cast.lines} changingLines={cast.changingLines} />
      <div className="sigil-meta">
        <p className="sigil-eyebrow">{title ?? `第 ${cast.hexagram.number} 卦`}</p>
        <h3 className="sigil-name">
          {cast.hexagram.name}
          <span className="sigil-alias">{cast.hexagram.alias}</span>
        </h3>
        <p className="sigil-trigrams">
          上{cast.upper.name}（{cast.upper.nature}） · 下{cast.lower.name}（{cast.lower.nature}）
        </p>
        {cast.changingLines.length > 0 && (
          <p className="sigil-changing">動爻：第 {cast.changingLines.join('、')} 爻</p>
        )}
      </div>
    </div>
  )
}
