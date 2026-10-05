// =====================================================================
// GAP3D - Section View 的 GAP 功能 (參考 GAPOnline)
// ---------------------------------------------------------------------
// 對切面矩陣 (rows × columns) 提供：
//   • Row / Column Proximity (Euclidean、Pearson、Kendall、Spearman …)
//   • Row / Column Order (Order from Cube、Original、HCT linkage、R2E、Random)
//   • Row / Column Flip (None、R2E、Uncle、GrandPa；用於 HCT linkage)
// 計算使用 GAP3D 既有的 seriation WASM (全域 Module)：
//   computeProximity / hctree_sort / ellipse_sort
// 缺失值 (NaN) 以 pairwise-complete 方式計算 proximity。
// =====================================================================

// [value, label, WASM proxType, isSimilarity]  (與 GAPOnline 相同)
export const PROX_TYPES = [
    ['euclidean_distance', 'Euclidean Distance', 0, false],
    ['pearson_correlation', "Pearson's Correlation", 1, true],
    ['kendalls_tau', "Kendall's tau", 2, true],
    ['spearman_rank', "Spearman's Rank", 3, true],
    ['atan_correlation', 'atan Correlation', 4, true],
    ['city_block', 'City-Block (L1)', 5, false],
    ['abs_pearson_correlation', "abs(Pearson's Correlation)", 6, true],
    ['uncentered_correlation', 'Uncentered Correlation', 7, true],
    ['abs_uncentered_correlation', 'abs(Uncentered Correlation)', 8, true]
];

// [value, label, needsProximity]
export const ORDER_TYPES = [
    ['cube', 'Order from Cube', false],
    ['original', 'Original Order', false],
    ['averagelinkage', 'Average-Linkage', true],
    ['singlelinkage', 'Single-Linkage', true],
    ['completelinkage', 'Complete-Linkage', true],
    ['r2e', 'R2E', true],
    ['random', 'Random', false]
];

export const FLIP_TYPES = [
    ['null', 'Flip: None'],
    ['r2e', 'Flip: R2E'],
    ['uncle', 'Flip: Uncle'],
    ['grandpa', 'Flip: GrandPa']
];

// 色階 (與 GAP3D 的 proximity 色階選單相同)
export const PALETTES = {
    sequential: ['GAP_Rainbow', 'YlOrRd', 'YlOrBr', 'YlGnBu', 'YlGn', 'Reds', 'RdPu', 'Purples', 'PuRd', 'PuBuGn',
        'PuBu', 'OrRd', 'Oranges', 'Greys', 'Greens', 'GnBu', 'BuPu', 'BuGn', 'Blues'],
    diverging: ['GAP_Blue_White_Red', 'Spectral', 'RdYlGn', 'RdYlBu', 'RdGy', 'RdBu', 'PuOr', 'PRGn', 'PiYG', 'BrBG']
};
const GAP_STOPS = {
    GAP_Rainbow: ['#A60000', '#D90000', '#FF0000', '#FF6600', '#FFB300', '#FFE600', '#FFFF00',
        '#CCF200', '#B3E600', '#66A600', '#007359', '#004DEB', '#00008C'],
    GAP_Blue_White_Red: ['#00006B', '#00009E', '#0000BF', '#0000E8', '#2121FF', '#4A4AFF', '#7A7AFF',
        '#ADADFF', '#E0E0FF', '#FAFAFF', '#FFFAFA', '#FFC7C7', '#FF9494', '#FF6161', '#FF3838',
        '#FF0000', '#CF0000', '#AD0000', '#850000', '#520000']
};
// 預設色階：距離 → GAP_Rainbow；相似度 → GAP_Blue_White_Red
export const defaultPalette = (proxValue) => {
    const info = proxInfo(proxValue);
    return info && info[3] ? 'GAP_Blue_White_Red' : 'GAP_Rainbow';
};

