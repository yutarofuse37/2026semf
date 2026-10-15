<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const BLUE = '#1c3177'
const SUB = '#7f96c2'
const WEAK = '#b42318'

const props = withDefaults(defineProps<{
  /** Fix step; omit to sync with slide clicks */
  step?: number
}>(), {})

const { $clicks } = useSlideContext()
/** 0: w → 1: Fiedler → 2: 利得 ℓ → 3: 乗法更新 → 4: 平均出力 */
const step = computed(() => {
  if (props.step != null)
    return Math.min(Math.max(props.step, 0), 4)
  return Math.min(Math.max(Number($clicks.value ?? 0), 0), 4)
})

const captionParts = computed(() => {
  switch (step.value) {
    case 0:
      return { before: '現在の重み ', math: 'w^{(t)}', after: '（一様から開始）' }
    case 1:
      return { before: '近似Fiedler ', math: 'x^{(t)}', after: '：弱点を探る引っ張り' }
    case 2:
      return { before: '利得 ', math: '\\ell_t(e)=(x_u-x_v)^2/4', after: '：伸びた辺が大きい' }
    case 3:
      return { before: '乗法更新：利得大の辺を厚くする', math: '', after: '' }
    default:
      return { before: '平均 ', math: '\\bar{w}=\\tfrac1T\\sum_t w^{(t)}', after: ' を出力' }
  }
})
</script>

