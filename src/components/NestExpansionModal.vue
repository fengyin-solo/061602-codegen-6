<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayerData } from '@/composables/usePlayerData'
import { NEST_LEVELS, DECORATION_NAMES, NEST_DECORATIONS } from '@/utils/constants'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const {
  playerData,
  currentNestConfig,
  unlockedNestConfig,
  progress,
  allDecorations,
  activeDecorations,
  upgradeNest,
  toggleDecoration,
} = usePlayerData()

const activeTab = ref<'upgrade' | 'decorations'>('upgrade')
const showUpgradeSuccess = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'warning' | 'info'>('info')
const showConfirmDialog = ref(false)

const progressPercent = computed(() => Math.round(progress.value.progressToNext))

const showToast = (msg: string, type: 'success' | 'warning' | 'info' = 'info', duration = 1800) => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, duration)
}

const handleUpgrade = () => {
  showConfirmDialog.value = true
}

const confirmUpgrade = () => {
  showConfirmDialog.value = false
  if (upgradeNest()) {
    showUpgradeSuccess.value = true
    setTimeout(() => {
      showUpgradeSuccess.value = false
    }, 2500)
  }
}

const handleToggleDecoration = (id: string) => {
  const result = toggleDecoration(id)
  if (result.success) {
    showToast(result.message, 'success', 1500)
  } else {
    showToast(result.message, 'warning', 2000)
  }
}

const nestLevelEmojis: Record<number, string> = {
  1: '🌿',
  2: '🌻',
  3: '🏡',
  4: '🏰',
  5: '👑',
}

