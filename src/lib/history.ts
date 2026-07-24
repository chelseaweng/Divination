import type { CastResult } from './cast'
import { birthKeyOf, getProfile } from './profile'
import { todayKey } from './seed'

const HISTORY_KEY = 'fuyao-history'
const LEGACY_PREFIX = 'fuyao-cast:'
const MAX_ENTRIES = 90

export type HistoryEntry = {
  dateKey: string
  birthKey: string
  cast: CastResult
  title: string
  resonanceLabel: string
  overallScore: number
  savedAt: string
}

function readAll(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const list = JSON.parse(raw) as HistoryEntry[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function writeAll(list: HistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_ENTRIES)))
}

export function listHistory(birthKey = birthKeyOf(getProfile())): HistoryEntry[] {
  return readAll()
    .filter((e) => e.birthKey === birthKey)
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
}

export function getHistoryEntry(
  dateKey = todayKey(),
  birthKey = birthKeyOf(getProfile()),
): HistoryEntry | null {
  return (
    readAll().find((e) => e.dateKey === dateKey && e.birthKey === birthKey) ?? null
  )
}

export function upsertHistory(entry: HistoryEntry): void {
  const list = readAll().filter(
    (e) => !(e.dateKey === entry.dateKey && e.birthKey === entry.birthKey),
  )
  list.unshift(entry)
  writeAll(list)

  // keep legacy key in sync for older readers
  try {
    localStorage.setItem(`${LEGACY_PREFIX}${entry.dateKey}`, JSON.stringify(entry.cast))
  } catch {
    /* ignore quota */
  }
}

export function clearHistoryForBirth(birthKey = birthKeyOf(getProfile())): void {
  writeAll(readAll().filter((e) => e.birthKey !== birthKey))
}

export function formatHistoryDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('zh-Hant', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}
