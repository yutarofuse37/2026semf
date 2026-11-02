<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import Katex from './Katex.vue'

const { $clicks, $nav, $page, $renderContext } = useSlideContext()
const uid = 'anf-count-' + useId().replace(/:/g, '')
const last = 7
const pairs = [
  { s: 1, t: 2, value: '\\tfrac14', quarterUnits: 1, edges: [0] },
  { s: 1, t: 3, value: '\\tfrac12', quarterUnits: 2, edges: [0, 1, 3] },
  { s: 2, t: 1, value: '\\tfrac14', quarterUnits: 1, edges: [1, 2] },
  { s: 2, t: 3, value: '\\tfrac14', quarterUnits: 1, edges: [1] },
  { s: 3, t: 1, value: '\\tfrac14', quarterUnits: 1, edges: [2] },
  { s: 3, t: 2, value: '\\tfrac14', quarterUnits: 1, edges: [2, 0] },
]
const edges = [
  { d: 'M 66 65 H 168', x: 117, y: 53 },
  { d: 'M 212 65 H 314', x: 263, y: 53 },
  { d: 'M 332 86 C 270 133, 110 133, 48 86', x: 190, y: 136 },
  { d: 'M 48 44 C 110 -3, 270 -3, 332 44', x: 190, y: 14 },
]
const isPresentation = computed(() => ['slide', 'presenter'].includes($renderContext.value))
const active = computed(() => $nav.value.currentPage === $page.value)
const stage = computed(() => isPresentation.value ? Math.max(0, Math.min(last, Number($clicks.value ?? 0))) : last)
const counted = computed(() => Math.min(stage.value, pairs.length))
const current = computed(() => stage.value > 0 && stage.value <= pairs.length ? pairs[stage.value - 1] : null)
const sum = computed(() => ['0', '\\tfrac14', '\\tfrac12', '\\tfrac34', '1', '\\tfrac54', '\\tfrac32', '\\tfrac74'][pairs.slice(0, counted.value).reduce((v, p) => v + p.quarterUnits, 0)])
const playing = ref(false)
const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
let timer: ReturnType<typeof setTimeout> | undefined

function pause() {
  if (timer) clearTimeout(timer)
  timer = undefined
  playing.value = false
}
async function move(to: number) {
  pause()
  await $nav.value.go($page.value, Math.max(0, Math.min(last, to)))
}
async function advance() {
  pause()
  if (stage.value === last) await $nav.value.next()
  else await move(stage.value + 1)
}
async function retreat() {
  pause()
  if (stage.value === 0) await $nav.value.prev()
  else await move(stage.value - 1)
}
function schedule() {
  timer = setTimeout(async () => {
    if (!active.value || !isPresentation.value || stage.value >= last) return pause()
    await $nav.value.go($page.value, stage.value + 1)
    if (stage.value === last) pause()
    else schedule()
  }, 3200)
}
async function toggle() {
  if (playing.value) return pause()
  if (!active.value || !isPresentation.value || reducedMotion) return
  if (stage.value === last) await $nav.value.go($page.value, 0)
  playing.value = true
  schedule()
}
watch(active, pause)
watch(isPresentation, pause)
onBeforeUnmount(pause)
</script>

