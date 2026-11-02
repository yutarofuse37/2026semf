<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import Katex from './Katex.vue'
import AcDisplacementGraph from './AcDisplacementGraph.vue'

const { $clicks } = useSlideContext()
const step = computed(() => Math.min(Math.max(Number($clicks.value ?? 0), 0), 3))
const hot = (s: string) => `\\textcolor{#b42318}{${s}}`
const formula = computed(() => {
  const weight = step.value === 0 ? hot('w_{uv}') : 'w_{uv}'
  const difference = step.value === 1 ? hot('(x_u-x_v)^2') : '(x_u-x_v)^2'
  const sum = `\\sum_{\\{u,v\\}\\in E}${weight}${difference}`
  const cost = step.value === 2 ? hot(sum) : sum
  const min = step.value === 3 ? hot('\\min_{x\\in X}') : '\\min_{x\\in X}'
  return `\\lambda_2(L(w))=${min}${cost}`
})
</script>

<template>
  <div class="ac-stage">
    <Katex class="ac-formula" :expr="formula" display />
    <div class="ac-body">
      <ol class="ac-steps">
        <li :class="{ active: step === 0 }">
          <span class="ac-number">1</span>
          <div><strong>守備側が辺容量を配分する</strong><p>辺の太さが，ばねの強さ <Katex expr="w_{uv}" />．</p></div>
        </li>
        <li :class="{ active: step === 1 }">
          <span class="ac-number">2</span>
          <div><strong>攻撃側が変位を選ぶ</strong><p>頂点の変位は <Katex expr="x_u" />，両端の差は <Katex expr="x_u-x_v" />．</p></div>
        </li>
        <li :class="{ active: step === 2 }">
          <span class="ac-number">3</span>
          <div><strong>各辺のコストを足す</strong><p><Katex expr="w_{uv}(x_u-x_v)^2" /> の総和が <Katex expr="x^\top L(w)x" />．</p></div>
        </li>
        <li :class="{ active: step === 3 }">
          <span class="ac-number">4</span>
          <div><strong>最も変形しやすい変位を探す</strong><p><Katex expr="x\in X" /> での最小コストが <Katex expr="\lambda_2(L(w))" />．</p></div>
        </li>
      </ol>
      <figure class="ac-example">
        <div class="ac-example-title">4頂点のパスで見る変位の一例</div>
        <AcDisplacementGraph :stage="Math.min(step, 2)" symbolic />
        <figcaption v-if="step === 0">辺容量を固定して，変位を選ぶ．</figcaption>
        <figcaption v-else-if="step === 1">左の2頂点と右の2頂点を，逆向きに動かす．</figcaption>
        <figcaption v-else>両端の変位が同じ辺のコストは <Katex expr="0" />．</figcaption>
      </figure>
    </div>
    <div class="ac-constraints" :class="{ active: step === 3 }">
      <Katex expr="X=\{x\in\mathbb R^V:x^\top\mathbf1=0,\ \|x\|_2=1\}" />
      <div class="ac-constraint-meaning">
        <span><Katex expr="x^\top\mathbf1=0" />：全頂点が同じだけ動く平行移動を除く</span>
        <span><Katex expr="\|x\|_2=1" />：変位全体の大きさを固定する</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ac-stage { display: flex; flex-direction: column; gap: 10px; }
.ac-formula { display: block; text-align: center; font-size: 24px; }
.ac-formula :deep(.katex-display) { margin: 0 !important; }
.ac-body { display: grid; grid-template-columns: 1.12fr 1fr; gap: 26px; align-items: center; }
.ac-steps { list-style: none; margin: 0; padding: 0; }
.ac-steps li { display: flex; gap: 12px; margin: 0; padding: 5px 0; line-height: 1.4; }
.ac-steps li + li { margin-top: 0 !important; }
.ac-number { color: #7f96c2; font-size: 15px; font-weight: 700; padding-top: 3px; min-width: 12px; }
.ac-steps strong { font-size: 18px; color: #1c3177; }
.ac-steps p { margin: 3px 0 0; color: #444; font-size: 15px; }
.ac-steps li.active strong, .ac-steps li.active .ac-number { color: #b42318; }
.ac-example { margin: 0; text-align: center; }
.ac-example-title { font-size: 16px; color: #1c3177; font-weight: 600; margin-bottom: 9px; }
.ac-example figcaption { font-size: 14px; line-height: 1.45; min-height: 22px; color: #444; }
.ac-constraints { border-top: 1px solid #cfdbed; padding-top: 12px; font-size: 18px; text-align: center; }
.ac-constraints.active > .kx { color: #b42318; }
.ac-constraint-meaning { display: flex; justify-content: center; gap: 28px; margin-top: 9px; font-size: 14px; color: #444; }
</style>
