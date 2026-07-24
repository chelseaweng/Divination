import type { CastResult } from './cast'
import type { Rune } from '../data/runes'
import type { Hexagram } from '../data/hexagrams'
import {
  getNatalInfo,
  runeToWuXing,
  wuxingRelation,
  type NatalInfo,
} from './profile'

export type AspectScore = {
  key: 'overall' | 'love' | 'career' | 'wealth' | 'health'
  label: string
  score: number // 1–5
  note: string
}

export type CrossReading = {
  title: string
  summary: string
  synthesis: string
  natalNote?: string
  guidance: string[]
  aspects: AspectScore[]
  resonance: 'harmonious' | 'tension' | 'catalytic' | 'steady'
  resonanceLabel: string
}

const TONE_SCORE: Record<string, number> = {
  auspicious: 5,
  neutral: 3,
  transform: 4,
  caution: 2,
}

function avgTone(a: string, b: string): number {
  return Math.round((TONE_SCORE[a] + TONE_SCORE[b]) / 2)
}

function resonanceOf(rune: Rune, hex: Hexagram): CrossReading['resonance'] {
  const pair = `${rune.tone}-${hex.tone}`
  if (
    (rune.tone === 'auspicious' && hex.tone === 'auspicious') ||
    (rune.tone === 'auspicious' && hex.tone === 'neutral') ||
    (rune.tone === 'neutral' && hex.tone === 'auspicious')
  ) {
    return 'harmonious'
  }
  if (
    (rune.tone === 'caution' && hex.tone === 'caution') ||
    (rune.tone === 'caution' && hex.tone === 'transform') ||
    pair === 'transform-caution'
  ) {
    return 'tension'
  }
  if (rune.tone === 'transform' || hex.tone === 'transform') {
    return 'catalytic'
  }
  return 'steady'
}

const RESONANCE_LABEL: Record<CrossReading['resonance'], string> = {
  harmonious: '符爻相生',
  tension: '符爻相激',
  catalytic: '符爻催變',
  steady: '符爻守中',
}

function titleFor(resonance: CrossReading['resonance'], rune: Rune, hex: Hexagram): string {
  switch (resonance) {
    case 'harmonious':
      return `${rune.name}照${hex.name} · 順勢可為`
    case 'tension':
      return `${rune.name}遇${hex.name} · 慎行守心`
    case 'catalytic':
      return `${rune.name}動${hex.name} · 變中求進`
    default:
      return `${rune.name}合${hex.name} · 穩中求成`
  }
}

function natalAffinityDelta(natal: NatalInfo | undefined, rune: Rune): number {
  if (!natal) return 0
  const rel = wuxingRelation(natal.yearElement, runeToWuXing(rune.element))
  switch (rel) {
    case 'same':
    case 'generate':
    case 'generated':
      return 0.5
    case 'overcome':
    case 'overcomeBy':
      return -0.5
    default:
      return 0
  }
}

function natalNoteText(natal: NatalInfo, rune: Rune, hex: Hexagram): string {
  const rel = wuxingRelation(natal.yearElement, runeToWuXing(rune.element))
  const affinity =
    rel === 'same' || rel === 'generate' || rel === 'generated'
      ? `你的年命「${natal.yearElement}」與盧恩「${rune.element}」氣場相合，今日較易得力。`
      : rel === 'overcome' || rel === 'overcomeBy'
        ? `年命「${natal.yearElement}」與盧恩「${rune.element}」略有沖剋，宜以柔濟剛、留白行事。`
        : `年命「${natal.yearElement}」與今日符文平行並存，不強求合，但可各取所長。`

  return `生肖${natal.zodiac}（${natal.trait}）。${natal.counsel} 對應卦象「${hex.name}」：${affinity}`
}

function aspectNote(
  key: AspectScore['key'],
  score: number,
  rune: Rune,
  hex: Hexagram,
  natal?: NatalInfo,
): string {
  const you = natal ? `屬${natal.zodiac}的你，` : ''
  const notes: Record<AspectScore['key'], Record<string, string>> = {
    overall: {
      high: `${you}整體氣場開闊，適合主動推進真正重要的事，其餘可暫緩。`,
      mid: `${you}整體平穩中正。宜穩扎穩打，把力氣放在一件可完成的事上。`,
      low: `${you}整體偏緊。先守後攻，減少承諾，給自己留轉圜空間。`,
    },
    love: {
      high: `${you}人際與情感流動順暢。「${rune.keywords[0]}」能量有助靠近與表達。`,
      mid: `${you}感情宜真誠慢熱。小步靠近、清楚表達，勝過激情衝刺。`,
      low: `${you}情感面需要邊界。記取「${hex.name}」之誡，先釐清再回應，避免誤會加深。`,
    },
    career: {
      high: `${you}事業有展開空間。「${hex.keywords[0]}」是今日可抓住的主題。`,
      mid: `${you}工作以完善流程與協作為主，穩健展現專業即可見效。`,
      low: `${you}職場宜低調務實。少爭一時之氣，把力氣留給可驗證的成果。`,
    },
    wealth: {
      high: `${you}財運有流動機會。收入與投資可審慎推進，仍忌孤注一擲。`,
      mid: `${you}財運持平。開源與節流並行，記帳比衝動消費更有用。`,
      low: `${you}財務宜守成。避開高風險賭性操作，先穩住現金流。`,
    },
    health: {
      high: `${you}身心能量充足。適合溫和運動，並維持規律作息。`,
      mid: `${you}注意休息與補水。情緒起伏時，給自己十分鐘緩衝。`,
      low: `${you}身心偏勞。睡眠與減壓優先，今天不必證明你有多能扛。`,
    },
  }
  const band = score >= 4 ? 'high' : score <= 2 ? 'low' : 'mid'
  return notes[key][band]
}

