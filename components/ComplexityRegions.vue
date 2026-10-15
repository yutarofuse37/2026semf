<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  /** Fix step; omit to sync with slide clicks */
  step?: number
}>(), {})

const BLUE = '#1c3177'
const A2 = '#c2410c'
const A1 = '#0f766e'
const A1_FILL = '#0f766e'
const A2_FILL = '#c2410c'

const { $clicks } = useSlideContext()
/** 0: 座標 → 1: 両領域 → 2: パス（A₂） → 3: 密（A₁） */
const step = computed(() => {
  if (props.step != null)
    return Math.min(Math.max(props.step, 0), 3)
  return Math.min(Math.max(Number($clicks.value ?? 0), 0), 3)
})
</script>

<template>
  <div class="cr" :data-step="step">
    <div class="cr__legend">
      <span class="cr__chip cr__chip--a2"><i />A₂ が速い</span>
      <span class="cr__chip cr__chip--a1"><i />A₁ が速い</span>
    </div>

    <svg viewBox="0 0 300 245" class="cr__svg" aria-hidden="true">
      <defs>
        <marker id="crX" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L5,3 L0,6 Z" :fill="BLUE" />
        </marker>
        <marker id="crY" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L5,3 L0,6 Z" :fill="BLUE" />
        </marker>
      </defs>

      <polygon class="cr__a1" points="56,36 270,36 270,200 163,200 56,118" :fill="A1_FILL" />
      <polygon class="cr__a2" points="56,200 163,200 56,118" :fill="A2_FILL" />

      <line x1="56" y1="200" x2="278" y2="200" :stroke="BLUE" stroke-width="1.8" marker-end="url(#crX)" />
      <line x1="56" y1="200" x2="56" y2="24" :stroke="BLUE" stroke-width="1.8" marker-end="url(#crY)" />
      <line x1="56" y1="118" x2="163" y2="200" stroke="#fff" stroke-width="4" />
      <line x1="56" y1="118" x2="163" y2="200" :stroke="BLUE" stroke-width="2" />

      <text x="56" y="216" text-anchor="middle" class="cr__t">1</text>
      <text x="163" y="216" text-anchor="middle" class="cr__t">3/2</text>
      <text x="270" y="216" text-anchor="middle" class="cr__t">2</text>
      <text x="46" y="204" text-anchor="end" class="cr__t">-3</text>
      <text x="46" y="122" text-anchor="end" class="cr__t">-2</text>
      <text x="46" y="40" text-anchor="end" class="cr__t">-1</text>

      <foreignObject x="200" y="218" width="90" height="20">
        <div xmlns="http://www.w3.org/1999/xhtml" class="cr__ax-html">
          <Katex expr="x=\log_n m" />
        </div>
      </foreignObject>
      <foreignObject x="2" y="2" width="90" height="20">
        <div xmlns="http://www.w3.org/1999/xhtml" class="cr__ax-html">
          <Katex expr="y=\log_n\mathsf{OPT}" />
        </div>
      </foreignObject>

      <text class="cr__lab cr__lab--a1" x="190" y="110" text-anchor="middle">A₁</text>
      <text class="cr__lab cr__lab--a2" x="90" y="175" text-anchor="middle">A₂</text>

      <g class="cr__pt cr__pt--path">
        <circle cx="82" cy="178" r="8" fill="#fff" :stroke="A2" stroke-width="2.4" />
        <circle cx="82" cy="178" r="3.5" :fill="A2" />
      </g>
      <g class="cr__pt cr__pt--dense">
        <circle cx="230" cy="78" r="8" fill="#fff" :stroke="A1" stroke-width="2.4" />
        <circle cx="230" cy="78" r="3.5" :fill="A1" />
      </g>
    </svg>

    <div class="cr__panel cr__panel--path">
      <div class="cr__panel-head">具体例：パス <Katex expr="P_n" /></div>
      <svg viewBox="0 0 180 40" class="cr__mini" aria-hidden="true">
        <line x1="16" y1="20" x2="164" y2="20" :stroke="A2" stroke-width="3" stroke-linecap="round" />
        <circle cx="16" cy="20" r="7" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="64" cy="20" r="7" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="112" cy="20" r="7" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="160" cy="20" r="7" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
      </svg>
      <div class="cr__panel-meta">
        <Katex expr="m\approx n,\ \mathsf{OPT}\approx n^{-3}" /> → 点は A₂ 側
      </div>
    </div>

    <div class="cr__panel cr__panel--dense">
      <div class="cr__panel-head">具体例：密／直径 <Katex expr="O(1)" /></div>
      <svg viewBox="0 0 180 52" class="cr__mini" aria-hidden="true">
        <line x1="50" y1="14" x2="130" y2="14" :stroke="A1" stroke-width="2.2" />
        <line x1="50" y1="14" x2="50" y2="40" :stroke="A1" stroke-width="2.2" />
        <line x1="130" y1="14" x2="130" y2="40" :stroke="A1" stroke-width="2.2" />
        <line x1="50" y1="40" x2="130" y2="40" :stroke="A1" stroke-width="2.2" />
        <line x1="50" y1="14" x2="130" y2="40" :stroke="BLUE" stroke-width="1.5" />
        <line x1="130" y1="14" x2="50" y2="40" :stroke="BLUE" stroke-width="1.5" />
        <line x1="90" y1="6" x2="50" y2="14" :stroke="BLUE" stroke-width="1.5" />
        <line x1="90" y1="6" x2="130" y2="14" :stroke="BLUE" stroke-width="1.5" />
        <circle cx="50" cy="14" r="6" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
        <circle cx="130" cy="14" r="6" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
        <circle cx="50" cy="40" r="6" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
        <circle cx="130" cy="40" r="6" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
        <circle cx="90" cy="6" r="6" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
      </svg>
      <div class="cr__panel-meta">
        <Katex expr="\mathsf{OPT}\gtrsim n^{-2}" />，密なら → 点は A₁ 側
      </div>
    </div>
  </div>