<template>
  <div class="mi" :data-step="step">
    <div class="mi__pipeline">
      <span class="mi__chip" :class="{ 'is-on': step >= 0 }"><Katex expr="w^{(t)}" /></span>
      <span class="mi__arrow">→</span>
      <span class="mi__chip" :class="{ 'is-on': step >= 1 }"><Katex expr="x^{(t)}" /></span>
      <span class="mi__arrow">→</span>
      <span class="mi__chip" :class="{ 'is-on': step >= 2 }"><Katex expr="\ell_t" /></span>
      <span class="mi__arrow">→</span>
      <span class="mi__chip" :class="{ 'is-on': step >= 3 }"><Katex expr="w^{(t+1)}" /></span>
      <span class="mi__arrow">→</span>
      <span class="mi__chip mi__chip--out" :class="{ 'is-on': step >= 4 }"><Katex expr="\bar{w}" /></span>
    </div>

    <svg viewBox="0 0 360 168" class="mi__svg" aria-hidden="true">
      <!-- pull arrows -->
      <g class="mi__pull mi__pull--l">
        <line x1="70" y1="36" x2="40" y2="36" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
        <polygon points="28,36 42,29 42,43" :fill="BLUE" />
        <text x="48" y="24" text-anchor="middle" class="mi__dir">左へ</text>
      </g>
      <g class="mi__pull mi__pull--r">
        <line x1="290" y1="36" x2="320" y2="36" :stroke="WEAK" stroke-width="2.2" stroke-linecap="round" />
        <polygon points="332,36 318,29 318,43" :fill="WEAK" />
        <text x="312" y="24" text-anchor="middle" class="mi__dir mi__dir--atk">右へ</text>
      </g>

      <!-- edges: before update (uniform / mid highlighted) -->
      <g class="mi__graph mi__graph--before">
        <line class="mi__e mi__e--side" x1="48" y1="72" x2="118" y2="72" stroke-linecap="round" />
        <line class="mi__e mi__e--mid" x1="142" y1="72" x2="218" y2="72" stroke-linecap="round" />
        <line class="mi__e mi__e--side" x1="242" y1="72" x2="312" y2="72" stroke-linecap="round" />
      </g>

      <!-- edges: after multiplicative update -->
      <g class="mi__graph mi__graph--after">
        <line class="mi__e mi__e--side-thin" x1="48" y1="72" x2="118" y2="72" :stroke="SUB" stroke-linecap="round" />
        <line class="mi__e mi__e--mid-thick" x1="142" y1="72" x2="218" y2="72" :stroke="BLUE" stroke-linecap="round" />
        <line class="mi__e mi__e--side-thin" x1="242" y1="72" x2="312" y2="72" :stroke="SUB" stroke-linecap="round" />
      </g>

      <!-- nodes -->
      <g class="mi__nodes">
        <circle cx="36" cy="72" r="14" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="130" cy="72" r="14" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="230" cy="72" r="14" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="324" cy="72" r="14" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <text x="36" y="76" text-anchor="middle" class="mi__num">1</text>
        <text x="130" y="76" text-anchor="middle" class="mi__num">2</text>
        <text x="230" y="76" text-anchor="middle" class="mi__num">3</text>
        <text x="324" y="76" text-anchor="middle" class="mi__num">4</text>
      </g>

      <!-- gain badges -->
      <g class="mi__gains">
        <rect x="58" y="96" width="50" height="18" rx="6" fill="#f9fbff" stroke="#cfdbed" />
        <foreignObject x="58" y="96" width="50" height="18">
          <div xmlns="http://www.w3.org/1999/xhtml" class="mi__badge">
            <Katex expr="\ell\!\approx\!0" />
          </div>
        </foreignObject>
        <rect x="155" y="96" width="58" height="18" rx="6" fill="#fff5f4" stroke="#f3c1bc" />
        <foreignObject x="155" y="96" width="58" height="18">
          <div xmlns="http://www.w3.org/1999/xhtml" class="mi__badge mi__badge--hot">
            <Katex expr="\ell\!\approx\!1" />
          </div>
        </foreignObject>
        <rect x="252" y="96" width="50" height="18" rx="6" fill="#f9fbff" stroke="#cfdbed" />
        <foreignObject x="252" y="96" width="50" height="18">
          <div xmlns="http://www.w3.org/1999/xhtml" class="mi__badge">
            <Katex expr="\ell\!\approx\!0" />
          </div>
        </foreignObject>
      </g>

      <!-- update formula hint -->
      <g class="mi__update">
        <rect x="70" y="122" width="220" height="28" rx="8" fill="#e4ebf6" stroke="#cfdbed" />
        <foreignObject x="70" y="122" width="220" height="28">
          <div xmlns="http://www.w3.org/1999/xhtml" class="mi__upd-fo">
            <Katex expr="w_e \leftarrow w_e\exp(\eta\,\ell_t(e))" />
          </div>
        </foreignObject>
      </g>

      <!-- average output bar -->
      <g class="mi__avg">
        <rect x="70" y="122" width="220" height="28" rx="8" fill="#ecfdf5" stroke="#99f6e4" />
        <foreignObject x="70" y="122" width="220" height="28">
          <div xmlns="http://www.w3.org/1999/xhtml" class="mi__upd-fo mi__upd-fo--out">
            <Katex expr="\bar{w}=\tfrac1T\sum_{t} w^{(t)}" />
          </div>
        </foreignObject>
      </g>
    </svg>

    <div class="mi__caption">
      <template v-if="captionParts.math">
        {{ captionParts.before }}<Katex :expr="captionParts.math" />{{ captionParts.after }}
      </template>
      <template v-else>
        {{ captionParts.before }}
      </template>
    </div>
  </div>
</template>

<style scoped>
.mi {
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
  color: #1a1a1a;
}
.mi__pipeline {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.15rem 0.2rem;
  margin-bottom: 0.35rem;
}
.mi__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.35rem;
  padding: 0.1rem 0.35rem;
  border-radius: 999px;
  border: 1px solid #cfdbed;
  background: #f9fbff;
  font-size: 0.82rem;
  opacity: 0.4;
  transition: opacity 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}
