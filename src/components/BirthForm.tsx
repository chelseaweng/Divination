import { useState, type FormEvent } from 'react'
import {
  getNatalInfo,
  saveProfile,
  type Profile,
} from '../lib/profile'

type Props = {
  initial?: Profile | null
  onSaved: (profile: Profile) => void
  onSkip?: () => void
}

export function BirthForm({ initial, onSaved, onSkip }: Props) {
  const [value, setValue] = useState(initial?.birthdate ?? '')
  const [error, setError] = useState('')

  const natal = /^\d{4}-\d{2}-\d{2}$/.test(value) ? getNatalInfo(value) : null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setError('請選擇有效的出生年月日')
      return
    }
    const year = Number(value.slice(0, 4))
    if (year < 1920 || year > new Date().getFullYear()) {
      setError('請確認出生年份是否合理')
      return
    }
    const profile = { birthdate: value }
    saveProfile(profile)
    onSaved(profile)
  }

  return (
    <section className="panel" aria-labelledby="birth-title">
      <p className="section-label">生辰設定</p>
      <h2 id="birth-title" className="panel__title">
        寫下你的出生年月日
      </h2>
      <p className="panel__lead">
        將以生肖與年命五行微調解讀，並讓每日卜問結果專屬於你。資料只存在本機。
      </p>

      <form className="birth-form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">出生年月日</span>
          <input
            className="field__input"
            type="date"
            value={value}
            max={new Date().toISOString().slice(0, 10)}
            min="1920-01-01"
            onChange={(e) => {
              setValue(e.target.value)
              setError('')
            }}
            required
          />
        </label>

        {natal && (
          <p className="birth-preview">
            生肖<strong>{natal.zodiac}</strong>
            <span aria-hidden> · </span>
            年命<strong>{natal.yearElement}</strong>
            <span aria-hidden> · </span>
            {natal.trait}
          </p>
        )}

        {error && <p className="field__error">{error}</p>}

        <div className="panel__actions">
          {onSkip && (
            <button type="button" className="btn btn--ghost" onClick={onSkip}>
              稍後再說
            </button>
          )}
          <button type="submit" className="btn">
            儲存生辰
          </button>
        </div>
      </form>
    </section>
  )
}
