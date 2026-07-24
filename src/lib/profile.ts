export type Profile = {
  birthdate: string // YYYY-MM-DD
}

const PROFILE_KEY = 'fuyao-profile'

export type ZodiacAnimal =
  | '鼠'
  | '牛'
  | '虎'
  | '兔'
  | '龍'
  | '蛇'
  | '馬'
  | '羊'
  | '猴'
  | '雞'
  | '狗'
  | '豬'

export type WuXing = '木' | '火' | '土' | '金' | '水'

export type NatalInfo = {
  birthdate: string
  year: number
  zodiac: ZodiacAnimal
  yearElement: WuXing
  trait: string
  counsel: string
}

const ZODIAC: ZodiacAnimal[] = [
  '鼠',
  '牛',
  '虎',
  '兔',
  '龍',
  '蛇',
  '馬',
  '羊',
  '猴',
  '雞',
  '狗',
  '豬',
]

const ZODIAC_TRAIT: Record<ZodiacAnimal, { trait: string; counsel: string }> = {
  鼠: { trait: '機敏善變', counsel: '今日宜用靈活與觀察，少硬碰硬。' },
  牛: { trait: '穩健踏實', counsel: '以耐心與節奏取勝，勿急於求成。' },
  虎: { trait: '勇銳敢為', counsel: '勇氣可貴，但仍需留一步餘地。' },
  兔: { trait: '細膩溫和', counsel: '以柔克剛，溝通與關係是你的優勢。' },
  龍: { trait: '氣度恢宏', counsel: '適合展現格局，但避免好高騖遠。' },
  蛇: { trait: '深沉睿智', counsel: '沉靜謀劃勝於張揚，洞察隱藏訊息。' },
  馬: { trait: '奔放進取', counsel: '行動力高，記得為身體與情緒留白。' },
  羊: { trait: '溫潤共情', counsel: '照顧感受，也別忘了為自己設界線。' },
  猴: { trait: '巧思靈動', counsel: '創意與應變是利器，慎防三分心。' },
  雞: { trait: '分明精確', counsel: '細節與秩序帶來勝算，避免過度挑剔。' },
  狗: { trait: '忠義可靠', counsel: '信任與承諾是今日關鍵，擇善固執。' },
  豬: { trait: '厚道從容', counsel: '心寬則路寬，享受過程勝過追逐結果。' },
}

/** 天干五行：甲乙木、丙丁火、戊己土、庚辛金、壬癸水 */
const STEM_ELEMENT: WuXing[] = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水']

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Profile
    if (!parsed.birthdate || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.birthdate)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY)
}

export function birthKeyOf(profile: Profile | null | undefined): string {
  return profile?.birthdate ?? ''
}

export function getNatalInfo(birthdate: string): NatalInfo {
  const year = Number(birthdate.slice(0, 4))
  const zodiac = ZODIAC[(year - 4) % 12]
  const yearElement = STEM_ELEMENT[(year - 4) % 10]
  const { trait, counsel } = ZODIAC_TRAIT[zodiac]
  return { birthdate, year, zodiac, yearElement, trait, counsel }
}

/** Rune elements → WuXing for rough affinity */
export function runeToWuXing(element: string): WuXing {
  switch (element) {
    case '火':
      return '火'
    case '水':
    case '冰':
      return '水'
    case '風':
      return '木'
    case '土':
      return '土'
    case '靈':
      return '金'
    default:
      return '土'
  }
}

/** 五行相生：木→火→土→金→水→木；相剋：木剋土、土剋水、水剋火、火剋金、金剋木 */
export function wuxingRelation(
  a: WuXing,
  b: WuXing,
): 'same' | 'generate' | 'generated' | 'overcome' | 'overcomeBy' | 'neutral' {
  if (a === b) return 'same'
  const generate: Record<WuXing, WuXing> = {
    木: '火',
    火: '土',
    土: '金',
    金: '水',
    水: '木',
  }
  const overcome: Record<WuXing, WuXing> = {
    木: '土',
    土: '水',
    水: '火',
    火: '金',
    金: '木',
  }
  if (generate[a] === b) return 'generate'
  if (generate[b] === a) return 'generated'
  if (overcome[a] === b) return 'overcome'
  if (overcome[b] === a) return 'overcomeBy'
  return 'neutral'
}