function clampScore(n: number): number {
  return Math.max(1, Math.min(5, Math.round(n)))
}

function summarize(
  resonance: CrossReading['resonance'],
  rune: Rune,
  hex: Hexagram,
  natal?: NatalInfo,
): string {
  const address = natal ? `屬${natal.zodiac}的你，` : '今日'
  switch (resonance) {
    case 'harmonious':
      return `${address}盧恩「${rune.name}」與「${hex.alias}」同頻相生。符文指向${rune.keywords.join('、')}；卦曰「${hex.judgment}」——宜順勢推進，不必過度猶豫。`
    case 'tension':
      return `${address}「${rune.name}」帶來提醒，「${hex.name}」亦示戒慎。不宜硬闖，先安頓內心與節奏，再決定下一步。`
    case 'catalytic':
      return `${address}符爻皆指向轉變：${rune.keywords.join('、')}遇上${hex.keywords.join('、')}。舊局鬆動之處，正是新機入口。`
    default:
      return `${address}氣場中正。以「${rune.name}」為心法，以「${hex.name}」為行事準則，穩中求進便是上策。`
  }
}

function synthesize(
  cast: CastResult,
  natal?: NatalInfo,
): string {
  const { rune, hexagram, relating, changingLines } = cast
  const bridge = natal
    ? `對生肖${natal.zodiac}而言，${natal.trait}的特質可作為今日濾鏡：`
    : ''

  if (relating) {
    return `${bridge}本卦「${hexagram.alias}」有${changingLines.length}爻動，化為之卦「${relating.alias}」。氣場從「${hexagram.judgment}」走向「${relating.judgment}」——變動是今日主軸，把注意力放在過渡本身，而非終點焦慮。盧恩「${rune.symbol} ${rune.name}」提醒：${rune.meaning}`
  }

  return `${bridge}本卦「${hexagram.alias}」無變爻，格局相對穩定。卦辭「${hexagram.judgment}」即是主調；盧恩「${rune.symbol} ${rune.name}」點出心法：${rune.meaning} 兩者交叉，即是今日行動指南。`
}

function buildGuidance(
  cast: CastResult,
  natal?: NatalInfo,
): string[] {
  const { rune, hexagram, relating } = cast
  const list = [
    hexagram.advice,
    `以「${rune.keywords[0]}」為今日關鍵字行事，同時警惕過度偏向「${rune.keywords[rune.keywords.length - 1]}」的極端。`,
  ]
  if (relating) {
    list.push(`若遇阻力，回想之卦「${relating.name}」：${relating.advice}`)
  } else {
    list.push(`可默念今日主題：${hexagram.keywords.join(' · ')}。`)
  }
  if (natal) {
    list.push(`生辰叮嚀：${natal.counsel}`)
  }
  return list
}

export function interpretCross(cast: CastResult, birthdate?: string): CrossReading {
  const natal = birthdate ? getNatalInfo(birthdate) : undefined
  const { rune, hexagram, changingLines } = cast
  const resonance = resonanceOf(rune, hexagram)
  const base = avgTone(rune.tone, hexagram.tone)
  const natalDelta = natalAffinityDelta(natal, rune)

  const changeBoost = changingLines.length >= 3 ? 0.5 : changingLines.length > 0 ? 0.25 : 0
  const overall = clampScore(
    base +
      natalDelta +
      (resonance === 'harmonious' ? 0.5 : resonance === 'tension' ? -0.5 : 0),
  )

  const aspects: AspectScore[] = [
    { key: 'overall', label: '總運', score: overall, note: '' },
    {
      key: 'love',
      label: '感情',
      score: clampScore(
        base +
          natalDelta * 0.5 +
          (rune.keywords.some((k) =>
            ['喜悅', '交換', '情感', '信任', '感應', '合作'].includes(k),
          )
            ? 0.5
            : 0) -
          (hexagram.tone === 'caution' ? 0.5 : 0),
      ),
      note: '',
    },
    {
      key: 'career',
      label: '事業',
      score: clampScore(
        base +
          changeBoost +
          natalDelta * 0.5 +
          (hexagram.keywords.some((k) =>
            ['進取', '領導', '晉升', '決斷', '策略', '成長'].includes(k),
          )
            ? 0.5
            : 0),
      ),
      note: '',
    },
    {
      key: 'wealth',
      label: '財運',
      score: clampScore(
        base +
          natalDelta * 0.5 +
          (rune.id === 'fehu' || rune.id === 'jera' || hexagram.number === 14 ? 1 : 0) -
          (rune.tone === 'caution' ? 0.5 : 0),
      ),
      note: '',
    },
    {
      key: 'health',
      label: '健康',
      score: clampScore(
        base +
          (rune.element === '冰' || hexagram.number === 29 ? -1 : 0) +
          (rune.id === 'sowilo' || rune.id === 'uruz' ? 0.5 : 0),
      ),
      note: '',
    },
  ]

  for (const a of aspects) {
    a.note = aspectNote(a.key, a.score, rune, hexagram, natal)
  }

  return {
    title: titleFor(resonance, rune, hexagram),
    summary: summarize(resonance, rune, hexagram, natal),
    synthesis: synthesize(cast, natal),
    natalNote: natal ? natalNoteText(natal, rune, hexagram) : undefined,
    guidance: buildGuidance(cast, natal),
    aspects,
    resonance,
    resonanceLabel: RESONANCE_LABEL[resonance],
  }
}
