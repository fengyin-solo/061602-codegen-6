import type { Weather, WeatherEffect, BerryType, GrowthStage, Personality, NestDecoration, NestLevelConfig } from '@/types/game'

export const ATTR_MIN = 0
export const ATTR_MAX = 100
export const DEATH_THRESHOLD = 10

export const STAGE_DURATION: Record<Exclude<GrowthStage, 'adult'>, number> = {
  egg: 1,
  chick: 2,
  juvenile: 2,
  subadult: 1,
}

export const STAGE_NAMES: Record<GrowthStage, string> = {
  egg: '🥚 蛋',
  chick: '🐣 雏鸟',
  juvenile: '🐥 幼鸟',
  subadult: '🦜 亚成鸟',
  adult: '🐦 成鸟',
}

export const STAGE_EMOJI: Record<GrowthStage, string> = {
  egg: '🥚',
  chick: '🐣',
  juvenile: '🐥',
  subadult: '🦜',
  adult: '🐦',
}

export const FOOD_NEED_MULTIPLIER: Record<Exclude<GrowthStage, 'egg'>, number> = {
  chick: 1.5,
  juvenile: 1.2,
  subadult: 1.0,
  adult: 0.8,
}

export const HUNGER_DECAY_RATE = 1.5
export const FEAR_DECAY_RATE = 0.8
export const HEALTH_RECOVERY_RATE = 0.5

export const BERRY_SPAWN_INTERVAL = 4000
export const BERRY_MAX_COUNT = 8
export const BERRY_LIFETIME = 20000

export const BERRY_VALUES: Record<BerryType, number> = {
  red: 10,
  blue: 15,
  golden: 25,
}

export const BERRY_COLORS: Record<BerryType, string> = {
  red: '#C41E3A',
  blue: '#4169E1',
  golden: '#FFD700',
}

export const BERRY_EMOJI: Record<BerryType, string> = {
  red: '🍒',
  blue: '🫐',
  golden: '✨',
}

export const WEATHER_CHANGE_INTERVAL = 25000

export const WEATHER_EFFECTS: Record<Weather, WeatherEffect> = {
  sunny: { hungerMod: 1.0, fearMod: 0.8, healthMod: 1.0 },
  rainy: { hungerMod: 1.3, fearMod: 1.5, healthMod: 0.9, awayChance: 0.08 },
  snowy: { hungerMod: 1.5, fearMod: 1.2, healthMod: 0.7, sickChance: 0.12 },
  stormy: { hungerMod: 1.2, fearMod: 2.0, healthMod: 0.6, awayChance: 0.2, sickChance: 0.18 },
}

export const WEATHER_NAMES: Record<Weather, string> = {
  sunny: '☀️ 晴天',
  rainy: '🌧️ 雨天',
  snowy: '❄️ 雪天',
  stormy: '🌪️ 暴风',
}

export const WEATHER_COLORS: Record<Weather, string> = {
  sunny: 'from-amber-300/30 to-yellow-200/20',
  rainy: 'from-blue-400/40 to-gray-500/30',
  snowy: 'from-blue-100/40 to-white/30',
  stormy: 'from-gray-600/50 to-purple-800/40',
}

export const PERSONALITY_NAMES: Record<Personality, string> = {
  bold: '勇敢大胆',
  shy: '胆小害羞',
  gentle: '温柔恬静',
  curious: '好奇活泼',
  stubborn: '倔强独立',
}

export const PERSONALITY_EMOJI: Record<Personality, string> = {
  bold: '💪',
  shy: '🥺',
  gentle: '🌸',
  curious: '🌟',
  stubborn: '😤',
}

export const DAY_DURATION = 60000
export const INITIAL_FOOD = 30
export const MIN_EGGS = 2
export const MAX_EGGS = 4
export const MAX_BREEDING_ROUNDS = 2

export const BIRD_NAMES = [
  '毛毛', '豆豆', '啾啾', '喳喳', '花花', '点点', '果果', '泡泡',
  '糖糖', '圆圆', '小米', '小麦', '云朵', '星星', '月亮', '太阳',
  '小橘', '小蓝', '小绿', '小红', '阿黄', '阿白', '阿黑', '阿灰',
]