<template>
  <div class="anf-count" :data-step="stage">
    <div class="count-heading">
      <span><Katex expr="n=3,\quad n(n-1)=6" /></span>
      <span class="count-progress">{{ counted }} / 6 対</span>
    </div>

    <div class="count-body">
      <div class="graph-example">
        <div class="pair-choice">
          <template v-if="current">
            <span class="source-label"><Katex :expr="'s=' + current.s" /></span>
            <span class="pair-arrow">→</span>
            <span class="target-label"><Katex :expr="'t=' + current.t" /></span>
          </template>
          <Katex v-else expr="w_e=\tfrac14\quad(e\in E)" />
        </div>
        <svg viewBox="0 0 380 145" role="img" :aria-label="current ? '有向サイクル1から2から3から1に、1から3への辺を追加。各辺の容量は4分の1。始点' + current.s + 'から終点' + current.t + 'への最大流量は' + (current.quarterUnits === 2 ? '2分の1' : '4分の1') + '。' : '有向サイクル1から2から3から1に、1から3への辺を追加。各辺の容量は4分の1。'">
          <defs>
            <marker :id="uid + '-arrow'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#8f9db8" />
            </marker>
            <marker :id="uid + '-flow'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#1c3177" />
            </marker>
          </defs>
          <g v-for="(edge, i) in edges" :key="i">
            <path :d="edge.d" class="edge" :marker-end="'url(#' + uid + '-arrow)'" />
            <path v-if="current?.edges.includes(i)" :key="stage + '-' + i" :d="edge.d" class="flow" :marker-end="'url(#' + uid + '-flow)'" />
            <text :x="edge.x" :y="edge.y" class="capacity" text-anchor="middle">1/4</text>
          </g>
          <g v-for="(x, i) in [44, 190, 336]" :key="i" class="vertex" :class="{ source: current?.s === i + 1, target: current?.t === i + 1 }">
            <circle :cx="x" cy="65" r="20" />
            <text :x="x" y="65" text-anchor="middle" dominant-baseline="central">{{ i + 1 }}</text>
          </g>
        </svg>
        <div class="current-value" aria-live="polite">
          <span v-if="current" :key="stage"><Katex :expr="'\\kappa_{' + current.s + current.t + '}(w)=' + current.value" /></span>
        </div>
      </div>

      <div class="pair-ledger" aria-label="6個の順序付き頂点対とその最小カット値">
        <div v-for="(p, i) in pairs" :key="p.s + '-' + p.t" class="pair-entry" :class="{ counted: i < counted, current: stage === i + 1 }">
          <span class="pair-number">{{ i + 1 }}</span>
          <Katex :expr="p.s + '\\to' + p.t" />
          <span class="entry-equals">：</span>
          <span v-if="i < counted" class="entry-value"><Katex :expr="p.value" /></span>
          <span v-if="i >= counted" class="empty-value">…</span>
        </div>
      </div>
    </div>

    <div class="sum-line" aria-live="polite">
      <span class="sum-label">合計</span>
      <div class="sum-terms">
        <span v-if="counted === 0" class="sum-placeholder">—</span>
        <span v-else class="terms">
          <span v-for="(p, i) in pairs.slice(0, counted)" :key="i" class="term" :class="{ latest: stage === i + 1 }"><span v-if="i > 0" class="plus">＋</span><Katex :expr="p.value" /></span>
        </span>
        <span v-if="counted > 0" class="running-sum"><Katex :expr="'=' + sum" /></span>
      </div>
    </div>

    <div class="average-line" :class="{ complete: stage === last }">
      <span v-if="stage === last" key="average"><Katex expr="\mathrm{ANF}(w)=\tfrac16\cdot\tfrac74=\boxed{\tfrac7{24}}" /></span>
    </div>

    <div v-if="isPresentation" class="count-controls" @click.stop @keydown.right.prevent.stop="advance" @keydown.left.prevent.stop="retreat">
      <button type="button" @click="move(stage - 1)" :disabled="stage === 0">前へ</button>
      <button type="button" class="primary" @click="move(stage + 1)" :disabled="stage === last">次へ</button>
      <button type="button" @click="toggle" :disabled="reducedMotion" :aria-pressed="playing">{{ playing ? '一時停止' : '再生' }}</button>
      <button type="button" @click="move(0)">最初から</button>
    </div>
  </div>
</template>

