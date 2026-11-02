<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import Katex from './Katex.vue'

type Mode = 'out' | 'in' | 'union' | 'cut-inside' | 'cut-outside' | 'cut-cases'
const props = withDefaults(defineProps<{
  mode?: Mode
  animateCut?: boolean
  cutStep?: number
  cutPlaying?: boolean
  showCapacity?: boolean
}>(), { mode: 'out', animateCut: false, cutPlaying: false, showCapacity: false })
const isCut = computed(() => props.mode === 'cut-inside' || props.mode === 'cut-outside')
const uid = `anf-tree-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
const nodes = [
  { x: 65, y: 168 }, // root
  { x: 205, y: 80 },
  { x: 205, y: 260 },
  { x: 370, y: 42 },
  { x: 370, y: 165 },
  { x: 370, y: 290 },
]
const outArcs = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]]
const inArcs = [[3, 1], [1, 4], [4, 0], [5, 2], [2, 0]]
// Extra arcs exist in G but are not the first discovery of their head.
const graphArcs: { from: number, to: number, treeStep: number | null }[] = [
  { from: 0, to: 1, treeStep: 1 },
  { from: 0, to: 2, treeStep: 2 },
  { from: 1, to: 2, treeStep: null },
  { from: 1, to: 3, treeStep: 3 },
  { from: 1, to: 4, treeStep: 4 },
  { from: 2, to: 4, treeStep: null },
  { from: 2, to: 5, treeStep: 5 },
  { from: 4, to: 5, treeStep: null },
]
const foundAt = [0, 1, 2, 3, 4, 5]
// BFS in the reversed graph: discover 4 and 2, then 1 and 5, then 3.
const inBuildArcs = [[4, 0], [2, 0], [1, 4], [5, 2], [3, 1]]
const inFoundAt = [0, 3, 2, 5, 1, 4]
const key = (a: number[]) => a.join('-')
const unionArcs = [...outArcs, ...inArcs.filter(e => !outArcs.some(f => key(e) === key(f)))]
const originalArcs = [...graphArcs.map(e => [e.from, e.to]), ...inArcs.filter(e => !graphArcs.some(f => key(e) === key([f.from, f.to])))]
const buildTotal = computed(() => props.mode === 'in' ? 8 : props.mode === 'union' ? 6 + unionArcs.length : props.mode.startsWith('cut-') ? 6 : 5)
const isAnimated = computed(() => ['out', 'in', 'union', 'cut-cases'].includes(props.mode) || props.animateCut)
const { $nav, $page } = useSlideContext()
const isActive = computed(() => $nav.value.currentPage === $page.value)
const shown = ref(buildTotal.value)
const playing = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
function stopBuild() {
  if (timer) clearTimeout(timer)
  timer = undefined
  playing.value = false
}
function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
function headless() {
  return typeof navigator !== 'undefined' && /HeadlessChrome/i.test(navigator.userAgent)
}
function advanceBuild() {
  const delay = props.mode.startsWith('cut-') ? (shown.value >= 3 ? 1700 : 1200)
    : props.mode === 'out' ? 680
    : props.mode === 'in' ? ([0, 1, 6, 7].includes(shown.value) ? 1400 : 850)
      : shown.value === 0 || shown.value === 5 || shown.value === 6 ? 1500 : shown.value > 6 ? 520 : 950
  timer = setTimeout(() => {
    shown.value += 1
    if (shown.value >= buildTotal.value) stopBuild()
    else advanceBuild()
  }, delay)
}
function startBuild() {
  stopBuild()
  if (!isActive.value || reducedMotion() || headless()) {
    shown.value = buildTotal.value
    return
  }
  shown.value = 0
  playing.value = true
  advanceBuild()
}
function toggleBuild() {
  if (playing.value) stopBuild()
  else if (shown.value >= buildTotal.value) startBuild()
  else {
    playing.value = true
    advanceBuild()
  }
}
watch([isActive, () => props.mode, () => props.animateCut], () => {
  if (isAnimated.value) startBuild()
  else {
    stopBuild()
    shown.value = buildTotal.value
  }
}, { immediate: true })
onBeforeUnmount(stopBuild)
const buildCaption = computed(() => {
  if (shown.value <= 0) return '有向グラフ．根から幅優先でたどる'
  if (shown.value < buildTotal.value) return '初めて到達した頂点への辺を残す'
  return '残った青い辺が外向き全域木 T⁺'
})
const inReversed = computed(() => shown.value >= 1 && shown.value <= 7)
const inChosenCount = computed(() => Math.max(0, Math.min(5, shown.value - 1)))
const unionInCount = computed(() => Math.min(5, shown.value))
const capacityCount = computed(() => Math.max(0, shown.value - 6))
const constructionCaption = computed(() => {
  if (props.mode === 'in') {
    if (shown.value === 0) return '① 元の有向グラフ G を用意する'
    if (shown.value === 1) return '② 全辺を反転し，根から探索する'
    if (shown.value <= 6) return `③ 初めて発見した頂点への辺を残す（${inChosenCount.value}/5）`
    if (shown.value === 7) return '④ 選んだ5辺だけを残す'
    return '⑤ 元の向きに戻すと，内向き全域木 T⁻'
  }
  if (shown.value === 0) return '① 外向き全域木 T⁺ の5辺から始める'
  if (shown.value <= 5) return `② 内向き全域木 T⁻ の辺を重ねる（${unionInCount.value}/5）`
  if (shown.value === 6) return '③ 共通辺を1本にまとめる（5 + 5 − 1 = 9辺）'
  if (shown.value < buildTotal.value) return `④ 各辺に容量 1/9 を配る（${capacityCount.value}/9）`
  return '④ 9辺に容量 1/9 ずつ．総容量は1'
})
const isOut = computed(() => props.mode === 'out' || props.mode === 'cut-inside')
// The paired diagrams receive one shared timeline from their parent figure.
const cutStage = computed(() => props.cutStep ?? (props.animateCut ? shown.value : 6))
const cutIsPlaying = computed(() => props.cutStep !== undefined ? props.cutPlaying : playing.value)
const cutRoute = computed(() => props.mode === 'cut-inside' ? [0, 1, 4] : [3, 1, 4, 0])
const cutCrossStage = computed(() => props.mode === 'cut-inside' ? 4 : 3)
const cutCaption = computed(() => {
  if (props.mode === 'cut-cases') {
    return [
      '① 外向き・内向きの木を用意する',
      '② 根が S の内側か外側かで場合分けする',
      '③ S の内側から外側への経路を選ぶ',
      '④ 矢印の向きに沿って経路をたどる',
      '⑤ 最初に S から出る辺を赤く残す',
      '⑥ 途中で S に入り直しても，赤い辺は残る',
      'どちらの場合も，赤い辺に容量 1/k がある',
    ][shown.value]
  }
  if (cutStage.value === 0) return isOut.value ? '① 外向き全域木 T⁺ を用意する' : '① 内向き全域木 T⁻ を用意する'
  if (cutStage.value === 1) return isOut.value ? '② 根を含む頂点集合 S を固定する' : '② 根を含まない頂点集合 S を固定する'
  if (cutStage.value === 2) return isOut.value ? '③ S の外側に終点 b を選ぶ' : '③ S の内側に始点 a を選ぶ'
  if (cutStage.value === 3) return isOut.value ? '④ 根から S の内側を進む' : '④ 最初に S から出る辺 e を赤く残す'
  if (cutStage.value === 4) return isOut.value ? '⑤ 最初に S から出る辺 e を赤く残す' : '⑤ 次の辺では S に入り直す'
  if (cutStage.value === 5) return isOut.value ? '⑥ S の外側の b に到達する' : '⑥ 再び S を出て，根に到達する'
  return '最初に S から出た赤い辺 e が求める1本'
})
const cutCurrentNode = computed(() => cutStage.value < 2 ? -1
  : cutRoute.value[Math.min(cutStage.value - 2, cutRoute.value.length - 1)])
const showControls = computed(() => isAnimated.value && props.mode !== 'out' && !headless() && !reducedMotion())
const descriptions: Record<Mode, string> = {
  out: '根 v_0 から各頂点への有向路を持つ外向き全域木の模式図．青い矢印は根から遠ざかる向き．',
  in: '元のグラフの全辺を反転し，根から幅優先探索で5辺を選ぶ．選んだ辺を元の向きに戻すと，各頂点から根へ到達する内向き全域木になる．',
  union: '外向き全域木に内向き全域木を重ね，共通辺を紫の1本にまとめる．逆向きの辺は別々に数え，和集合の9辺に容量1/9を配る．',
  'cut-inside': '根 v_0 が S の内側にある場合．外向き全域木の v_0 から b への有向路が S の境界を横切る．赤い矢印が S から出る辺．',
  'cut-outside': '根 v_0 が S の外側にある場合．内向き全域木の a から v_0 への有向路が S の境界を横切る．赤い矢印が S から出る辺．',
  'cut-cases': '根の位置による二つの場合を同時にたどる．いずれも最初に S から出る辺を赤く示し，その辺の容量1/kを確認する．',
}
const palette = { out: '#1c3177', in: '#087f8c', shared: '#7651a5', cross: '#b42318', muted: '#c6cfdc' }
function arcPath(from: number, to: number, bend = 0) {
  const a = nodes[from], b = nodes[to]
  const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy)
  const cx = (a.x + b.x) / 2 - dy / length * bend
  const cy = (a.y + b.y) / 2 + dx / length * bend
  const startLength = Math.hypot(cx - a.x, cy - a.y)
  const endLength = Math.hypot(b.x - cx, b.y - cy)
  const sx = a.x + (cx - a.x) / startLength * 14
  const sy = a.y + (cy - a.y) / startLength * 14
  const ex = b.x - (b.x - cx) / endLength * 19
  const ey = b.y - (b.y - cy) / endLength * 19
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`
}
const buildEdges = computed(() => graphArcs.map((edge) => {
  const chosen = edge.treeStep !== null && shown.value >= edge.treeStep
  const fresh = playing.value && edge.treeStep === shown.value && shown.value > 0
  const dropped = edge.treeStep === null && shown.value >= foundAt[edge.from] && shown.value >= foundAt[edge.to]
  return {
    key: `${edge.from}-${edge.to}`,
    path: arcPath(edge.from, edge.to),
    chosen,
    fresh,
    dropped,
  }
}).sort((a, b) => Number(a.chosen) - Number(b.chosen)))
const inBuildEdges = computed(() => originalArcs.map(([from, to]) => {
  const step = inBuildArcs.findIndex(e => key(e) === key([from, to])) + 1
  const chosen = step > 0 && step <= inChosenCount.value
  const reversePair = shown.value < 7 && originalArcs.some(e => e[0] === to && e[1] === from)
  const bend = reversePair ? 18 : 0
  return {
    key: key([from, to]),
    path: inReversed.value ? arcPath(to, from, -bend) : arcPath(from, to, bend),
    chosen,
    hidden: shown.value >= 7 && !chosen,
    fresh: playing.value && chosen && shown.value === step + 1,
  }
}).sort((a, b) => Number(a.chosen) - Number(b.chosen)))
const unionBuildEdges = computed(() => unionArcs.map(([from, to], index) => {
  const k = key([from, to])
  const inStep = inArcs.findIndex(e => key(e) === k) + 1
  const inOut = outArcs.some(e => key(e) === k)
  const inSelected = inStep > 0 && inStep <= unionInCount.value
  const shared = inOut && inSelected && shown.value >= 6
  const reversePair = unionArcs.some(e => e[0] === to && e[1] === from)
  const bend = reversePair ? 18 : 0
  const a = nodes[from], b = nodes[to]
  const length = Math.hypot(b.x - a.x, b.y - a.y)
  const offset = bend / 2 + 13
  return {
    key: k,
    path: arcPath(from, to, bend),
    duplicatePath: arcPath(from, to, -25),
    visible: inOut || inSelected,
    duplicate: inOut && inSelected && shown.value < 6,
    tone: shared ? 'shared' : inOut ? 'out' : 'in',
    fresh: playing.value && ((!inOut && shown.value === inStep) || (shared && shown.value === 6)),
    duplicateFresh: playing.value && shown.value === inStep,
    capacity: capacityCount.value > index,
    capacityFresh: playing.value && capacityCount.value === index + 1,
    labelX: (a.x + b.x) / 2 - (b.y - a.y) / length * offset,
    labelY: (a.y + b.y) / 2 + (b.x - a.x) / length * offset,
  }
}))
const edges = computed(() => {
  const arcs = isOut.value ? outArcs : inArcs
  return arcs.map(([from, to]) => {
    const k = key([from, to])
    const routeIndex = cutRoute.value.findIndex((node, i) => node === from && cutRoute.value[i + 1] === to)
    const revealStage = routeIndex + 3
    const highlighted = routeIndex >= 0 && cutStage.value >= revealStage
    const crossing = highlighted && (isOut.value ? k === '1-4' : k === '3-1')
    const tone = crossing ? 'cross' : highlighted ? (isOut.value ? 'out' : 'in') : 'muted'
    const fresh = cutIsPlaying.value && highlighted && cutStage.value === revealStage
    return { key: k, tone, crossing, highlighted, fresh, path: arcPath(from, to) }
  }).sort((a, b) => Number(a.crossing) - Number(b.crossing))
})
function nodeFill(index: number) {
  if (props.mode === 'in' && index !== 0) return inChosenCount.value >= inFoundAt[index] ? '#e1f2f0' : '#ffffff'
  if (props.mode !== 'out') return index === 0 ? '#1c3177' : '#ffffff'
  if (index === 0) return '#1c3177'
  return shown.value >= foundAt[index] ? '#e4ebf6' : '#ffffff'
}
function nodeStroke(index: number) {
  if (props.mode === 'in' && index !== 0) return inChosenCount.value >= inFoundAt[index] ? palette.in : '#b7c3d6'
  if (props.mode !== 'out' || index === 0 || shown.value >= foundAt[index]) return '#1c3177'
  return '#b7c3d6'
}
</script>

