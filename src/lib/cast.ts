import { RUNES, type Rune } from '../data/runes'
import {
  TRIGRAMS,
  getHexagramByTrigrams,
  getTrigramById,
  type Hexagram,
  type Trigram,
} from '../data/hexagrams'
import { hashSeed, mulberry32, todayKey } from './seed'

export type CastResult = {
  dateKey: string
  birthKey: string
  rune: Rune
  hexagram: Hexagram
  lower: Trigram
  upper: Trigram
  lines: boolean[] // bottom → top, true = yang
  changingLines: number[] // 1–6, bottom = 1
  relating?: Hexagram
}

/** Coin method: 3 coins → 6/7/8/9 (old yin / young yang / young yin / old yang) */
function castLine(rand: () => number): { yang: boolean; changing: boolean } {
  let sum = 0
  for (let i = 0; i < 3; i++) {
    sum += rand() < 0.5 ? 2 : 3 // tails=2, heads=3
  }
  return {
    yang: sum === 7 || sum === 9,
    changing: sum === 6 || sum === 9,
  }
}

function trigramFromLines(lines: [boolean, boolean, boolean]): Trigram {
  const found = TRIGRAMS.find(
    (t) => t.lines[0] === lines[0] && t.lines[1] === lines[1] && t.lines[2] === lines[2],
  )
  return found!
}

export function castDaily(dateKey = todayKey(), birthKey = ''): CastResult {
  const seedInput = birthKey
    ? `符爻:${dateKey}:生辰${birthKey}`
    : `符爻:${dateKey}`
  const rand = mulberry32(hashSeed(seedInput))

  const rune = RUNES[Math.floor(rand() * RUNES.length)]

  const lineResults = Array.from({ length: 6 }, () => castLine(rand))
  const lines = lineResults.map((l) => l.yang)
  const changingLines = lineResults
    .map((l, i) => (l.changing ? i + 1 : -1))
    .filter((n) => n > 0)

  const lower = trigramFromLines(lines.slice(0, 3) as [boolean, boolean, boolean])
  const upper = trigramFromLines(lines.slice(3, 6) as [boolean, boolean, boolean])
  const hexagram = getHexagramByTrigrams(lower.id, upper.id)

  let relating: Hexagram | undefined
  if (changingLines.length > 0) {
    const relatedLines = lines.map((yang, i) =>
      changingLines.includes(i + 1) ? !yang : yang,
    )
    const rLower = trigramFromLines(relatedLines.slice(0, 3) as [boolean, boolean, boolean])
    const rUpper = trigramFromLines(relatedLines.slice(3, 6) as [boolean, boolean, boolean])
    relating = getHexagramByTrigrams(rLower.id, rUpper.id)
  }

  return {
    dateKey,
    birthKey,
    rune,
    hexagram,
    lower,
    upper,
    lines,
    changingLines,
    relating,
  }
}

export { getTrigramById }
