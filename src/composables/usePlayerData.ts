import { reactive, computed } from 'vue'
import type { PlayerData, PlayerProgress, NestLevelConfig, GameScore } from '@/types/game'
import { NEST_LEVELS, NEST_DECORATIONS } from '@/utils/constants'
import { savePlayerData, loadPlayerData, clearPlayerData } from '@/utils/storage'

const createInitialPlayerData = (): PlayerData => ({
  totalScore: 0,
  gamesPlayed: 0,
  bestScore: 0,
  totalHatched: 0,
  totalSurvived: 0,
  currentNestLevel: 1,
  unlockedDecorations: [],
  activeDecorations: [],
  lastPlayedAt: Date.now(),
})

const playerData = reactive<PlayerData>(createInitialPlayerData())

let isInitialized = false

const initPlayerData = (): void => {
  if (isInitialized) return
  const saved = loadPlayerData()
  if (saved) {
    Object.assign(playerData, saved)
  }
  isInitialized = true
  checkUnlocks()
}

const checkUnlocks = (): void => {
  Object.values(NEST_DECORATIONS).forEach(decoration => {
    if (playerData.totalScore >= decoration.requiredScore && 
        !playerData.unlockedDecorations.includes(decoration.id)) {
      playerData.unlockedDecorations.push(decoration.id)
    }
  })

  let maxLevel = 1
  for (const level of NEST_LEVELS) {
    if (playerData.totalScore >= level.requiredTotalScore) {
      maxLevel = level.level
    }
  }
  playerData.currentNestLevel = maxLevel as 1 | 2 | 3 | 4 | 5
}

const currentNestConfig = computed<NestLevelConfig>(() => {
  return NEST_LEVELS.find(l => l.level === playerData.currentNestLevel) || NEST_LEVELS[0]
})

const progress = computed<PlayerProgress>(() => {
  const current = currentNestConfig.value
  const nextIdx = NEST_LEVELS.findIndex(l => l.level === current.level) + 1
  const next = nextIdx < NEST_LEVELS.length ? NEST_LEVELS[nextIdx] : null

  if (!next) {
    return {
      currentLevel: current,
      nextLevel: null,
      progressToNext: 100,
      canUpgrade: false,
    }
  }

  const currentRequired = current.requiredTotalScore
  const nextRequired = next.requiredTotalScore
  const progressToNext = ((playerData.totalScore - currentRequired) / (nextRequired - currentRequired)) * 100

  return {
    currentLevel: current,
    nextLevel: next,
    progressToNext: Math.min(Math.max(progressToNext, 0), 100),
    canUpgrade: playerData.totalScore >= nextRequired,
  }
})

const activeDecorations = computed(() => {
  return playerData.activeDecorations
    .map(id => NEST_DECORATIONS[id])
    .filter(Boolean)
})

const allDecorations = computed(() => {
  return Object.values(NEST_DECORATIONS).map(d => ({
    ...d,
    unlocked: playerData.unlockedDecorations.includes(d.id),
    active: playerData.activeDecorations.includes(d.id),
  }))
})

const addGameResult = (score: GameScore, hatched: number, survived: number): { newUnlocks: string[], levelUp: boolean } => {
  const prevLevel = playerData.currentNestLevel
  const prevUnlocks = [...playerData.unlockedDecorations]

  playerData.totalScore += score.totalScore
  playerData.gamesPlayed += 1
  playerData.bestScore = Math.max(playerData.bestScore, score.totalScore)
  playerData.totalHatched += hatched
  playerData.totalSurvived += survived
  playerData.lastPlayedAt = Date.now()

  checkUnlocks()

  const newUnlocks = playerData.unlockedDecorations.filter(id => !prevUnlocks.includes(id))
  const levelUp = playerData.currentNestLevel > prevLevel

  savePlayerData(playerData)

  return { newUnlocks, levelUp }
}

const upgradeNest = (): boolean => {
  if (progress.value.canUpgrade && progress.value.nextLevel) {
    playerData.currentNestLevel = progress.value.nextLevel.level
    savePlayerData(playerData)
    return true
  }
  return false
}

const toggleDecoration = (decorationId: string): boolean => {
  if (!playerData.unlockedDecorations.includes(decorationId)) return false

  const idx = playerData.activeDecorations.indexOf(decorationId)
  if (idx >= 0) {
    playerData.activeDecorations.splice(idx, 1)
  } else {
    if (playerData.activeDecorations.length < 5) {
      playerData.activeDecorations.push(decorationId)
    } else {
      return false
    }
  }
  savePlayerData(playerData)
  return true
}

const resetPlayerData = (): void => {
  Object.assign(playerData, createInitialPlayerData())
  clearPlayerData()
}

const getNestConfig = () => currentNestConfig.value

const getNestLimits = () => {
  const config = currentNestConfig.value
  return {
    minEggs: config.minEggs,
    maxEggs: config.maxEggs,
    maxBreedingRounds: config.maxBreedingRounds,
    eventBonus: config.eventBonus,
  }
}

export function usePlayerData() {
  initPlayerData()
  return {
    playerData,
    currentNestConfig,
    progress,
    activeDecorations,
    allDecorations,
    addGameResult,
    upgradeNest,
    toggleDecoration,
    resetPlayerData,
    getNestConfig,
    getNestLimits,
  }
}
