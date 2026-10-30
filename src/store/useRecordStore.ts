import { create } from 'zustand';
import { GameSaveRecord, Difficulty } from '../types/game';
import { soundSynth } from '../audio/soundSynth';

interface RecordStore {
  saveRecord: GameSaveRecord;
  soundMuted: boolean;
  loadRecord: () => void;
  updateRecord: (difficulty: Difficulty, round: number, cleared: boolean) => void;
  toggleSound: () => void;
}

const STORAGE_KEY = 'monkey_pop_record';

const defaultRecord: GameSaveRecord = {
  highestRoundCleared: 0,
  difficultyRecords: {
    easy: { cleared: false, highestFreeplayRound: 0 },
    normal: { cleared: false, highestFreeplayRound: 0 },
    hard: { cleared: false, highestFreeplayRound: 0 },
  },
  soundMuted: false,
};

export const useRecordStore = create<RecordStore>((set, get) => ({
  saveRecord: defaultRecord,
  soundMuted: false,

  loadRecord: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: GameSaveRecord = JSON.parse(stored);
        soundSynth.setMuted(parsed.soundMuted);
        set({ saveRecord: parsed, soundMuted: parsed.soundMuted });
      }
    } catch {
      // localStorage read fallback
    }
  },

  updateRecord: (difficulty: Difficulty, round: number, cleared: boolean) => {
    const { saveRecord } = get();
    const diffRecord = saveRecord.difficultyRecords[difficulty];

    const isCleared = cleared || diffRecord.cleared;
    const currentFreeplay = round > 30 ? round : 30;
    const highestFreeplay = Math.max(diffRecord.highestFreeplayRound, cleared ? currentFreeplay : round);
    const overallHighest = Math.max(saveRecord.highestRoundCleared, round);

    const updated: GameSaveRecord = {
      ...saveRecord,
      highestRoundCleared: overallHighest,
      difficultyRecords: {
        ...saveRecord.difficultyRecords,
        [difficulty]: {
          cleared: isCleared,
          highestFreeplayRound: highestFreeplay,
        },
      },
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage write fallback
    }

    set({ saveRecord: updated });
  },

  toggleSound: () => {
    const { saveRecord } = get();
    const nextMuted = !saveRecord.soundMuted;
    soundSynth.setMuted(nextMuted);

    const updated = { ...saveRecord, soundMuted: nextMuted };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage write fallback
    }

    set({ saveRecord: updated, soundMuted: nextMuted });
  },
}));