</template>

<style scoped>
.cr {
  width: 100%;
  max-width: 18rem;
  margin: 0 auto;
  color: #1a1a1a;
}
.cr__legend {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin-bottom: 0.35rem;
}
.cr__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a1a1a;
}
.cr__chip i {
  display: inline-block;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 0.15rem;
  border: 1px solid transparent;
}
.cr__chip--a2 i { background: #c2410c; }
.cr__chip--a1 i { background: #0f766e; }

.cr__svg { width: 100%; height: auto; display: block; }
.cr__t {
  font-size: 11px;
  fill: #1a1a1a;
  font-family: system-ui, sans-serif;
  font-weight: 600;
}
.cr__ax-html {
  font-size: 10px;
  color: #1a1a1a;
  line-height: 1.1;
}
.cr__lab {
  font-size: 22px;
  font-weight: 800;
  font-family: system-ui, sans-serif;
  transition: opacity 0.3s ease;
}
.cr__lab--a1 { fill: #fff; }
.cr__lab--a2 { fill: #fff; }
.cr__a1,
.cr__a2,
.cr__pt { transition: opacity 0.3s ease; opacity: 0; }
.cr__panel {
  display: none;
  margin-top: 0.55rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.5rem;
  background: #f9fbff;
}
.cr__panel--path { border: 2px solid #c2410c; }
.cr__panel--dense { border: 2px solid #0f766e; }
.cr__panel-head {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
}
.cr__mini { width: 100%; height: auto; display: block; margin-top: 0.2rem; }
.cr__panel-meta {
  margin-top: 0.2rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
}

.cr[data-step="0"] .cr__lab { opacity: 0; }

.cr[data-step="1"] .cr__a1,
.cr[data-step="1"] .cr__a2 { opacity: 1; }

.cr[data-step="2"] .cr__a1 { opacity: 0.28; }
.cr[data-step="2"] .cr__a2 { opacity: 1; }
.cr[data-step="2"] .cr__lab--a1 { opacity: 0.35; }
.cr[data-step="2"] .cr__pt--path { opacity: 1; }
.cr[data-step="2"] .cr__panel--path { display: block; }
.cr[data-step="2"] .cr__chip--a1 { opacity: 0.45; }

.cr[data-step="3"] .cr__a1 { opacity: 1; }
.cr[data-step="3"] .cr__a2 { opacity: 0.28; }
.cr[data-step="3"] .cr__lab--a2 { opacity: 0.4; }
.cr[data-step="3"] .cr__pt--dense { opacity: 1; }
.cr[data-step="3"] .cr__panel--dense { display: block; }
.cr[data-step="3"] .cr__chip--a2 { opacity: 0.45; }
</style>
