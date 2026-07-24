# 符爻 · 每日運勢

盧恩符文（Elder Futhark）與易經六十四卦交叉卜問的 PWA 網站。

## 功能

- **生辰個人化**：輸入出生年月日，依生肖與年命五行微調解讀；卜問種子含生辰，結果專屬於你
- **每日一卜**：同一日、同一生辰結果固定
- **盧恩 × 易經**：抽取一枚盧恩，擲幣成六爻，交叉解讀（含之卦）
- **歷史紀錄**：本機保存過往卜問，可回溯查看
- **面向評分**：總運／感情／事業／財運／健康
- **可安裝 PWA**：支援離線開啟

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
npm run preview
```

### 部署到 omzen.space/dailydivination

需本機同時有 `../omzen-space`（[omzen-space](https://github.com/chelseaweng/omzen-space)）倉庫：

```bash
npm run deploy:omzen
cd ../omzen-space
git add dailydivination index.md
git commit -m "Publish 符爻 daily divination under /dailydivination"
git push
```

GitHub Pages 更新後即可開啟 https://omzen.space/dailydivination/
