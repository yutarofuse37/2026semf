<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  stage: number
  weights?: number[]
  symbolic?: boolean
  showWeights?: boolean
}>(), { weights: () => [0.45, 0.10, 0.45], symbolic: false, showWeights: true })

const positions = [52, 144, 256, 348]
const moved = computed(() => props.stage >= 1)
const evaluated = computed(() => props.stage >= 2)
const edgeWidth = (i: number) => 1.5 + 10 * props.weights[i]
const labels = computed(() => props.symbolic ? ['w₁₂', 'w₂₃', 'w₃₄'] : props.weights.map(w => w.toFixed(2)))
</script>

<template>
  <svg viewBox="0 0 400 154" class="ac-graph" :class="{ moved, evaluated }" role="img" aria-label="4頂点のパス。左の2頂点はマイナス2分の1、右の2頂点はプラス2分の1だけ変位する。両端の辺のコストは0で、中央の辺だけが寄与する。">
    <g class="ac-graph-reference" :class="{ visible: moved }">
      <line x1="52" y1="71" x2="348" y2="71" />
      <circle v-for="x in positions" :key="x" :cx="x" cy="71" r="13" />
    </g>
    <g class="ac-graph-arrows" :class="{ visible: moved }">
      <g v-for="(x, i) in positions" :key="i">
        <line :x1="x" y1="20" :x2="x + (i < 2 ? -18 : 18)" y2="20" />
        <path :d="i < 2 ? `M ${x - 12} 15 L ${x - 18} 20 L ${x - 12} 25` : `M ${x + 12} 15 L ${x + 18} 20 L ${x + 12} 25`" />
      </g>
    </g>
    <line class="ac-graph-middle" x1="144" y1="71" x2="256" y2="71" :stroke-width="edgeWidth(1)" />
    <text v-if="showWeights" x="200" y="51" class="ac-graph-weight ac-graph-middle-label">{{ labels[1] }}</text>
    <g v-for="side in [0, 1]" :key="side" class="ac-graph-half" :class="side === 0 ? 'left' : 'right'">
      <line :x1="positions[side * 2]" y1="71" :x2="positions[side * 2 + 1]" y2="71" :stroke-width="edgeWidth(side * 2)" class="ac-graph-edge" />
      <text v-if="showWeights" :x="side === 0 ? 98 : 302" y="51" class="ac-graph-weight">{{ labels[side * 2] }}</text>
      <g v-for="i in [side * 2, side * 2 + 1]" :key="i">
        <circle :cx="positions[i]" cy="71" r="14" class="ac-graph-node" />
        <text :x="positions[i]" y="77" class="ac-graph-number">{{ i + 1 }}</text>
        <text :x="positions[i]" y="105" class="ac-graph-value" :class="{ visible: moved }">{{ i < 2 ? '−½' : '+½' }}</text>
      </g>
    </g>
    <g class="ac-graph-contributions" :class="{ visible: evaluated }">
      <text x="80" y="141" class="ac-graph-zero">0</text>
      <text x="200" y="141" class="ac-graph-cost">{{ symbolic ? 'w₂₃' : weights[1].toFixed(2) }}</text>
      <text x="320" y="141" class="ac-graph-zero">0</text>
      <path d="M 62 117 L 62 121 L 98 121 L 98 117 M 164 117 L 164 121 L 236 121 L 236 117 M 302 117 L 302 121 L 338 121 L 338 117" />
    </g>
  </svg>
</template>

<style scoped>
.ac-graph { display: block; width: 100%; overflow: visible; }
.ac-graph .ac-graph-number { text-anchor: middle; font-size: 17px; fill: #1c3177; }
.ac-graph .ac-graph-weight { text-anchor: middle; font-size: 16px; fill: #1c3177; font-family: 'KaTeX_Main', 'Times New Roman', serif; font-style: italic; }
.ac-graph .ac-graph-value { text-anchor: middle; font-size: 19px; font-family: 'KaTeX_Main', 'Times New Roman', serif; fill: #444; }
.ac-graph .ac-graph-cost { text-anchor: middle; font-size: 20px; fill: #b42318; font-family: 'KaTeX_Main', 'Times New Roman', serif; }
.ac-graph .ac-graph-zero { text-anchor: middle; font-size: 18px; fill: #687890; }
.ac-graph-node { fill: #fff; stroke: #1c3177; stroke-width: 1.8; }
.ac-graph-edge, .ac-graph-middle { stroke: #1c3177; stroke-linecap: round; }
.ac-graph-reference { fill: none; stroke: #c6cfdc; stroke-width: 1; }
.ac-graph-reference line { stroke-dasharray: 3 4; }
.ac-graph-arrows { fill: none; stroke: #b42318; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.ac-graph-half { transition: transform .7s ease; }
.ac-graph-middle { transform-origin: 200px 71px; transition: transform .7s ease, stroke .35s ease; }
.ac-graph.moved .ac-graph-half.left { transform: translateX(-18px); }
.ac-graph.moved .ac-graph-half.right { transform: translateX(18px); }
.ac-graph.moved .ac-graph-middle { transform: scaleX(1.3214285714); }
.ac-graph.evaluated .ac-graph-middle { stroke: #b42318; }
.ac-graph.evaluated .ac-graph-middle-label { fill: #b42318; }
.ac-graph-reference, .ac-graph-arrows, .ac-graph-value, .ac-graph-contributions { opacity: 0; transition: opacity .35s ease; }
.ac-graph .visible { opacity: 1; }
.ac-graph-contributions path { fill: none; stroke: #a7b5ca; stroke-width: 1; }
@media (prefers-reduced-motion: reduce) { .ac-graph * { transition: none; } }
</style>
