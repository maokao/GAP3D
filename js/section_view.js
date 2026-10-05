// =====================================================================
// GAP3D - Section View (任一切面選擇 + 另開視窗顯示)
// ---------------------------------------------------------------------
// 讓使用者選擇 cube 在 X / Y / Z 方向上的任一切面 (slice)，
// 在 3D 場景中以紅框標示，並可將該切面以 2D 矩陣 (heatmap) 的方式
//   (1) 開在頁面內的浮動視窗 (可拖曳、縮放、轉置、匯出 PNG)，或
//   (2) 開在獨立的瀏覽器視窗。
// 切面內容直接取自目前 3D cube 的狀態 (排序、顏色、篩選後的透明度)，
// 因此與畫面上看到的 cube 一致。
//
// 使用方式 (於 index.html 的 module script 中)：
//   import { initSectionView } from './js/section_view.js';
//   initSectionView({ THREE, scene, renderer, getCamera: () => camera, startDrag });
// =====================================================================

import { computeGap, makeProxScale, treeLayout, buildGapPanel, defaultGapSettings, cloneGapSettings } from './section_gap.js';

export function initSectionView(ctx) {
    const { THREE, scene, renderer, getCamera, startDrag } = ctx;

    // 切面平面上的 (列軸, 欄軸)
    const PLANE = { X: ['Y', 'Z'], Y: ['X', 'Z'], Z: ['X', 'Y'] };

    const state = { axis: 'X', index: 0 };
    let windowCount = 0;

    const $id = (id) => document.getElementById(id);
    const axisSel = $id('sectionAxis');
    const idxRange = $id('sectionIndex');
    const idxLabel = $id('sectionIndexLabel');
    const hlChk = $id('sectionHighlight');
    const openBtn = $id('openSectionWindow');
    const popBtn = $id('openSectionPopup');
    const prevBtn = $id('sectionPrev');
    const nextBtn = $id('sectionNext');
    if (!axisSel || !idxRange) return; // 找不到 UI 則不啟用

    // ------------------------------------------------------------------
    // 讀取全域資料 (index.html 以 var 宣告於一般 script，故掛在 window 上)
    // ------------------------------------------------------------------
    const dims = () => ({ X: window.numX || 0, Y: window.numY || 0, Z: window.numZ || 0 });
    const ready = () => !!window.isDataLoaded && Array.isArray(window.cubes) && window.cubes.length > 0 && (window.numX || 0) > 0;
    const orderOf = (a) => (a === 'X' ? window.Xindices : a === 'Y' ? window.Yindices : window.Zindices);
    const uniqOf = (a) => (a === 'X' ? window.uniqueX : a === 'Y' ? window.uniqueY : window.uniqueZ) || [];
    const fieldOf = (a) => (a === 'X' ? window.fieldX : a === 'Y' ? window.fieldY : window.fieldZ) || (a + '-axis');

    // 目前顯示位置 pos 上的類別標籤 (考慮排序後的 indices)
    function labelAt(axis, pos) {
        const n = dims()[axis];
        const order = orderOf(axis);
        const src = (Array.isArray(order) && order.length === n) ? order[pos] : pos;
        const v = uniqOf(axis)[src];
        return (v === undefined || v === null) ? String(pos + 1) : String(v);
    }

    // 顯示位置 pos 對應的原始類別 index
    function srcIndexAt(axis, pos) {
        const order = orderOf(axis);
        return (Array.isArray(order) && order.length === dims()[axis]) ? order[pos] : pos;
    }
    // 原始類別 index 目前排在哪個顯示位置
    function posOfSrc(axis, src) {
        const order = orderOf(axis);
        if (!Array.isArray(order) || order.length !== dims()[axis]) return src;
        const p = order.indexOf(src);
        return p >= 0 ? p : src;
    }

    function cubeAt(idx) {
        const a = window.cubes[idx.X];
        const b = a && a[idx.Y];
        return b ? b[idx.Z] : null;
    }

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // ------------------------------------------------------------------
    // 擷取切面資料
    // ------------------------------------------------------------------
    function extractSection(axis, index) {
        const [rA, cA] = PLANE[axis];
        const d = dims();
        const nR = d[rA], nC = d[cA];
        const cells = new Array(nR);
        let vmin = Infinity, vmax = -Infinity, shown = 0;

        for (let r = 0; r < nR; r++) {
            cells[r] = new Array(nC);
            for (let c = 0; c < nC; c++) {
                const idx = {};
                idx[axis] = index; idx[rA] = r; idx[cA] = c;
                const cube = cubeAt(idx);
                let cell = { visible: false, color: null, value: null, tip: '' };
                if (cube && cube.material) {
                    const v = cube.userData ? cube.userData.value : null;
                    const hasValue = v !== null && v !== undefined && !(typeof v === 'number' && Number.isNaN(v));
                    const visible = hasValue && cube.visible !== false && cube.material.opacity > 0;
                    cell = {
                        visible,
                        color: '#' + cube.material.color.getHexString(),
                        value: hasValue ? v : null,
                        tip: (cube.userData && cube.userData.tooltipText) || ''
                    };
                    if (visible) {
                        shown++;
                        if (typeof v === 'number') { vmin = Math.min(vmin, v); vmax = Math.max(vmax, v); }
                    }
                }
                cells[r][c] = cell;
            }
        }

        return {
            axis, index,
            srcIndex: srcIndexAt(axis, index),
            sliceField: fieldOf(axis),
            sliceLabel: labelAt(axis, index),
            rowAxis: rA, colAxis: cA,
            rowField: fieldOf(rA), colField: fieldOf(cA),
            rowLabels: Array.from({ length: nR }, (_, r) => labelAt(rA, r)),
            colLabels: Array.from({ length: nC }, (_, c) => labelAt(cA, c)),
            rowSrc: Array.from({ length: nR }, (_, r) => srcIndexAt(rA, r)),
            colSrc: Array.from({ length: nC }, (_, c) => srcIndexAt(cA, c)),
            cells, shown, vmin, vmax,
            transposed: false
        };
    }

    function transposeSection(s) {
        const nR = s.rowLabels.length, nC = s.colLabels.length;
        const cells = Array.from({ length: nC }, (_, c) => Array.from({ length: nR }, (_, r) => s.cells[r][c]));
        return Object.assign({}, s, {
            rowAxis: s.colAxis, colAxis: s.rowAxis,
            rowField: s.colField, colField: s.rowField,
            rowLabels: s.colLabels, colLabels: s.rowLabels,
            rowSrc: s.colSrc, colSrc: s.rowSrc,
            cells, transposed: !s.transposed
        });
    }

    const sectionTitle = (s) => `${s.axis}-Section: ${s.sliceField} = ${s.sliceLabel}`;
    const fmt = (v) => (typeof v === 'number' ? (Math.abs(v) >= 1000 || Number.isInteger(v) ? String(+v.toFixed(2)) : v.toFixed(3)) : String(v));

    // ------------------------------------------------------------------
    // 以 canvas 繪製切面矩陣 (含 GAP：proximity 矩陣與樹狀圖)
    //   gr: computeGap() 的結果 (可為 null)
    // ------------------------------------------------------------------
    //   vt: 縮放 / 平移 { k, tx, ty }。以 k 倍大的虛擬畫布重新排版 (格子變大後標籤會出現)，再平移到可視範圍
    function drawSection(canvas, s, gr, W, H, dpr, vt) {
        const nR = s.rowLabels.length, nC = s.colLabels.length;
        const g = canvas.getContext('2d');
        canvas.width = Math.max(1, Math.round(W * dpr));
        canvas.height = Math.max(1, Math.round(H * dpr));
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.fillStyle = '#ffffff';
        g.fillRect(0, 0, W, H);
        if (!nR || !nC) return null;
        const zk = vt ? vt.k : 1;
        if (vt) g.setTransform(dpr, 0, 0, dpr, dpr * vt.tx, dpr * vt.ty);
        W *= zk; H *= zk;

        const rowOrder = gr ? gr.row.order : [...Array(nR).keys()];
        const colOrder = gr ? gr.col.order : [...Array(nC).keys()];
        const rowLabels = rowOrder.map((i) => s.rowLabels[i]);
        const colLabels = colOrder.map((j) => s.colLabels[j]);
        const rp = !!(gr && gr.row.prox), cp = !!(gr && gr.col.prox);
        const rt = !!(gr && gr.row.tree), ct = !!(gr && gr.col.tree);

        const FONT = (px, bold) => `${bold ? '600 ' : ''}${px}px "Encode Sans", Arial, sans-serif`;
        const pad = 10, titleSpace = 18, gapPx = 6, treeSize = 48;
        const footH = (rp || cp) ? 40 : 20;
        g.font = FONT(11);
        const maxW = (arr) => arr.reduce((m, t) => Math.max(m, g.measureText(t).width), 0);

        let rowLW = Math.min(150, maxW(rowLabels)) + 6;
        // 有 column proximity 矩陣時，column 名稱橫放在該矩陣右側 (矩陣與樹狀圖之間)；否則直立放在資料矩陣上方
        let colLH = cp ? 0 : Math.min(150, maxW(colLabels)) + 6;
        let colLabW = cp ? Math.min(150, maxW(colLabels)) + 6 : 0;
        let left, top, extraW;
        const extraH = (cp ? gapPx : 0);

        const fit = () => {
            // 右側空間：row proximity / row 樹狀圖 與 column 名稱 / column 樹狀圖 共用
            extraW = Math.max((rp ? gapPx : 0) + (rt ? gapPx + treeSize : 0),
                cp ? gapPx + colLabW + (ct ? gapPx + treeSize : 0) : 0);
            left = pad + titleSpace + rowLW;
            top = pad + titleSpace + colLH;
            const aw = W - left - pad - extraW, ah = H - top - pad - footH - extraH;
            if (rp || cp) {
                // 有 proximity 矩陣時使用正方形格子
                const sz = Math.min(aw / (nC + (rp ? nR : 0)), ah / (nR + (cp ? nC : 0)), 40 * zk);
                return [Math.max(1, sz), Math.max(1, sz)];
            }
            // 否則格子寬高各自填滿視窗 (長寬比 1:3 ~ 3:1，最大 60px)
            let w = aw / nC, h = ah / nR;
            w = Math.min(w, 60 * zk, h * 3); h = Math.min(h, 60 * zk, w * 3);
            return [Math.max(1, w), Math.max(1, h)];
        };
        let [cw, ch] = fit();
        // 格子太小時不畫類別標籤，把空間留給矩陣
        const showRowLabels = ch >= 7, showColLabels = cw >= 7;
        if (!showRowLabels || !showColLabels) {
            if (!showRowLabels) rowLW = 0;
            if (!showColLabels) { colLH = 0; colLabW = 0; }
            [cw, ch] = fit();
        }
        // 由上而下：軸名稱 → column proximity 矩陣 (右側：column 名稱、樹狀圖) → 資料矩陣
        const colProxY = pad + titleSpace;
        const x0 = left;
        const y0 = top + (cp ? nC * cw + gapPx : 0);
        const mw = cw * nC, mh = ch * nR;
        const L = { x0, y0, cw, ch, nR, nC, rowOrder, colOrder };

        const grid = (x, y, nx, ny, w, h) => {
            if (w < 10 || h < 10) return;
            g.strokeStyle = 'rgba(255,255,255,0.7)';
            g.lineWidth = 0.6;
            g.beginPath();
            for (let r = 1; r < ny; r++) { g.moveTo(x, y + r * h); g.lineTo(x + nx * w, y + r * h); }
            for (let c = 1; c < nx; c++) { g.moveTo(x + c * w, y); g.lineTo(x + c * w, y + ny * h); }
            g.stroke();
        };
        const frame = (x, y, w, h) => {
            g.strokeStyle = '#9e9e9e';
            g.lineWidth = 1;
            g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        };

        // 資料矩陣
        for (let r = 0; r < nR; r++) {
            const row = s.cells[rowOrder[r]];
            for (let c = 0; c < nC; c++) {
                const cl = row[colOrder[c]];
                g.fillStyle = cl.visible ? cl.color : '#f3f3f3';
                g.fillRect(x0 + c * cw, y0 + r * ch, Math.ceil(cw), Math.ceil(ch));
            }
        }
        grid(x0, y0, nC, nR, cw, ch);
        frame(x0, y0, mw, mh);

        // Row proximity 矩陣 (資料矩陣右側)
        let rightEdge = x0 + mw;
        if (rp) {
            const P = gr.row.prox, xr = x0 + mw + gapPx;
            for (let a = 0; a < nR; a++) for (let b = 0; b < nR; b++) {
                g.fillStyle = gr.row.scale.color(P[rowOrder[a] * nR + rowOrder[b]]);
                g.fillRect(xr + b * ch, y0 + a * ch, Math.ceil(ch), Math.ceil(ch));
            }
            grid(xr, y0, nR, nR, ch, ch);
            frame(xr, y0, nR * ch, nR * ch);
            L.rowProx = { x: xr, y: y0, size: ch, n: nR };
            rightEdge = xr + nR * ch;
        }
        // Column proximity 矩陣 (資料矩陣上方)
        let bottomEdge = y0 + mh;
        if (cp) {
            const P = gr.col.prox, yc = colProxY;
            for (let a = 0; a < nC; a++) for (let b = 0; b < nC; b++) {
                g.fillStyle = gr.col.scale.color(P[colOrder[a] * nC + colOrder[b]]);
                g.fillRect(x0 + b * cw, yc + a * cw, Math.ceil(cw), Math.ceil(cw));
            }
            grid(x0, yc, nC, nC, cw, cw);
            frame(x0, yc, nC * cw, nC * cw);
            L.colProx = { x: x0, y: yc, size: cw, n: nC };
        }

        // 樹狀圖 (HCT linkage)
        g.strokeStyle = '#555';
        g.lineWidth = 1;
        if (rt) {
            const T = treeLayout(gr.row.tree, rowOrder);
            const xt = rightEdge + gapPx;
            const X = (h) => xt + (T.maxH > 0 ? h / T.maxH : 0) * treeSize;
            const Y = (p) => y0 + (p + 0.5) * ch;
            g.beginPath();
            for (let t = 0; t < T.n - 1; t++) {
                const node = T.n + t, a = gr.row.tree.left[t], b = gr.row.tree.right[t];
                g.moveTo(X(T.hgt[a]), Y(T.pos[a])); g.lineTo(X(T.hgt[node]), Y(T.pos[a]));
                g.lineTo(X(T.hgt[node]), Y(T.pos[b])); g.lineTo(X(T.hgt[b]), Y(T.pos[b]));
            }
            g.stroke();
        }
        if (ct) {
            const T = treeLayout(gr.col.tree, colOrder);
            // 樹狀圖在 column proximity 矩陣右側，葉節點對齊矩陣的列，根部朝右
            const xt = x0 + nC * cw + colLabW + gapPx;
            const X = (h) => xt + (T.maxH > 0 ? h / T.maxH : 0) * treeSize;
            const Y = (p) => colProxY + (p + 0.5) * cw;
            g.beginPath();
            for (let t = 0; t < T.n - 1; t++) {
                const node = T.n + t, a = gr.col.tree.left[t], b = gr.col.tree.right[t];
                g.moveTo(X(T.hgt[a]), Y(T.pos[a])); g.lineTo(X(T.hgt[node]), Y(T.pos[a]));
                g.lineTo(X(T.hgt[node]), Y(T.pos[b])); g.lineTo(X(T.hgt[b]), Y(T.pos[b]));
            }
            g.stroke();
        }

        // 類別標籤
        const clip = (t, maxPx) => {
            if (g.measureText(t).width <= maxPx) return t;
            let lo = 0, hi = t.length;
            while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (g.measureText(t.slice(0, mid) + '…').width <= maxPx) lo = mid; else hi = mid - 1; }
            return t.slice(0, lo) + '…';
        };
        g.fillStyle = '#333';
        g.textBaseline = 'middle';
        if (showRowLabels) {
            g.font = FONT(Math.max(7, Math.min(11, Math.floor(ch - 1))));
            g.textAlign = 'right';
            for (let r = 0; r < nR; r++) g.fillText(clip(rowLabels[r], rowLW - 6), x0 - 4, y0 + (r + 0.5) * ch);
        }
        if (showColLabels && cp) {
            // column proximity 矩陣右側 (橫向)
            g.font = FONT(Math.max(7, Math.min(11, Math.floor(cw - 1))));
            g.textAlign = 'left';
            for (let c = 0; c < nC; c++) g.fillText(clip(colLabels[c], colLabW - 6), x0 + nC * cw + 4, colProxY + (c + 0.5) * cw);
        } else if (showColLabels) {
            g.font = FONT(Math.max(7, Math.min(11, Math.floor(cw - 1))));
            g.textAlign = 'left';
            for (let c = 0; c < nC; c++) {
                g.save();
                g.translate(x0 + (c + 0.5) * cw, y0 - 4);
                g.rotate(-Math.PI / 2);
                g.fillText(clip(colLabels[c], colLH - 6), 0, 0);
                g.restore();
            }
        }

        // 軸名稱
        g.font = FONT(12, true);
        g.fillStyle = '#4a4a4a';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(clip(`${s.colField}  (${s.colAxis})  →`, Math.max(40, mw + rowLW)), x0 + mw / 2, pad + titleSpace / 2);
        g.save();
        g.translate(pad + titleSpace / 2, y0 + mh / 2);
        g.rotate(-Math.PI / 2);
        g.fillText(clip(`←  ${s.rowField}  (${s.rowAxis})`, Math.max(40, mh + colLH)), 0, 0);
        g.restore();

        // 頁尾摘要
        g.font = FONT(11);
        g.fillStyle = '#777';
        g.textAlign = 'left';
        const range = s.shown > 0 && isFinite(s.vmin) ? `  ·  range ${fmt(s.vmin)} – ${fmt(s.vmax)}` : '';
        const fy = Math.min(H - (footH - 13), bottomEdge + 13);
        g.fillText(`${nR} × ${nC}  ·  ${s.shown} visible cells${range}`, x0, fy);
        // proximity 色階圖例
        if (rp || cp) {
            let lx = x0;
            const ly = fy + 18, barW = 90, barH = 9;
            for (const [side, name] of [[gr.row, 'Row'], [gr.col, 'Col']]) {
                if (!side.prox) continue;
                const sc = side.scale;
                g.fillStyle = '#555';
                g.textAlign = 'left';
                const label = `${name}: ${side.info[1]}`;
                g.fillText(label, lx, ly);
                lx += g.measureText(label).width + 8;
                g.fillText(fmt(sc.min), lx, ly);
                lx += g.measureText(fmt(sc.min)).width + 4;
                for (let i = 0; i < barW; i++) {
                    g.fillStyle = sc.color(sc.min + (sc.max - sc.min) * (i + 0.5) / barW);
                    g.fillRect(lx + i, ly - barH / 2, 1.5, barH);
                }
                g.strokeStyle = '#bbb';
                g.lineWidth = 0.5;
                g.strokeRect(lx + 0.25, ly - barH / 2 + 0.25, barW - 0.5, barH - 0.5);
                lx += barW + 4;
                g.fillStyle = '#555';
                g.fillText(fmt(sc.max), lx, ly);
                lx += g.measureText(fmt(sc.max)).width + 20;
            }
        }
        return L;
    }

    // 把切面掛到某個容器 (可在本頁或另一個瀏覽器視窗)；gs = GAP 設定
    function mountView(container, sec, win, gs) {
        const doc = container.ownerDocument;
        const canvas = doc.createElement('canvas');
        canvas.className = 'section-canvas';
        const tip = doc.createElement('div');
        tip.className = 'section-tooltip';
        const msg = doc.createElement('div');
        msg.className = 'section-gap-msg';
        container.appendChild(canvas);
        container.appendChild(tip);
        container.appendChild(msg);

        let cur = sec;
        let layout = null;
        const vt = { k: 1, tx: 0, ty: 0 }; // 縮放與平移狀態
        const ZMIN = 1, ZMAX = 30;
        let gr = null, grKey = null, grSec = null;

        function gapResult() {
            const key = JSON.stringify([gs.row.prox, gs.row.order, gs.row.flip, gs.col.prox, gs.col.order, gs.col.flip]);
            if (grSec === cur && grKey === key) return gr;
            try {
                gr = computeGap(cur, gs);
                msg.style.display = 'none';
            } catch (err) {
                console.error(err);
                gr = null;
                msg.textContent = 'GAP computation failed: ' + err.message;
                msg.style.display = 'block';
            }
            grKey = key; grSec = cur;
            return gr;
        }

        function draw() {
            const W = container.clientWidth, H = container.clientHeight;
            if (W < 20 || H < 20) return;
            const r = gapResult();
            if (r) {
                // 色階只影響繪製，不需重新計算 proximity / order
                if (r.row.prox) r.row.scale = makeProxScale(r.row, gs.row);
                if (r.col.prox) r.col.scale = makeProxScale(r.col, gs.col);
            }
            clampPan(W, H);
            layout = drawSection(canvas, cur, r, W, H, win.devicePixelRatio || 1, vt);
            zoomLabel.textContent = Math.round(vt.k * 100) + '%';
            canvas.style.cursor = vt.k > 1 ? (dragging ? 'grabbing' : 'grab') : 'default';
        }

        // ---------------- 縮放 / 平移 ----------------
        function clampPan(W, H) {
            vt.tx = Math.min(0, Math.max(W - W * vt.k, vt.tx));
            vt.ty = Math.min(0, Math.max(H - H * vt.k, vt.ty));
        }
        // 以畫面上的 (px, py) 為中心縮放
        function zoomAt(px, py, factor) {
            const k2 = Math.max(ZMIN, Math.min(ZMAX, vt.k * factor));
            const r = k2 / vt.k;
            vt.tx = px - (px - vt.tx) * r;
            vt.ty = py - (py - vt.ty) * r;
            vt.k = k2;
            draw();
        }
        function resetZoom() { vt.k = 1; vt.tx = 0; vt.ty = 0; draw(); }

        const zoomBar = doc.createElement('div');
        zoomBar.className = 'section-zoom';
        const zbtn = (text, title, fn) => {
            const b = doc.createElement('button');
            b.type = 'button';
            b.textContent = text;
            b.title = title;
            b.addEventListener('mousedown', (e) => e.stopPropagation());
            b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
            zoomBar.appendChild(b);
            return b;
        };
        zbtn('−', 'Zoom out', () => zoomAt(container.clientWidth / 2, container.clientHeight / 2, 1 / 1.25));
        const zoomLabel = doc.createElement('span');
        zoomLabel.className = 'section-zoom-label';
        zoomLabel.title = 'Double-click the matrix to reset';
        zoomBar.appendChild(zoomLabel);
        zbtn('+', 'Zoom in', () => zoomAt(container.clientWidth / 2, container.clientHeight / 2, 1.25));
        zbtn('⤢', 'Fit to window (reset zoom)', resetZoom);
        container.appendChild(zoomBar);

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0015));
        }, { passive: false });
        canvas.addEventListener('dblclick', resetZoom);

        let dragging = false, dragX = 0, dragY = 0;
        canvas.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || vt.k <= 1) return;
            e.preventDefault();
            e.stopPropagation();
            dragging = true; dragX = e.clientX; dragY = e.clientY;
            tip.style.display = 'none';
            canvas.style.cursor = 'grabbing';
        });
        win.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            vt.tx += e.clientX - dragX; vt.ty += e.clientY - dragY;
            dragX = e.clientX; dragY = e.clientY;
            draw();
        });
        win.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            draw();
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!layout || dragging) return;
            const rect = canvas.getBoundingClientRect();
            const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
            const x = sx - vt.tx, y = sy - vt.ty; // 轉成虛擬畫布座標
            let html = null;
            const c = Math.floor((x - layout.x0) / layout.cw);
            const r = Math.floor((y - layout.y0) / layout.ch);
            if (r >= 0 && c >= 0 && r < layout.nR && c < layout.nC) {
                const ri = layout.rowOrder[r], ci = layout.colOrder[c];
                const cl = cur.cells[ri][ci];
                html = cl.tip ||
                    `${esc(cur.rowField)}：${esc(cur.rowLabels[ri])}<br>${esc(cur.colField)}：${esc(cur.colLabels[ci])}<br>(no value)`;
                if (cl.tip && !cl.visible) html += '<br><i>(hidden / filtered in cube)</i>';
            }
            const proxTip = (P, side, labels, order, field) => {
                const a = Math.floor((y - P.y) / P.size), b = Math.floor((x - P.x) / P.size);
                if (a < 0 || b < 0 || a >= P.n || b >= P.n) return null;
                const ia = order[a], ib = order[b];
                return `${esc(field)}：${esc(labels[ia])}<br>${esc(field)}：${esc(labels[ib])}<br>${esc(side.info[1])}：${fmt(side.prox[ia * P.n + ib])}`;
            };
            if (!html && layout.rowProx && gr) html = proxTip(layout.rowProx, gr.row, cur.rowLabels, layout.rowOrder, cur.rowField);
            if (!html && layout.colProx && gr) html = proxTip(layout.colProx, gr.col, cur.colLabels, layout.colOrder, cur.colField);
            if (!html) { tip.style.display = 'none'; return; }
            tip.innerHTML = html;
            tip.style.display = 'block';
            const cw = container.clientWidth, chh = container.clientHeight;
            let tx = sx + 14, ty = sy + 14;
            if (tx + tip.offsetWidth > cw) tx = Math.max(0, sx - tip.offsetWidth - 10);
            if (ty + tip.offsetHeight > chh) ty = Math.max(0, sy - tip.offsetHeight - 10);
            tip.style.left = tx + 'px';
            tip.style.top = ty + 'px';
        });
        canvas.addEventListener('mouseleave', () => { tip.style.display = 'none'; });

        if (win === window && 'ResizeObserver' in window) {
            new ResizeObserver(draw).observe(container);
        } else {
            win.addEventListener('resize', draw);
        }
        draw();
        win.setTimeout(draw, 60);

        return {
            canvas,
            gs,
            redraw: draw,
            get section() { return cur; },
            set section(s) { cur = s; draw(); },   // 換切面時保留縮放
            resetZoom,
            // 轉置：切面與 row / column 的 GAP 設定一起交換
            transpose() {
                const t = gs.row; gs.row = gs.col; gs.col = t;
                cur = transposeSection(cur);
                draw();
            }
        };
    }

    function savePNG(view, doc) {
        const s = view.section;
        const a = doc.createElement('a');
        a.href = view.canvas.toDataURL('image/png');
        a.download = `section_${s.axis}_${String(s.sliceLabel).replace(/[\\/:*?"<>|\s]+/g, '_')}.png`;
        doc.body.appendChild(a);
        a.click();
        a.remove();
    }

    // 依目前 cube 狀態重新擷取 (保留轉置狀態)
    // 已開啟的切面視窗 (排序改變時自動更新)
    const openViews = new Set();
    function registerView(view, isAlive, onUpdate) {
        const entry = { view, isAlive, onUpdate, linked: true }; // 預設與側欄 slider 連動
        openViews.add(entry);
        return entry;
    }
    // 側欄 (軸向 / slider) 改變 → 已連動的視窗改顯示目前選取的切面
    function syncLinkedViews() {
        if (!ready()) return;
        for (const v of openViews) {
            if (!v.isAlive()) { openViews.delete(v); continue; }
            if (!v.linked) continue;
            const old = v.view.section;
            if (old.axis === state.axis && old.index === state.index) continue;
            let fresh = extractSection(state.axis, state.index);
            if (old.transposed) fresh = transposeSection(fresh);
            v.view.section = fresh;
            if (v.onUpdate) v.onUpdate(fresh);
        }
    }
    function refreshAllViews() {
        for (const v of openViews) {
            if (!v.isAlive()) { openViews.delete(v); continue; }
            v.view.section = reExtract(v.view.section);
            if (v.onUpdate) v.onUpdate(v.view.section);
        }
    }

    function reExtract(s) {
        if (!ready()) return s;
        const d = dims();
        const pos = (s.srcIndex !== undefined) ? posOfSrc(s.axis, s.srcIndex) : s.index;
        if (pos >= d[s.axis]) return s;
        let fresh = extractSection(s.axis, pos);
        if (s.transposed) fresh = transposeSection(fresh);
        return fresh;
    }

    // ------------------------------------------------------------------
    // (1) 頁面內浮動視窗
    // ------------------------------------------------------------------
    function openFloatingWindow(sec, gsInit) {
        const gs = gsInit ? cloneGapSettings(gsInit) : defaultGapSettings();
        windowCount++;
        const id = 'sectionWindow' + windowCount;
        const fw = document.createElement('div');
        fw.className = 'floating-window section-window';
        fw.id = id;
        const offset = (windowCount - 1) % 8;
        fw.style.left = (280 + offset * 28) + 'px';
        fw.style.top = (90 + offset * 28) + 'px';
        fw.style.width = '640px';
        fw.style.height = '620px';
        fw.style.display = 'flex';
        fw.style.zIndex = ++window.highestZIndex;

        const header = document.createElement('div');
        header.className = 'window-header section-window-header';
        const title = document.createElement('span');
        title.className = 'section-window-title';
        title.textContent = sectionTitle(sec);
        title.title = sectionTitle(sec);
        header.appendChild(title);

        const btns = document.createElement('span');
        btns.className = 'section-window-btns';
        header.appendChild(btns);

        const body = document.createElement('div');
        body.className = 'section-body';

        let view = null;
        const panel = buildGapPanel(document, gs, () => view && view.redraw());

        fw.appendChild(header);
        fw.appendChild(panel.el);
        fw.appendChild(body);
        $id('floatingWindowContainer').appendChild(fw);

        view = mountView(body, sec, window, gs);
        const entry = registerView(view, () => fw.isConnected, (s) => { title.textContent = title.title = sectionTitle(s); });

        const addBtn = (text, tipText, fn) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'section-btn';
            b.textContent = text;
            b.title = tipText;
            b.addEventListener('mousedown', (e) => e.stopPropagation());
            b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
            btns.appendChild(b);
            return b;
        };
        const linkBtn = addBtn('🔗', '', () => setLinked(!entry.linked));
        const setLinked = (on) => {
            entry.linked = on;
            linkBtn.classList.toggle('active', on);
            linkBtn.title = on ? 'Linked to Section View slider (click to lock this section)'
                               : 'Locked (click to link with Section View slider)';
            if (on) syncLinkedViews();
        };
        setLinked(true);
        addBtn('⇄', 'Transpose (swap rows / columns)', () => { view.transpose(); panel.sync(); });
        addBtn('↻', 'Refresh from current cube (colors / order / filters)', () => {
            view.section = reExtract(view.section);
            title.textContent = title.title = sectionTitle(view.section);
        });
        addBtn('⤓', 'Save as PNG', () => savePNG(view, document));
        addBtn('⧉', 'Open in a new browser window', () => openBrowserWindow(view.section, gs));
        const minBtn = addBtn('–', 'Minimize / restore', () => {
            if (fw.classList.contains('minimized')) {
                fw.style.height = fw.dataset.originalHeight || '620px';
                body.style.display = '';
                panel.el.style.display = '';
                fw.classList.remove('minimized');
                minBtn.textContent = '–';
            } else {
                fw.dataset.originalHeight = fw.style.height;
                body.style.display = 'none';
                panel.el.style.display = 'none';
                fw.style.height = header.offsetHeight + 'px';
                fw.classList.add('minimized');
                minBtn.textContent = '+';
            }
        });
        addBtn('×', 'Close', () => fw.remove());

        header.addEventListener('mousedown', (e) => startDrag(e, id));
        fw.addEventListener('mousedown', () => { fw.style.zIndex = ++window.highestZIndex; });
        return fw;
    }

    // ------------------------------------------------------------------
    // (2) 獨立瀏覽器視窗
    // ------------------------------------------------------------------
    const POPUP_CSS = `
        html,body{margin:0;height:100%;font-family:"Encode Sans",Arial,sans-serif;background:#fff;color:#333}
        body{display:flex;flex-direction:column}
        .bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:#f5f5f5;border-bottom:1px solid #e3e3e3}
        .bar .t{flex:1;font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .bar button{border:1px solid #ced4da;background:#fff;border-radius:5px;padding:4px 10px;cursor:pointer;font-size:13px}
        .bar button:hover{background:#f3f5ff}
        .bar button.active{background:#e3e9ff;border-color:#85a3f5;color:#2a4ab5}
        .section-body{position:relative;flex:1;min-height:0;overflow:hidden}
        .section-canvas{display:block}
        .section-tooltip{position:absolute;display:none;pointer-events:none;background:rgba(255,255,255,.96);border:1px solid #ccc;
            border-radius:4px;padding:5px 8px;font-size:12px;line-height:1.45;box-shadow:0 2px 6px rgba(0,0,0,.15);white-space:nowrap;z-index:5}`;

    function openBrowserWindow(sec, gsInit) {
        const gs = gsInit ? cloneGapSettings(gsInit) : defaultGapSettings();
        const w = window.open('', '_blank', 'width=900,height=860,resizable=yes');
        if (!w) {
            alert('瀏覽器封鎖了彈出視窗，請允許此網站開啟彈出視窗後再試一次。\nPop-up blocked: please allow pop-ups for this site.');
            return null;
        }
        w.document.open();
        w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(sectionTitle(sec))}</title>
            <style>${POPUP_CSS}</style></head><body>
            <div class="bar"><span class="t"></span>
              <button data-a="l" class="active" title="Linked to Section View slider (click to lock)">🔗 Linked</button>
              <button data-a="t" title="Swap rows / columns">⇄ Transpose</button>
              <button data-a="r" title="Refresh from current cube">↻ Refresh</button>
              <button data-a="p" title="Save as PNG">⤓ PNG</button></div>
            <div class="section-body" id="sectionBody"></div></body></html>`);
        w.document.close();

        const t = w.document.querySelector('.t');
        t.textContent = sectionTitle(sec);
        const body = w.document.getElementById('sectionBody');
        let view = null;
        const panel = buildGapPanel(w.document, gs, () => view && view.redraw());
        body.parentNode.insertBefore(panel.el, body);
        view = mountView(body, sec, w, gs);
        const entry = registerView(view, () => !w.closed, (s) => { t.textContent = w.document.title = sectionTitle(s); });

        w.document.querySelector('.bar').addEventListener('click', (e) => {
            const a = e.target && e.target.getAttribute && e.target.getAttribute('data-a');
            if (a === 't') { view.transpose(); panel.sync(); }
            else if (a === 'r') {
                view.section = reExtract(view.section);
                t.textContent = w.document.title = sectionTitle(view.section);
            } else if (a === 'p') savePNG(view, w.document);
            else if (a === 'l') {
                entry.linked = !entry.linked;
                e.target.classList.toggle('active', entry.linked);
                e.target.textContent = entry.linked ? '🔗 Linked' : '🔒 Locked';
                e.target.title = entry.linked ? 'Linked to Section View slider (click to lock)' : 'Locked (click to link with Section View slider)';
                if (entry.linked) syncLinkedViews();
            }
        });
        return w;
    }

    // ------------------------------------------------------------------
    // 3D 場景中的切面標示框
    // ------------------------------------------------------------------
    const box = new THREE.Box3();
    const tmpBox = new THREE.Box3();
    let helper = null;

    function updateHighlight() {
        const on = hlChk && hlChk.checked && ready();
        if (!on) { if (helper) helper.visible = false; return; }
        if (!helper || helper.parent !== scene) {
            helper = new THREE.Box3Helper(box, 0xe53935);
            helper.material.depthTest = false;
            helper.material.transparent = true;
            helper.renderOrder = 999;
            helper.userData.isSectionHelper = true;
            scene.add(helper);
        }
        const d = dims();
        const axis = state.axis;
        if (state.index >= d[axis]) { helper.visible = false; return; }
        const [rA, cA] = PLANE[axis];
        box.makeEmpty();
        for (let r = 0; r < d[rA]; r++) {
            for (let c = 0; c < d[cA]; c++) {
                const idx = {};
                idx[axis] = state.index; idx[rA] = r; idx[cA] = c;
                const cube = cubeAt(idx);
                if (cube) { tmpBox.setFromObject(cube); box.union(tmpBox); }
            }
        }
        helper.visible = !box.isEmpty();
        if (helper.visible) box.expandByScalar(0.03);
    }

    // ------------------------------------------------------------------
    // 側邊欄控制項
    // ------------------------------------------------------------------
    let lastFieldsKey = '';
    function refreshControls() {
        const ok = ready();
        const n = dims()[state.axis];
        const max = Math.max(0, n - 1);
        if (Number(idxRange.max) !== max) idxRange.max = max;
        if (state.index > max) state.index = max;
        if (Number(idxRange.value) !== state.index) idxRange.value = state.index;

        idxRange.disabled = !ok;
        openBtn.disabled = !ok;
        popBtn.disabled = !ok;
        prevBtn.disabled = !ok || state.index <= 0;
        nextBtn.disabled = !ok || state.index >= max;

        idxLabel.textContent = ok
            ? `${fieldOf(state.axis)} = ${labelAt(state.axis, state.index)}  (${state.index + 1}/${n})`
            : 'No data loaded';
        idxLabel.title = idxLabel.textContent;

        // 下拉選單顯示欄位名稱
        const key = ok ? [window.fieldX, window.fieldY, window.fieldZ].join('|') : '';
        if (key !== lastFieldsKey) {
            lastFieldsKey = key;
            for (const opt of axisSel.options) {
                const a = opt.value;
                const [r, c] = PLANE[a];
                opt.textContent = ok ? `${a}-Section: ${fieldOf(a)}` : `${a}-Section (${r} × ${c})`;
                opt.title = ok ? `${fieldOf(r)} × ${fieldOf(c)}` : '';
            }
        }
    }

    function setAxis(a) {
        if (!PLANE[a]) return;
        if (state.axis !== a) { state.axis = a; state.index = 0; }
        axisSel.value = a;
        if (ready()) selectedSrc = { axis: state.axis, src: srcIndexAt(state.axis, state.index) };
        refreshControls();
        updateHighlight();
        syncLinkedViews();
    }
    function setIndex(i) {
        const n = dims()[state.axis];
        state.index = Math.max(0, Math.min(n - 1, i | 0));
        if (ready()) selectedSrc = { axis: state.axis, src: srcIndexAt(state.axis, state.index) };
        refreshControls();
        updateHighlight();
        syncLinkedViews();
    }

    axisSel.addEventListener('change', () => setAxis(axisSel.value));
    idxRange.addEventListener('input', () => setIndex(Number(idxRange.value)));
    prevBtn.addEventListener('click', () => setIndex(state.index - 1));
    nextBtn.addEventListener('click', () => setIndex(state.index + 1));
    if (hlChk) hlChk.addEventListener('change', updateHighlight);
    // 滑鼠移入控制區時立即同步 (例如剛載入新資料)
    const panel = axisSel.closest('.Sectionwhite-background');
    if (panel) panel.addEventListener('pointerenter', refreshControls);

    openBtn.addEventListener('click', () => {
        if (!ready()) return;
        openFloatingWindow(extractSection(state.axis, state.index));
    });
    popBtn.addEventListener('click', () => {
        if (!ready()) return;
        openBrowserWindow(extractSection(state.axis, state.index));
    });

    // 與既有 Slices (X/Y/Z-Slices) 選項同步軸向
    const sliceForm = $id('axisSelection');
    if (sliceForm) {
        sliceForm.addEventListener('change', (e) => {
            const v = e.target && e.target.value;
            if (v === 'X' || v === 'Y' || v === 'Z') setAxis(v);
        });
    }

    // 在 3D cube 上雙擊某個小立方體 → 選取經過它的切面
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    renderer.domElement.addEventListener('dblclick', (e) => {
        if (!ready()) return;
        const rect = renderer.domElement.getBoundingClientRect();
        ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(ndc, getCamera());

        const d = dims();
        const objs = [];
        const where = new Map();
        for (let i = 0; i < d.X; i++) for (let j = 0; j < d.Y; j++) for (let k = 0; k < d.Z; k++) {
            const cube = window.cubes[i] && window.cubes[i][j] && window.cubes[i][j][k];
            if (cube && cube.visible !== false && cube.material && cube.material.opacity > 0) {
                objs.push(cube);
                where.set(cube, { X: i, Y: j, Z: k });
            }
        }
        const hits = raycaster.intersectObjects(objs, false);
        if (!hits.length) return;
        const idx = where.get(hits[0].object);
        setIndex(idx[state.axis]);
        if (e.shiftKey) openFloatingWindow(extractSection(state.axis, state.index));
    });

    // 排序 (X/Y/Z indices、沉澱圖順序) 改變 → 更新所有切面視窗，並讓側欄選取跟著同一類別
    const orderSig = () => {
        const part = (o) => (Array.isArray(o) ? o.join(',') : '');
        const sedi = (o) => { try { return o ? JSON.stringify(o).length + ':' + JSON.stringify(o).slice(0, 200) : ''; } catch (e) { return '?'; } };
        return [part(window.Xindices), part(window.Yindices), part(window.Zindices),
                sedi(window.Xsediorder), sedi(window.Ysediorder), sedi(window.Zsediorder),
                window.now_Xflip_side, window.now_Yflip_side, window.now_Zflip_side,
                document.getElementById('DisplayCondition') ? document.getElementById('DisplayCondition').value : ''].join('|');
    };
    let lastOrderSig = null;
    let selectedSrc = null; // 側欄目前選取的原始類別
    function checkOrderChange() {
        if (!ready()) { lastOrderSig = null; return; }
        const sig = orderSig();
        if (lastOrderSig !== null && sig !== lastOrderSig) {
            if (selectedSrc !== null && selectedSrc.axis === state.axis) {
                state.index = posOfSrc(state.axis, selectedSrc.src);
                refreshControls();
                updateHighlight();
            }
            refreshAllViews();
            setTimeout(refreshAllViews, 300); // 顏色可能在排序後才更新，稍後再同步一次
        }
        lastOrderSig = sig;
        selectedSrc = { axis: state.axis, src: srcIndexAt(state.axis, state.index) };
    }

    // 定期同步 (資料重新載入、排序改變、大小改變後標示框跟著更新)
    let frame = 0;
    (function tick() {
        requestAnimationFrame(tick);
        frame++;
        if (frame % 3 === 0) updateHighlight();
    })();

    // 側欄與排序同步改用計時器 (不受 3D 繪製幀率影響)
    setInterval(() => { refreshControls(); checkOrderChange(); }, 250);

    refreshControls();

    // 對外提供 (方便在 console 中使用)
    return { extractSection, openFloatingWindow, openBrowserWindow, setAxis, setIndex, state };
}