// t ∈ [0,1] → 顏色 (t = 0 為色階第一個顏色)
function paletteSampler(name) {
    const d3 = window.d3;
    const stops = GAP_STOPS[name];
    if (stops) {
        const mix = d3 && d3.interpolateRgb ? (a, b, u) => d3.interpolateRgb(a, b)(u) : (a, b, u) => (u < 0.5 ? a : b);
        return (t) => {
            const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
            const i = Math.min(stops.length - 2, Math.floor(x));
            return mix(stops[i], stops[i + 1], x - i);
        };
    }
    const interp = d3 && d3['interpolate' + name];
    if (interp) return (t) => interp(Math.max(0, Math.min(1, t)));
    return (t) => `hsl(${240 * Math.max(0, Math.min(1, t))},80%,50%)`;
}

// 依 GAP3D (heatmap_class.js) 的規則決定色階方向：
//   相似度：domain 固定 [-1, 1]；距離：domain 為 [min, max]
export function makeProxScale(side, setting) {
    const isSim = side.info[3];
    const name = setting.palette || defaultPalette(setting.prox);
    const lo = isSim ? -1 : side.min, hi = isSim ? 1 : side.max;
    // 色階第一個顏色所在的端點 (a) 與另一端 (b)
    let a, b;
    if (name === 'GAP_Rainbow') { [a, b] = isSim ? [lo, hi] : [hi, lo]; }
    else if (name === 'GAP_Blue_White_Red') { [a, b] = [lo, hi]; }
    else { [a, b] = [hi, lo]; }
    if (setting.reverse) [a, b] = [b, a];
    const sample = paletteSampler(name);
    const color = (v) => sample(b === a ? 0.5 : (v - a) / (b - a));
    return { color, min: lo, max: hi, name };
}

const HCT_TYPE = { singlelinkage: 0, completelinkage: 1, averagelinkage: 2 };
const FLIP_CODE = { null: 0, r2e: 1, uncle: 2, grandpa: 3 };

export const isLinkage = (o) => o in HCT_TYPE;
export const proxInfo = (v) => PROX_TYPES.find((p) => p[0] === v) || null;

export function defaultGapSettings() {
    const side = () => ({ prox: 'null', order: 'cube', flip: 'null', rand: null, palette: null, reverse: false });
    return { row: side(), col: side() };
}

export function cloneGapSettings(gs) {
    const c = (s) => ({ prox: s.prox, order: s.order, flip: s.flip, rand: s.rand ? s.rand.slice() : null,
        palette: s.palette, reverse: !!s.reverse });
    return { row: c(gs.row), col: c(gs.col) };
}

