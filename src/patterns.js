// ─── Grid patterns ────────────────────────────────────────────────────────────
// Each slot: { area, colStart, colSpan, rowOffset, rowSpan }
//   area      → value of data-area attribute (CSS [data-area="x"] hook)
//   rowOffset → 0-based row within the 6-row block (row at offset 3 is always
//               intentionally left empty as a breathing gap)
//
// Two curated variations per breakpoint. On load, one variation is picked at
// random and held for the full session. Desktop and tablet share the same
// variation index so layout direction stays coherent across breakpoints.

// ─── Desktop variations (6 columns) ──────────────────────────────────────────
//
// ── Variation A — left-anchored ───────────────────────────────────────────────
// Pattern A0             Pattern A1             Pattern A2
// col: 1  2  3  4  5  6  col: 1  2  3  4  5  6  col: 1  2  3  4  5  6
// r1:  a  a  a  ·  ·  ·  r1:  a  a  ·  ·  ·  ·  r1:  a  a  a  a  ·  ·
// r2:  a  a  a  ·  b  b  r2:  a  a  ·  ·  b  b  r2:  a  a  a  a  ·  ·
// r3:  a  a  a  ·  b  b  r3:  a  a  ·  ·  b  b  r3:  a  a  a  a  b  b
// r4:  ·  ·  ·  ·  ·  ·  r4:  ·  ·  ·  ·  ·  ·  r4:  ·  ·  ·  ·  ·  ·
// r5:  ·  d  d  ·  c  c  r5:  d  ·  ·  c  c  c  r5:  ·  ·  d  d  c  c
// r6:  ·  d  d  ·  c  c  r6:  d  ·  ·  c  c  c  r6:  ·  ·  d  d  c  c
//
// ── Variation B — right-anchored ──────────────────────────────────────────────
// Pattern B0             Pattern B1             Pattern B2
// col: 1  2  3  4  5  6  col: 1  2  3  4  5  6  col: 1  2  3  4  5  6
// r1:  ·  ·  ·  a  a  a  r1:  ·  ·  a  a  a  a  r1:  ·  ·  a  a  a  ·
// r2:  b  b  ·  a  a  a  r2:  b  b  a  a  a  a  r2:  ·  ·  a  a  a  ·
// r3:  b  b  ·  a  a  a  r3:  b  b  a  a  a  a  r3:  b  b  a  a  a  ·
// r4:  ·  ·  ·  ·  ·  ·  r4:  ·  ·  ·  ·  ·  ·  r4:  ·  ·  ·  ·  ·  ·
// r5:  c  c  c  ·  ·  d  r5:  c  c  ·  d  d  ·  r5:  c  ·  d  d  d  ·
// r6:  c  c  c  ·  ·  d  r6:  c  c  ·  d  d  ·  r6:  c  ·  d  d  d  ·
//
export const DESKTOP_VARIATIONS = [
  // ── Variation A — left-anchored ────────────────────────────────────────────
  [
    // A0 — feature top-left, accent mid-right, bottom offset inward
    [
      { area: 'a', colStart: 1, colSpan: 3, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 5, colSpan: 2, rowOffset: 1, rowSpan: 2 },
      { area: 'c', colStart: 5, colSpan: 2, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 2, colSpan: 2, rowOffset: 4, rowSpan: 2 },
    ],
    // A1 — feature top-left narrow, accent far-right, bottom spread right
    [
      { area: 'a', colStart: 1, colSpan: 2, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 5, colSpan: 2, rowOffset: 1, rowSpan: 2 },
      { area: 'c', colStart: 4, colSpan: 3, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 1, colSpan: 1, rowOffset: 4, rowSpan: 2 },
    ],
    // A2 — wide feature top-left, accent bottom-right, d bottom-centre
    [
      { area: 'a', colStart: 1, colSpan: 4, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 5, colSpan: 2, rowOffset: 2, rowSpan: 1 },
      { area: 'c', colStart: 5, colSpan: 2, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 3, colSpan: 2, rowOffset: 4, rowSpan: 2 },
    ],
  ],
  // ── Variation B — right-anchored ───────────────────────────────────────────
  [
    // B0 — feature top-right, accent mid-left, bottom inverted
    [
      { area: 'a', colStart: 4, colSpan: 3, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 1, colSpan: 2, rowOffset: 1, rowSpan: 2 },
      { area: 'c', colStart: 1, colSpan: 3, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 6, colSpan: 1, rowOffset: 4, rowSpan: 2 },
    ],
    // B1 — wide feature top-right, accent bottom-left, d bottom-centre
    [
      { area: 'a', colStart: 3, colSpan: 4, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 1, colSpan: 2, rowOffset: 1, rowSpan: 2 },
      { area: 'c', colStart: 1, colSpan: 2, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 4, colSpan: 2, rowOffset: 4, rowSpan: 2 },
    ],
    // B2 — feature top-centre-right, accent bottom-left, d bottom-right
    [
      { area: 'a', colStart: 3, colSpan: 3, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 1, colSpan: 2, rowOffset: 1, rowSpan: 2 },
      { area: 'c', colStart: 1, colSpan: 1, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 3, colSpan: 3, rowOffset: 4, rowSpan: 2 },
    ],
  ],
]

