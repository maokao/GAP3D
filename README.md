# GAP3D Online 系統說明書

GAP3D 是一個網頁版的三維資料視覺化系統，把 **Generalized Association Plots (GAP)** 的矩陣視覺化概念延伸到三維資料。每一筆觀測值由三個類別變數 (X、Y、Z) 定位，以 3D cube 中小立方體的顏色呈現數值；使用者可對三個軸分別計算 proximity、排序 (seriation) 與 flip，並選取任一切面以 GAP 矩陣圖檢視，探索三向資料的結構。

線上版：<https://maokao.github.io/GAP3D>

---

## 目錄

1. [開啟系統](#1-開啟系統)
2. [準備資料](#2-準備資料)
3. [畫面介紹](#3-畫面介紹)
4. [操作 3D Cube](#4-操作-3d-cube)
5. [排序與 Proximity](#5-排序與-proximity)
6. [側邊選單功能](#6-側邊選單功能)
7. [切面檢視 (Section View)](#7-切面檢視-section-view)
8. [匯出結果](#8-匯出結果)
9. [常見問題](#9-常見問題)

---

## 1. 開啟系統

- **線上使用**：以瀏覽器開啟 <https://maokao.github.io/GAP3D>。
- **本機使用**：系統需透過網頁伺服器開啟，直接雙擊 `index.html` 會無法讀取資料。在專案資料夾中執行：

  ```bash
  python -m http.server 8000
  ```

  再以瀏覽器開啟 `http://localhost:8000/index.html`。

建議使用最新版 Chrome、Edge 或 Firefox。

---

## 2. 準備資料

### 資料格式

使用「長格式 (long format)」的 CSV 檔：每一列是一個 (X, Y, Z) 組合的觀測值。

| 欄位 | 說明 |
|---|---|
| X、Y、Z | 三個類別變數，各自的不重複值成為 cube 三個軸的類別 |
| Value | 數值變數，對應到小立方體的顏色 |

範例 (Air Pollution)：

```csv
State,Month,Pollutant,Concentration
Alabama,2024-01,CO,0.1842
Alabama,2024-02,CO,0.2347
...
```

此例中 X = State、Y = Month、Z = Pollutant、Value = Concentration。
沒有觀測值的 (X, Y, Z) 組合視為缺失值，以透明方式顯示。

### 載入資料

左側選單 **Select Data File**：

- **Example Data**：從下拉選單選擇內建範例資料 (Air Pollution、MLB)，選取後自動繪製。
- **Import Data**：按 **Choose Data** 匯入自己的 CSV 檔，並指定 X、Y、Z 與數值欄位。

---

## 3. 畫面介紹

| 區域 | 說明 |
|---|---|
| 上方工具列 | Order X / Y / Z 與 Flip 下拉選單，設定三個軸的排序 |
| 左側選單 | 資料、匯出、Proximity、篩選、顏色、切片、大小、字型、互動等設定 |
| 中央 | 3D cube 主畫面 |
| 右側 | 數值色階 (colorbar) |
| 浮動視窗 | Proximity 矩陣、長條圖、直方圖、切面矩陣圖等，可拖曳、縮放與最小化 |

---

## 4. 操作 3D Cube

| 操作 | 動作 |
|---|---|
| 旋轉 | 按住滑鼠左鍵拖曳 |
| 縮放 | 滑鼠滾輪 |
| 平移 | 在 **Interactive** 勾選 **Pan** 後拖曳 |
| 顯示數值 | 在 **Interactive** 勾選 **Show Data on Hover**，滑鼠移到小立方體上即顯示其 X、Y、Z 類別與數值 |
| 重設視角 | **Interactive** → **Reset Camera to Default** |
| 選取切面 | 雙擊小立方體 (見第 7 節) |

---

## 5. 排序與 Proximity

### Proximity

左側選單 **Proximity** 可分別計算 X、Y、Z 軸的 proximity matrix，結果以浮動視窗顯示：

- Distance：Euclidean Distance、City-Block (L1)
- Similarity：Pearson's Correlation、Kendall's tau、Spearman's Rank、atan Correlation、abs(Pearson's Correlation)

### 排序 (Order) 與 Flip

上方工具列 **Order X / Y / Z** 設定各軸類別的排列順序：

| 選項 | 說明 |
|---|---|
| Original Order | 資料中的原始順序 |
| Average / Single / Complete-Linkage | 階層式分群 (HCT) 的葉節點順序 |
| R2E | Rank-two Ellipse 排序 |
| Random | 隨機順序 |

Linkage 與 R2E 需先計算該軸的 proximity 才能選取。
使用 Linkage 排序時，可再以 **Flip** (None、R2E、Uncle、GrandPa) 調整樹狀圖分支的翻轉方式。

---

## 6. 側邊選單功能

| 選單 | 功能 |
|---|---|
| **Select Data File** | 選擇範例資料或匯入 CSV |
| **Export** | 匯出結果 (見第 8 節) |
| **Proximity** | 計算 X / Y / Z 軸的 proximity matrix |
| **Filter** | 依數值範圍，或在長條圖 / 直方圖上選取，篩選要顯示的小立方體；可選聯集 (Union) 或交集 (Intersection) |
| **Opacity** | 調整小立方體的透明度 |
| **Color** | 設定資料與 proximity 的色階、反轉色階；**Display Condition** 可選擇以整個 cube 或各軸 (Range: Col. X / Y / Z) 的範圍上色 |
| **Slices** | 沿 X / Y / Z 方向把 cube 切成多片並以 **Slices Gap** 拉開間距；下方的 **Section View** 用於切面檢視 |
| **Cube Size** | 調整小立方體在三個方向的邊長，或把小立方體分開 |
| **Font** | 調整軸標籤的字型大小 |
| **Interactive** | 平移、滑鼠懸停顯示資料、重設相機、重設 cube |

---

## 7. 切面檢視 (Section View)

切面檢視可選取 cube 任一方向、任一位置的切面，並在視窗中以 GAP 矩陣圖呈現，進一步計算該切面的 row / column proximity 與排序。

### 7.1 選取切面

在左側 **Slices** 選單下方的 **Section View**：

1. 從下拉選單選擇方向：
   - **X-Section**：固定一個 X 類別，顯示 Y × Z 矩陣
   - **Y-Section**：固定一個 Y 類別，顯示 X × Z 矩陣
   - **Z-Section**：固定一個 Z 類別，顯示 X × Y 矩陣
2. 拖曳 **slider** 或按 `‹` `›` 選擇位置，下方會顯示目前切面的類別名稱。
3. 勾選 **Highlight in cube**，可在 3D cube 上以紅框標示目前的切面 (預設不勾選)。

快速選取：

- 在 3D cube 上 **雙擊** 小立方體，會選取經過它的切面。
- **Shift + 雙擊** 會直接開啟該切面的視窗。
- 在 Slices 選擇 X / Y / Z-Slices 時，Section View 的方向會跟著切換。

### 7.2 開啟切面視窗

- **Open Section Window**：在頁面內開啟浮動視窗。可拖曳標題列移動、拖曳右下角調整大小，也可以同時開啟多個。
- **Open in Browser Window**：以獨立的瀏覽器視窗開啟，適合放到另一個螢幕。若沒有反應，請允許此網站開啟彈出視窗。

### 7.3 視窗按鈕

| 按鈕 | 功能 |
|---|---|
| 🔗 | 與 Section View 的 slider 連動 (預設開啟)。點一下變暗即鎖定在目前切面 |
| ⇄ | 轉置：行列互換，Row 與 Column 的設定一併交換 |
| ↻ | 依 cube 目前的狀態重新擷取切面 |
| ⤓ | 將目前畫面存成 PNG |
| ⧉ | 改以獨立瀏覽器視窗開啟，並帶著目前的設定 |
| – | 最小化 / 還原 |
| × | 關閉 |

> **比較兩個切面**：先開一個視窗並按 🔗 鎖定，再開第二個視窗並移動 slider，即可並排比較。

### 7.4 GAP 設定

視窗上方的控制面板，**Row** 與 **Column** 各有四個選單：

| 選單 | 選項 |
|---|---|
| **Proximity** | Distance：Euclidean Distance、City-Block (L1)<br>Similarity：Pearson's Correlation、Kendall's tau、Spearman's Rank、atan Correlation、abs(Pearson's Correlation)、Uncentered Correlation、abs(Uncentered Correlation) |
| **Order** | **Order from Cube** (預設，與 3D cube 目前的排列相同)、Original Order、Average / Single / Complete-Linkage、R2E、Random |
| **Flip** | None、R2E、Uncle、GrandPa (僅在 Linkage 排序時可用) |
| **Color** | proximity 矩陣的色階。距離預設 **GAP_Rainbow**，相似度預設 **GAP_Blue_White_Red**；另有多種 Sequential / Diverging 色階 |

操作步驟：

1. 先選 **Proximity**，畫面會出現對應的 proximity 矩陣。
2. 再選 **Order**。Linkage 與 R2E 需先選好 Proximity 才能使用。
3. 使用 Linkage 排序時，會畫出樹狀圖，並可選 **Flip**。
4. 在 **Color** 選擇色階；點右側的色條可反轉顏色。

### 7.5 矩陣圖配置

```
                    Column 軸名稱
          ┌───────────────┐
          │ Column        │  column    Column
          │ proximity     │  名稱      樹狀圖
          └───────────────┘
  row     ┌───────────────┐  ┌───────────┐
  名稱    │   資料矩陣     │  │ Row       │  Row
          │               │  │ proximity │  樹狀圖
          └───────────────┘  └───────────┘
  切面摘要、proximity 色階圖例
```

- 未選 Column proximity 時，column 名稱直立顯示在資料矩陣上方。
- 滑鼠移到資料格子上，會顯示該格的類別與數值；移到 proximity 格子上，會顯示兩個類別與 proximity 值。
- 被 Filter 篩掉或沒有數值的格子以淺灰色顯示。
- 色階的對應範圍：相似度固定為 -1 到 1，距離為實際的最小值到最大值。

### 7.6 縮放矩陣圖

| 操作 | 動作 |
|---|---|
| 縮放 | 滑鼠滾輪 (以游標位置為中心，100%–3000%) |
| 平移 | 放大後按住左鍵拖曳 |
| 工具列 | 右上角 `−` 縮小、`+` 放大、`⤢` 回到原大小 |
| 重設 | 雙擊矩陣圖 |

格子太小時類別名稱會自動隱藏；放大或把視窗拉大後就會出現。

### 7.7 自動更新

- **切換切面**：移動 slider、按 `‹` `›` 或切換方向時，連動中 (🔗) 的視窗會改顯示新的切面。
- **cube 重新排序**：改變 Order、Flip 或 Display Condition 時，所有視窗都會自動更新，並持續顯示**同一個類別**的切面，即使它在 cube 中的位置改變了。
- 換切面或換色階時，矩陣圖的縮放狀態會保留。

### 7.8 缺失值

切面中有缺失值時，proximity 以 **pairwise-complete** 方式計算：兩列 (或兩欄) 之間只使用兩者皆有值的欄位，距離會依可用欄位數放大以便比較。整列缺失或變異數為 0 而無法計算時，相似度以 0、距離以最大值代替。

---

## 8. 匯出結果

| 匯出方式 | 內容 |
|---|---|
| **Export → Cube** | 3D cube 畫面 |
| **Export → Proximity** | Proximity matrix 資料 |
| **Export → Proximity Images** | Proximity 矩陣圖片 |
| **Export → Charts** | 長條圖與直方圖 |
| 切面視窗 **⤓** | 切面矩陣圖 (目前畫面，含縮放狀態) 的 PNG |

---

## 9. 常見問題

**Q：開啟後看不到資料？**
請確認是透過網頁伺服器 (例如 `http://localhost:8000`) 開啟，而不是直接雙擊 `index.html`。

**Q：Order 選單中的 Linkage、R2E 無法選取？**
需先在 **Proximity** 計算該軸的 proximity matrix。切面視窗中則需先選擇該列 / 欄的 Proximity。

**Q：Open in Browser Window 沒有反應？**
瀏覽器封鎖了彈出視窗，請在網址列允許此網站開啟彈出視窗。

**Q：切面矩陣圖看不到類別名稱？**
格子太小時名稱會自動隱藏，請放大矩陣圖或把視窗拉大。

**Q：想固定某個切面不隨 slider 改變？**
按視窗標題列的 🔗 將它鎖定。

---

## 致謝

Lab for Information Visualization
Institute of Statistical Science, Academia Sinica
Department of Statistics, Tamkang University

Web Design by Shu-Yu Lin, Chiun-How Kao
