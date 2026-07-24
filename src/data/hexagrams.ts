export type Trigram = {
  id: string
  name: string
  nature: string
  lines: [boolean, boolean, boolean] // true = yang (—), false = yin (- -)
}

/** Bagua trigrams, bottom to top */
export const TRIGRAMS: Trigram[] = [
  { id: 'qian', name: '乾', nature: '天', lines: [true, true, true] },
  { id: 'dui', name: '兌', nature: '澤', lines: [true, true, false] },
  { id: 'li', name: '離', nature: '火', lines: [true, false, true] },
  { id: 'zhen', name: '震', nature: '雷', lines: [true, false, false] },
  { id: 'xun', name: '巽', nature: '風', lines: [false, true, true] },
  { id: 'kan', name: '坎', nature: '水', lines: [false, true, false] },
  { id: 'gen', name: '艮', nature: '山', lines: [false, false, true] },
  { id: 'kun', name: '坤', nature: '地', lines: [false, false, false] },
]

export type Hexagram = {
  number: number
  name: string
  alias: string
  upper: string
  lower: string
  judgment: string
  advice: string
  keywords: string[]
  tone: 'auspicious' | 'caution' | 'neutral' | 'transform'
}

/** King Wen sequence — 64 hexagrams */
export const HEXAGRAMS: Hexagram[] = [
  { number: 1, name: '乾', alias: '乾為天', upper: 'qian', lower: 'qian', judgment: '元亨利貞。剛健進取，正向開展。', advice: '以誠正自持，持續行動必有成。', keywords: ['創造', '領導', '進取'], tone: 'auspicious' },
  { number: 2, name: '坤', alias: '坤為地', upper: 'kun', lower: 'kun', judgment: '厚德載物。以柔順承載，收穫在後。', advice: '低調務實，協助與包容勝過爭鋒。', keywords: ['承載', '包容', '務實'], tone: 'auspicious' },
  { number: 3, name: '屯', alias: '水雷屯', upper: 'kan', lower: 'zhen', judgment: '草木破土，初生艱難。', advice: '萬事起頭難，宜積蓄勿躁進。', keywords: ['開始', '困難', '積蓄'], tone: 'caution' },
  { number: 4, name: '蒙', alias: '山水蒙', upper: 'gen', lower: 'kan', judgment: '啟蒙之時，虛心求教。', advice: '承認未知，主動學習與請益。', keywords: ['學習', '啟蒙', '謙虛'], tone: 'neutral' },
  { number: 5, name: '需', alias: '水天需', upper: 'kan', lower: 'qian', judgment: '等待時機，飲食宴樂。', advice: '實力已備，耐心等候窗口。', keywords: ['等待', '時機', '充實'], tone: 'neutral' },
  { number: 6, name: '訟', alias: '天水訟', upper: 'qian', lower: 'kan', judgment: '爭訟之象，不宜持久。', advice: '化解衝突，退一步海闊天空。', keywords: ['爭議', '溝通', '退讓'], tone: 'caution' },
  { number: 7, name: '師', alias: '地水師', upper: 'kun', lower: 'kan', judgment: '師出有名，紀律為先。', advice: '組織力量，有策略地推進目標。', keywords: ['紀律', '團隊', '策略'], tone: 'neutral' },
  { number: 8, name: '比', alias: '水地比', upper: 'kan', lower: 'kun', judgment: '親比輔助，擇善而從。', advice: '尋求同盟，真誠連結帶來支持。', keywords: ['親近', '同盟', '歸屬'], tone: 'auspicious' },
  { number: 9, name: '小畜', alias: '風天小畜', upper: 'xun', lower: 'qian', judgment: '小有積蓄，尚未大成。', advice: '細水長流，完善細節勝過豪賭。', keywords: ['積蓄', '細節', '克制'], tone: 'neutral' },
  { number: 10, name: '履', alias: '天澤履', upper: 'qian', lower: 'dui', judgment: '如履虎尾，慎行則吉。', advice: '按規矩走，謹慎可化險為夷。', keywords: ['禮儀', '謹慎', '分寸'], tone: 'caution' },
  { number: 11, name: '泰', alias: '地天泰', upper: 'kun', lower: 'qian', judgment: '天地交泰，亨通之象。', advice: '順勢而為，合作與溝通特別順暢。', keywords: ['通泰', '和諧', '興盛'], tone: 'auspicious' },
  { number: 12, name: '否', alias: '天地否', upper: 'qian', lower: 'kun', judgment: '閉塞不通，小人當道之象。', advice: '守靜待變，不宜強求突破。', keywords: ['閉塞', '等待', '自守'], tone: 'caution' },
  { number: 13, name: '同人', alias: '天火同人', upper: 'qian', lower: 'li', judgment: '與人和同，志同道合。', advice: '公開真誠，尋找同頻之人。', keywords: ['團結', '公開', '共識'], tone: 'auspicious' },
  { number: 14, name: '大有', alias: '火天大有', upper: 'li', lower: 'qian', judgment: '豐盛擁有，光明盛大。', advice: '善用資源，分享成果更增福澤。', keywords: ['豐盛', '成功', '光明'], tone: 'auspicious' },
  { number: 15, name: '謙', alias: '地山謙', upper: 'kun', lower: 'gen', judgment: '謙謙君子，亨。', advice: '謙遜不矜，反而贏得信任與機會。', keywords: ['謙遜', '穩健', '美德'], tone: 'auspicious' },
  { number: 16, name: '豫', alias: '雷地豫', upper: 'zhen', lower: 'kun', judgment: '喜樂預備，振奮人心。', advice: '鼓舞士氣，但勿沉溺於享樂。', keywords: ['喜悅', '預備', '動員'], tone: 'auspicious' },
  { number: 17, name: '隨', alias: '澤雷隨', upper: 'dui', lower: 'zhen', judgment: '隨時而動，從善如流。', advice: '靈活適應，跟隨正確的節奏。', keywords: ['隨順', '適應', '跟隨'], tone: 'neutral' },
  { number: 18, name: '蠱', alias: '山風蠱', upper: 'gen', lower: 'xun', judgment: '整治弊亂，振疲起衰。', advice: '清理舊疾，修復被忽視的問題。', keywords: ['整頓', '修復', '責任'], tone: 'transform' },
  { number: 19, name: '臨', alias: '地澤臨', upper: 'kun', lower: 'dui', judgment: '居高臨下，以德監臨。', advice: '積極關懷與指導，影響力上升。', keywords: ['臨近', '關懷', '領導'], tone: 'auspicious' },
  { number: 20, name: '觀', alias: '風地觀', upper: 'xun', lower: 'kun', judgment: '觀而後動，省察自身。', advice: '多看少說，觀察局勢再決策。', keywords: ['觀察', '省思', '示範'], tone: 'neutral' },
  { number: 21, name: '噬嗑', alias: '火雷噬嗑', upper: 'li', lower: 'zhen', judgment: '咬合刑罰，掃除障礙。', advice: '果斷處理卡點，公正解決問題。', keywords: ['決斷', '清除', '正義'], tone: 'transform' },
  { number: 22, name: '賁', alias: '山火賁', upper: 'gen', lower: 'li', judgment: '文飾之美，適宜小成。', advice: '注重形式與表達，但勿華而不實。', keywords: ['美飾', '表達', '修飾'], tone: 'neutral' },
  { number: 23, name: '剝', alias: '山地剝', upper: 'gen', lower: 'kun', judgment: '剝落消蝕，不利有攸往。', advice: '減法思維，保護核心，靜待轉機。', keywords: ['剝落', '簡化', '守成'], tone: 'caution' },
  { number: 24, name: '復', alias: '地雷復', upper: 'kun', lower: 'zhen', judgment: '一陽來復，轉機初現。', advice: '回歸初心，小步重啟正當時。', keywords: ['回復', '重生', '回歸'], tone: 'auspicious' },
  { number: 25, name: '無妄', alias: '天雷無妄', upper: 'qian', lower: 'zhen', judgment: '無妄之災亦可，順其自然。', advice: '行事誠實，不強求非分之福。', keywords: ['真誠', '自然', '意外'], tone: 'neutral' },
  { number: 26, name: '大畜', alias: '山天大畜', upper: 'gen', lower: 'qian', judgment: '大有積蓄，止而能畜。', advice: '厚積薄發，學習與儲備優先。', keywords: ['積蓄', '涵養', '節制'], tone: 'auspicious' },
  { number: 27, name: '頤', alias: '山雷頤', upper: 'gen', lower: 'zhen', judgment: '頤養之道，慎言語節飲食。', advice: '照顧身心，注意資訊與消耗的品質。', keywords: ['養生', '言語', '滋養'], tone: 'neutral' },
  { number: 28, name: '大過', alias: '澤風大過', upper: 'dui', lower: 'xun', judgment: '大過之時，非常之舉。', advice: '承擔非常任務，但留意結構負荷。', keywords: ['非常', '承擔', '危機'], tone: 'transform' },
  { number: 29, name: '坎', alias: '坎為水', upper: 'kan', lower: 'kan', judgment: '習坎重險，心亨行有尚。', advice: '面對連續挑戰，以誠與韌性穿越。', keywords: ['險難', '誠信', '堅持'], tone: 'caution' },
  { number: 30, name: '離', alias: '離為火', upper: 'li', lower: 'li', judgment: '附麗光明，文明以麗。', advice: '依附正確方向，展現才華與清晰。', keywords: ['光明', '依附', '文明'], tone: 'auspicious' },
  { number: 31, name: '咸', alias: '澤山咸', upper: 'dui', lower: 'gen', judgment: '感應相通，亨利貞。', advice: '情感與感應活躍，真誠互動有利。', keywords: ['感應', '情感', '吸引'], tone: 'auspicious' },
  { number: 32, name: '恆', alias: '雷風恆', upper: 'zhen', lower: 'xun', judgment: '恆久之道，利有攸往。', advice: '保持穩定節奏，長久比短暫耀眼重要。', keywords: ['恆久', '穩定', '堅持'], tone: 'auspicious' },
  { number: 33, name: '遯', alias: '天山遯', upper: 'qian', lower: 'gen', judgment: '退避保全，小利貞。', advice: '適時抽身，保存實力勝過硬扛。', keywords: ['退避', '保全', '智慧'], tone: 'caution' },
  { number: 34, name: '大壯', alias: '雷天大壯', upper: 'zhen', lower: 'qian', judgment: '大壯之時，利貞。', advice: '力量充沛，須以正道約束，勿逞強。', keywords: ['強盛', '勇氣', '節制'], tone: 'neutral' },
  { number: 35, name: '晉', alias: '火地晉', upper: 'li', lower: 'kun', judgment: '前進光明，康侯用錫馬蕃庶。', advice: '能見度提升，積極表現將被看見。', keywords: ['晉升', '光明', '進展'], tone: 'auspicious' },
  { number: 36, name: '明夷', alias: '地火明夷', upper: 'kun', lower: 'li', judgment: '光明受傷，晦而能貞。', advice: '暫時收斂鋒芒，暗中守正等待。', keywords: ['隱忍', '晦暗', '守正'], tone: 'caution' },
  { number: 37, name: '家人', alias: '風火家人', upper: 'xun', lower: 'li', judgment: '齊家之道，女正位乎內。', advice: '重視家庭與內部秩序，由近而遠。', keywords: ['家庭', '秩序', '內務'], tone: 'neutral' },
  { number: 38, name: '睽', alias: '火澤睽', upper: 'li', lower: 'dui', judgment: '乖離異見，小事吉。', advice: '差異可並存，求同存異處理小事。', keywords: ['差異', '疏離', '調和'], tone: 'caution' },
  { number: 39, name: '蹇', alias: '水山蹇', upper: 'kan', lower: 'gen', judgment: '蹇難在前，見險而止。', advice: '知難而退或繞道，求助貴人。', keywords: ['艱難', '止步', '求助'], tone: 'caution' },
  { number: 40, name: '解', alias: '雷水解', upper: 'zhen', lower: 'kan', judgment: '舒解困境，赦過宥罪。', advice: '鬆綁壓力，化解舊怨，輕裝前行。', keywords: ['解除', '寬恕', '釋放'], tone: 'auspicious' },
  { number: 41, name: '損', alias: '山澤損', upper: 'gen', lower: 'dui', judgment: '損下益上，有孚元吉。', advice: '適當捨棄，換取更重要的成長。', keywords: ['減損', '取捨', '誠信'], tone: 'transform' },
  { number: 42, name: '益', alias: '風雷益', upper: 'xun', lower: 'zhen', judgment: '增益之時，利有攸往。', advice: '助人助己，投資成長會有回報。', keywords: ['增益', '助人', '進取'], tone: 'auspicious' },
  { number: 43, name: '夬', alias: '澤天夬', upper: 'dui', lower: 'qian', judgment: '決斷清除，揚於王庭。', advice: '公開果斷決策，清除不當之人事物。', keywords: ['決斷', '清除', '宣告'], tone: 'transform' },
  { number: 44, name: '姤', alias: '天風姤', upper: 'qian', lower: 'xun', judgment: '不期而遇，陰始生。', advice: '意外邂逅，保持警覺與界線。', keywords: ['邂逅', '誘惑', '警覺'], tone: 'caution' },
  { number: 45, name: '萃', alias: '澤地萃', upper: 'dui', lower: 'kun', judgment: '會聚群集，亨利貞。', advice: '聚集資源與人心，共同目標明確則吉。', keywords: ['聚集', '聚會', '凝聚'], tone: 'auspicious' },
  { number: 46, name: '升', alias: '地風升', upper: 'kun', lower: 'xun', judgment: '柔以時升，南征吉。', advice: '循序上升，踏實累積可見成果。', keywords: ['上升', '成長', '累積'], tone: 'auspicious' },
  { number: 47, name: '困', alias: '澤水困', upper: 'dui', lower: 'kan', judgment: '困頓之中，有言不信。', advice: '少說多做，以行動證明勝過辯解。', keywords: ['困頓', '忍耐', '行動'], tone: 'caution' },
  { number: 48, name: '井', alias: '水風井', upper: 'kan', lower: 'xun', judgment: '井養不窮，改邑不改井。', advice: '維護核心資源，滋養他人也滋養己。', keywords: ['滋養', '資源', '穩定'], tone: 'neutral' },
  { number: 49, name: '革', alias: '澤火革', upper: 'dui', lower: 'li', judgment: '變革更新，己日乃孚。', advice: '時機成熟則改革，先得人心再動手。', keywords: ['變革', '更新', '時機'], tone: 'transform' },
  { number: 50, name: '鼎', alias: '火風鼎', upper: 'li', lower: 'xun', judgment: '鼎新烹飪，養賢育才。', advice: '建立新秩序，培養人才與好習慣。', keywords: ['革新', '養成', '穩定'], tone: 'auspicious' },
  { number: 51, name: '震', alias: '震為雷', upper: 'zhen', lower: 'zhen', judgment: '震驚百里，不喪匕鬯。', advice: '突發震動中保持鎮定，化驚為醒。', keywords: ['震動', '警醒', '行動'], tone: 'transform' },
  { number: 52, name: '艮', alias: '艮為山', upper: 'gen', lower: 'gen', judgment: '止其所止，時行則行。', advice: '該停則停，靜心安住於當下。', keywords: ['止息', '安定', '邊界'], tone: 'neutral' },
  { number: 53, name: '漸', alias: '風山漸', upper: 'xun', lower: 'gen', judgment: '漸進有序，女歸吉。', advice: '按部就班，緩慢而堅定地前進。', keywords: ['漸進', '順序', '穩定'], tone: 'auspicious' },
  { number: 54, name: '歸妹', alias: '雷澤歸妹', upper: 'zhen', lower: 'dui', judgment: '歸妹征凶，無攸利。', advice: '關係與決定勿倉促，審慎評估動機。', keywords: ['衝動', '關係', '審慎'], tone: 'caution' },
  { number: 55, name: '豐', alias: '雷火豐', upper: 'zhen', lower: 'li', judgment: '豐盛盛大，宜日中。', advice: '把握高峰期展現，盛極須防過滿。', keywords: ['豐盛', '高峰', '光明'], tone: 'auspicious' },
  { number: 56, name: '旅', alias: '火山旅', upper: 'li', lower: 'gen', judgment: '羈旅在外，小亨。', advice: '客居心態，靈活應對，勿戀棧。', keywords: ['旅途', '暫居', '適應'], tone: 'neutral' },
  { number: 57, name: '巽', alias: '巽為風', upper: 'xun', lower: 'xun', judgment: '柔順滲透，反覆申命。', advice: '溫和影響勝於硬推，重複溝通有效。', keywords: ['滲透', '柔順', '溝通'], tone: 'neutral' },
  { number: 58, name: '兌', alias: '兌為澤', upper: 'dui', lower: 'dui', judgment: '兌悅亨通，朋友講習。', advice: '以喜悅與交流開啟機會。', keywords: ['喜悅', '交流', '說服'], tone: 'auspicious' },
  { number: 59, name: '渙', alias: '風水渙', upper: 'xun', lower: 'kan', judgment: '渙散冰釋，王假有廟。', advice: '化解凝滯，疏散焦慮，凝聚信念。', keywords: ['渙散', '化解', '凝聚'], tone: 'transform' },
  { number: 60, name: '節', alias: '水澤節', upper: 'kan', lower: 'dui', judgment: '節制有度，苦節不可貞。', advice: '設立合理界限，過嚴反而不利。', keywords: ['節制', '界限', '適度'], tone: 'neutral' },
  { number: 61, name: '中孚', alias: '風澤中孚', upper: 'xun', lower: 'dui', judgment: '中心誠信，豚魚吉。', advice: '以至誠感人，信任是今日貨幣。', keywords: ['誠信', '感應', '信任'], tone: 'auspicious' },
  { number: 62, name: '小過', alias: '雷山小過', upper: 'zhen', lower: 'gen', judgment: '小有過越，宜下不宜上。', advice: '小事可為，大事謹慎；謙抑行事。', keywords: ['小過', '謹慎', '謙抑'], tone: 'caution' },
  { number: 63, name: '既濟', alias: '水火既濟', upper: 'kan', lower: 'li', judgment: '事已既成，初吉終亂。', advice: '完成後防鬆懈，維持成果更重要。', keywords: ['完成', '警惕', '平衡'], tone: 'neutral' },
  { number: 64, name: '未濟', alias: '火水未濟', upper: 'li', lower: 'kan', judgment: '事尚未濟，小狐汔濟。', advice: '接近完成卻未竟，謹慎收尾勿急功。', keywords: ['未完', '潛力', '謹慎'], tone: 'transform' },
]

