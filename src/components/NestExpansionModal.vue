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
  progress,
  allDecorations,
  activeDecorations,
  upgradeNest,
  toggleDecoration,
} = usePlayerData()

const activeTab = ref<'upgrade' | 'decorations'>('upgrade')
const showUpgradeSuccess = ref(false)
const showDecorationMessage = ref('')

const progressPercent = computed(() => Math.round(progress.value.progressToNext))

const handleUpgrade = () => {
  if (upgradeNest()) {
    showUpgradeSuccess.value = true
    setTimeout(() => {
      showUpgradeSuccess.value = false
    }, 2000)
  }
}

const handleToggleDecoration = (id: string) => {
  const decoration = NEST_DECORATIONS[id]
  if (!decoration) return

  const isActive = activeDecorations.value.some(d => d.id === id)
  if (!isActive && activeDecorations.value.length >= 5) {
    showDecorationMessage = '最多只能展示 5 个装饰哦~'
    setTimeout(() => { showDecorationMessage = '' }, 2000)
    return
  }

  if (toggleDecoration(id)) {
    showDecorationMessage = isActive ? `已移除 ${decoration.name}` : `已展示 ${decoration.name}`
    setTimeout(() => { showDecorationMessage = '' }, 1500)
  }
}

const nestLevelEmojis: Record<number, string> = {
  1: '🌿',
  2: '🌻',
  3: '🏡',
  4: '🏰',
  5: '👑',
}
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

      <div class="p-6 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <div class="text-center mb-6">
          <div class="text-6xl mb-3">{{ nestLevelEmojis[currentNestConfig.level] }}</div>
          <h2 class="font-display text-4xl text-white text-stroke mb-2">巢穴扩建</h2>
          <p class="text-white/70">{{ currentNestConfig.name }} · Lv.{{ currentNestConfig.level }}</p>
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
              'px-6 py-2.5 rounded-xl font-bold transition-all',
              activeTab === 'decorations'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            ]"
            @click="activeTab = 'decorations'"
          >
            🎨 装饰管理
          </button>
        </div>

        <div v-if="showUpgradeSuccess" class="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 rounded-2xl animate-bounce-slow">
            <div class="text-3xl text-center mb-2">🎉</div>
            <div class="text-white font-bold text-xl">巢穴升级成功！</div>
          </div>
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
                <div class="text-white/50 text-sm">当前等级</div>
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

          <div v-if="progress.nextLevel" class="glass rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="text-4xl opacity-50">{{ nestLevelEmojis[progress.nextLevel.level] }}</span>
                <div>
                  <div class="font-bold text-xl text-white">{{ progress.nextLevel.name }}</div>
                  <div class="text-white/60 text-sm">{{ progress.nextLevel.description }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-amber-300/70 font-bold text-2xl">Lv.{{ progress.nextLevel.level }}</div>
                <div class="text-white/50 text-sm">下一等级</div>
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
                <div class="font-bold text-green-400">{{ progress.nextLevel.minEggs }}-{{ progress.nextLevel.maxEggs }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">💝</div>
                <div class="text-white/50 text-xs">繁殖轮数</div>
                <div class="font-bold text-green-400">{{ progress.nextLevel.maxBreedingRounds }}</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">🛡️</div>
                <div class="text-white/50 text-xs">事件抗性</div>
                <div class="font-bold text-green-400">+{{ progress.nextLevel.eventBonus }}%</div>
              </div>
              <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                <div class="text-2xl mb-1">✨</div>
                <div class="text-white/50 text-xs">装饰数量</div>
                <div class="font-bold text-green-400">{{ progress.nextLevel.decorations.length }}</div>
              </div>
            </div>

            <button
              :disabled="!progress.canUpgrade"
              :class="[
                'w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2',
                progress.canUpgrade
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white btn-3d hover:from-amber-400 hover:to-orange-400'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              ]"
              @click="handleUpgrade"
            >
              <span class="text-xl">⬆️</span>
              {{ progress.canUpgrade ? '立即升级' : `还差 ${progress.nextLevel.requiredTotalScore - playerData.totalScore} 分` }}
            </button>
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
          <div v-if="showDecorationMessage" class="fixed top-1/3 left-1/2 -translate-x-1/2 z-30">
            <div class="bg-black/80 text-white px-6 py-3 rounded-xl animate-pop-in">
              {{ showDecorationMessage }}
            </div>
          </div>

          <div class="glass rounded-2xl p-4">
            <div class="flex items-center justify-between">
              <span class="text-white/70">已展示装饰</span>
              <span class="text-amber-300 font-bold">{{ activeDecorations.length }} / 5</span>
            </div>
            <div class="flex gap-2 mt-3 flex-wrap">
              <div
                v-for="dec in activeDecorations"
                :key="dec.id"
                class="bg-white/10 px-3 py-2 rounded-xl flex items-center gap-2"
              >
                <span class="text-2xl">{{ dec.emoji }}</span>
                <span class="text-white/80 text-sm">{{ dec.name }}</span>
              </div>
              <div v-if="activeDecorations.length === 0" class="text-white/40 text-sm py-2">
                还没有展示任何装饰~
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h3 class="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <span>✨</span> 装饰收藏
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="dec in allDecorations"
                :key="dec.id"
                :class="[
                  'p-4 rounded-xl border-2 transition-all cursor-pointer',
                  dec.unlocked
                    ? dec.active
                      ? 'border-amber-400 bg-amber-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                    : 'border-white/10 bg-black/20 opacity-50 cursor-not-allowed'
                ]"
                @click="dec.unlocked && handleToggleDecoration(dec.id)"
              >
                <div class="text-center">
                  <div class="text-4xl mb-2" :class="{ 'grayscale': !dec.unlocked }">{{ dec.emoji }}</div>
                  <div class="font-bold text-white text-sm mb-1">{{ dec.name }}</div>
                  <div class="text-xs text-white/50">{{ DECORATION_NAMES[dec.type] }}</div>
                  <div v-if="!dec.unlocked" class="mt-2 text-xs text-amber-300">
                    🔒 {{ dec.requiredScore }} 分解锁
                  </div>
                  <div v-else-if="dec.active" class="mt-2 text-xs text-green-400">
                    ✓ 已展示
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
