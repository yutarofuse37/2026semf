<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $nav, $page } = useSlideContext()
const isActive = computed(() => $nav.value.currentPage === $page.value)
const eta = ref(0.7 / 3)
const round = ref(25)
const running = ref(false)
const limit = 120
const coefficients = [1, 2, 3]
const optimum = [6 / 11, 3 / 11, 2 / 11]
const objective = (w: number[]) => Math.min(...w.map((v, i) => v * coefficients[i]))
const weakest = (w: number[]) => w.map((v, i) => v * coefficients[i]).indexOf(objective(w))
const trajectory = computed(() => {
  const points = [[1 / 3, 1 / 3, 1 / 3]]
  for (let t = 1; t < limit; t++) {
    const w = points[t - 1]
    const k = weakest(w)
    const next = w.map((v, i) => v * Math.exp(i === k ? eta.value * coefficients[i] : 0))
    const sum = next.reduce((a, b) => a + b, 0)
    points.push(next.map(v => v / sum))
  }
  return points
})
const current = computed(() => trajectory.value[round.value - 1])
const average = computed(() => [0, 1, 2].map(i => trajectory.value.slice(0, round.value).reduce((s, w) => s + w[i], 0) / round.value))
const zoomed = ref(true)
const clipId = `mwu-plot-${useId().replace(/:/g, '')}`
const bounds = computed(() => zoomed.value ? { x0: .28, x1: .66, y0: .13, y1: .45 } : { x0: 0, x1: 1, y0: 0, y1: 1 })
const px = (w: number[]) => 52 + (w[0] - bounds.value.x0) / (bounds.value.x1 - bounds.value.x0) * 430
const py = (w: number[]) => 325 - (w[1] - bounds.value.y0) / (bounds.value.y1 - bounds.value.y0) * 278
const xy = (points: number[][]) => points.map(w => `${px(w)},${py(w)}`).join(' ')
const path = computed(() => xy(trajectory.value.slice(0, round.value)))
const recent = computed(() => xy(trajectory.value.slice(Math.max(0, round.value - 7), round.value)))
const contour = (q: number) => xy([[q, q / 2], [1 - 5 * q / 6, q / 2], [q, 1 - 4 * q / 3]])
const xTicks = computed(() => zoomed.value ? [.3, .4, .5, .6] : [0, .25, .5, .75, 1])
const yTicks = computed(() => zoomed.value ? [.15, .25, .35, .45] : [0, .25, .5, .75, 1])
const levels = computed(() => zoomed.value ? [.3, .4, .5] : [.15, .3, .45])
const fmt = (n: number) => n.toFixed(3)
const edgeName = ['w₁', 'w₂', 'w₃']
const edgeCoef = [1, 2, 3]
const nodeX = [20, 108, 196, 284]
const edgeWidth = (w: number) => 2.2 + w * 16
const activeEdge = computed(() => weakest(current.value))
function step() { if (round.value < limit) round.value++; else running.value = false }
function reset() { running.value = false; round.value = 1 }
function toggle() { if (round.value === limit) round.value = 1; running.value = !running.value }
const timer = setInterval(() => { if (running.value && isActive.value) step(); else if (!isActive.value) running.value = false }, 240)
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="mwu-demo" @keydown.stop @click.stop>
    <div class="graph-panel">
      <div class="plot-toolbar">
        <span>{{ zoomed ? '軌跡付近を拡大' : '配分可能な領域全体' }}</span>
        <button type="button" @click="zoomed = !zoomed" :aria-pressed="zoomed">{{ zoomed ? '全体を表示' : '軌跡を拡大' }}</button>
      </div>
      <svg class="plot-svg" viewBox="0 0 520 375" role="img" :aria-label="`MWUの${zoomed ? '拡大' : '全体'}軌跡。反復${round}、現在の目的値${fmt(objective(current))}、平均配分の目的値${fmt(objective(average))}`">
        <defs><clipPath :id="clipId"><rect x="52" y="47" width="430" height="278" /></clipPath></defs>
        <rect x="52" y="47" width="430" height="278" fill="#f7f9fd" />
        <g :clip-path="`url(#${clipId})`">
          <polygon :points="xy([[0,0],[1,0],[0,1]])" fill="#eef3fb" stroke="#9baccc" stroke-width="1.5" />
          <line v-for="x in xTicks" :key="`x${x}`" :x1="px([x,0])" :x2="px([x,0])" y1="47" y2="325" stroke="#dce4ef" />
          <line v-for="y in yTicks" :key="`y${y}`" x1="52" x2="482" :y1="py([0,y])" :y2="py([0,y])" stroke="#dce4ef" />
          <g v-for="q in levels" :key="q">
            <polygon :points="contour(q)" fill="none" stroke="#92a7c9" stroke-width="1.4" stroke-dasharray="6 5" />
            <text :x="px([(1+q/6)/2,q/2])" :y="py([q,q/2])+17" text-anchor="middle" fill="#596e90" class="contour-label">{{ q.toFixed(2) }}</text>
          </g>
          <polyline :points="path" fill="none" stroke="#b2bfd3" stroke-width="1.8" stroke-linejoin="round" />
          <polyline :points="recent" fill="none" stroke="#1c3177" stroke-width="2.7" stroke-linejoin="round" />
          <circle :cx="px(trajectory[0])" :cy="py(trajectory[0])" r="5" fill="white" stroke="#7485a0" stroke-width="1.7" />
          <text :x="px(trajectory[0])-8" :y="py(trajectory[0])-14" text-anchor="end" fill="#53627b" class="point-label">初期点</text>
          <path :d="`M ${px(optimum)-7} ${py(optimum)-7} L ${px(optimum)+7} ${py(optimum)+7} M ${px(optimum)-7} ${py(optimum)+7} L ${px(optimum)+7} ${py(optimum)-7}`" stroke="white" stroke-width="6" />
          <path :d="`M ${px(optimum)-7} ${py(optimum)-7} L ${px(optimum)+7} ${py(optimum)+7} M ${px(optimum)-7} ${py(optimum)+7} L ${px(optimum)+7} ${py(optimum)-7}`" stroke="#a52634" stroke-width="2.8" />
          <text :x="px(optimum)+14" :y="py(optimum)-15" fill="#a52634" class="point-label">最適解</text>
          <rect :x="px(average)-6" :y="py(average)-6" width="12" height="12" fill="#c76a13" stroke="white" stroke-width="2" />
          <circle :cx="px(current)" :cy="py(current)" r="6.5" fill="#1c3177" stroke="white" stroke-width="2" />
        </g>
        <path d="M 52 42 V 325 H 490" fill="none" stroke="#526079" stroke-width="1.5" />
        <g fill="#394963">
          <text v-for="x in xTicks" :key="`xt${x}`" :x="px([x,0])" y="347" text-anchor="middle">{{ x }}</text>
          <text v-for="y in yTicks" :key="`yt${y}`" x="42" :y="py([0,y])+5" text-anchor="end">{{ y }}</text>
          <text x="492" y="331" class="axis-label">w₁</text><text x="30" y="32" class="axis-label">w₂</text>
          <text x="268" y="371" text-anchor="middle">w₃ = 1 − w₁ − w₂　／　破線：目的値の等高線</text>
        </g>
        <g v-if="zoomed" transform="translate(380,56)" aria-hidden="true">
          <rect x="-7" y="-8" width="104" height="105" rx="4" fill="white" stroke="#d0d9e6" />
          <text x="42" y="8" text-anchor="middle" fill="#64718a" class="inset-label">全体での位置</text>
          <path d="M 8 83 L 83 83 L 8 20 Z" fill="#eef3fb" stroke="#a9b8d0" />
          <rect :x="8+bounds.x0*75" :y="83-bounds.y1*63" :width="(bounds.x1-bounds.x0)*75" :height="(bounds.y1-bounds.y0)*63" fill="#1c317725" stroke="#1c3177" stroke-width="1.3" />
        </g>
      </svg>
    </div>
    <div class="demo-panel">
      <div class="edge-fig">
        <div class="edge-caption">
          <span>辺の太さは現在の重み</span>
          <span class="edge-key">赤が次に増える</span>
        </div>
        <svg class="edge-svg" viewBox="0 0 304 108" role="img" :aria-label="`3辺のパス。重み ${current.map(fmt).join('、')}。次に増やす辺は ${edgeName[activeEdge]}`">
          <line
            v-for="i in 3"
            :key="`e${i}`"
            :x1="nodeX[i - 1] + 15"
            :x2="nodeX[i] - 15"
            y1="52"
            y2="52"
            stroke-linecap="round"
            :stroke="i - 1 === activeEdge ? '#b42318' : '#1c3177'"
            :stroke-width="edgeWidth(current[i - 1])"
          />
          <g v-for="(x, i) in nodeX" :key="`n${i}`">
            <circle :cx="x" cy="52" r="12" fill="#fff" stroke="#1c3177" stroke-width="1.6" />
            <text :x="x" y="56" text-anchor="middle" class="node-num">{{ i + 1 }}</text>
          </g>
          <text
            v-for="i in 3"
            :key="`l${i}`"
            :x="(nodeX[i - 1] + nodeX[i]) / 2"
            y="24"
            text-anchor="middle"
            class="edge-label"
            :fill="i - 1 === activeEdge ? '#b42318' : '#1c3177'"
          >{{ edgeName[i - 1] }} {{ fmt(current[i - 1]) }}</text>
          <text
            v-for="i in 3"
            :key="`t${i}`"
            :x="(nodeX[i - 1] + nodeX[i]) / 2"
            y="86"
            text-anchor="middle"
            class="edge-term"
            :fill="i - 1 === activeEdge ? '#b42318' : '#526079'"
          >項 {{ fmt(edgeCoef[i - 1] * current[i - 1]) }}</text>
        </svg>
      </div>
      <div class="round-label">反復 <strong data-testid="round">{{ round }}</strong> / {{ limit }}</div>
      <div class="legend"><span class="blue">● 現在</span><span class="orange">■ 平均</span><span class="red">× 最適解</span></div>
      <div class="weights" data-testid="weights">w = ({{ current.map(fmt).join(', ') }})</div>
      <div class="readout"><span>現在の目的値</span><strong data-testid="current-value">{{ fmt(objective(current)) }}</strong></div>
      <div class="readout"><span>平均配分の目的値</span><strong class="orange" data-testid="average-value">{{ fmt(objective(average)) }}</strong></div>
      <div class="readout"><span>最適値 6/11</span><strong class="red">{{ fmt(6/11) }}</strong></div>
      <div class="trail-key">濃い線：直近6回の更新<br>薄い線：それ以前の軌跡</div>
      <div class="controls">
        <button type="button" @click="toggle" :aria-pressed="running">{{ running ? '一時停止' : '再生' }}</button>
        <button type="button" @click="running=false; step()" :disabled="round===limit">1回進む</button>
        <button type="button" @click="reset">リセット</button>
      </div>
      <label class="slider">反復<input aria-label="反復回数" type="range" min="1" :max="limit" v-model.number="round" @input="running=false" /></label>
      <label class="eta">ステップ幅 η
        <select aria-label="ステップ幅" v-model.number="eta" @change="reset"><option :value="0.2/3">0.07</option><option :value="0.7/3">0.23</option><option :value="1.4/3">0.47</option></select>
        <span>変更時にリセット</span>
      </label>
      <p class="next-update">次は w{{ weakest(current)+1 }} に exp(η × {{ coefficients[weakest(current)] }}) を掛けて正規化．</p>
    </div>
  </div>
