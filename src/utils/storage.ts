import type { GameState, PlayerData } from '@/types/game'

const STORAGE_KEY = 'virtual-bird-nest-save'
const PLAYER_DATA_KEY = 'virtual-bird-nest-player-data'

export const saveGame = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('保存游戏失败', e)
  }
}

export const loadGame = (): GameState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.warn('读取存档失败', e)
    return null
  }
}

export const clearSave = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('清除存档失败', e)
  }
}

export const savePlayerData = (data: PlayerData): void => {
  try {
    localStorage.setItem(PLAYER_DATA_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('保存玩家数据失败', e)
  }
}

export const loadPlayerData = (): PlayerData | null => {
  try {
    const data = localStorage.getItem(PLAYER_DATA_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.warn('读取玩家数据失败', e)
    return null
  }
}

export const clearPlayerData = (): void => {
  try {
    localStorage.removeItem(PLAYER_DATA_KEY)
  } catch (e) {
    console.warn('清除玩家数据失败', e)
  }
}