// ---------------------------------------------------------------------
// WASM wrappers
// ---------------------------------------------------------------------
let W = null;
function wasm() {
    if (W) return W;
    const M = window.Module;
    if (!M || !M.cwrap || !M._malloc) throw new Error('Seriation WASM module is not ready yet.');
    W = {
        M,
        prox: M.cwrap('computeProximity', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number']),
        hct: M.cwrap('hctree_sort', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']),
        r2e: M.cwrap('ellipse_sort', null, ['number', 'number', 'number', 'number', 'number'])
    };
    return W;
}

// X: Float64Array (n items × m features, row-major) → n × n Float64Array
function wasmProximity(X, n, m, type) {
    const { M, prox } = wasm();
    const inp = M._malloc(n * m * 8);
    const out = M._malloc(n * n * 8);
    try {
        M.HEAPF64.set(X, inp / 8);
        prox(inp, out, n, m, type, 0, 0);
        return new Float64Array(M.HEAPF64.buffer, out, n * n).slice();
    } finally {
        M._free(inp);
        M._free(out);
    }
}

// 計算 n 個 item 之間的 proximity (支援缺失值)
function proximityMatrix(X, n, m, info) {
    const type = info[2], isSim = info[3];
    const P = wasmProximity(X, n, m, type);

    // 找出含缺失值的 item
    const hasNaN = new Array(n).fill(false);
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < m; k++) if (!Number.isFinite(X[i * m + k])) { hasNaN[i] = true; break; }
    }
    // 含缺失值的配對：只用兩者皆有值的欄位重新計算 (pairwise-complete)
    if (hasNaN.some(Boolean)) {
        const pair = new Float64Array(2 * m);
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (!hasNaN[i] && !hasNaN[j]) continue;
                let k2 = 0;
                for (let k = 0; k < m; k++) {
                    const a = X[i * m + k], b = X[j * m + k];
                    if (Number.isFinite(a) && Number.isFinite(b)) { pair[k2] = a; pair[m + k2] = b; k2++; }
                }
                let v = NaN;
                if (k2 >= 2) {
                    const sub = new Float64Array(2 * k2);
                    sub.set(pair.subarray(0, k2), 0);
                    sub.set(pair.subarray(m, m + k2), k2);
                    v = wasmProximity(sub, 2, k2, type)[1];
                    // 距離依可用欄位數放大，使其與完整資料可比較
                    if (type === 0) v *= Math.sqrt(m / k2);
                    else if (type === 5) v *= m / k2;
                }
                P[i * n + j] = P[j * n + i] = v;
            }
            P[i * n + i] = isSim ? 1 : 0;
        }
    }

    // 仍無法計算的值 (例如整列缺失、變異數為 0)：相似度補 0，距離補最大值
    let maxD = 0;
    for (let t = 0; t < n * n; t++) if (Number.isFinite(P[t])) maxD = Math.max(maxD, P[t]);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const t = i * n + j;
            if (!Number.isFinite(P[t])) P[t] = (i === j) ? (isSim ? 1 : 0) : (isSim ? 0 : maxD);
        }
    }
    return P;
}

function r2eOrder(P, n) {
    if (n < 3) return [...Array(n).keys()];
    const { M, r2e } = wasm();
    const inp = M._malloc(n * n * 8);
    const out = M._malloc(n * 4);
    try {
        M.HEAPF64.set(P, inp / 8);
        r2e(inp, out, n, n, 0);
        return Array.from(new Int32Array(M.HEAP32.buffer, out, n));
    } finally {
        M._free(inp);
        M._free(out);
    }
}

function hctOrder(P, n, hctType, flip, isSim, extOrder) {
    if (n < 2) return { order: [0], tree: null };
    const { M, hct } = wasm();
    const D = new Float64Array(n * n);
    for (let t = 0; t < n * n; t++) D[t] = isSim ? 1 - P[t] : P[t];
    const ext = new Int32Array(n);
    for (let i = 0; i < n; i++) ext[i] = (flip === 1 && extOrder) ? extOrder[i] : i;

    const inp = M._malloc(n * n * 8), extp = M._malloc(n * 4);
    const lp = M._malloc((n - 1) * 4), rp = M._malloc((n - 1) * 4);
    const hp = M._malloc((n - 1) * 8), op = M._malloc(n * 4);
    try {
        M.HEAPF64.set(D, inp / 8);
        M.HEAP32.set(ext, extp / 4);
        hct(inp, extp, lp, rp, hp, op, n, n, hctType, flip);
        return {
            order: Array.from(new Int32Array(M.HEAP32.buffer, op, n)),
            tree: {
                n,
                left: Array.from(new Int32Array(M.HEAP32.buffer, lp, n - 1)),
                right: Array.from(new Int32Array(M.HEAP32.buffer, rp, n - 1)),
                hgt: Array.from(new Float64Array(M.HEAPF64.buffer, hp, n - 1))
            }
        };
    } finally {
        [inp, extp, lp, rp, hp, op].forEach((p) => M._free(p));
    }
}

function shuffled(n) {
    const a = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}

