<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { useGameState } from '@/composables/useGameState'
import { usePlayerData } from '@/composables/usePlayerData'
import NestExpansionModal from './NestExpansionModal.vue'

const router = useRouter()
const { startGame, tryLoadGame, state } = useGameState()
const { currentNestConfig, unlockedNestConfig, progress, playerData, activeDecorations } = usePlayerData()

const hasSave = state.phase === 'playing' || state.phase === 'breeding'
const showExpansionModal = ref(false)

const progressPercent = computed(() => Math.round(progress.value.progressToNext))

const nestLevelEmojis: Record<number, string> = {
  1: '🌿',
  2: '🌻',
  3: '🏡',
  4: '🏰',
  5: '👑',
}

onMounted(() => {
  tryLoadGame()
})

const handleStart = () => {
  startGame()
  router.push('/game')
}

const handleContinue = () => {
  router.push('/game')
}
</script>

<template>
  <div class="w-full h-full bg-gradient-to-br from-forest-dark via-forest to-forest-light flex items-center justify-center p-6 overflow-auto">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 text-6xl opacity-20 animate-float">🌳</div>
      <div class="absolute top-20 right-16 text-5xl opacity-20 animate-float" style="animation-delay: 0.5s">🌲</div>
      <div class="absolute bottom-20 left-20 text-4xl opacity-20 animate-float" style="animation-delay: 1s">🍃</div>
      <div class="absolute bottom-16 right-10 text-5xl opacity-20 animate-float" style="animation-delay: 1.5s">🌿</div>
      <div class="absolute top-1/3 left-1/4 text-3xl opacity-10 animate-bounce-slow">🐦</div>
      <div class="absolute top-1/2 right-1/3 text-3xl opacity-10 animate-bounce-slow" style="animation-delay: 0.7s">🐦</div>
    </div>

    <div class="relative z-10 max-w-2xl w-full">
      <div class="text-center mb-8 animate-pop-in">
        <div class="text-8xl mb-4 animate-bounce-slow inline-block">🪺</div>
        <h1 class="font-display text-6xl text-white text-stroke mb-3 tracking-wide">
          虚拟鸟巢
        </h1>
        <p class="text-forest-light/90 text-xl font-medium">超休闲·养成小游戏</p>
      </div>

      <div class="glass rounded-3xl p-6 card-shadow animate-pop-in mb-4" style="animation-delay: 0.1s">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="text-5xl">{{ nestLevelEmojis[currentNestConfig.level] }}</div>
              <div
                v-if="progress.canUpgrade"
                class="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs flex items-center justify-center rounded-full animate-bounce-slow"
              >
                !
              </div>
            </div>
            <div>
              <div class="font-bold text-white text-lg">{{ currentNestConfig.name }}</div>
              <div class="text-white/60 text-sm">
                Lv.{{ currentNestConfig.level }} · 累计 {{ playerData.totalScore }} 分
                <span v-if="progress.canUpgrade" class="text-green-300 ml-2">
                  · 可扩建至 Lv.{{ unlockedNestConfig.level }}
                </span>
              </div>
            </div>
          </div>
          <button
            :class="[
              'px-4 py-2 text-white rounded-xl font-bold btn-3d flex items-center gap-2 transition-all',
              progress.canUpgrade
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 animate-pulse-slow'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
            ]"
            @click="showExpansionModal = true"
          >
            <span>🏗️</span>
            {{ progress.canUpgrade ? '立即扩建' : '扩建巢穴' }}
          </button>
        </div>

        <div v-if="progress.canUpgrade" class="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3 border border-green-400/40">
          <div class="text-green-300 text-sm font-medium">
            ✨ 新巢穴已解锁！点击"立即扩建"提升蛋数上限与事件抗性！
          </div>
        </div>

        <div v-else-if="progress.nextLevel" class="mt-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-white/70">解锁下一扩建资格进度</span>
            <span class="text-amber-300">{{ progressPercent }}%</span>
          </div>
          <div class="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
        </div>
        <div v-else class="mt-4 text-center text-amber-300 text-sm">
          👑 已解锁全部等级！
        </div>

        <div v-if="activeDecorations.length > 0" class="mt-4 flex gap-2 flex-wrap">
          <span class="text-white/50 text-sm">当前装饰：</span>
          <span
            v-for="dec in activeDecorations"
            :key="dec.id"
            class="text-2xl"
            :title="dec.name"
          >
            {{ dec.emoji }}
          </span>
        </div>
      </div>

      <div class="glass rounded-3xl p-8 card-shadow animate-pop-in" style="animation-delay: 0.15s">
        <h2 class="font-display text-2xl text-amber-300 mb-5 flex items-center gap-2">
          <span>📜</span> 游戏规则
        </h2>

        <div class="grid md:grid-cols-2 gap-4 mb-8">
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <div class="text-2xl mb-2">🥚</div>
            <div class="text-white font-bold mb-1">神奇孵化</div>
            <div class="text-white/60 text-sm">每窝 {{ currentNestConfig.minEggs }}~{{ currentNestConfig.maxEggs }} 颗蛋，每颗独立孵化倒计时，孵化时长影响性格！</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <div class="text-2xl mb-2">🍒</div>
            <div class="text-white font-bold mb-1">采摘喂食</div>
            <div class="text-white/60 text-sm">点击鸟巢周围随机刷新的浆果收集食物，分配给需要的小鸟。</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <div class="text-2xl mb-2">🌤️</div>
            <div class="text-white font-bold mb-1">天气事件</div>
            <div class="text-white/60 text-sm">晴雨雪暴随机变化，影响属性！小心鸟儿离巢或生病~</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <div class="text-2xl mb-2">📈</div>
            <div class="text-white font-bold mb-1">五段成长</div>
            <div class="text-white/60 text-sm">🥚蛋 → 🐣雏鸟 → 🐥幼鸟 → 🦜亚成鸟 → 🐦成鸟</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <div class="text-2xl mb-2">💔</div>
            <div class="text-white font-bold mb-1">生离死别</div>
            <div class="text-white/60 text-sm">健康过低会死亡，埋葬鸟儿会影响同伴心理，需精心照料！</div>
          </div>

          <div class="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
            <div class="text-2xl mb-2">🏆</div>
            <div class="text-white font-bold mb-1">多终结局</div>
            <div class="text-white/60 text-sm">成鸟后可放飞或留下配对繁殖，根据成活率等综合评分！</div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            v-if="hasSave"
            class="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl
                   font-bold text-lg btn-3d hover:from-amber-400 hover:to-orange-400 flex items-center justify-center gap-2"
            @click="handleContinue"
          >
            <span class="text-xl">📂</span>
            继续上次游戏
          </button>

          <button
            class="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl
                   font-bold text-lg btn-3d hover:from-green-400 hover:to-emerald-500 flex items-center justify-center gap-2"
            @click="handleStart"
          >
            <span class="text-xl">🪺</span>
            {{ hasSave ? '开启新的一窝' : '开始孵蛋！' }}
          </button>
        </div>

        <div class="mt-6 text-center text-white/40 text-xs">
          💡 小贴士：经常喂食、安抚恐惧、关注天气，健康成长的鸟儿才会获得高分！
        </div>
      </div>
    </div>

    <NestExpansionModal
      v-if="showExpansionModal"
      @close="showExpansionModal = false"
    />
  </div>
</template>
