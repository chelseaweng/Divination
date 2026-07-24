import type { HistoryEntry } from '../lib/history'
import { formatHistoryDate } from '../lib/history'

type Props = {
  entries: HistoryEntry[]
  todayKey: string
  onOpen: (entry: HistoryEntry) => void
  onBack: () => void
}

export function HistoryList({ entries, todayKey, onOpen, onBack }: Props) {
  return (
    <section className="panel" aria-labelledby="history-title">
      <div className="panel__nav">
        <button type="button" className="topbar__link" onClick={onBack}>
          返回
        </button>
      </div>
      <p className="section-label">過往卜問</p>
      <h2 id="history-title" className="panel__title">
        歷史紀錄
      </h2>
      <p className="panel__lead">依你的生辰保存於本機，最多保留約三個月。</p>

      {entries.length === 0 ? (
        <p className="empty-state">尚無紀錄。完成一次今日卜問後會出現在此。</p>
      ) : (
        <ul className="history-list">
          {entries.map((entry) => {
            const overall =
              entry.overallScore >= 1
                ? '●'.repeat(entry.overallScore) + '○'.repeat(5 - entry.overallScore)
                : ''
            return (
              <li key={`${entry.dateKey}-${entry.birthKey}`}>
                <button
                  type="button"
                  className="history-item"
                  onClick={() => onOpen(entry)}
                >
                  <span className="history-item__date">
                    {formatHistoryDate(entry.dateKey)}
                    {entry.dateKey === todayKey ? (
                      <span className="history-item__badge">今日</span>
                    ) : null}
                  </span>
                  <span className="history-item__title">{entry.title}</span>
                  <span className="history-item__meta">
                    <span>{entry.cast.rune.symbol} {entry.cast.rune.name}</span>
                    <span aria-hidden>·</span>
                    <span>{entry.cast.hexagram.alias}</span>
                    <span aria-hidden>·</span>
                    <span>{entry.resonanceLabel}</span>
                    {overall && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="history-item__score" aria-label={`總運 ${entry.overallScore}`}>
                          {overall}
                        </span>
                      </>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
