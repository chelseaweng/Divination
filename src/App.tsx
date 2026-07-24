import { useEffect, useState, useTransition } from 'react'
import { AspectBars } from './components/AspectBars'
import { BirthForm } from './components/BirthForm'
import { HexagramCard, HexagramGlyph } from './components/HexagramGlyph'
import { HistoryList } from './components/HistoryList'
import { InstallHint } from './components/InstallHint'
import { RuneCard } from './components/RuneCard'
import { castDaily, type CastResult } from './lib/cast'
import { interpretCross, type CrossReading } from './lib/cross'
import {
  getHistoryEntry,
  listHistory,
  upsertHistory,
  type HistoryEntry,
} from './lib/history'
import {
  birthKeyOf,
  getNatalInfo,
  getProfile,
  type Profile,
} from './lib/profile'
import { formatZhDate, todayKey } from './lib/seed'
import './App.css'

type Phase = 'home' | 'casting' | 'result' | 'history' | 'profile'

function readingOf(cast: CastResult, profile: Profile | null): CrossReading {
  return interpretCross(cast, profile?.birthdate)
}

function saveReading(cast: CastResult, reading: CrossReading): void {
  upsertHistory({
    dateKey: cast.dateKey,
    birthKey: cast.birthKey,
    cast,
    title: reading.title,
    resonanceLabel: reading.resonanceLabel,
    overallScore: reading.aspects.find((a) => a.key === 'overall')?.score ?? 3,
    savedAt: new Date().toISOString(),
  })
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('home')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cast, setCast] = useState<CastResult | null>(null)
  const [reading, setReading] = useState<CrossReading | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [castStep, setCastStep] = useState(0)
  const [, startTransition] = useTransition()
  const dateLabel = formatZhDate()
  const dayKey = todayKey()
  const natal = profile ? getNatalInfo(profile.birthdate) : null

  useEffect(() => {
    const p = getProfile()
    setProfile(p)
    const bk = birthKeyOf(p)
    setHistory(listHistory(bk))
    const existing = getHistoryEntry(dayKey, bk)
    if (existing) {
      setCast(existing.cast)
      setReading(readingOf(existing.cast, p))
      setPhase('result')
    }
  }, [dayKey])

  const refreshHistory = (p: Profile | null = profile) => {
    setHistory(listHistory(birthKeyOf(p)))
  }

  const openEntry = (entry: HistoryEntry) => {
    setCast(entry.cast)
    setReading(readingOf(entry.cast, profile))
    setPhase('result')
  }

  const beginCast = () => {
    if (!profile) {
      setPhase('profile')
      return
    }

    const bk = birthKeyOf(profile)
    const existing = getHistoryEntry(dayKey, bk)
    if (existing) {
      openEntry(existing)
      return
    }

    setPhase('casting')
    setCastStep(0)

    const steps = [400, 900, 1500, 2200]
    steps.forEach((ms, i) => {
      window.setTimeout(() => setCastStep(i + 1), ms)
    })

    window.setTimeout(() => {
      startTransition(() => {
        const result = castDaily(dayKey, bk)
        const nextReading = readingOf(result, profile)
        saveReading(result, nextReading)
        setCast(result)
        setReading(nextReading)
        refreshHistory(profile)
        setPhase('result')
      })
    }, 2800)
  }

  const onProfileSaved = (next: Profile) => {
    setProfile(next)
    refreshHistory(next)
    const existing = getHistoryEntry(dayKey, birthKeyOf(next))
    if (existing) {
      setCast(existing.cast)
      setReading(readingOf(existing.cast, next))
      setPhase('result')
    } else {
      setCast(null)
      setReading(null)
      setPhase('home')
    }
  }

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden>
        <div className="atmosphere__wash" />
        <div className="atmosphere__grain" />
        <div className="atmosphere__orb atmosphere__orb--a" />
        <div className="atmosphere__orb atmosphere__orb--b" />
      </div>

      <header className="topbar">
        <p className="topbar__date">{dateLabel}</p>
        <nav className="topbar__nav" aria-label="主要">
          {phase !== 'home' && phase !== 'casting' && (
            <button type="button" className="topbar__link" onClick={() => setPhase('home')}>
              首頁
            </button>
          )}
          {phase !== 'history' && phase !== 'casting' && (
            <button
              type="button"
              className="topbar__link"
              onClick={() => {
                refreshHistory()
                setPhase('history')
              }}
            >
              紀錄
            </button>
          )}
          {phase !== 'profile' && phase !== 'casting' && (
            <button type="button" className="topbar__link" onClick={() => setPhase('profile')}>
              生辰
            </button>
          )}
        </nav>
      </header>

      <main className="main">
        {phase === 'home' && (
          <section className="hero" aria-labelledby="brand">
            <p className="hero__mark" aria-hidden>
              ᛉ ✦ ䷀
            </p>
            <h1 id="brand" className="hero__brand">
              符爻
            </h1>
            <p className="hero__tag">每日運勢</p>
            <p className="hero__lead">
              以盧恩符文為心法，以易經卦象為時勢，
              <br />
              依你的生辰交叉卜問今日氣場。
            </p>
            {natal && (
              <p className="hero__natal">
                生肖{natal.zodiac} · 年命{natal.yearElement}
              </p>
            )}
            <div className="hero__cta">
              <button type="button" className="btn" onClick={beginCast}>
                {getHistoryEntry(dayKey, birthKeyOf(profile))
                  ? '查看今日結果'
                  : profile
                    ? '開啟今日卜問'
                    : '設定生辰並卜問'}
              </button>
              <div className="hero__links">
                <button type="button" className="btn btn--ghost" onClick={() => setPhase('profile')}>
                  {profile ? '修改生辰' : '設定生辰'}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    refreshHistory()
                    setPhase('history')
                  }}
                >
                  歷史紀錄
                </button>
              </div>
              <p className="hero__hint">
                {profile
                  ? '同一日、同一生辰結果不變 · 可離線使用'
                  : '首次請先設定出生年月日'}
              </p>
            </div>
          </section>
        )}

        {phase === 'casting' && (
          <section className="ritual" aria-live="polite" aria-busy="true">
            <div className="ritual__ring">
              <span className={`ritual__rune${castStep >= 1 ? ' is-on' : ''}`}>ᚨ</span>
              <span className={`ritual__dot${castStep >= 2 ? ' is-on' : ''}`} />
              <span className={`ritual__hex${castStep >= 3 ? ' is-on' : ''}`}>
                <HexagramGlyph
                  lines={[true, false, true, false, true, false]}
                  compact
                />
              </span>
            </div>
            <p className="ritual__text">
              {castStep < 1 && '靜心……'}
              {castStep === 1 && '抽取盧恩……'}
              {castStep === 2 && '擲幣成爻……'}
              {castStep >= 3 && '符爻相交……'}
            </p>
          </section>
        )}

        {phase === 'profile' && (
          <BirthForm
            initial={profile}
            onSaved={onProfileSaved}
            onSkip={
              profile
                ? () => setPhase(cast ? 'result' : 'home')
                : undefined
            }
          />
        )}

        {phase === 'history' && (
          <HistoryList
            entries={history}
            todayKey={dayKey}
            onOpen={openEntry}
            onBack={() => setPhase(cast ? 'result' : 'home')}
          />
        )}

        {phase === 'result' && cast && reading && (
          <section className="result" aria-labelledby="result-title">
            <header className="result__header">
              <p className={`result__resonance result__resonance--${reading.resonance}`}>
                {reading.resonanceLabel}
              </p>
              <h2 id="result-title" className="result__title">
                {reading.title}
              </h2>
              {cast.dateKey !== dayKey && (
                <p className="result__past">
                  回溯 · {cast.dateKey}
                </p>
              )}
              <p className="result__summary">{reading.summary}</p>
            </header>

            <div className="result__sigils">
              <RuneCard rune={cast.rune} />
              <HexagramCard cast={cast} />
            </div>

            {cast.relating && (
              <div className="result__relating">
                <p className="section-label">之卦</p>
                <p className="relating-line">
                  化為「{cast.relating.alias}」——{cast.relating.judgment}
                </p>
              </div>
            )}

            {reading.natalNote && (
              <div className="result__block">
                <p className="section-label">生辰對照</p>
                <p className="result__synthesis">{reading.natalNote}</p>
              </div>
            )}

            <div className="result__block">
              <p className="section-label">交叉解讀</p>
              <p className="result__synthesis">{reading.synthesis}</p>
            </div>

            <div className="result__block">
              <p className="section-label">今日面向</p>
              <AspectBars aspects={reading.aspects} />
            </div>

            <div className="result__block">
              <p className="section-label">行動指引</p>
              <ol className="guidance-list">
                {reading.guidance.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ol>
            </div>

            <div className="result__details">
              <details>
                <summary>盧恩詳解 · {cast.rune.name}</summary>
                <p>{cast.rune.meaning}</p>
              </details>
              <details>
                <summary>易經詳解 · {cast.hexagram.alias}</summary>
                <p>
                  <strong>卦辭：</strong>
                  {cast.hexagram.judgment}
                </p>
                <p>
                  <strong>建議：</strong>
                  {cast.hexagram.advice}
                </p>
              </details>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>符爻 · 北歐盧恩 × 周易六十四卦</p>
      </footer>

      <InstallHint />
    </div>
  )
}
