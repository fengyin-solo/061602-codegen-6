import { reactive, computed } from 'vue'
import type { PlayerData, PlayerProgress, NestLevelConfig, GameScore, NestLevel } from '@/types/game'
import { NEST_LEVELS, NEST_DECORATIONS } from '@/utils/constants'
import { savePlayerData, loadPlayerData, clearPlayerData } from '@/utils/storage'

const createInitialPlayerData = (): PlayerData => ({
  totalScore: 0,
  gamesPlayed: 0,
  bestScore: 0,
  totalHatched: 0,
  totalSurvived: 0,
  currentNestLevel: 1,
  unlockedNestLevel: 1,
  unlockedDecorations: [],
  activeDecorations: [],
  lastPlayedAt: Date.now(),
})

const playerData = reactive<PlayerData>(createInitialPlayerData())

let isInitialized = false

const getLevelByScore = (score: number): NestLevel => {
  let maxLevel: NestLevel = 1
  for (const level of NEST_LEVELS) {
    if (score >= level.requiredTotalScore) {
      maxLevel = level.level as NestLevel
    }
  }
  return maxLevel
}

const checkDecorationUnlocks = (): string[] => {
  const newlyUnlocked: string[] = []
  Object.values(NEST_DECORATIONS).forEach(decoration => {
    if (playerData.totalScore >= decoration.requiredScore &&
        !playerData.unlockedDecorations.includes(decoration.id)) {
      playerData.unlockedDecorations.push(decoration.id)
      newlyUnlocked.push(decoration.id)
    }
  })
  return newlyUnlocked
}

const checkNestLevelUnlock = (): boolean => {
  const shouldUnlock = getLevelByScore(playerData.totalScore)
  if (shouldUnlock > playerData.unlockedNestLevel) {
    playerData.unlockedNestLevel = shouldUnlock
    return true
  }
  return false
}

const initPlayerData = (): void => {
  if (isInitialized) return
  const saved = loadPlayerData()
  if (saved) {
    const initial = createInitialPlayerData()
    Object.assign(playerData, {
      ...initial,
      ...saved,
      unlockedNestLevel: saved.unlockedNestLevel ?? saved.currentNestLevel ?? 1,
    })
  }
  isInitialized = true
  checkDecorationUnlocks()
  checkNestLevelUnlock()
}

const currentNestConfig = computed<NestLevelConfig>(() => {
  return NEST_LEVELS.find(l => l.level === playerData.currentNestLevel) || NEST_LEVELS[0]
})

const unlockedNestConfig = computed<NestLevelConfig>(() => {
  return NEST_LEVELS.find(l => l.level === playerData.unlockedNestLevel) || NEST_LEVELS[0]
})

const progress = computed<PlayerProgress>(() => {
  const current = currentNestConfig.value
  const unlocked = unlockedNestConfig.value

  const nextIdx = NEST_LEVELS.findIndex(l => l.level === unlocked.level) + 1
  const next = nextIdx < NEST_LEVELS.length ? NEST_LEVELS[nextIdx] : null

  if (!next) {
    return {
      currentLevel: current,
      unlockedLevel: unlocked,
      nextLevel: null,
      progressToNext: 100,
      canUnlockNext: false,
      canUpgrade: false,
    }
  }

  const unlockedRequired = unlocked.requiredTotalScore
  const nextRequired = next.requiredTotalScore
  const progressToNext = unlockedRequired === nextRequired
    ? 100
    : ((playerData.totalScore - unlockedRequired) / (nextRequired - unlockedRequired)) * 100

  return {
    currentLevel: current,
    unlockedLevel: unlocked,
    nextLevel: next,
    progressToNext: Math.min(Math.max(progressToNext, 0), 100),
    canUnlockNext: playerData.totalScore >= nextRequired,
    canUpgrade: playerData.unlockedNestLevel > playerData.currentNestLevel,
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

interface AddGameResult {
  newDecorationUnlocks: string[]
  newNestUnlock: boolean
  canUpgrade: boolean
}

const addGameResult = (score: GameScore, hatched: number, survived: number): AddGameResult => {
  const prevUnlockedLevel = playerData.unlockedNestLevel
  const prevUnlockedDecos = [...playerData.unlockedDecorations]

  playerData.totalScore += score.totalScore
  playerData.gamesPlayed += 1
  playerData.bestScore = Math.max(playerData.bestScore, score.totalScore)
  playerData.totalHatched += hatched
  playerData.totalSurvived += survived
  playerData.lastPlayedAt = Date.now()

  const newDecorationUnlocks = checkDecorationUnlocks()
  const newNestUnlock = checkNestLevelUnlock()

  savePlayerData(playerData)

  return {
    newDecorationUnlocks,
    newNestUnlock,
    canUpgrade: playerData.unlockedNestLevel > playerData.currentNestLevel,
  }
}

const upgradeNest = (): boolean => {
  if (playerData.unlockedNestLevel > playerData.currentNestLevel) {
    playerData.currentNestLevel = playerData.unlockedNestLevel
    savePlayerData(playerData)
    return true
  }
  return false
}

interface ToggleResult {
  success: boolean
  action: 'added' | 'removed' | 'blocked' | 'locked'
  message: string
}

const toggleDecoration = (decorationId: string): ToggleResult => {
  if (!playerData.unlockedDecorations.includes(decorationId)) {
    return { success: false, action: 'locked', message: '该装饰尚未解锁' }
  }

  const idx = playerData.activeDecorations.indexOf(decorationId)
  const decoration = NEST_DECORATIONS[decorationId]

  if (idx >= 0) {
    playerData.activeDecorations.splice(idx, 1)
    savePlayerData(playerData)
    return { success: true, action: 'removed', message: `已移除 ${decoration?.name || decorationId}` }
  } else {
    if (playerData.activeDecorations.length >= 5) {
      return { success: false, action: 'blocked', message: '最多只能展示 5 个装饰' }
    }
    playerData.activeDecorations.push(decorationId)
    savePlayerData(playerData)
    return { success: true, action: 'added', message: `已展示 ${decoration?.name || decorationId}` }
  }
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
    unlockedNestConfig,
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