/** King Wen lookup: lower trigram id + upper trigram id → hexagram number */
const KING_WEN: Record<string, number> = {
  'qian-qian': 1, 'kun-kun': 2, 'zhen-kan': 3, 'kan-gen': 4,
  'qian-kan': 5, 'kan-qian': 6, 'kan-kun': 7, 'kun-kan': 8,
  'qian-xun': 9, 'dui-qian': 10, 'qian-kun': 11, 'kun-qian': 12,
  'li-qian': 13, 'qian-li': 14, 'gen-kun': 15, 'kun-zhen': 16,
  'zhen-dui': 17, 'xun-gen': 18, 'dui-kun': 19, 'kun-xun': 20,
  'zhen-li': 21, 'li-gen': 22, 'kun-gen': 23, 'zhen-kun': 24,
  'zhen-qian': 25, 'qian-gen': 26, 'zhen-gen': 27, 'xun-dui': 28,
  'kan-kan': 29, 'li-li': 30, 'gen-dui': 31, 'xun-zhen': 32,
  'gen-qian': 33, 'qian-zhen': 34, 'kun-li': 35, 'li-kun': 36,
  'li-xun': 37, 'dui-li': 38, 'gen-kan': 39, 'kan-zhen': 40,
  'dui-gen': 41, 'zhen-xun': 42, 'qian-dui': 43, 'xun-qian': 44,
  'kun-dui': 45, 'xun-kun': 46, 'kan-dui': 47, 'xun-kan': 48,
  'li-dui': 49, 'xun-li': 50, 'zhen-zhen': 51, 'gen-gen': 52,
  'gen-xun': 53, 'dui-zhen': 54, 'li-zhen': 55, 'gen-li': 56,
  'xun-xun': 57, 'dui-dui': 58, 'kan-xun': 59, 'dui-kan': 60,
  'dui-xun': 61, 'gen-zhen': 62, 'li-kan': 63, 'kan-li': 64,
}

export function getHexagramByTrigrams(lowerId: string, upperId: string): Hexagram {
  const num = KING_WEN[`${lowerId}-${upperId}`]
  return HEXAGRAMS[num - 1]
}

export function getTrigramById(id: string): Trigram {
  return TRIGRAMS.find((t) => t.id === id)!
}

export function linesFromTrigrams(lower: Trigram, upper: Trigram): boolean[] {
  return [...lower.lines, ...upper.lines]
}
