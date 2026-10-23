<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import Katex from './Katex.vue'

type Mode = 'out' | 'in' | 'union' | 'cut-inside' | 'cut-outside'
const props = withDefaults(defineProps<{ mode?: Mode }>(), { mode: 'out' })
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
const buildTotal = 5
const { $nav, $page } = useSlideContext()
const isActive = computed(() => $nav.value.currentPage === $page.value)
const shown = ref(buildTotal)
const playing = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
function stopBuild() {
  if (timer) clearInterval(timer)
  timer = undefined
  playing.value = false
}
function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
function headless() {
  return typeof navigator !== 'undefined' && /HeadlessChrome/i.test(navigator.userAgent)
}
watch(isActive, (active) => {
  if (props.mode !== 'out') return
  stopBuild()
  if (!active || reducedMotion() || headless()) {
    shown.value = buildTotal
    return
  }
  shown.value = 0
  playing.value = true
  timer = setInterval(() => {
    shown.value += 1
    if (shown.value >= buildTotal) stopBuild()
  }, 680)
}, { immediate: true })
onBeforeUnmount(stopBuild)
const buildCaption = computed(() => {
  if (shown.value <= 0) return '有向グラフ．根から幅優先でたどる'
  if (shown.value < buildTotal) return '初めて到達した頂点への辺を残す'
  return '残った青い辺が外向き全域木 T⁺'
})
const key = (a: number[]) => a.join('-')
const isCut = computed(() => props.mode.startsWith('cut-'))
const isOut = computed(() => props.mode === 'out' || props.mode === 'cut-inside')
const descriptions: Record<Mode, string> = {
  out: '根 v_0 から各頂点への有向路を持つ外向き全域木の模式図．青い矢印は根から遠ざかる向き．',
  in: '各頂点から根 v_0 への有向路を持つ内向き全域木の模式図．緑の矢印をたどると根へ到達する．',
  union: '二つの有向全域木の和集合．共通する有向辺は紫の実線で一度だけ描き，逆向きの辺は別々の矢印で描く．',
  'cut-inside': '根 v_0 が S の内側にある場合．外向き全域木の v_0 から b への有向路が S の境界を横切る．赤い矢印が S から出る辺．',
  'cut-outside': '根 v_0 が S の外側にある場合．内向き全域木の a から v_0 への有向路が S の境界を横切る．赤い矢印が S から出る辺．',
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
const edges = computed(() => {
  const union = props.mode === 'union'
  const arcs = union
    ? [...outArcs, ...inArcs.filter(e => !outArcs.some(f => key(e) === key(f)))]
    : isOut.value ? outArcs : inArcs
  return arcs.map(([from, to]) => {
    const k = key([from, to])
    const shared = union && outArcs.some(e => key(e) === k) && inArcs.some(e => key(e) === k)
    const highlighted = props.mode === 'cut-inside' ? ['0-1', '1-4'].includes(k)
      : props.mode === 'cut-outside' ? ['3-1', '1-4', '4-0'].includes(k) : false
    const crossing = props.mode === 'cut-inside' ? k === '1-4'
      : props.mode === 'cut-outside' ? k === '3-1' : false
    const tone = crossing ? 'cross' : isCut.value && !highlighted ? 'muted'
      : shared ? 'shared' : outArcs.some(e => key(e) === k) && (union || isOut.value) ? 'out' : 'in'
    const reverse = union && arcs.some(e => e[0] === to && e[1] === from)
    return { key: k, tone, crossing, highlighted, path: arcPath(from, to, reverse ? 18 : 0) }
  }).sort((a, b) => Number(a.crossing) - Number(b.crossing))
})
function nodeFill(index: number) {
  if (props.mode !== 'out') return index === 0 ? '#1c3177' : '#ffffff'
  if (index === 0) return '#1c3177'
  return shown.value >= foundAt[index] ? '#e4ebf6' : '#ffffff'
}
function nodeStroke(index: number) {
  if (props.mode !== 'out' || index === 0 || shown.value >= foundAt[index]) return '#1c3177'
  return '#b7c3d6'
}
</script>

<template>
  <figure class="anf-tree-figure">
    <svg viewBox="0 0 450 345" role="img" :aria-labelledby="`${uid}-title ${uid}-desc`">
      <title :id="`${uid}-title`">有向全域木による ANF の下界</title>
      <desc :id="`${uid}-desc`">{{ descriptions[mode] }}</desc>
      <defs>
        <marker v-for="(color, tone) in palette" :id="`${uid}-${tone}`" :key="tone"
          viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 Z" :fill="color" />
        </marker>
      </defs>

      <template v-if="isCut">
        <rect :x="mode === 'cut-inside' ? 18 : 298" y="14"
          :width="mode === 'cut-inside' ? 250 : 130" height="307" rx="28"
          fill="#eef3fc" stroke="#7f96c2" stroke-width="1.8" stroke-dasharray="6 5" />
        <foreignObject :x="mode === 'cut-inside' ? 32 : 310" y="22" width="60" height="35">
          <div xmlns="http://www.w3.org/1999/xhtml" class="anf-math-label"><Katex expr="S" /></div>
        </foreignObject>
      </template>

      <template v-if="mode === 'out'">
        <path v-for="edge in buildEdges" :key="`${edge.key}-${edge.fresh}`" :d="edge.path" fill="none"
          :class="{ 'anf-draw': edge.fresh, 'anf-dropped': edge.dropped }"
          :stroke="edge.chosen ? palette.out : palette.muted"
          :stroke-width="edge.chosen ? 3.6 : 1.8"
          :marker-end="`url(#${uid}-${edge.chosen ? 'out' : 'muted'})`" stroke-linecap="round" />
      </template>
      <path v-else v-for="edge in edges" :key="edge.key" :d="edge.path" fill="none"
        :stroke="palette[edge.tone]" :stroke-width="edge.crossing ? 5 : edge.highlighted ? 3.8 : 2.7"
        :marker-end="`url(#${uid}-${edge.tone})`" stroke-linecap="round" />

      <g v-for="(node, index) in nodes" :key="index">
        <circle v-if="mode === 'out' && playing && shown === foundAt[index] && index !== 0"
          :cx="node.x" :cy="node.y" r="20" fill="none" stroke="#1c3177" stroke-width="2" class="anf-pulse" />
        <circle :cx="node.x" :cy="node.y" :r="index === 0 ? 15 : 12"
          :fill="nodeFill(index)" :stroke="nodeStroke(index)" stroke-width="2" />
        <circle v-if="index === 0" :cx="node.x" :cy="node.y" r="5" fill="#ffffff" />
      </g>

      <foreignObject x="28" y="190" width="72" height="37">
        <div xmlns="http://www.w3.org/1999/xhtml" class="anf-math-label"><Katex expr="v_0" /></div>
      </foreignObject>
      <foreignObject v-if="mode === 'cut-inside'" x="386" y="146" width="45" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml" class="anf-math-label"><Katex expr="b" /></div>
      </foreignObject>
      <foreignObject v-if="mode === 'cut-outside'" x="386" y="23" width="40" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml" class="anf-math-label"><Katex expr="a" /></div>
      </foreignObject>
    </svg>
    <figcaption v-if="mode === 'union'" class="anf-tree-legend">
      <span><i class="out" />外向きの木</span>
      <span><i class="in" />内向きの木</span>
      <span><i class="shared" />共通辺</span>
    </figcaption>
    <figcaption v-else-if="isCut" class="anf-tree-legend">
      <span><i class="cross" />経路が最初に <Katex expr="S" /> から出る辺</span>
    </figcaption>
    <figcaption v-else class="anf-tree-caption">{{ mode === 'out' ? buildCaption : (isOut ? '根から全頂点へ' : '全頂点から根へ') + '（模式図）' }}</figcaption>
  </figure>
</template>

<style scoped>
.anf-tree-figure { margin: 0; width: 100%; }
svg { display: block; width: 100%; height: auto; overflow: visible; }
.anf-math-label { font-size: 23px; line-height: 32px; text-align: center; color: #1c3177; }
.anf-tree-legend, .anf-tree-caption { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 14px; font-size: 13px; line-height: 1.5; color: #46526a; }
.anf-tree-legend span { display: inline-flex; align-items: center; gap: 5px; }
.anf-tree-legend i { display: inline-block; width: 17px; height: 3px; border-radius: 1px; }
.anf-dropped { opacity: 0.55; stroke-dasharray: 5 4; }
.anf-draw { stroke-dasharray: 280; stroke-dashoffset: 280; animation: anf-draw 0.45s ease forwards; }
.anf-pulse { transform-box: fill-box; transform-origin: center; animation: anf-pulse 0.7s ease-out; }
@keyframes anf-draw { to { stroke-dashoffset: 0; } }
@keyframes anf-pulse { from { opacity: 0.15; } to { opacity: 0.85; } }
.out { background: #1c3177; } .in { background: #087f8c; }
.shared { background: #7651a5; } .cross { background: #b42318; }
</style>