export const NEST_DECORATIONS: Record<string, NestDecoration> = {
  flower_red: {
    id: 'flower_red',
    type: 'flower',
    name: '红花',
    emoji: '🌺',
    x: 15,
    y: 75,
    scale: 1.2,
    unlocked: false,
    requiredScore: 50,
  },
  flower_yellow: {
    id: 'flower_yellow',
    type: 'flower',
    name: '黄花',
    emoji: '🌻',
    x: 85,
    y: 78,
    scale: 1.1,
    unlocked: false,
    requiredScore: 100,
  },
  lantern: {
    id: 'lantern',
    type: 'lantern',
    name: '小灯笼',
    emoji: '🏮',
    x: 10,
    y: 25,
    scale: 1.0,
    unlocked: false,
    requiredScore: 150,
  },
  feather: {
    id: 'feather',
    type: 'feather',
    name: '彩色羽毛',
    emoji: '🪶',
    x: 90,
    y: 20,
    scale: 1.3,
    unlocked: false,
    requiredScore: 200,
  },
  ribbon: {
    id: 'ribbon',
    type: 'ribbon',
    name: '丝带',
    emoji: '🎀',
    x: 50,
    y: 15,
    scale: 1.0,
    unlocked: false,
    requiredScore: 300,
  },
  crystal: {
    id: 'crystal',
    type: 'crystal',
    name: '水晶',
    emoji: '💎',
    x: 20,
    y: 50,
    scale: 1.1,
    unlocked: false,
    requiredScore: 400,
  },
  mushroom: {
    id: 'mushroom',
    type: 'mushroom',
    name: '小蘑菇',
    emoji: '🍄',
    x: 80,
    y: 55,
    scale: 1.0,
    unlocked: false,
    requiredScore: 500,
  },
  flower_pink: {
    id: 'flower_pink',
    type: 'flower',
    name: '樱花',
    emoji: '🌸',
    x: 30,
    y: 82,
    scale: 1.2,
    unlocked: false,
    requiredScore: 600,
  },
  star: {
    id: 'star',
    type: 'crystal',
    name: '星星',
    emoji: '⭐',
    x: 70,
    y: 18,
    scale: 1.0,
    unlocked: false,
    requiredScore: 800,
  },
  crown: {
    id: 'crown',
    type: 'crystal',
    name: '皇冠',
    emoji: '👑',
    x: 50,
    y: 8,
    scale: 1.4,
    unlocked: false,
    requiredScore: 1000,
  },
}

export const NEST_LEVELS: NestLevelConfig[] = [
  {
    level: 1,
    name: '简陋小巢',
    description: '用树枝搭建的简易巢穴，只能容纳少量鸟蛋。',
    requiredTotalScore: 0,
    minEggs: 2,
    maxEggs: 4,
    maxBreedingRounds: 2,
    eventBonus: 0,
    decorations: [],
    bgGradient: 'from-forest-dark via-forest to-forest-light',
  },
  {
    level: 2,
    name: '温馨鸟巢',
    description: '铺了柔软羽毛的温暖巢穴，可以容纳更多鸟蛋。',
    requiredTotalScore: 100,
    minEggs: 3,
    maxEggs: 5,
    maxBreedingRounds: 3,
    eventBonus: 5,
    decorations: ['flower_red', 'flower_yellow'],
    bgGradient: 'from-green-900 via-emerald-800 to-teal-700',
  },
  {
    level: 3,
    name: '豪华鸟窝',
    description: '装饰着花朵和丝带的精致巢穴，小鸟们更健康了。',
    requiredTotalScore: 300,
    minEggs: 3,
    maxEggs: 6,
    maxBreedingRounds: 3,
    eventBonus: 10,
    decorations: ['lantern', 'feather', 'ribbon'],
    bgGradient: 'from-emerald-900 via-green-700 to-lime-600',
  },
  {
    level: 4,
    name: '梦幻宫殿',
    description: '闪烁着水晶光芒的豪华巢穴，是小鸟们的天堂。',
    requiredTotalScore: 600,
    minEggs: 4,
    maxEggs: 7,
    maxBreedingRounds: 4,
    eventBonus: 15,
    decorations: ['crystal', 'mushroom', 'flower_pink'],
    bgGradient: 'from-purple-900 via-indigo-700 to-blue-600',
  },
  {
    level: 5,
    name: '传奇鸟巢',
    description: '传说中的顶级巢穴，皇冠加冕，王者风范。',
    requiredTotalScore: 1000,
    minEggs: 5,
    maxEggs: 8,
    maxBreedingRounds: 5,
    eventBonus: 20,
    decorations: ['star', 'crown'],
    bgGradient: 'from-amber-900 via-orange-700 to-yellow-500',
  },
]

export const DECORATION_NAMES: Record<string, string> = {
  flower: '花朵',
  lantern: '灯笼',
  feather: '羽毛',
  ribbon: '丝带',
  crystal: '水晶',
  mushroom: '蘑菇',
}
