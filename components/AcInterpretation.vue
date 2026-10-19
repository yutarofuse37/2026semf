<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import Katex from './Katex.vue'
import AttackDefense from './AttackDefense.vue'

const HOT = '#b42318'

const { $clicks } = useSlideContext()
const step = computed(() => Math.min(Math.max(Number($clicks.value ?? 0), 0), 3))

const hot = (s: string) => `\\textcolor{${HOT}}{${s}}`

const formula = computed(() => {
  const w = step.value === 0 ? hot('w_{uv}') : 'w_{uv}'
  const diff = step.value === 1 ? hot('(x_u-x_v)^2') : '(x_u-x_v)^2'
  const sum = `\\sum_{\\{u,v\\}\\in E}${w}${diff}`
  const body = step.value === 2 ? hot(sum) : sum
  const min = step.value === 3 ? hot('\\min_{x\\in X}') : '\\min_{x\\in X}'
  return `\\lambda_2(L(w))=${min}${body}`
})

const items = [
  [
    { t: '守備側が配分するばね定数が' },
    { e: 'w_{uv}' },
    { t: 'で，図の辺の太さである．' },
  ],
  [
    { t: '攻撃側が選ぶ変位の差が' },
    { e: '(x_u-x_v)' },
    { t: 'で，符号が向き，絶対値が大きさである．' },
  ],
  [
    { t: '変形のコストは和' },
    { e: 'x^\\top L(w)x' },
    { t: 'である．' },
  ],
  [
    { t: 'そのコストの最小が' },
    { e: '\\min_{x\\in X}' },
    { t: 'である．この' },
    { e: 'X' },
    { t: 'によって，グラフは必ず左右それぞれへの変位を持ち，その変位の大きさに制限を与えている．' },
  ],
]
</script>

<template>
  <div class="ac-stage">
    <Katex class="ac-formula" :expr="formula" display />
    <p class="ac-x" :class="{ on: step === 3 }">
      <Katex expr="X=\{x\in\mathbb R^V:x^\top\mathbf1=0,\ \|x\|_2=1\}" />
    </p>
    <div class="ac-read">
      <ul>
        <li v-for="(parts, i) in items" :key="i" :class="{ on: step === i }">
          <template v-for="(part, j) in parts" :key="j">
            <Katex v-if="'e' in part" :expr="part.e" />
            <template v-else>{{ part.t }}</template>
          </template>
        </li>
      </ul>
      <AttackDefense />
    </div>
  </div>
</template>

<style scoped>
.ac-stage {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.ac-formula {
  display: block;
  text-align: center;
}
.ac-formula :deep(.katex) {
  font-size: 1.05rem;
}
.ac-x {
  margin: 0;
  text-align: center;
  opacity: 0.4;
}
.ac-x.on {
  opacity: 1;
}
.ac-read {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 0.55rem;
  align-items: center;
}
.ac-read ul {
  margin: 0;
}
.ac-read li {
  opacity: 0.4;
}
.ac-read li.on {
  opacity: 1;
  color: #b42318;
}
</style>