// ---------------------------------------------------------------------
// 對切面計算一個方向 (row 或 column) 的 proximity / order / tree
//   X: n items × m features；src: 每個 item 的原始類別 index
// ---------------------------------------------------------------------
function computeSide(X, n, m, src, s) {
    const res = { order: [...Array(n).keys()], prox: null, info: null, tree: null, min: 0, max: 0 };
    const info = proxInfo(s.prox);
    if (info && n > 0) {
        res.info = info;
        res.prox = proximityMatrix(X, n, m, info);
        let mn = Infinity, mx = -Infinity;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
            if (i === j && n > 1) continue;
            const v = res.prox[i * n + j];
            if (v < mn) mn = v;
            if (v > mx) mx = v;
        }
        res.min = Number.isFinite(mn) ? mn : 0;
        res.max = Number.isFinite(mx) ? mx : 1;
    }

    const o = s.order;
    if (o === 'original') {
        res.order.sort((a, b) => src[a] - src[b]);
    } else if (o === 'random') {
        if (!s.rand || s.rand.length !== n) s.rand = shuffled(n);
        res.order = s.rand.slice();
    } else if (o === 'r2e' && res.prox) {
        res.order = r2eOrder(res.prox, n);
    } else if (isLinkage(o) && res.prox) {
        const flip = FLIP_CODE[s.flip] || 0;
        const ext = flip === 1 ? r2eOrder(res.prox, n) : null;
        const h = hctOrder(res.prox, n, HCT_TYPE[o], flip, res.info[3], ext);
        res.order = h.order;
        res.tree = h.tree;
    }
    return res;
}

// sec: 切面資料 (section_view.js 的 extractSection 結果)
export function computeGap(sec, gs) {
    const nR = sec.rowLabels.length, nC = sec.colLabels.length;
    const val = (cl) => (cl && typeof cl.value === 'number' && Number.isFinite(cl.value)) ? cl.value : NaN;

    let rowX = null, colX = null;
    if (proxInfo(gs.row.prox)) {
        rowX = new Float64Array(nR * nC);
        for (let r = 0; r < nR; r++) for (let c = 0; c < nC; c++) rowX[r * nC + c] = val(sec.cells[r][c]);
    }
    if (proxInfo(gs.col.prox)) {
        colX = new Float64Array(nC * nR);
        for (let c = 0; c < nC; c++) for (let r = 0; r < nR; r++) colX[c * nR + r] = val(sec.cells[r][c]);
    }
    const rowSrc = sec.rowSrc || [...Array(nR).keys()];
    const colSrc = sec.colSrc || [...Array(nC).keys()];
    return {
        row: computeSide(rowX, nR, nC, rowSrc, gs.row),
        col: computeSide(colX, nC, nR, colSrc, gs.col)
    };
}

// 由 hctree 輸出的樹與目前順序，計算每個節點的位置 (leaf = 順序位置)
export function treeLayout(tree, order) {
    const n = tree.n;
    const rank = new Array(n);
    order.forEach((item, pos) => { rank[item] = pos; });
    const pos = new Array(2 * n - 1), hgt = new Array(2 * n - 1);
    const visit = (node) => {
        if (pos[node] !== undefined) return;
        if (node < n) { pos[node] = rank[node]; hgt[node] = 0; return; }
        const t = node - n;
        visit(tree.left[t]); visit(tree.right[t]);
        pos[node] = (pos[tree.left[t]] + pos[tree.right[t]]) / 2;
        hgt[node] = tree.hgt[t];
    };
    const root = 2 * n - 2;
    visit(root);
    let maxH = 0;
    for (let t = 0; t < n - 1; t++) maxH = Math.max(maxH, tree.hgt[t]);
    return { pos, hgt, maxH, root, n };
}