const pendingUpgradeAvailable = computed(() => {
  return progress.value.canUpgrade
})
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="emit('close')">
    <div class="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-forest-dark via-forest to-forest-light card-shadow animate-pop-in">
      <button
        class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        @click="emit('close')"
      >
        <span class="text-xl">✕</span>
      </button>

      <div v-if="showUpgradeSuccess" class="absolute inset-0 flex items-center justify-center bg-black/50 z-40 pointer-events-none">
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-6 rounded-3xl animate-bounce-slow shadow-2xl">
          <div class="text-5xl text-center mb-3">🎉</div>
          <div class="text-white font-bold text-2xl text-center">巢穴扩建成功！</div>
          <div class="text-white/80 text-center mt-2">蛋数上限、事件抗性已提升</div>
        </div>
      </div>

      <div v-if="toastMessage" class="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-pop-in">
        <div
          :class="[
            'px-6 py-3 rounded-2xl font-medium text-white shadow-2xl',
            toastType === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
            toastType === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
            'bg-gradient-to-r from-blue-500 to-indigo-500',
          ]"
        >
          {{ toastMessage }}
        </div>
      </div>

      <div v-if="showConfirmDialog" class="absolute inset-0 flex items-center justify-center bg-black/60 z-40">
        <div class="bg-gradient-to-br from-forest via-forest-dark to-forest-light rounded-3xl p-6 max-w-sm mx-4 card-shadow border border-white/10 animate-pop-in">
          <div class="text-center">
            <div class="text-5xl mb-3">{{ nestLevelEmojis[unlockedNestConfig.level] }}</div>
            <div class="font-display text-2xl text-white mb-2">确认扩建巢穴？</div>
            <div class="text-white/70 text-sm mb-4">
              将从 <span class="text-amber-300 font-bold">{{ currentNestConfig.name }}</span>
              升级到 <span class="text-green-300 font-bold">{{ unlockedNestConfig.name }}</span>
            </div>
            <div class="bg-white/5 rounded-2xl p-4 mb-5 text-left space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-white/60">🥚 蛋数范围</span>
                <span class="text-green-300 font-bold">
                  {{ currentNestConfig.minEggs }}-{{ currentNestConfig.maxEggs }}
                  <span class="text-white/40 mx-1">→</span>
                  {{ unlockedNestConfig.minEggs }}-{{ unlockedNestConfig.maxEggs }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-white/60">💝 繁殖轮数</span>
                <span class="text-green-300 font-bold">
                  {{ currentNestConfig.maxBreedingRounds }}
                  <span class="text-white/40 mx-1">→</span>
                  {{ unlockedNestConfig.maxBreedingRounds }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-white/60">🛡️ 事件抗性</span>
                <span class="text-green-300 font-bold">
                  +{{ currentNestConfig.eventBonus }}%
                  <span class="text-white/40 mx-1">→</span>
                  +{{ unlockedNestConfig.eventBonus }}%
                </span>
              </div>
            </div>
            <div class="flex gap-3 justify-center">
              <button
                class="px-6 py-3 bg-white/10 text-white/80 rounded-2xl font-bold hover:bg-white/20 transition-all"
                @click="showConfirmDialog = false"
              >
                再想想
              </button>
              <button
                class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold btn-3d hover:from-amber-400 hover:to-orange-400 transition-all"
                @click="confirmUpgrade"
              >
                确认扩建
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <div class="text-center mb-6">
          <div class="relative inline-block">
            <div class="text-6xl mb-3">{{ nestLevelEmojis[currentNestConfig.level] }}</div>
            <div
              v-if="pendingUpgradeAvailable"
              class="absolute -top-1 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse"
            >
              NEW!
            </div>
          </div>
          <h2 class="font-display text-4xl text-white text-stroke mb-2">巢穴扩建</h2>
          <p class="text-white/70">
            {{ currentNestConfig.name }} · Lv.{{ currentNestConfig.level }}
            <span v-if="pendingUpgradeAvailable" class="text-green-300 ml-2">
              （可升级至 Lv.{{ unlockedNestConfig.level }}）
            </span>
          </p>
        </div>

        <div class="flex gap-2 mb-6 justify-center">
          <button
            :class="[
              'px-6 py-2.5 rounded-xl font-bold transition-all',
              activeTab === 'upgrade'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            ]"
            @click="activeTab = 'upgrade'"
          >
            🏠 巢穴升级
          </button>
          <button
            :class="[
              'px-6 py-2.5 rounded-xl font-bold transition-all relative',
              activeTab === 'decorations'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            ]"
            @click="activeTab = 'decorations'"
          >
            🎨 装饰管理
          </button>
        </div>

        <div v-if="activeTab === 'upgrade'" class="space-y-6">
          <div class="glass rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="text-4xl">{{ nestLevelEmojis[currentNestConfig.level] }}</span>
                <div>
                  <div class="font-bold text-xl text-white">{{ currentNestConfig.name }}</div>
                  <div class="text-white/60 text-sm">{{ currentNestConfig.description }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-amber-300 font-bold text-2xl">Lv.{{ currentNestConfig.level }}</div>
                <div class="text-white/50 text-sm">当前生效</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">🥚</div>
                <div class="text-white/50 text-xs">蛋数范围</div>
                <div class="font-bold text-white">{{ currentNestConfig.minEggs }}-{{ currentNestConfig.maxEggs }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">💝</div>
                <div class="text-white/50 text-xs">繁殖轮数</div>
                <div class="font-bold text-white">{{ currentNestConfig.maxBreedingRounds }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">🛡️</div>
                <div class="text-white/50 text-xs">事件抗性</div>
                <div class="font-bold text-green-400">+{{ currentNestConfig.eventBonus }}%</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">✨</div>
                <div class="text-white/50 text-xs">装饰数量</div>
                <div class="font-bold text-pink-400">{{ currentNestConfig.decorations.length }}</div>
              </div>
            </div>
          </div>

          <div v-if="pendingUpgradeAvailable" class="glass rounded-2xl p-6 border-2 border-green-400/40 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <span class="text-4xl">{{ nestLevelEmojis[unlockedNestConfig.level] }}</span>
                  <span class="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">✓</span>
                </div>
                <div>
                  <div class="font-bold text-xl text-green-300">{{ unlockedNestConfig.name }}</div>
                  <div class="text-white/60 text-sm">{{ unlockedNestConfig.description }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-green-300 font-bold text-2xl">Lv.{{ unlockedNestConfig.level }}</div>
                <div class="text-green-400/70 text-sm">已解锁待扩建</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div class="bg-white/5 rounded-xl p-3 text-center border border-green-400/30">
                <div class="text-2xl mb-1">🥚</div>
                <div class="text-white/50 text-xs">蛋数范围</div>
                <div class="font-bold text-green-400">
                  {{ unlockedNestConfig.minEggs }}-{{ unlockedNestConfig.maxEggs }}
                  <span class="text-xs text-green-300 block">+{{ unlockedNestConfig.minEggs - currentNestConfig.minEggs }} ~ +{{ unlockedNestConfig.maxEggs - currentNestConfig.maxEggs }}</span>
                </div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-green-400/30">
                <div class="text-2xl mb-1">💝</div>
                <div class="text-white/50 text-xs">繁殖轮数</div>
                <div class="font-bold text-green-400">
                  {{ unlockedNestConfig.maxBreedingRounds }}
                  <span class="text-xs text-green-300 block">+{{ unlockedNestConfig.maxBreedingRounds - currentNestConfig.maxBreedingRounds }}</span>
                </div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-green-400/30">
                <div class="text-2xl mb-1">🛡️</div>
                <div class="text-white/50 text-xs">事件抗性</div>
                <div class="font-bold text-green-400">
                  +{{ unlockedNestConfig.eventBonus }}%
                  <span class="text-xs text-green-300 block">+{{ unlockedNestConfig.eventBonus - currentNestConfig.eventBonus }}%</span>
                </div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-green-400/30">
                <div class="text-2xl mb-1">✨</div>
                <div class="text-white/50 text-xs">装饰数量</div>
                <div class="font-bold text-green-400">
                  {{ unlockedNestConfig.decorations.length }}
                </div>
              </div>
            </div>

            <button
              class="w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white btn-3d hover:from-green-400 hover:to-emerald-400 animate-pulse-slow"
              @click="handleUpgrade"
            >
              <span class="text-xl">🏗️</span>
              立即扩建巢穴
            </button>
          </div>

          <div v-else-if="progress.nextLevel" class="glass rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="text-4xl opacity-40 grayscale">{{ nestLevelEmojis[progress.nextLevel.level] }}</span>
                <div>
                  <div class="font-bold text-xl text-white/60">{{ progress.nextLevel.name }}</div>
                  <div class="text-white/40 text-sm">{{ progress.nextLevel.description }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-white/40 font-bold text-2xl">Lv.{{ progress.nextLevel.level }}</div>
                <div class="text-white/30 text-sm">下一等级</div>
              </div>
            </div>

            <div class="mb-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-white/70">累计成绩进度</span>
                <span class="text-amber-300 font-bold">{{ playerData.totalScore }} / {{ progress.nextLevel.requiredTotalScore }}</span>
              </div>
              <div class="h-4 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  :style="{ width: `${progressPercent}%` }"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">🥚</div>
                <div class="text-white/50 text-xs">蛋数范围</div>
                <div class="font-bold text-amber-300/70">{{ progress.nextLevel.minEggs }}-{{ progress.nextLevel.maxEggs }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">💝</div>
                <div class="text-white/50 text-xs">繁殖轮数</div>
                <div class="font-bold text-amber-300/70">{{ progress.nextLevel.maxBreedingRounds }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">🛡️</div>
                <div class="text-white/50 text-xs">事件抗性</div>
                <div class="font-bold text-amber-300/70">+{{ progress.nextLevel.eventBonus }}%</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">✨</div>
                <div class="text-white/50 text-xs">装饰数量</div>
                <div class="font-bold text-amber-300/70">{{ progress.nextLevel.decorations.length }}</div>
              </div>
            </div>

            <div class="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 bg-white/10 text-white/50 cursor-not-allowed">
              <span class="text-xl">🔒</span>
              还差 {{ progress.nextLevel.requiredTotalScore - playerData.totalScore }} 分解锁扩建资格
            </div>
          </div>

          <div v-else class="glass rounded-2xl p-6 text-center">
            <div class="text-6xl mb-4">👑</div>
            <div class="font-display text-2xl text-amber-300 mb-2">已达最高等级！</div>
            <div class="text-white/70">恭喜你达到了传奇鸟巢等级！</div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h3 class="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <span>📊</span> 累计数据
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">🏆</div>
                <div class="text-white/50 text-xs">累计积分</div>
                <div class="font-bold text-amber-300">{{ playerData.totalScore }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">🎮</div>
                <div class="text-white/50 text-xs">游戏次数</div>
                <div class="font-bold text-white">{{ playerData.gamesPlayed }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">⭐</div>
                <div class="text-white/50 text-xs">最高得分</div>
                <div class="font-bold text-yellow-300">{{ playerData.bestScore }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">🐦</div>
                <div class="text-white/50 text-xs">总孵化/存活</div>
                <div class="font-bold text-green-400">{{ playerData.totalHatched }} / {{ playerData.totalSurvived }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'decorations'" class="space-y-6">
          <div class="glass rounded-2xl p-4">
            <div class="flex items-center justify-between">
              <span class="text-white/70">已展示装饰</span>
              <span :class="['font-bold', activeDecorations.length >= 5 ? 'text-amber-300' : 'text-green-300']">
                {{ activeDecorations.length }} / 5
              </span>
            </div>
            <div class="flex gap-2 mt-3 flex-wrap">
              <div
                v-for="dec in activeDecorations"
                :key="dec.id"
                class="bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-2 rounded-xl flex items-center gap-2 border border-amber-400/30"
              >
                <span class="text-2xl">{{ dec.emoji }}</span>
                <span class="text-white/90 text-sm font-medium">{{ dec.name }}</span>
              </div>
              <div v-if="activeDecorations.length === 0" class="text-white/40 text-sm py-2">
                点击下方装饰进行展示（最多 5 个）
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h3 class="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <span>✨</span> 装饰收藏
              <span class="text-white/50 text-sm font-normal ml-2">
                （已解锁 {{ playerData.unlockedDecorations.length }} / {{ Object.keys(NEST_DECORATIONS).length }}）
              </span>
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="dec in allDecorations"
                :key="dec.id"
                :class="[
                  'p-4 rounded-xl border-2 transition-all',
                  dec.unlocked
                    ? dec.active
                      ? 'border-amber-400 bg-amber-500/20 cursor-pointer hover:bg-amber-500/30 scale-[1.02]'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer hover:scale-[1.02]'
                    : 'border-white/10 bg-black/20 opacity-50 cursor-not-allowed'
                ]"
                @click="dec.unlocked && handleToggleDecoration(dec.id)"
              >
                <div class="text-center">
                  <div class="text-4xl mb-2 transition-transform" :class="[{ 'grayscale': !dec.unlocked }, dec.active ? 'animate-bounce-slow' : '']">
                    {{ dec.emoji }}
                  </div>
                  <div class="font-bold text-white text-sm mb-1">{{ dec.name }}</div>
                  <div class="text-xs text-white/50">{{ DECORATION_NAMES[dec.type] }}</div>
                  <div v-if="!dec.unlocked" class="mt-2 text-xs text-amber-300">
                    🔒 {{ dec.requiredScore }} 分解锁
                  </div>
                  <div v-else-if="dec.active" class="mt-2 text-xs text-green-400 font-medium">
                    ✓ 展示中 · 点击移除
                  </div>
                  <div v-else class="mt-2 text-xs text-white/40">
                    点击展示
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h3 class="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <span>📖</span> 全部等级装饰预览
            </h3>
            <div class="space-y-3">
              <div v-for="level in NEST_LEVELS" :key="level.level" class="bg-white/5 rounded-xl p-3 border border-white/10">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xl">{{ nestLevelEmojis[level.level] }}</span>
                  <span class="font-bold text-white">{{ level.name }}</span>
                  <span class="text-white/40 text-sm">Lv.{{ level.level }}</span>
                  <span class="text-white/30 text-xs ml-auto">需要 {{ level.requiredTotalScore }} 分</span>
                </div>
                <div class="flex gap-2 flex-wrap">
                  <span
                    v-for="decId in level.decorations"
                    :key="decId"
                    class="text-2xl"
                    :title="NEST_DECORATIONS[decId]?.name"
                  >
                    {{ NEST_DECORATIONS[decId]?.emoji }}
                  </span>
                  <span v-if="level.decorations.length === 0" class="text-white/30 text-sm">无专属装饰</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
