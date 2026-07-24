import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferred || hidden) return null

  return (
    <div className="install-hint">
      <p>將符爻加到主畫面，每日離線亦可卜問。</p>
      <div className="install-actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setHidden(true)}
        >
          稍後
        </button>
        <button
          type="button"
          className="btn btn--small"
          onClick={async () => {
            await deferred.prompt()
            setDeferred(null)
          }}
        >
          安裝
        </button>
      </div>
    </div>
  )
}
