import type { AspectScore } from '../lib/cross'

export function AspectBars({ aspects }: { aspects: AspectScore[] }) {
  return (
    <ul className="aspect-list">
      {aspects.map((a) => (
        <li key={a.key} className="aspect-item">
          <div className="aspect-head">
            <span className="aspect-label">{a.label}</span>
            <span className="aspect-score" aria-label={`${a.score} 分，滿分 5`}>
              {'●'.repeat(a.score)}
              <span className="aspect-score-empty">{'○'.repeat(5 - a.score)}</span>
            </span>
          </div>
          <p className="aspect-note">{a.note}</p>
        </li>
      ))}
    </ul>
  )
}