<template>
  <figure class="anf-tree-figure">
    <div v-if="mode === 'cut-cases'" class="anf-case-grid">
      <div>
        <div class="anf-case-label"><Katex expr="v_0\in S" />：外向きの木を使う</div>
        <AnfArborescence mode="cut-inside" :cut-step="shown" :cut-playing="playing" show-capacity />
      </div>
      <div>
        <div class="anf-case-label"><Katex expr="v_0\notin S" />：内向きの木を使う</div>
        <AnfArborescence mode="cut-outside" :cut-step="shown" :cut-playing="playing" show-capacity />
      </div>
    </div>
    <svg v-else :viewBox="mode === 'union' ? '0 0 450 330' : '0 0 450 345'" role="img" :aria-labelledby="`${uid}-title ${uid}-desc`">
      <title :id="`${uid}-title`">有向全域木による ANF の下界</title>
      <desc :id="`${uid}-desc`">{{ descriptions[mode] }}</desc>
      <defs>
        <marker v-for="(color, tone) in palette" :id="`${uid}-${tone}`" :key="tone"
          viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 Z" :fill="color" />
        </marker>
      </defs>

      <g v-if="isCut" :class="{ 'anf-hidden': cutStage < 1, 'anf-capacity-pop': cutIsPlaying && cutStage === 1 }">
        <rect :x="mode === 'cut-inside' ? 18 : 298" y="14"
          :width="mode === 'cut-inside' ? 250 : 130" height="307" rx="28"
          fill="#eef3fc" stroke="#7f96c2" stroke-width="1.8" stroke-dasharray="6 5" />
        <text :x="mode === 'cut-inside' ? 62 : 340" y="45" class="anf-math-label">S</text>
      </g>

      <template v-if="mode === 'out'">
        <path v-for="edge in buildEdges" :key="`${edge.key}-${edge.fresh}`" :d="edge.path" fill="none"
          :class="{ 'anf-draw': edge.fresh, 'anf-dropped': edge.dropped }"
          :stroke="edge.chosen ? palette.out : palette.muted"
          :stroke-width="edge.chosen ? 3.6 : 1.8"
          :marker-end="`url(#${uid}-${edge.chosen ? 'out' : 'muted'})`" stroke-linecap="round" />
      </template>
      <template v-else-if="mode === 'in'">
        <path v-for="edge in inBuildEdges" :key="`${edge.key}-${edge.fresh}-${inReversed}`"
          :d="edge.path" fill="none" pathLength="1"
          :class="{ 'anf-construct-draw': edge.fresh, 'anf-hidden': edge.hidden }"
          :stroke="edge.chosen ? palette.in : palette.muted"
          :stroke-width="edge.chosen ? 3.6 : 1.5"
          :marker-end="`url(#${uid}-${edge.chosen ? 'in' : 'muted'})`" stroke-linecap="round" />
      </template>
      <template v-else-if="mode === 'union'">
        <g v-for="edge in unionBuildEdges" :key="edge.key" :class="{ 'anf-hidden': !edge.visible }">
          <path :key="`${edge.key}-${edge.fresh}`" :d="edge.path" fill="none" pathLength="1"
            :class="{ 'anf-construct-draw': edge.fresh }" :stroke="palette[edge.tone]"
            :stroke-width="edge.capacity ? 3.6 : 2.7" :marker-end="`url(#${uid}-${edge.tone})`" stroke-linecap="round" />
          <path v-if="edge.duplicate" :d="edge.duplicatePath" fill="none" pathLength="1"
            :class="{ 'anf-construct-draw': edge.duplicateFresh }" :stroke="palette.in"
            stroke-width="2.7" :marker-end="`url(#${uid}-in)`" stroke-linecap="round" />
        </g>
        <text v-for="edge in unionBuildEdges.filter(e => e.capacity)" :key="`capacity-${edge.key}`"
          :x="edge.labelX" :y="edge.labelY" :fill="palette[edge.tone]"
          class="anf-capacity" :class="{ 'anf-capacity-pop': edge.capacityFresh }"
          text-anchor="middle" dominant-baseline="central">1/9</text>
      </template>
      <path v-else v-for="edge in edges" :key="`${edge.key}-${edge.fresh}`" :d="edge.path" fill="none" pathLength="1"
        :class="{ 'anf-construct-draw': edge.fresh }"
        :stroke="palette[edge.tone]" :stroke-width="edge.crossing ? 5 : edge.highlighted ? 3.8 : 2.7"
        :marker-end="`url(#${uid}-${edge.tone})`" stroke-linecap="round" />

      <g v-for="(node, index) in nodes" :key="index">
        <circle v-if="isCut && cutIsPlaying && cutCurrentNode === index && cutStage <= 5"
          :key="`cut-node-${index}-${cutStage}`" :cx="node.x" :cy="node.y" r="21" fill="none"
          :stroke="isOut ? palette.out : palette.in" stroke-width="2" class="anf-pulse" />
        <circle v-if="mode === 'out' && playing && shown === foundAt[index] && index !== 0"
          :cx="node.x" :cy="node.y" r="20" fill="none" stroke="#1c3177" stroke-width="2" class="anf-pulse" />
        <circle v-if="mode === 'in' && playing && shown >= 2 && shown <= 6 && inChosenCount === inFoundAt[index] && index !== 0"
          :cx="node.x" :cy="node.y" r="20" fill="none" :stroke="palette.in" stroke-width="2" class="anf-pulse" />
        <circle :cx="node.x" :cy="node.y" :r="index === 0 ? 15 : 12"
          :fill="nodeFill(index)" :stroke="nodeStroke(index)" stroke-width="2" />
        <circle v-if="index === 0" :cx="node.x" :cy="node.y" r="5" fill="#ffffff" />
      </g>

      <text x="64" y="214" class="anf-math-label">v<tspan baseline-shift="sub" font-size="65%" font-style="normal">0</tspan></text>
      <text v-if="mode === 'cut-inside' && cutStage >= 2" x="408" y="170" class="anf-math-label">b</text>
      <text v-if="mode === 'cut-outside' && cutStage >= 2" x="406" y="47" class="anf-math-label">a</text>
      <text v-if="isCut && (animateCut || cutStep !== undefined) && cutStage >= cutCrossStage"
        :x="mode === 'cut-inside' ? 288 : 286" :y="mode === 'cut-inside' ? 112 : 44"
        class="anf-math-label anf-edge-label">e</text>
      <text v-if="isCut && showCapacity && cutStage >= 6" x="301"
        :y="mode === 'cut-inside' ? 199 : 98" class="anf-math-label anf-cut-capacity">q<tspan baseline-shift="sub" font-size="65%">e</tspan><tspan font-style="normal"> = 1/</tspan>k</text>
    </svg>
    <figcaption v-if="mode === 'cut-cases'" class="anf-cases-footer">
      <span>{{ cutCaption }}</span>
      <div v-if="showControls" class="anf-animation-controls" @click.stop @keydown.stop>
        <button type="button" @click="startBuild">↻ もう一度</button>
        <button v-if="shown < buildTotal" type="button" @click="toggleBuild">{{ playing ? '一時停止' : '続ける' }}</button>
      </div>
    </figcaption>
    <figcaption v-else-if="mode === 'union'" class="anf-construction-caption">
      <div class="anf-tree-caption">{{ constructionCaption }}</div>
      <div class="anf-tree-legend">
      <span><i class="out" />外向きの木</span>
      <span><i class="in" />内向きの木</span>
      <span><i class="shared" />共通辺</span>
      </div>
    </figcaption>
    <figcaption v-else-if="isCut && animateCut" class="anf-tree-caption">{{ cutCaption }}</figcaption>
    <figcaption v-else-if="isCut" class="anf-tree-legend">
      <span><i class="cross" />経路が最初に <Katex expr="S" /> から出る辺</span>
    </figcaption>
    <figcaption v-else class="anf-tree-caption">{{ mode === 'out' ? buildCaption : constructionCaption }}</figcaption>
    <div v-if="mode !== 'cut-cases' && showControls"
      class="anf-animation-controls" @click.stop @keydown.stop>
      <button type="button" @click="startBuild">↻ もう一度</button>
      <button v-if="shown < buildTotal" type="button" @click="toggleBuild">{{ playing ? '一時停止' : '続ける' }}</button>
    </div>
  </figure>
