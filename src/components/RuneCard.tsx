import type { Rune } from '../data/runes'

export function RuneCard({ rune }: { rune: Rune }) {
  return (
    <div className="sigil-card">
      <div className="rune-glyph" aria-hidden>
        {rune.symbol}
      </div>
      <div className="sigil-meta">
        <p className="sigil-eyebrow">{rune.nameEn}</p>
        <h3 className="sigil-name">
          {rune.name}
          <span className="sigil-alias">{rune.element}行</span>
        </h3>
        <p className="sigil-keywords">{rune.keywords.join(' · ')}</p>
      </div>
    </div>
  )
}
