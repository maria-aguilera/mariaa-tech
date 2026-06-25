/**
 * Manual snapshot of my Tower-of-Hanoi progress on the Impulse brain-training app.
 * No public API — update by editing the values when I unlock a new level.
 */
export const impulseStats = {
  app: "Impulse — Brain Training",
  appUrl: "https://impulse-app.com/",
  currentLevel: 26,
  bestTimeSeconds: null as number | null, // fill when I beat the level
  bestMoves: null as number | null,
  minimumMoves: 187, // for level 26 (theoretical optimum)
  averageTimeSeconds: 367, // app-wide average for level 26
  betterThanPct: null as number | null,
  lastVerified: "June 2026",
};
