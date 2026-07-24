import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type BrowserGuide = 'ios-safari' | 'ios-chrome' | 'ios-other' | 'android'

const DISMISS_KEY = 'fuyao-install-dismissed'
const DISMISS_DAYS = 14

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

function isMobile(): boolean {
  return (
    window.matchMedia('(max-width: 820px)').matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  )
}

function isIos(): boolean {
  const ua = navigator.userAgent
  // iPadOS 13+ may report as Mac; touch points help catch it
  return (
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function detectGuide(): BrowserGuide {
  const ua = navigator.userAgent
  if (isIos()) {
    if (/CriOS/i.test(ua)) return 'ios-chrome'
    if (/FxiOS|EdgiOS|OPiOS|OPT\//i.test(ua)) return 'ios-other'
    return 'ios-safari'
  }
  return 'android'
}

function wasDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const at = Number(raw)
    if (!Number.isFinite(at)) return false
    return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

function dismissForLater(): void {
  localStorage.setItem(DISMISS_KEY, String(Date.now()))
}

const GUIDE_COPY: Record<
  BrowserGuide,
  { title: string; steps: string[] }
> = {
  'ios-safari': {
    title: '用 Safari 加入主畫面',
    steps: [
      '點底部的「分享」按鈕',
      '向下滑動，選擇「加入主畫面」',
      '確認名稱後按「加入」',
    ],
  },
  'ios-chrome': {
    title: '用 Chrome 加入主畫面',
    steps: [
      '點網址列右側的「分享」按鈕',
      '若沒看到，先點右下角「⋯」再選「分享」',
      '選擇「加入主畫面」',
      '確認名稱後按「加入」',
    ],
  },
  'ios-other': {
    title: '加入 iPhone 主畫面',
    steps: [
      '點瀏覽器的「分享」按鈕',
      '選擇「加入主畫面」',
      '確認名稱後按「加入」',
    ],
  },
  android: {
    title: '加入主畫面',
    steps: [
      '點瀏覽器選單「⋮」',
      '選擇「安裝應用程式」或「加入主畫面」',
    ],
  },
}

export function InstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [busy, setBusy] = useState(false)
  const [guide] = useState<BrowserGuide>(() =>
    typeof navigator === 'undefined' ? 'android' : detectGuide(),
  )

  useEffect(() => {
    if (isStandalone() || !isMobile() || wasDismissedRecently()) return

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBip)

    const timer = window.setTimeout(() => {
      setVisible(true)
    }, 1200)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBip)
    }
  }, [])

  if (!visible) return null

  const close = () => {
    dismissForLater()
    setVisible(false)
    setShowGuide(false)
  }

  const install = async () => {
    if (deferred) {
      setBusy(true)
      try {
        await deferred.prompt()
        const choice = await deferred.userChoice
        setDeferred(null)
        if (choice.outcome === 'accepted') {
          setVisible(false)
          localStorage.removeItem(DISMISS_KEY)
        } else {
          close()
        }
      } finally {
        setBusy(false)
      }
      return
    }

    // iOS (Safari / Chrome) and Android without native prompt → manual steps
    setShowGuide(true)
  }

  const copy = GUIDE_COPY[guide]

  return (
    <div className="install-overlay" role="dialog" aria-modal="true" aria-labelledby="install-title">
      <div className="install-card">
        {!showGuide ? (
          <>
            <p className="install-eyebrow">符爻 · PWA</p>
            <h2 id="install-title" className="install-title">
              要安裝到主畫面嗎？
            </h2>
            <p className="install-copy">
              加到手機主畫面後，可像 App 一樣開啟，也能離線卜問今日運勢。
            </p>
            <div className="install-actions">
              <button type="button" className="btn btn--ghost" onClick={close}>
                稍後
              </button>
              <button
                type="button"
                className="btn btn--small"
                disabled={busy}
                onClick={() => void install()}
              >
                {busy ? '請稍候…' : '安裝'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="install-eyebrow">安裝方式</p>
            <h2 id="install-title" className="install-title">
              {copy.title}
            </h2>
            <ol className="install-steps">
              {copy.steps.map((step) => (
                <li key={step}>
                  {step.split(/「([^」]+)」/g).map((part, i) =>
                    i % 2 === 1 ? <strong key={`${step}-${part}`}>{part}</strong> : part,
                  )}
                </li>
              ))}
            </ol>
            <div className="install-actions">
              <button type="button" className="btn" onClick={close}>
                知道了
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