.mi__chip.is-on {
  opacity: 1;
  border-color: #7f96c2;
  background: #e4ebf6;
}
.mi__chip--out.is-on {
  border-color: #5eead4;
  background: #ecfdf5;
}
.mi__arrow {
  font-size: 0.7rem;
  color: #555;
}
.mi__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.mi__dir {
  font-size: 10px;
  fill: #1c3177;
  font-family: system-ui, sans-serif;
}
.mi__dir--atk { fill: #b42318; }
.mi__num {
  font-size: 12px;
  fill: #1a1a1a;
  font-family: system-ui, sans-serif;
  font-weight: 700;
}
.mi__e--side {
  stroke: #7f96c2;
  stroke-width: 3.2;
}
.mi__e--mid {
  stroke: #7f96c2;
  stroke-width: 3.2;
}
.mi__e--side-thin {
  stroke-width: 1.6;
}
.mi__e--mid-thick {
  stroke-width: 7.5;
}
.mi__badge,
.mi__upd-fo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #1a1a1a;
  line-height: 1;
}
.mi__badge--hot { color: #b42318; }
.mi__upd-fo--out { color: #0f766e; }
.mi__caption {
  margin-top: 0.25rem;
  text-align: center;
  font-size: 0.85rem;
  color: #444;
  min-height: 1.6em;
}

.mi__pull,
.mi__gains,
.mi__update,
.mi__avg,
.mi__graph--after {
  opacity: 0;
  transition: opacity 0.35s ease;
}
.mi__graph--before { opacity: 1; transition: opacity 0.35s ease; }

/* step 0: uniform weights */
.mi[data-step="0"] .mi__e--side,
.mi[data-step="0"] .mi__e--mid {
  stroke: #7f96c2;
  stroke-width: 3.2;
}

/* step 1: Fiedler pull */
.mi[data-step="1"] .mi__pull { opacity: 1; }
.mi[data-step="1"] .mi__pull--l { animation: mi-l 2.6s ease-in-out infinite; }
.mi[data-step="1"] .mi__pull--r { animation: mi-r 2.6s ease-in-out infinite; }
.mi[data-step="1"] .mi__nodes { animation: mi-split 2.6s ease-in-out infinite; }
.mi[data-step="1"] .mi__e--mid {
  stroke: #b42318;
  stroke-width: 2;
}

/* step 2: gains */
.mi[data-step="2"] .mi__pull { opacity: 1; }
.mi[data-step="2"] .mi__gains { opacity: 1; }
.mi[data-step="2"] .mi__e--mid {
  stroke: #b42318;
  stroke-width: 2.4;
}
.mi[data-step="2"] .mi__e--side {
  stroke: #cfdbed;
  stroke-width: 2.2;
}

/* step 3: multiplicative update */
.mi[data-step="3"] .mi__graph--before { opacity: 0; }
.mi[data-step="3"] .mi__graph--after { opacity: 1; }
.mi[data-step="3"] .mi__gains { opacity: 0.55; }
.mi[data-step="3"] .mi__update { opacity: 1; }
.mi[data-step="3"] .mi__e--mid-thick { animation: mi-thicken 2.4s ease-in-out infinite; }

/* step 4: average output */
.mi[data-step="4"] .mi__graph--before { opacity: 0; }
.mi[data-step="4"] .mi__graph--after { opacity: 1; }
.mi[data-step="4"] .mi__avg { opacity: 1; }
.mi[data-step="4"] .mi__e--mid-thick { stroke-width: 6.5; }
.mi[data-step="4"] .mi__e--side-thin { stroke-width: 2.2; }

@keyframes mi-l {
  0%, 20% { transform: translateX(0); opacity: 0.45; }
  55%, 75% { transform: translateX(-5px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.45; }
}
@keyframes mi-r {
  0%, 20% { transform: translateX(0); opacity: 0.45; }
  55%, 75% { transform: translateX(5px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.45; }
}
@keyframes mi-split {
  0%, 20% { transform: translateX(0); }
  55%, 75% { transform: translateX(0); }
  100% { transform: translateX(0); }
}
@keyframes mi-thicken {
  0%, 25% { stroke-width: 4; }
  55%, 80% { stroke-width: 8; }
  100% { stroke-width: 4; }
}
</style>