</template>

<style scoped>
.mwu-demo { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(300px,0.9fr); gap:16px; height:400px; font-size:14px; line-height:1.35; margin-top:-8px; }
.plot-toolbar { display:flex; align-items:center; justify-content:space-between; padding:0 8px 0 36px; font-size:13px; height:24px; color:#526079; }
.plot-svg { width:100%; height:376px; }
.plot-svg text { font-size:14px !important; }
.plot-svg .axis-label { font-size:18px !important; }
.plot-svg .inset-label { font-size:11px !important; }
.edge-fig { margin-bottom:2px; }
.edge-caption { display:flex; justify-content:space-between; gap:8px; margin-bottom:4px; font-size:12px; color:#526079; line-height:1.2; }
.edge-key { color:#b42318; font-weight:700; }
.edge-svg { width:100%; height:92px; display:block; }
.edge-svg text { font-size:11px !important; }
.edge-svg .node-num { font-size:12px !important; fill:#1c3177; font-weight:700; }
.edge-svg line { transition: stroke-width .2s linear, stroke .2s linear; }
.point-label,.contour-label { paint-order:stroke; stroke:#f7f9fd; stroke-width:5px; stroke-linejoin:round; }
.demo-panel { padding:0; min-width:0; }
.round-label { font-size:16px; color:#1c3177; margin:2px 0 0; }
.legend { display:flex; gap:10px; font-size:13px; font-weight:600; }
.blue { color:#1c3177; }.orange { color:#a85109; }.red { color:#a52634; }
.weights { font-variant-numeric:tabular-nums; margin:1px 0; font-size:12px; color:#394963; }
.readout { display:flex; justify-content:space-between; padding:1px 0; border-bottom:1px solid #e4e8f0; font-variant-numeric:tabular-nums; font-size:13px; }
.readout strong { font-size:15px; }
.trail-key { font-size:11px; color:#64718a; margin:2px 0; line-height:1.25; }
.controls { display:flex; gap:4px; }
button { border:1px solid #a9b8d0; background:white; border-radius:4px; padding:3px 7px; font-size:13px; }
.controls button:first-child { background:#1c3177; color:white; border-color:#1c3177; }
button:disabled { opacity:.4; }
button:focus-visible,select:focus-visible,input:focus-visible { outline:3px solid #7f96c2; outline-offset:2px; }
.slider { display:flex; gap:8px; align-items:center; font-size:13px; margin-top:3px; }
input { flex:1; min-width:0; accent-color:#1c3177; }
.eta { display:flex; gap:6px; align-items:center; font-size:13px; margin-top:2px; }
.eta span { color:#64718a; font-size:11px; }
select { border:1px solid #a9b8d0; padding:3px; border-radius:3px; background:white; }
.next-update { font-size:13px; color:#526079; margin:6px 0 0 !important; line-height:1.5; }
@media print { .controls,.slider,.eta,.plot-toolbar button { visibility:hidden; } }
</style>