<style scoped>
.anf-count { margin:2px 0 0; color:#263551; font-size:16px; line-height:1.4; }
.count-heading { height:25px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #cfdbed; font-weight:650; color:#1c3177; }
.count-progress { font-variant-numeric:tabular-nums; font-size:14px; }
.count-body { display:grid; grid-template-columns:1.05fr 1fr; gap:26px; height:154px; padding-top:8px; box-sizing:border-box; }
.pair-choice { display:flex; align-items:center; justify-content:center; gap:12px; height:24px; font-size:15px; }
.source-label { color:#1c3177; font-weight:650; }
.target-label { color:#b42318; font-weight:650; }
.pair-arrow { color:#7c899f; }
svg { display:block; width:100%; height:96px; overflow:visible; }
.edge { fill:none; stroke:#8f9db8; stroke-width:2.5; }
.flow { fill:none; stroke:#1c3177; stroke-width:4; stroke-dasharray:7 4; animation:flow 1s linear infinite; }
.capacity { fill:#3d4d6b; font-size:17px !important; font-weight:650; paint-order:stroke; stroke:white; stroke-width:4px; }
.vertex circle { fill:white; stroke:#8191ae; stroke-width:2; }
.vertex text { fill:#3d4d6b; font-size:20px !important; font-weight:650; }
.vertex.source circle { fill:#1c3177; stroke:#1c3177; }
.vertex.source text { fill:white; }
.vertex.target circle { fill:#fff1ed; stroke:#b42318; stroke-width:3; }
.vertex.target text { fill:#b42318; }
.current-value { height:23px; text-align:center; font-size:16px; color:#1c3177; }
.pair-ledger { display:grid; grid-template-columns:1fr 1fr; grid-template-rows:repeat(3, 1fr); gap:4px 22px; padding:2px 0 6px; }
.pair-entry { display:flex; align-items:center; gap:10px; border-bottom:1px solid #d6deec; color:#8793a7; padding:0 6px; font-size:18px; }
.pair-entry.counted { color:#344564; }
.pair-entry.current { background:#edf2fc; border-bottom:2px solid #1c3177; color:#1c3177; font-weight:650; }
.pair-number { font-size:11px; color:#8793a7; width:9px; }
.entry-equals { font-size:15px; color:#8793a7; margin-left:auto; }
.entry-value, .empty-value { min-width:25px; text-align:center; }
.empty-value { color:#b2bcca; }
.sum-line { height:36px; display:flex; align-items:center; border-top:1px solid #cfdbed; gap:20px; }
.sum-label { font-size:15px; color:#52627d; }
.sum-terms { display:flex; align-items:center; font-size:21px; }
.sum-placeholder { font-size:16px; color:#8490a5; }
.terms { display:inline-flex; align-items:center; }
.term { display:inline-flex; align-items:center; }
.term.latest { color:#1c3177; }
.plus { margin:0 9px; font-size:17px; color:#7d8da8; }
.running-sum { margin-left:17px; color:#1c3177; font-weight:650; }
.average-line { height:40px; display:flex; align-items:center; justify-content:center; color:#52627d; font-size:15px; }
.average-line.complete { color:#1c3177; font-size:20px; background:#f1f5fc; }
.count-controls { display:flex; align-items:center; gap:6px; height:26px; box-sizing:border-box; padding-top:3px; }
.count-controls button { border:1px solid #a9b8d0; background:white; color:#35466a; border-radius:4px; padding:2px 10px; font-size:12px; line-height:1.5; cursor:pointer; }
.count-controls button.primary { background:#1c3177; border-color:#1c3177; color:white; }
.count-controls button:disabled { opacity:.38; cursor:default; }
.count-controls button:focus-visible { outline:3px solid #7f96c2; outline-offset:2px; }
.entry-value, .term, .current-value > span, .average-line > span { display:inline-block; animation:value-in .3s ease-out; }
@keyframes value-in { from { transform:translateY(5px) scale(1.06); } to { transform:none; } }
@keyframes flow { to { stroke-dashoffset:-22; } }
@media (prefers-reduced-motion:reduce) { *, *::before, *::after { animation:none !important; transition:none !important; } }
@media print { .count-controls { display:none; } }
</style>