// ─── Tablet variations (4 columns) ───────────────────────────────────────────
//
// ── Variation A — left-anchored ───────────────────────────────────────────────
// Pattern TA0            Pattern TA1            Pattern TA2
// col: 1  2  3  4        col: 1  2  3  4        col: 1  2  3  4
// r1:  a  a  ·  ·        r1:  a  a  ·  ·        r1:  a  a  a  ·
// r2:  a  a  ·  b        r2:  a  a  ·  ·        r2:  a  a  a  ·
// r3:  a  a  ·  b        r3:  a  a  b  b        r3:  a  a  a  b
// r4:  ·  ·  ·  ·        r4:  ·  ·  ·  ·        r4:  ·  ·  ·  ·
// r5:  ·  c  c  d        r5:  d  ·  c  c        r5:  ·  c  d  d
// r6:  ·  c  c  d        r6:  d  ·  c  c        r6:  ·  c  d  d
//
// ── Variation B — right-anchored ──────────────────────────────────────────────
// Pattern TB0            Pattern TB1            Pattern TB2
// col: 1  2  3  4        col: 1  2  3  4        col: 1  2  3  4
// r1:  ·  ·  a  a        r1:  ·  a  a  a        r1:  ·  ·  a  a
// r2:  b  ·  a  a        r2:  ·  a  a  a        r2:  b  b  a  a
// r3:  b  ·  a  a        r3:  b  a  a  a        r3:  b  b  a  a
// r4:  ·  ·  ·  ·        r4:  ·  ·  ·  ·        r4:  ·  ·  ·  ·
// r5:  c  c  ·  d        r5:  c  ·  d  d        r5:  c  ·  ·  d
// r6:  c  c  ·  d        r6:  c  ·  d  d        r6:  c  ·  ·  d
//
export const TABLET_VARIATIONS = [
  // ── Variation A — left-anchored ────────────────────────────────────────────
  [
    // TA0 — feature top-left, accent far-right, bottom offset
    [
      { area: 'a', colStart: 1, colSpan: 2, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 4, colSpan: 1, rowOffset: 1, rowSpan: 2 },
      { area: 'c', colStart: 2, colSpan: 2, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 4, colSpan: 1, rowOffset: 4, rowSpan: 2 },
    ],
    // TA1 — feature top-left, accent bottom-right row3, bottom spread
    [
      { area: 'a', colStart: 1, colSpan: 2, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 3, colSpan: 2, rowOffset: 2, rowSpan: 1 },
      { area: 'c', colStart: 3, colSpan: 2, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 1, colSpan: 1, rowOffset: 4, rowSpan: 2 },
    ],
    // TA2 — wide feature top-left, accent far-right row3, bottom split
    [
      { area: 'a', colStart: 1, colSpan: 3, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 4, colSpan: 1, rowOffset: 2, rowSpan: 1 },
      { area: 'c', colStart: 2, colSpan: 1, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 3, colSpan: 2, rowOffset: 4, rowSpan: 2 },
    ],
  ],
  // ── Variation B — right-anchored ───────────────────────────────────────────
  [
    // TB0 — feature top-right, accent mid-left, bottom inverted
    [
      { area: 'a', colStart: 3, colSpan: 2, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 1, colSpan: 1, rowOffset: 1, rowSpan: 2 },
      { area: 'c', colStart: 1, colSpan: 2, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 4, colSpan: 1, rowOffset: 4, rowSpan: 2 },
    ],
    // TB1 — wide feature top-right, accent bottom-left, d bottom-right
    [
      { area: 'a', colStart: 2, colSpan: 3, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 1, colSpan: 1, rowOffset: 2, rowSpan: 1 },
      { area: 'c', colStart: 1, colSpan: 1, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 3, colSpan: 2, rowOffset: 4, rowSpan: 2 },
    ],
    // TB2 — feature top-right, wide accent mid-left, bottom split
    [
      { area: 'a', colStart: 3, colSpan: 2, rowOffset: 0, rowSpan: 3 },
      { area: 'b', colStart: 1, colSpan: 2, rowOffset: 1, rowSpan: 2 },
      { area: 'c', colStart: 1, colSpan: 1, rowOffset: 4, rowSpan: 2 },
      { area: 'd', colStart: 4, colSpan: 1, rowOffset: 4, rowSpan: 2 },
    ],
  ],
]
