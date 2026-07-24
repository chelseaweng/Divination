import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

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
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
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

export function InstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [iosGuide, setIosGuide] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isStandalone() || !isMobile() || wasDismissedRecently()) return

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBip)

    // Ask shortly after landing so it feels intentional, not buried.
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
    setIosGuide(false)
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

    if (isIos()) {
      setIosGuide(true)
      return
    }

    // Android/other without deferred prompt: show brief how-to
    setIosGuide(true)
  }

  return (
    <div className="install-overlay" role="dialog" aria-modal="true" aria-labelledby="install-title">
      <div className="install-card">
        {!iosGuide ? (
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
              {isIos() ? '加入 iPhone 主畫面' : '加入主畫面'}
            </h2>
            {isIos() ? (
              <ol className="install-steps">
                <li>
                  點 Safari 底部的<strong>分享</strong>按鈕
                </li>
                <li>
                  選擇<strong>加入主畫面</strong>
                </li>
                <li>確認名稱後按「加入」</li>
              </ol>
            ) : (
              <ol className="install-steps">
                <li>
                  點瀏覽器選單<strong>⋮</strong>
                </li>
                <li>
                  選擇<strong>安裝應用程式</strong>或<strong>加入主畫面</strong>
                </li>
              </ol>
            )}
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
