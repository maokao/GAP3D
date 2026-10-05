# GAP3D Online User Guide

**English** | [繁體中文](README.zh-TW.md)

GAP3D is a web-based system for visualizing three-way data. It extends the matrix visualization concept of **Generalized Association Plots (GAP)** to three dimensions: each observation is located by three categorical variables (X, Y, Z) and its value is shown as the color of a small cube inside a 3D cube. For each axis you can compute proximity, apply seriation and flipping, and pick any section of the cube to examine as a GAP matrix plot, helping you explore the structure of three-way data.

Online version: <https://maokao.github.io/GAP3D>

---

## Contents

1. [Opening the System](#1-opening-the-system)
2. [Preparing Data](#2-preparing-data)
3. [Screen Layout](#3-screen-layout)
4. [Working with the 3D Cube](#4-working-with-the-3d-cube)
5. [Ordering and Proximity](#5-ordering-and-proximity)
6. [Side Menu Functions](#6-side-menu-functions)
7. [Section View](#7-section-view)
8. [Exporting Results](#8-exporting-results)
9. [FAQ](#9-faq)

---

## 1. Opening the System

- **Online**: open <https://maokao.github.io/GAP3D> in your browser.
- **Locally**: the system must be served through a web server; double-clicking `index.html` will not load the data. In the project folder, run:

  ```bash
  python -m http.server 8000
  ```

  then open `http://localhost:8000/index.html` in your browser.

The latest version of Chrome, Edge, or Firefox is recommended.

---

## 2. Preparing Data

### Data format

Use a CSV file in **long format**: each row is the observation for one (X, Y, Z) combination.

| Column | Description |
|---|---|
| X, Y, Z | Three categorical variables; their distinct values become the categories on the three axes of the cube |
| Value | A numeric variable, mapped to the color of each small cube |

Example (Air Pollution):

```csv
State,Month,Pollutant,Concentration
Alabama,2024-01,CO,0.1842
Alabama,2024-02,CO,0.2347
...
```

Here X = State, Y = Month, Z = Pollutant, and Value = Concentration.
(X, Y, Z) combinations with no observation are treated as missing values and shown as transparent.

### Loading data

In the side menu, open **Select Data File**:

- **Example Data**: choose a built-in example dataset (Air Pollution, MLB) from the drop-down list; it is plotted automatically.
- **Import Data**: click **Choose Data** to import your own CSV file, then specify the X, Y, Z, and value columns.

---

## 3. Screen Layout

| Area | Description |
|---|---|
| Top toolbar | Order X / Y / Z and Flip drop-down lists for ordering the three axes |
| Side menu | Settings for data, export, proximity, filtering, color, slices, size, font, and interaction |
| Center | The main 3D cube view |
| Right | Color bar for data values |
| Floating windows | Proximity matrices, bar charts, histograms, section matrix plots, etc.; they can be dragged, resized, and minimized |

---

## 4. Working with the 3D Cube

| Action | How |
|---|---|
| Rotate | Drag with the left mouse button |
| Zoom | Mouse wheel |
| Pan | Check **Pan** under **Interactive**, then drag |
| Show values | Check **Show Data on Hover** under **Interactive**; hovering over a small cube shows its X, Y, Z categories and value |
| Reset view | **Interactive** → **Reset Camera to Default** |
| Select a section | Double-click a small cube (see Section 7) |

---

## 5. Ordering and Proximity

### Proximity

The **Proximity** side menu computes proximity matrices for the X, Y, and Z axes; results are shown in floating windows:

- Distance: Euclidean Distance, City-Block (L1)
- Similarity: Pearson's Correlation, Kendall's tau, Spearman's Rank, atan Correlation, abs(Pearson's Correlation)

### Order and Flip

**Order X / Y / Z** in the top toolbar set the order of the categories on each axis:

| Option | Description |
|---|---|
| Original Order | The order in the data |
| Average / Single / Complete-Linkage | Leaf order of hierarchical clustering (HCT) |
| R2E | Rank-two Ellipse seriation |
| Random | Random order |

Linkage and R2E become available only after the proximity of that axis has been computed.
With a linkage order, **Flip** (None, R2E, Uncle, GrandPa) controls how the dendrogram branches are flipped.

---

## 6. Side Menu Functions

| Menu | Function |
|---|---|
| **Select Data File** | Choose example data or import a CSV |
| **Export** | Export results (see Section 8) |
| **Proximity** | Compute proximity matrices for the X / Y / Z axes |
| **Filter** | Filter which small cubes are shown by value range, or by selecting bars in the bar charts / histogram; choose Union or Intersection |
| **Opacity** | Adjust the opacity of the small cubes |
| **Color** | Set and reverse the color schemes for data and proximity; **Display Condition** colors by the range of the whole cube or of each axis (Range: Col. X / Y / Z) |
| **Slices** | Cut the cube into slices along X / Y / Z and spread them apart with **Slices Gap**; **Section View** below is for examining a single section |
| **Cube Size** | Adjust the edge lengths of the small cubes in the three directions, or separate the small cubes |
| **Font** | Adjust the font size of the axis labels |
| **Interactive** | Pan, show data on hover, reset camera, reset cube |

---

## 7. Section View

Section View lets you select a section at any position along any direction of the cube and display it as a GAP matrix plot in a window, where you can further compute row / column proximity and orderings for that section.

### 7.1 Selecting a section

In **Section View**, at the bottom of the **Slices** menu:

1. Choose a direction from the drop-down list:
   - **X-Section**: fixes one X category and shows the Y × Z matrix
   - **Y-Section**: fixes one Y category and shows the X × Z matrix
   - **Z-Section**: fixes one Z category and shows the X × Y matrix
2. Drag the **slider** or click `‹` `›` to choose a position; the category name of the current section is shown below.
3. Check **Highlight in cube** to outline the current section with a red box in the 3D cube (unchecked by default).

Shortcuts:

- **Double-click** a small cube in the 3D cube to select the section passing through it.
- **Shift + double-click** opens a window for that section directly.
- Choosing X / Y / Z-Slices in the Slices menu switches the Section View direction accordingly.

### 7.2 Opening a section window

- **Open Section Window**: opens a floating window in the page. Drag the title bar to move it and drag the lower-right corner to resize; several windows can be open at once.
- **Open in Browser Window**: opens a separate browser window, useful on a second monitor. If nothing happens, allow pop-ups for this site.

### 7.3 Window buttons

| Button | Function |
|---|---|
| 🔗 | Linked to the Section View slider (on by default). Click to dim it and lock the window to the current section |
| ⇄ | Transpose: swap rows and columns, together with their Row / Column settings |
| ↻ | Re-extract the section from the current state of the cube |
| ⤓ | Save the current view as a PNG |
| ⧉ | Open in a separate browser window, keeping the current settings |
| – | Minimize / restore |
| × | Close |

> **Comparing two sections**: open a window and click 🔗 to lock it, then open a second window and move the slider to view the two sections side by side.

### 7.4 GAP settings

The control panel at the top of the window has four drop-down lists each for **Row** and **Column**:

| Menu | Options |
|---|---|
| **Proximity** | Distance: Euclidean Distance, City-Block (L1)<br>Similarity: Pearson's Correlation, Kendall's tau, Spearman's Rank, atan Correlation, abs(Pearson's Correlation), Uncentered Correlation, abs(Uncentered Correlation) |
| **Order** | **Order from Cube** (default; same as the current arrangement of the 3D cube), Original Order, Average / Single / Complete-Linkage, R2E, Random |
| **Flip** | None, R2E, Uncle, GrandPa (available only with a linkage order) |
| **Color** | Color scheme of the proximity matrix. Distances default to **GAP_Rainbow** and similarities to **GAP_Blue_White_Red**; various Sequential / Diverging schemes are also available |

Steps:

1. Choose a **Proximity**; the corresponding proximity matrix appears.
2. Choose an **Order**. Linkage and R2E require a Proximity to be selected first.
3. With a linkage order, a dendrogram is drawn and **Flip** becomes available.
4. Choose a color scheme under **Color**; click the color strip on the right to reverse it.

### 7.5 Matrix plot layout

```
                   Column axis name
          ┌───────────────┐
          │ Column        │  column    Column
          │ proximity     │  names     dendrogram
          └───────────────┘
  row     ┌───────────────┐  ┌───────────┐
  names   │  Data matrix  │  │ Row       │  Row
          │               │  │ proximity │  dendrogram
          └───────────────┘  └───────────┘
  Section summary and proximity color legends
```

- Without a column proximity, column names are shown vertically above the data matrix.
- Hovering over a data cell shows its categories and value; hovering over a proximity cell shows the two categories and the proximity value.
- Cells removed by the Filter or without a value are shown in light gray.
- Color ranges: similarities are fixed to -1 to 1; distances span the actual minimum to maximum.

### 7.6 Zooming the matrix plot

| Action | How |
|---|---|
| Zoom | Mouse wheel (centered on the cursor, 100%–3000%) |
| Pan | Drag with the left mouse button while zoomed in |
| Toolbar | Top-right `−` zoom out, `+` zoom in, `⤢` fit to window |
| Reset | Double-click the matrix plot |

Category names are hidden automatically when cells are too small; zoom in or enlarge the window to show them.

### 7.7 Automatic updates

- **Changing the section**: moving the slider, clicking `‹` `›`, or switching direction updates all linked (🔗) windows to the new section.
- **Reordering the cube**: changing Order, Flip, or Display Condition updates all windows automatically, and each window keeps showing the section of the **same category**, even if its position in the cube changes.
- The zoom state of the matrix plot is kept when the section or the color scheme changes.

### 7.8 Missing values

When a section contains missing values, proximity is computed with a **pairwise-complete** approach: between two rows (or columns), only the entries present in both are used, and distances are scaled up by the number of usable entries so they remain comparable. When a value still cannot be computed (e.g., an entirely missing row or zero variance), similarity is set to 0 and distance to the maximum distance.

---

## 8. Exporting Results

| Export | Content |
|---|---|
| **Export → Cube** | The 3D cube view |
| **Export → Proximity** | Proximity matrix data |
| **Export → Proximity Images** | Proximity matrix images |
| **Export → Charts** | Bar charts and histogram |
| Section window **⤓** | PNG of the section matrix plot (current view, including zoom) |

---

## 9. FAQ

**Q: No data appears after opening the page.**
Make sure you open it through a web server (e.g., `http://localhost:8000`), not by double-clicking `index.html`.

**Q: Linkage and R2E cannot be selected in the Order list.**
Compute the proximity matrix for that axis under **Proximity** first. In a section window, select a Proximity for that row / column first.

**Q: Open in Browser Window does nothing.**
The browser blocked the pop-up; allow pop-ups for this site in the address bar.

**Q: I can't see category names in the section matrix plot.**
Names are hidden when cells are too small; zoom in on the matrix plot or enlarge the window.

**Q: How do I keep a section from changing with the slider?**
Click 🔗 in the window's title bar to lock it.

---

## Acknowledgments

Lab for Information Visualization
Institute of Statistical Science, Academia Sinica
Department of Statistics, Tamkang University

Web Design by Shu-Yu Lin, Chiun-How Kao
