import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Platform = 'ios' | 'android' | 'other'
type Browser =
  | 'safari'
  | 'chrome'
  | 'firefox'
  | 'edge'
  | 'samsung'
  | 'opera'
  | 'other'

type DeviceProfile = {
  platform: Platform
  browser: Browser
  label: string
  title: string
  steps: string[]
  canNativeInstall: boolean
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

function isMobileViewport(): boolean {
  return (
    window.matchMedia('(max-width: 820px)').matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  )
}

function detectPlatform(ua: string): Platform {
  if (
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return 'ios'
  }
  if (/Android/i.test(ua)) return 'android'
  return 'other'
}

function detectBrowser(ua: string, platform: Platform): Browser {
  if (platform === 'ios') {
    if (/CriOS/i.test(ua)) return 'chrome'
    if (/FxiOS/i.test(ua)) return 'firefox'
    if (/EdgiOS/i.test(ua)) return 'edge'
    if (/OPiOS|OPT\//i.test(ua)) return 'opera'
    // Chrome/Firefox on iOS include other tokens; plain Safari usually has Version/ + Safari/
    if (/Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua)) return 'safari'
    return 'other'
  }

  // Android / other: order matters (Edge/Opera/Samsung contain Chrome)
  if (/SamsungBrowser/i.test(ua)) return 'samsung'
  if (/EdgA|Edg\//i.test(ua)) return 'edge'
  if (/OPR|Opera/i.test(ua)) return 'opera'
  if (/Firefox|FxiOS/i.test(ua)) return 'firefox'
  if (/Chrome|CriOS/i.test(ua)) return 'chrome'
  if (/Safari/i.test(ua)) return 'safari'
  return 'other'
}

function buildProfile(): DeviceProfile {
  const ua = navigator.userAgent
  const platform = detectPlatform(ua)
  const browser = detectBrowser(ua, platform)

  const browserName: Record<Browser, string> = {
    safari: 'Safari',
    chrome: 'Chrome',
    firefox: 'Firefox',
    edge: 'Edge',
    samsung: 'Samsung Internet',
    opera: 'Opera',
    other: '目前瀏覽器',
  }

  const platformName =
    platform === 'ios' ? 'iPhone' : platform === 'android' ? 'Android' : '手機'

  const label = `${platformName} · ${browserName[browser]}`

  if (platform === 'ios' && browser === 'safari') {
    return {
      platform,
      browser,
      label,
      title: '用 Safari 加入主畫面',
      steps: [
        '點底部的「分享」按鈕',
        '向下滑動，選擇「加入主畫面」',
        '確認名稱後按「加入」',
      ],
      canNativeInstall: false,
    }
  }

  if (platform === 'ios' && browser === 'chrome') {
    return {
      platform,
      browser,
      label,
      title: '用 Chrome 加入主畫面',
      steps: [
        '點網址列右側的「分享」按鈕',
        '若沒看到，先點右下角「⋯」再選「分享」',
        '選擇「加入主畫面」',
        '確認名稱後按「加入」',
      ],
      canNativeInstall: false,
    }
  }

  if (platform === 'ios') {
    return {
      platform,
      browser,
      label,
      title: `用 ${browserName[browser]} 加入主畫面`,
      steps: [
        '點瀏覽器的「分享」按鈕',
        '選擇「加入主畫面」',
        '確認名稱後按「加入」',
      ],
      canNativeInstall: false,
    }
  }

  if (platform === 'android' && browser === 'chrome') {
    return {
      platform,
      browser,
      label,
      title: '用 Chrome 加入主畫面',
      steps: [
        '點右上角選單「⋮」',
        '選擇「安裝應用程式」或「加入主畫面」',
        '確認後完成安裝',
      ],
      canNativeInstall: true,
    }
  }

  if (platform === 'android' && browser === 'samsung') {
    return {
      platform,
      browser,
      label,
      title: '用 Samsung Internet 加入主畫面',
      steps: [
        '點底部選單按鈕',
        '選擇「加入主螢幕頁」或「安裝應用程式」',
        '確認後完成',
      ],
      canNativeInstall: true,
    }
  }

  if (platform === 'android' && browser === 'firefox') {
    return {
      platform,
      browser,
      label,
      title: '用 Firefox 加入主畫面',
      steps: [
        '點右上角選單「⋮」',
        '選擇「安裝」或「加入主畫面」',
        '確認後完成',
      ],
      canNativeInstall: true,
    }
  }

  if (platform === 'android') {
    return {
      platform,
      browser,
      label,
      title: `用 ${browserName[browser]} 加入主畫面`,
      steps: [
        '點瀏覽器選單「⋮」',
        '選擇「安裝應用程式」或「加入主畫面」',
        '確認後完成',
      ],
      canNativeInstall: true,
    }
  }

  return {
    platform,
    browser,
    label,
    title: '加入主畫面',
    steps: [
      '開啟瀏覽器選單',
      '選擇「安裝應用程式」或「加入主畫面」',
    ],
    canNativeInstall: false,
  }
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

function renderStep(step: string) {
  return step.split(/「([^」]+)」/g).map((part, i) =>
    i % 2 === 1 ? <strong key={`${step}-${part}-${i}`}>{part}</strong> : part,
  )
}

export function InstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [profile] = useState<DeviceProfile | null>(() =>
    typeof navigator === 'undefined' ? null : buildProfile(),
  )

  useEffect(() => {
    if (isStandalone() || !isMobileViewport() || wasDismissedRecently()) return

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBip)

    const timer = window.setTimeout(() => setVisible(true), 1000)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBip)
    }
  }, [])

  if (!visible || !profile) return null

  const close = () => {
    dismissForLater()
    setVisible(false)
  }

  const nativeInstall = async () => {
    if (!deferred) return
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
  }

  const showNativeButton = Boolean(deferred && profile.canNativeInstall)

  return (
    <div className="install-overlay" role="dialog" aria-modal="true" aria-labelledby="install-title">
      <div className="install-card">
        <p className="install-eyebrow">{profile.label}</p>
        <h2 id="install-title" className="install-title">
          {profile.title}
        </h2>
        <p className="install-copy">
          已偵測你的裝置與瀏覽器。依下列步驟加入主畫面，之後可像 App
          一樣開啟，並支援離線卜問。
        </p>
        <ol className="install-steps">
          {profile.steps.map((step) => (
            <li key={step}>{renderStep(step)}</li>
          ))}
        </ol>
        <div className="install-actions">
          <button type="button" className="btn btn--ghost" onClick={close}>
            稍後
          </button>
          {showNativeButton ? (
            <button
              type="button"
              className="btn btn--small"
              disabled={busy}
              onClick={() => void nativeInstall()}
            >
              {busy ? '請稍候…' : '一鍵安裝'}
            </button>
          ) : (
            <button type="button" className="btn btn--small" onClick={close}>
              知道了
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
