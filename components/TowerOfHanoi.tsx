"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Lock, RotateCcw, Undo2, Check, Play, HelpCircle, ArrowRight, Coffee } from "lucide-react";
import { impulseStats } from "@/lib/impulse-stats";

type TowerIndex = 0 | 1 | 2;
type Towers = [number[], number[], number[]];

const LEVELS = [3, 4, 5, 6, 7, 8] as const;
type Level = (typeof LEVELS)[number];

const DISK_COLORS = [
  "#DC2626", // 1 - smallest
  "#EA580C",
  "#D97706",
  "#CA8A04",
  "#65A30D",
  "#16A34A",
  "#0EA5E9",
  "#2563EB", // 8 - largest
];

const STORAGE_KEY = "mariaa-tech.hanoi.progress";
const PAID_UNLOCK_KEY = "mariaa-tech.hanoi.paidUnlock";
const BYPASS_KEY = "mariaa-tech.hanoi.bypass";
const EFFORT_MULTIPLIER = 20; // hints unlock after moves >= (2^n - 1) * 20
const COFFEE_URL = "https://www.buymeacoffee.com/mariaaguilera";
const BYPASS_QUERY_KEYS = ["dev", "bypass", "maria"];

type StoredProgress = {
  cleared: number[];
  bestMoves: Record<string, number>;
  bestTimeSeconds: Record<string, number>;
};

const minimumMovesFor = (disks: number) => (1 << disks) - 1;

const buildInitialTowers = (disks: number): Towers => [
  Array.from({ length: disks }, (_, i) => disks - i),
  [],
  [],
];

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type Hint = { label: string; body: React.ReactNode };

const HINTS: Hint[] = [
  {
    label: "The pattern",
    body: (
      <p>
        The smallest disk moves every other turn. The moves in between are
        forced — there&apos;s only one legal move that doesn&apos;t undo the
        previous one.
      </p>
    ),
  },
  {
    label: "Which direction",
    body: (
      <ul className="hanoi__hintList">
        <li>
          <strong>Odd</strong> number of disks → the smallest disk goes
          straight to <strong>the target</strong> tower.
        </li>
        <li>
          <strong>Even</strong> number of disks → the smallest disk goes to{" "}
          <strong>the spare</strong> tower first.
        </li>
        <li>
          After the first move, the smallest disk always travels in the same
          direction.
        </li>
      </ul>
    ),
  },
  {
    label: "The recursive recipe",
    body: (
      <ul className="hanoi__hintList">
        <li>To move <strong>N disks from A to C</strong>:</li>
        <li>(1) Move <strong>N−1</strong> disks from A to B (the spare).</li>
        <li>(2) Move the <strong>largest</strong> disk from A to C.</li>
        <li>(3) Move <strong>N−1</strong> disks from B to C.</li>
        <li>Same trick applied to each smaller subproblem.</li>
      </ul>
    ),
  },
];

