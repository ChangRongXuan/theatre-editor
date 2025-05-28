# Theatre Editor 編輯器

- 使用 [Theatre.js](https://www.theatrejs.com/) 開發。使用者可透過此編輯器新增素材、設定各參數動態變化，並生成捲動式影片 JSON data。
- 取得 JSON data 後，可透過 [@readr-media/react-theatre](https://www.npmjs.com/package/@readr-media/react-theatre) 套件轉換為 Embedded Code 作使用。詳細專案架構＆使用說明可參考 MirrorMedia Dropbox「Theatre_編輯器工程文件」內容。
- 此編輯器專案過往僅部署於 Netlify（非公用帳號），提供 Deploy link 給記者作使用（目前最新版本為：[link](https://theatre-playground-prod.netlify.app/) )。未來可調整或討論看是否改統一於 GCS 上 Deploy 以利管理。
- 使用 React18 + styled-components 開發。
- 過去以獨立的 React 專案環境作開發，2024/03 改移進 `@readr-media/react` Monorepo 中。如果啟用環境上有遇到問題，可先 fork：[ChangRongXuan/theatre-editor](https://github.com/ChangRongXuan/theatre-editor) 專案內容作測試與設定。

<img width="1435" alt="截圖 2024-04-25 下午10 52 51" src="https://github.com/ChangRongXuan/react/assets/104489150/13493827-a597-4e8f-945f-b94d386c2b57">


### 開發與測試

1. 使用 `yarn install` 安裝環境依賴。
2. 接著，使用 `yarn dev` 啟動服務，進行開發測試。
3. 開發完畢後，使用 `yarn build` 來建構正式環境程式。（如搭配 Netlify，後續需將 build 生成內容 deploy 至 Netlify 上以生成網站連結）
4. 無環境變數設定。

## Project Directory Explanation (專案目錄結構說明)

```                      
|── public/                      - 公開資源(圖片、SVG)
|── src/           
    |── components/          
    |    |── button/             - 編輯/新增素材用按鈕
    |    |  |── element-button/  - 按鈕: 點擊以新增各類型素材
    |    |  └── setting-button/  - 按鈕: 點擊以查看 JSON 或 scroll/video 預覽效果
    |    |
    |    |── elements/           - 各素材元件
    |    |  |── background/      - 背景滿版圖片
    |    |  |── image/           - 圖片
    |    |  |── bgVideo/         - 捲動式影片
    |    |  |── video/           - 影片
    |    |  └── font/            - 文字    
    |    |                     
    |    |── lightbox/           - 光箱元件: 顯示JSON / 刪除素材 / 輸入影片src
    |    |── dimmer-with-message -「載入中」畫面元件
    |    |── edit-panel/         - lightbox + button 介面
    |    |── grid-line/          - 背景對齊用格線
    |    |── range-slider/       - 背景對齊格線
    |    └── stage/              - 整合各素材顯示狀況的介面
    |
    |── constants/               - 各素材可調整參數數值
    |    |── background/         - 背景滿版圖片
    |    |── image/              - 圖片
    |    |── bgVideo/            - 捲動式影片
    |    |── video/              - 影片
    |    └── font/               - 文字
    | 
    |── page/                    - 頁面
    |     |── playground/        - 編輯介面
    |     |── demo-scroll/       - 預覽效果頁面：捲動式播放（ `/demo-scroll` 分頁 ) 
    |     └── demo-video/        - 預覽效果頁面：自動播放（ `/demo-video` 分頁 ) 
    |  
    |── utils/                   - 共用 functions
    └── hooks/                   - 共用 hooks
```