// ---------------------------------------------------------------------
// 視窗內的 GAP 控制面板
//   以表格排列：欄 = Proximity / Order / Flip / Color，列 = Row / Column
// ---------------------------------------------------------------------
export const PANEL_CSS = `
.section-gap-panel{flex:0 0 auto;padding:8px 10px 9px;background:#f8f9fc;border-bottom:1px solid #e6e8ef}
.section-gap-grid{display:grid;grid-template-columns:52px minmax(0,1.5fr) minmax(0,1.35fr) minmax(0,.9fr) minmax(0,1.4fr);gap:4px 6px;align-items:center}
.section-gap-head{font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#8a8fa3;padding-left:3px;line-height:1.2}
.section-gap-label{font-size:12px;font-weight:600;color:#4a4f63}
.section-gap-select{width:100%;height:24px;font-size:12px;color:#333;border:1px solid #d5d9e3;border-radius:5px;padding:0 3px;background:#fff;min-width:0;cursor:pointer}
.section-gap-select:hover:not(:disabled){border-color:#aab6d8}
.section-gap-select:focus{outline:none;border-color:#85a3f5;box-shadow:0 0 0 2px rgba(133,163,245,.25)}
.section-gap-select:disabled{cursor:not-allowed;color:#aaa;background:#f3f4f7}
.section-gap-color{display:flex;align-items:center;gap:4px;min-width:0}
.section-gap-color .section-gap-select{flex:1 1 auto}
.section-gap-swatch{flex:0 0 30px;height:16px;padding:0;border:1px solid #c9cdd8;border-radius:3px;cursor:pointer}
.section-gap-swatch:hover:not(:disabled){box-shadow:0 0 0 2px rgba(133,163,245,.35)}
.section-gap-swatch:disabled{cursor:not-allowed;opacity:.4}
.section-zoom{position:absolute;top:8px;right:8px;z-index:4;display:flex;align-items:center;gap:1px;padding:2px;background:rgba(255,255,255,.92);border:1px solid #d5d9e3;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.08);user-select:none}
.section-zoom button{width:24px;height:22px;padding:0;border:none;border-radius:4px;background:transparent;color:#4a4f63;font-size:15px;line-height:1;cursor:pointer}
.section-zoom button:hover{background:#e6e9f5}
.section-zoom-label{min-width:42px;text-align:center;font-size:11px;color:#666;font-variant-numeric:tabular-nums}
.section-gap-msg{position:absolute;left:10px;bottom:10px;display:none;color:#c62828;font-size:12px}
`;

// 把面板樣式加到文件中 (本頁與獨立瀏覽器視窗共用)
function ensurePanelStyle(doc) {
    if (doc.getElementById('section-gap-style')) return;
    const st = doc.createElement('style');
    st.id = 'section-gap-style';
    st.textContent = PANEL_CSS;
    (doc.head || doc.documentElement).appendChild(st);
}