</template>

<style scoped>
.anf-tree-figure { margin: 0; width: 100%; }
svg { display: block; width: 100%; height: auto; overflow: visible; }
.anf-math-label { font-family: 'KaTeX_Main', 'Times New Roman', serif; font-size: 23px; font-style: italic; text-anchor: middle; fill: #1c3177; }
.anf-edge-label, .anf-cut-capacity { fill: #b42318; }
.anf-cut-capacity { font-size: 21px; }
.anf-cases-footer { display: flex; justify-content: center; align-items: center; gap: 20px; min-height: 23px; font-size: 12px; color: #46526a; }
.anf-cases-footer .anf-animation-controls { margin: 0; }
.anf-tree-legend, .anf-tree-caption { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 14px; font-size: 13px; line-height: 1.5; color: #46526a; }
.anf-tree-legend span { display: inline-flex; align-items: center; gap: 5px; }
.anf-tree-legend i { display: inline-block; width: 17px; height: 3px; border-radius: 1px; }
.anf-construction-caption .anf-tree-caption { min-height: 1.5em; align-items: center; }
.anf-animation-controls { display: flex; justify-content: center; gap: 16px; height: 23px; margin-top: 3px; }
.anf-animation-controls button { padding: 0 2px; font: inherit; font-size: 11px; color: #64748b; background: none; border: 0; cursor: pointer; }
.anf-animation-controls button:hover { color: #1c3177; text-decoration: underline; }
.anf-animation-controls button:focus-visible { outline: 2px solid #7f96c2; outline-offset: 2px; }
.anf-hidden { opacity: 0; pointer-events: none; }
.anf-construct-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: anf-draw 0.5s ease forwards; }
.anf-capacity { font-size: 16px; font-weight: 650; paint-order: stroke; stroke: white; stroke-width: 5px; stroke-linejoin: round; }
.anf-capacity-pop { animation: anf-capacity-pop 0.4s ease-out; }
@keyframes anf-capacity-pop { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .anf-construct-draw, .anf-capacity-pop, .anf-pulse { animation: none; stroke-dashoffset: 0; }
}
@media print { .anf-animation-controls { display: none; } }
.anf-dropped { opacity: 0.55; stroke-dasharray: 5 4; }
.anf-draw { stroke-dasharray: 280; stroke-dashoffset: 280; animation: anf-draw 0.45s ease forwards; }
.anf-pulse { transform-box: fill-box; transform-origin: center; animation: anf-pulse 0.7s ease-out; }
@keyframes anf-draw { to { stroke-dashoffset: 0; } }
@keyframes anf-pulse { from { opacity: 0.15; } to { opacity: 0.85; } }
.out { background: #1c3177; } .in { background: #087f8c; }
.shared { background: #7651a5; } .cross { background: #b42318; }
</style>