export default function TowerOfHanoi() {
  const [level, setLevel] = useState<Level>(3);
  const [towers, setTowers] = useState<Towers>(() => buildInitialTowers(3));
  const [selected, setSelected] = useState<TowerIndex | null>(null);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState<Towers[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [progress, setProgress] = useState<StoredProgress>({
    cleared: [],
    bestMoves: {},
    bestTimeSeconds: {},
  });
  const [hintIndex, setHintIndex] = useState(-1); // -1 = closed, 0..2 = hint
  const [showWinFlash, setShowWinFlash] = useState(false);
  const [paidUnlock, setPaidUnlock] = useState(false);
  const [bypass, setBypass] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // load paid unlock + URL bypass on mount.
  // Bypass via URL query (?dev=1, ?bypass=1, ?maria=1) is sticky: once visited,
  // it persists in localStorage so I don't need the query param every time.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(PAID_UNLOCK_KEY) === "1") {
        setPaidUnlock(true);
      }
    } catch {
      // ignore
    }
    try {
      if (window.localStorage.getItem(BYPASS_KEY) === "1") {
        setBypass(true);
      }
      const params = new URLSearchParams(window.location.search);
      const hasBypass = BYPASS_QUERY_KEYS.some((k) => params.has(k));
      if (hasBypass) {
        setBypass(true);
        window.localStorage.setItem(BYPASS_KEY, "1");
      }
    } catch {
      // ignore
    }
  }, []);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // load progress from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredProgress;
        setProgress({
          cleared: Array.isArray(parsed.cleared) ? parsed.cleared : [],
          bestMoves: parsed.bestMoves ?? {},
          bestTimeSeconds: parsed.bestTimeSeconds ?? {},
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const persistProgress = useCallback((next: StoredProgress) => {
    setProgress(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  // timer tick
  useEffect(() => {
    if (startedAt == null) return;
    tickRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [startedAt]);

  const handleSelectLevel = useCallback(
    (newLevel: Level) => {
      const maxCleared = progress.cleared.length
        ? Math.max(...progress.cleared)
        : 0;
      // first available level is always 3, then unlock as you clear
      if (newLevel > 3 && newLevel > maxCleared + 1) return;
      setLevel(newLevel);
      setTowers(buildInitialTowers(newLevel));
      setSelected(null);
      setMoves(0);
      setHistory([]);
      setStartedAt(null);
      setElapsedSec(0);
    },
    [progress.cleared],
  );

  const handleReset = useCallback(() => {
    setTowers(buildInitialTowers(level));
    setSelected(null);
    setMoves(0);
    setHistory([]);
    setStartedAt(null);
    setElapsedSec(0);
  }, [level]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setTowers(previous);
    setHistory((h) => h.slice(0, -1));
    setMoves((m) => Math.max(0, m - 1));
    setSelected(null);
  }, [history]);

  const handleTapTower = useCallback(
    (idx: TowerIndex) => {
      if (selected == null) {
        if (towers[idx].length === 0) return;
        setSelected(idx);
        return;
      }
      if (selected === idx) {
        setSelected(null);
        return;
      }
      const fromTower = towers[selected];
      const toTower = towers[idx];
      const moving = fromTower[fromTower.length - 1];
      const onTop = toTower[toTower.length - 1];
      if (onTop != null && moving > onTop) {
        // illegal — wiggle could be added later
        setSelected(null);
        return;
      }
      const next: Towers = [
        [...towers[0]],
        [...towers[1]],
        [...towers[2]],
      ];
      next[selected] = next[selected].slice(0, -1);
      next[idx] = [...next[idx], moving];
      setHistory((h) => [...h, towers]);
      setTowers(next);
      setMoves((m) => m + 1);
      setSelected(null);
      if (startedAt == null) setStartedAt(Date.now());

      // win check: all disks on tower 2 (the rightmost)
      if (next[2].length === level) {
        const seconds = Math.floor((Date.now() - (startedAt ?? Date.now())) / 1000);
        const key = String(level);
        const newCleared = progress.cleared.includes(level)
          ? progress.cleared
          : [...progress.cleared, level];
        const prevBestMoves = progress.bestMoves[key];
        const newBestMoves =
          prevBestMoves == null ? moves + 1 : Math.min(prevBestMoves, moves + 1);
        const prevBestSec = progress.bestTimeSeconds[key];
        const newBestSec =
          prevBestSec == null ? seconds : Math.min(prevBestSec, seconds);
        persistProgress({
          cleared: newCleared,
          bestMoves: { ...progress.bestMoves, [key]: newBestMoves },
          bestTimeSeconds: { ...progress.bestTimeSeconds, [key]: newBestSec },
        });
        setStartedAt(null);
        setShowWinFlash(true);
        window.setTimeout(() => setShowWinFlash(false), 1600);
      }
    },
    [selected, towers, startedAt, level, moves, progress, persistProgress],
  );

  const maxCleared = progress.cleared.length
    ? Math.max(...progress.cleared)
    : 0;
  const bestMovesKey = String(level);
  const bestMovesForLevel = progress.bestMoves[bestMovesKey];
  const bestSecForLevel = progress.bestTimeSeconds[bestMovesKey];
  const minMoves = minimumMovesFor(level);

  // Effort gate: hints unlock after the player has clearly struggled.
  const effortThreshold = minMoves * EFFORT_MULTIPLIER;
  const effortReached = moves >= effortThreshold;
  const movesRemaining = Math.max(0, effortThreshold - moves);
  const hintsUnlocked = bypass || paidUnlock || effortReached;

  const handleHintButton = useCallback(() => {
    if (hintsUnlocked) {
      setHintIndex((i) => (i >= HINTS.length - 1 ? -1 : i + 1));
      return;
    }
    setShowPaywall(true);
  }, [hintsUnlocked]);

  const handlePayUnlock = useCallback(() => {
    try {
      window.localStorage.setItem(PAID_UNLOCK_KEY, "1");
    } catch {
      // ignore
    }
    setPaidUnlock(true);
    setShowPaywall(false);
    // Open the coffee link in a new tab as a thank-you trigger.
    try {
      window.open(COFFEE_URL, "_blank", "noopener,noreferrer");
    } catch {
      // ignore
    }
  }, []);

  return (
    <section className="hanoi" aria-label="Tower of Hanoi puzzle">
      <header className="hanoi__intro">
        <h2 className="topic-section__title">
          <span className="topic-section__label">A puzzle I keep coming back to</span>
          <span className="topic-section__rule" aria-hidden="true" />
        </h2>
        <p className="hanoi__lede">
          I&apos;m motivated by steep learning curves &mdash; problems that keep not
          making sense until, suddenly, they do. Tower of Hanoi is the classic:
          move the whole stack one disk at a time, never a larger disk onto a
          smaller one. Each level adds a disk and <strong>doubles</strong> the
          minimum moves. Have a go.
        </p>
      </header>

      <div className="hanoi__board">
        <header className="hanoi__boardHeader">
          <h3 className="hanoi__boardTitle">Tower of Hanoi</h3>
          <div className="hanoi__rules">
            <span className="hanoi__rulesLabel">Goal</span>
            <div className="hanoi__rulesText">
              <p>Move every disk from the left tower to the right tower.</p>
            </div>
            <span className="hanoi__rulesLabel">Rules</span>
            <div className="hanoi__rulesText">
              <ul>
                <li>Move one disk at a time — only the one on top of a tower.</li>
                <li>A disk can be placed on an empty tower.</li>
                <li>
                  A disk can sit on a <em>larger</em> one — never on a smaller one.
                </li>
              </ul>
            </div>
          </div>
        </header>

        <div className="hanoi__levels" role="group" aria-label="Disk levels">
          {LEVELS.map((lvl) => {
            const cleared = progress.cleared.includes(lvl);
            const isCurrent = level === lvl;
            const locked = lvl > 3 && lvl > maxCleared + 1;
            return (
              <button
                key={lvl}
                type="button"
                className={`hanoi__levelBtn${
                  cleared ? " hanoi__levelBtn--cleared" : ""
                }${isCurrent ? " hanoi__levelBtn--current" : ""}${
                  locked ? " hanoi__levelBtn--locked" : ""
                }`}
                onClick={() => handleSelectLevel(lvl)}
                aria-pressed={isCurrent}
                aria-label={`Level ${lvl} disks${
                  cleared ? ", cleared" : locked ? ", locked" : ""
                }`}
                disabled={locked}
              >
                <span className="hanoi__levelInner">
                  {locked ? (
                    <Lock size={14} aria-hidden />
                  ) : cleared ? (
                    isCurrent ? (
                      <span className="hanoi__levelIconRow">
                        <Check size={14} aria-hidden />
                        <Play size={10} aria-hidden />
                      </span>
                    ) : (
                      <Check size={14} aria-hidden />
                    )
                  ) : (
                    lvl
                  )}
                </span>
                <span className="hanoi__levelLabel">{lvl}</span>
              </button>
            );
          })}
          <span className="hanoi__clearedHint">
            {maxCleared > 0
              ? `Cleared up to ${maxCleared} disks`
              : "Clear a level to unlock the next"}
          </span>
        </div>

        <div className="hanoi__towers">
          {[0, 1, 2].map((idx) => {
            const tower = towers[idx as TowerIndex];
            const isSelected = selected === idx;
            const towerLabel = ["A", "B", "C"][idx];
            return (
              <div key={idx} className="hanoi__towerCol">
                <button
                  type="button"
                  className={`hanoi__tower${
                    isSelected ? " hanoi__tower--selected" : ""
                  }`}
                  onClick={() => handleTapTower(idx as TowerIndex)}
                  aria-label={`Tower ${towerLabel}`}
                >
                  <div className="hanoi__pole" aria-hidden />
                  <div className="hanoi__base" aria-hidden />
                  <div className="hanoi__stack">
                    {tower.map((disk, posFromBottom) => {
                      const width = 40 + (disk - 1) * 18;
                      const isTop = posFromBottom === tower.length - 1;
                      return (
                        <div
                          key={`${idx}-${posFromBottom}-${disk}`}
                          className={`hanoi__disk${
                            isSelected && isTop ? " hanoi__disk--lifted" : ""
                          }`}
                          style={{
                            width: `${width}px`,
                            background: DISK_COLORS[disk - 1],
                          }}
                        >
                          <span className="hanoi__diskNum">{disk}</span>
                        </div>
                      );
                    })}
                  </div>
                </button>
                <span className="hanoi__towerLabel">{towerLabel}</span>
              </div>
            );
          })}
        </div>

        <div className="hanoi__metrics">
          <div className="hanoi__metric">
            <span className="hanoi__metricLabel">Moves</span>
            <span className="hanoi__metricValue">
              {moves} <span className="hanoi__metricMin">/ {minMoves} min</span>
            </span>
          </div>
          <div className="hanoi__metric">
            <span className="hanoi__metricLabel">Time</span>
            <span className="hanoi__metricValue">{formatTime(elapsedSec)}</span>
          </div>
          <div className="hanoi__metric">
            <span className="hanoi__metricLabel">Your best</span>
            <span className="hanoi__metricValue">
              {bestMovesForLevel != null
                ? `${bestMovesForLevel} moves · ${formatTime(bestSecForLevel ?? 0)}`
                : "—"}
            </span>
          </div>

          <div className="hanoi__actions">
            <button
              type="button"
              className="hanoi__action"
              onClick={handleUndo}
              disabled={history.length === 0}
            >
              <Undo2 size={14} aria-hidden /> Undo
            </button>
            <button
              type="button"
              className="hanoi__action"
              onClick={handleReset}
            >
              <RotateCcw size={14} aria-hidden /> Reset
            </button>
          </div>
        </div>

        <p className="hanoi__instruction">
          Tap a tower to lift its top disk, then tap another tower to drop it.
        </p>

        {showWinFlash && (
          <div className="hanoi__winFlash" role="status">
            🎉 Cleared {level} disks in {moves} moves &middot; {formatTime(elapsedSec)}
          </div>
        )}

        <Link href="/blog/tower-of-hanoi-python" className="hanoi__readMore">
          <span>
            Want to see how it works in <strong>8 lines of Python</strong>?
            Walkthrough of the recursive solution
          </span>
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>

      <aside className="hanoi__sidebar">
        <div className="hanoi__hintBlock">
          {hintsUnlocked ? (
            <button
              type="button"
              className="hanoi__hintBtn"
              onClick={handleHintButton}
            >
              <HelpCircle size={16} aria-hidden />
              {hintIndex === -1
                ? "Stuck? Show me the trick"
                : hintIndex >= HINTS.length - 1
                ? "Close hints"
                : `Show next hint (${hintIndex + 2}/${HINTS.length})`}
            </button>
          ) : (
            <>
              <div className="hanoi__hintLocked">
                <Lock size={14} aria-hidden />
                <span>
                  Hints locked — make <strong>{movesRemaining}</strong> more
                  moves to unlock
                </span>
              </div>
              <p className="hanoi__hintGateNote">
                I spent days figuring out the pattern. You can too. ✊
                <br />
                <span className="hanoi__hintGateNoteSmall">
                  Hints auto-unlock at <strong>{effortThreshold}</strong> moves
                  this level ({EFFORT_MULTIPLIER}× the minimum).
                </span>
              </p>
              <button
                type="button"
                className="hanoi__coffeeBtn"
                onClick={handlePayUnlock}
              >
                <Coffee size={14} aria-hidden />
                Skip ahead — buy me a coffee
              </button>
            </>
          )}

          {hintIndex >= 0 &&
            HINTS.slice(0, hintIndex + 1).map((h, i) => (
              <div key={h.label} className="hanoi__hint">
                <span className="hanoi__hintLabel">
                  Hint {i + 1} &middot; {h.label}
                </span>
                <div className="hanoi__hintBody">{h.body}</div>
              </div>
            ))}
        </div>

        <div className="hanoi__impulse">
          <span className="hanoi__impulseEyebrow">
            Personal best (verified)
          </span>
          <p className="hanoi__impulseTitle">{impulseStats.app}</p>
          <p className="hanoi__impulseLine">
            <strong>Level {impulseStats.currentLevel}</strong> &middot; minimum{" "}
            {impulseStats.minimumMoves} moves &middot; app avg{" "}
            {impulseStats.averageTimeSeconds}s
          </p>
          <p className="hanoi__impulseFootnote">
            Last verified {impulseStats.lastVerified}.{" "}
            <a
              href={impulseStats.appUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              About Impulse →
            </a>
          </p>
        </div>
      </aside>
    </section>
  );
}
