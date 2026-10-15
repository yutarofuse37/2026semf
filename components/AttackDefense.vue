<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const BLUE = '#1c3177'
const SUB = '#7f96c2'
const WEAK = '#b42318'

const { $clicks } = useSlideContext()
/** スライド先頭の導入クリックを除き、ゲーム説明と同期（0..4） */
const step = computed(() => {
  const c = Number($clicks.value ?? 0)
  return Math.min(Math.max(c - 1, 0), 4)
})
</script>

<template>
  <div class="ad" :data-step="step">
    <div class="ad__title">
      守備が全辺に <Katex expr="w" /> を配分 → 攻撃が引っ張り <Katex expr="x" /> を選ぶ
    </div>

    <svg viewBox="0 0 360 200" class="ad__svg" aria-hidden="true">
      <g class="ad__turn ad__turn--def">
        <rect x="8" y="8" width="72" height="22" rx="11" fill="#e4ebf6" :stroke="BLUE" stroke-width="1.5" />
        <text x="44" y="23" text-anchor="middle" class="ad__turn-text">守備ターン</text>
      </g>
      <g class="ad__turn ad__turn--atk">
        <rect x="280" y="8" width="72" height="22" rx="11" fill="#fff5f4" stroke="#f3c1bc" stroke-width="1.5" />
        <text x="316" y="23" text-anchor="middle" class="ad__turn-text-atk">攻撃ターン</text>
      </g>

      <g class="ad__player ad__player--def">
        <ellipse cx="44" cy="168" rx="18" ry="5" fill="#cfdbed" />
        <rect x="32" y="128" width="24" height="32" rx="12" :fill="SUB" />
        <circle cx="44" cy="112" r="17" fill="#fff" :stroke="SUB" stroke-width="2.2" />
        <circle cx="38" cy="110" r="2.2" :fill="BLUE" />
        <circle cx="50" cy="110" r="2.2" :fill="BLUE" />
        <circle cx="34" cy="116" r="2.4" fill="#f3c1bc" opacity="0.75" />
        <circle cx="54" cy="116" r="2.4" fill="#f3c1bc" opacity="0.75" />
        <path d="M39 118 Q44 122 49 118" fill="none" :stroke="BLUE" stroke-width="1.4" stroke-linecap="round" />
        <path d="M54 140 Q72 136 92 118" fill="none" :stroke="SUB" stroke-width="3.2" stroke-linecap="round" />
        <text x="44" y="188" text-anchor="middle" class="ad__name ad__name--def">守備</text>
        <text x="44" y="198" text-anchor="middle" class="ad__name-sub">配分</text>
      </g>

      <g class="ad__player ad__player--atk">
        <ellipse cx="316" cy="168" rx="18" ry="5" fill="#cfdbed" />
        <rect x="304" y="128" width="24" height="32" rx="12" :fill="BLUE" />
        <circle cx="316" cy="112" r="17" fill="#fff" :stroke="BLUE" stroke-width="2.2" />
        <circle cx="310" cy="110" r="2.2" :fill="BLUE" />
        <circle cx="322" cy="110" r="2.2" :fill="BLUE" />
        <circle cx="306" cy="116" r="2.4" fill="#f3c1bc" opacity="0.75" />
        <circle cx="326" cy="116" r="2.4" fill="#f3c1bc" opacity="0.75" />
        <path d="M311 118 Q316 122 321 118" fill="none" :stroke="BLUE" stroke-width="1.4" stroke-linecap="round" />
        <path d="M306 140 Q288 136 268 118" fill="none" :stroke="BLUE" stroke-width="3.2" stroke-linecap="round" />
        <text x="316" y="188" text-anchor="middle" class="ad__name ad__name--atk">攻撃</text>
        <text x="316" y="198" text-anchor="middle" class="ad__name-sub">選択</text>
      </g>

      <g class="ad__pull ad__pull--l">
        <line x1="118" y1="48" x2="96" y2="48" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
        <polygon points="88,48 100,42 100,54" :fill="BLUE" />
      </g>
      <g class="ad__pull ad__pull--r">
        <line x1="242" y1="48" x2="264" y2="48" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
        <polygon points="272,48 260,42 260,54" :fill="BLUE" />
      </g>

      <g class="ad__half ad__half--l">
        <line class="ad__e ad__e--mid" x1="120" y1="78" x2="152" y2="60" stroke-linecap="round" />
        <line class="ad__e ad__e--mid" x1="120" y1="78" x2="138" y2="112" stroke-linecap="round" />
        <line class="ad__e ad__e--mid" x1="152" y1="60" x2="138" y2="112" stroke-linecap="round" />
        <line class="ad__e ad__e--thin" x1="152" y1="60" x2="174" y2="66" stroke-linecap="round" />
        <line class="ad__e ad__e--thick" x1="138" y1="112" x2="174" y2="116" stroke-linecap="round" />
        <circle cx="120" cy="78" r="7.5" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="152" cy="60" r="7.5" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="138" cy="112" r="7.5" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
      </g>
      <g class="ad__half ad__half--r">
        <line class="ad__e ad__e--mid" x1="208" y1="60" x2="240" y2="78" stroke-linecap="round" />
        <line class="ad__e ad__e--mid" x1="240" y1="78" x2="222" y2="112" stroke-linecap="round" />
        <line class="ad__e ad__e--mid" x1="208" y1="60" x2="222" y2="112" stroke-linecap="round" />
        <line class="ad__e ad__e--thin" x1="186" y1="66" x2="208" y2="60" stroke-linecap="round" />
        <line class="ad__e ad__e--thick" x1="186" y1="116" x2="222" y2="112" stroke-linecap="round" />
        <circle cx="208" cy="60" r="7.5" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="240" cy="78" r="7.5" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
        <circle cx="222" cy="112" r="7.5" fill="#fff" :stroke="BLUE" stroke-width="1.8" />
      </g>

      <g class="ad__cut">
        <line x1="170" y1="56" x2="186" y2="72" :stroke="WEAK" stroke-width="2.2" />
        <line x1="170" y1="72" x2="186" y2="56" :stroke="WEAK" stroke-width="2.2" />
      </g>

      <g class="ad__cost">
        <rect x="100" y="134" width="160" height="26" rx="8" fill="#fff5f4" stroke="#f3c1bc" />
        <foreignObject x="100" y="134" width="160" height="26">
          <div xmlns="http://www.w3.org/1999/xhtml" class="ad__fo ad__fo--atk">
            <Katex expr="C=\sum w_e(x_u-x_v)^2" />
          </div>
        </foreignObject>
      </g>
      <g class="ad__min">
        <rect x="100" y="134" width="160" height="26" rx="8" fill="#e4ebf6" stroke="#cfdbed" />
        <foreignObject x="100" y="134" width="160" height="26">
          <div xmlns="http://www.w3.org/1999/xhtml" class="ad__fo ad__fo--def">
            <Katex expr="\lambda_2=\min_x C(x;w)" />
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.ad {
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
  color: #1a1a1a;
}
.ad__title {
  text-align: center;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.1rem;
}
.ad__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.ad__fo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1;
}
.ad__fo--atk { color: #b42318; }
.ad__fo--def { color: #1c3177; }
.ad__turn-text {
  font-size: 10px;
  font-weight: 700;
  fill: #1c3177;
  font-family: system-ui, sans-serif;
}
.ad__turn-text-atk {
  font-size: 10px;
  font-weight: 700;
  fill: #b42318;
  font-family: system-ui, sans-serif;
}
.ad__name {
  font-size: 11px;
  font-weight: 700;
  font-family: system-ui, sans-serif;
}
.ad__name--def { fill: #1c3177; }
.ad__name--atk { fill: #b42318; }
.ad__name-sub {
  font-size: 8px;
  fill: #555555;
  font-family: system-ui, sans-serif;
}

.ad__e {
  fill: none;
  stroke: #7f96c2;
  stroke-width: 1.4;
  stroke-dasharray: 4 4;
  transition: stroke-width 0.45s ease, stroke 0.45s ease, stroke-dasharray 0.45s ease, opacity 0.35s ease;
}
.ad__turn,
.ad__player,
.ad__pull,
.ad__half,
.ad__cut,
.ad__cost,
.ad__min {
  transition: opacity 0.35s ease, transform 0.45s ease, filter 0.35s ease;
}

/* step 0: idle dashed — keep labels readable */
.ad[data-step="0"] .ad__turn { opacity: 0.55; }
.ad[data-step="0"] .ad__player { opacity: 0.85; }
.ad[data-step="0"] .ad__pull,
.ad[data-step="0"] .ad__cut,
.ad[data-step="0"] .ad__cost,
.ad[data-step="0"] .ad__min { opacity: 0; }

/* step 1: defense allocates — all edges solid with thickness */
.ad[data-step="1"] .ad__turn--def { opacity: 1; }
.ad[data-step="1"] .ad__turn--atk { opacity: 0.45; }
.ad[data-step="1"] .ad__player--def { opacity: 1; }
.ad[data-step="1"] .ad__player--atk { opacity: 0.7; }
.ad[data-step="1"] .ad__pull,
.ad[data-step="1"] .ad__cut,
.ad[data-step="1"] .ad__cost,
.ad[data-step="1"] .ad__min { opacity: 0; }
.ad[data-step="1"] .ad__e--thin {
  stroke: #b42318;
  stroke-width: 1.6;
  stroke-dasharray: none;
}
.ad[data-step="1"] .ad__e--mid {
  stroke: #7f96c2;
  stroke-width: 2.6;
  stroke-dasharray: none;
}
.ad[data-step="1"] .ad__e--thick {
  stroke: #1c3177;
  stroke-width: 5.8;
  stroke-dasharray: none;
}

/* step 2+: keep allocation; attacker pulls */
.ad[data-step="2"] .ad__turn--def,
.ad[data-step="3"] .ad__turn--def,
.ad[data-step="4"] .ad__turn--def { opacity: 0.45; }
.ad[data-step="2"] .ad__turn--atk,
.ad[data-step="3"] .ad__turn--atk,
.ad[data-step="4"] .ad__turn--atk { opacity: 1; }
.ad[data-step="2"] .ad__player--def,
.ad[data-step="3"] .ad__player--def,
.ad[data-step="4"] .ad__player--def { opacity: 0.7; }
.ad[data-step="2"] .ad__player--atk,
.ad[data-step="3"] .ad__player--atk,
.ad[data-step="4"] .ad__player--atk { opacity: 1; }

.ad[data-step="2"] .ad__e--thin,
.ad[data-step="3"] .ad__e--thin,
.ad[data-step="4"] .ad__e--thin {
  stroke: #b42318;
  stroke-width: 1.6;
  stroke-dasharray: none;
}
.ad[data-step="2"] .ad__e--mid,
.ad[data-step="3"] .ad__e--mid,
.ad[data-step="4"] .ad__e--mid {
  stroke: #7f96c2;
  stroke-width: 2.6;
  stroke-dasharray: none;
}
.ad[data-step="2"] .ad__e--thick,
.ad[data-step="3"] .ad__e--thick,
.ad[data-step="4"] .ad__e--thick {
  stroke: #1c3177;
  stroke-width: 5.8;
  stroke-dasharray: none;
}

.ad[data-step="2"] .ad__pull,
.ad[data-step="3"] .ad__pull,
.ad[data-step="4"] .ad__pull { opacity: 1; }
.ad[data-step="2"] .ad__half--l,
.ad[data-step="3"] .ad__half--l,
.ad[data-step="4"] .ad__half--l { transform: translateX(-10px); }
.ad[data-step="2"] .ad__half--r,
.ad[data-step="3"] .ad__half--r,
.ad[data-step="4"] .ad__half--r { transform: translateX(10px); }
.ad[data-step="2"] .ad__cut,
.ad[data-step="2"] .ad__cost,
.ad[data-step="2"] .ad__min { opacity: 0; }

/* step 3: show payoff C, stress on thin */
.ad[data-step="3"] .ad__cost { opacity: 1; }
.ad[data-step="3"] .ad__min { opacity: 0; }
.ad[data-step="3"] .ad__cut { opacity: 0.85; }
.ad[data-step="3"] .ad__e--thin {
  stroke-width: 1.2;
  opacity: 0.55;
  stroke-dasharray: 3 4;
}

/* step 4: minimize C → λ2 */
.ad[data-step="4"] .ad__cost { opacity: 0; }
.ad[data-step="4"] .ad__min { opacity: 1; }
.ad[data-step="4"] .ad__cut { opacity: 1; }
.ad[data-step="4"] .ad__e--thin {
  stroke-width: 1.2;
  opacity: 0.45;
  stroke-dasharray: 3 4;
}
</style>