export function buildGapPanel(doc, gs, onChange) {
    ensurePanelStyle(doc);
    const panel = doc.createElement('div');
    panel.className = 'section-gap-panel';
    const ctl = { row: {}, col: {} };

    const el = (tag, cls, text) => {
        const e = doc.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    };
    const addOptions = (sel, items) => {
        for (const it of items) {
            if (it.group) {
                const og = doc.createElement('optgroup');
                og.label = it.group;
                addOptions(og, it.items);
                sel.appendChild(og);
                continue;
            }
            const o = doc.createElement('option');
            o.value = it[0];
            o.textContent = it[1];
            sel.appendChild(o);
        }
    };
    const mkSelect = (side, key, items, title) => {
        const sel = el('select', 'section-gap-select');
        sel.title = title;
        addOptions(sel, items);
        sel.addEventListener('mousedown', (e) => e.stopPropagation());
        sel.addEventListener('change', () => {
            const s = gs[side];
            s[key] = sel.value;
            if (key === 'prox') {
                s.palette = proxInfo(s.prox) ? defaultPalette(s.prox) : null; // 依距離 / 相似度給預設色階
                s.reverse = false;
                if (!proxInfo(s.prox)) {
                    const o = ORDER_TYPES.find((x) => x[0] === s.order);
                    if (o && o[2]) s.order = 'cube';
                }
            }
            if (key === 'order' && sel.value === 'random') s.rand = null; // 每次選 Random 重新打亂
            if (!isLinkage(s.order)) s.flip = 'null';
            sync();
            onChange();
        });
        ctl[side][key] = sel;
        return sel;
    };

    // 表頭
    const grid = el('div', 'section-gap-grid');
    grid.appendChild(el('span', 'section-gap-head', ''));
    for (const h of ['Proximity', 'Order', 'Flip', 'Color']) grid.appendChild(el('span', 'section-gap-head', h));

    const proxItems = [['null', '-----'],
        { group: 'Distance', items: PROX_TYPES.filter((p) => !p[3]).map((p) => [p[0], p[1]]) },
        { group: 'Similarity', items: PROX_TYPES.filter((p) => p[3]).map((p) => [p[0], p[1]]) }];
    const orderItems = [
        ['cube', 'Order from Cube'], ['original', 'Original Order'],
        { group: 'Hierarchical Clustering', items: ORDER_TYPES.filter((o) => isLinkage(o[0])).map((o) => [o[0], o[1]]) },
        { group: 'Seriation', items: [['r2e', 'R2E']] },
        ['random', 'Random']];
    const flipItems = FLIP_TYPES.map((f) => [f[0], f[1].replace('Flip: ', '')]);
    const paletteItems = [
        { group: 'Sequential', items: PALETTES.sequential.map((p) => [p, p]) },
        { group: 'Diverging', items: PALETTES.diverging.map((p) => [p, p]) }];

    for (const [side, label] of [['row', 'Row'], ['col', 'Column']]) {
        grid.appendChild(el('span', 'section-gap-label', label));
        grid.appendChild(mkSelect(side, 'prox', proxItems, `${label} proximity measure`));
        grid.appendChild(mkSelect(side, 'order', orderItems, `${label} order`));
        grid.appendChild(mkSelect(side, 'flip', flipItems, `${label} flip (for hierarchical clustering)`));

        const colorCell = el('span', 'section-gap-color');
        colorCell.appendChild(mkSelect(side, 'palette', paletteItems, `${label} proximity color`));
        const sw = el('button', 'section-gap-swatch');
        sw.type = 'button';
        sw.title = 'Reverse colors';
        sw.addEventListener('mousedown', (e) => e.stopPropagation());
        sw.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!proxInfo(gs[side].prox)) return;
            gs[side].reverse = !gs[side].reverse;
            sync();
            onChange();
        });
        colorCell.appendChild(sw);
        ctl[side].swatch = sw;
        grid.appendChild(colorCell);
    }
    panel.appendChild(grid);

    // 色階預覽 (CSS 漸層)
    const gradientCss = (name, reverse) => {
        const sample = paletteSampler(name);
        const stops = [];
        for (let i = 0; i <= 10; i++) stops.push(sample(reverse ? 1 - i / 10 : i / 10));
        return `linear-gradient(to right, ${stops.join(',')})`;
    };

    function sync() {
        for (const side of ['row', 'col']) {
            const s = gs[side], c = ctl[side];
            const hasProx = !!proxInfo(s.prox);
            c.prox.value = s.prox;
            for (const opt of c.order.querySelectorAll('option')) {
                const o = ORDER_TYPES.find((x) => x[0] === opt.value);
                opt.disabled = !!(o && o[2] && !hasProx);
            }
            c.order.value = s.order;
            c.flip.disabled = !isLinkage(s.order);
            c.flip.value = s.flip;
            c.palette.disabled = !hasProx;
            c.palette.value = s.palette || defaultPalette(s.prox);
            c.swatch.disabled = !hasProx;
            c.swatch.classList.toggle('reversed', !!s.reverse);
            c.swatch.style.background = hasProx ? gradientCss(c.palette.value, s.reverse) : '#eee';
            c.swatch.title = hasProx ? (s.reverse ? 'Colors reversed (click to restore)' : 'Click to reverse colors') : 'Select a proximity first';
        }
    }
    sync();
    return { el: panel, sync };
}
