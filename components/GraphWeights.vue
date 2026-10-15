<script setup lang="ts">
/** Science Tokyo palette */
const BLUE = '#1c3177'
const SUB = '#7f96c2'
const WEAK = '#b42318'
</script>

<template>
  <div class="gw">
    <div class="gw__panels">
      <!-- Bad: weight inside clusters → thin bridge splits under pull -->
      <div class="gw__panel">
        <div class="gw__phase">細い橋に弱点がある</div>
        <svg viewBox="0 0 240 130" class="gw__svg" aria-hidden="true">
          <!-- ← left / right → : pull apart (same as path figure) -->
          <g class="gw__pull gw__pull--l">
            <line x1="36" y1="66" x2="20" y2="66" :stroke="BLUE" stroke-width="2.4" stroke-linecap="round" />
            <polygon points="10,66 22,59 22,73" :fill="BLUE" />
          </g>
          <g class="gw__pull gw__pull--r">
            <line x1="204" y1="66" x2="220" y2="66" :stroke="BLUE" stroke-width="2.4" stroke-linecap="round" />
            <polygon points="230,66 218,59 218,73" :fill="BLUE" />
          </g>

          <!-- left cluster + half bridge move together -->
          <g class="gw__side gw__side--l">
            <line x1="38" y1="56" x2="66" y2="26" :stroke="BLUE" stroke-width="5" stroke-linecap="round" />
            <line x1="66" y1="26" x2="76" y2="76" :stroke="BLUE" stroke-width="5" stroke-linecap="round" />
            <line x1="76" y1="76" x2="38" y2="56" :stroke="BLUE" stroke-width="5" stroke-linecap="round" />
            <line class="gw__half gw__half--bad" x1="76" y1="76" x2="112" y2="66" :stroke="SUB" stroke-linecap="round" />
            <circle cx="38" cy="56" r="6.5" :fill="BLUE" />
            <circle cx="66" cy="26" r="6.5" :fill="BLUE" />
            <circle cx="76" cy="76" r="6.5" :fill="BLUE" />
          </g>

          <!-- right cluster + half bridge -->
          <g class="gw__side gw__side--r">
            <line x1="164" y1="56" x2="192" y2="26" :stroke="BLUE" stroke-width="5" stroke-linecap="round" />
            <line x1="192" y1="26" x2="202" y2="76" :stroke="BLUE" stroke-width="5" stroke-linecap="round" />
            <line x1="202" y1="76" x2="164" y2="56" :stroke="BLUE" stroke-width="5" stroke-linecap="round" />
            <line class="gw__half gw__half--bad" x1="128" y1="66" x2="164" y2="56" :stroke="SUB" stroke-linecap="round" />
            <circle cx="164" cy="56" r="6.5" :fill="BLUE" />
            <circle cx="192" cy="26" r="6.5" :fill="BLUE" />
            <circle cx="202" cy="76" r="6.5" :fill="BLUE" />
          </g>

          <g class="gw__cut">
            <line x1="110" y1="56" x2="130" y2="76" :stroke="WEAK" stroke-width="2.6" />
            <line x1="110" y1="76" x2="130" y2="56" :stroke="WEAK" stroke-width="2.6" />
          </g>
        </svg>
        <div class="gw__label">橋が細い配分</div>
        <div class="gw__hint">クラスタ内に厚く → 橋への変形に弱い</div>
      </div>

      <!-- Good: weight on bridge → same pull, holds -->
      <div class="gw__panel">
        <div class="gw__phase">橋の抵抗を高める</div>
        <svg viewBox="0 0 240 130" class="gw__svg" aria-hidden="true">
          <!-- ← left / right → : pull apart -->
          <g class="gw__pull gw__pull--l">
            <line x1="36" y1="66" x2="20" y2="66" :stroke="BLUE" stroke-width="2.4" stroke-linecap="round" />
            <polygon points="10,66 22,59 22,73" :fill="BLUE" />
          </g>
          <g class="gw__pull gw__pull--r">
            <line x1="204" y1="66" x2="220" y2="66" :stroke="BLUE" stroke-width="2.4" stroke-linecap="round" />
            <polygon points="230,66 218,59 218,73" :fill="BLUE" />
          </g>

          <g class="gw__side gw__side--l-hold">
            <line x1="38" y1="56" x2="66" y2="26" :stroke="SUB" stroke-width="2" stroke-linecap="round" />
            <line x1="66" y1="26" x2="76" y2="76" :stroke="SUB" stroke-width="2" stroke-linecap="round" />
            <line x1="76" y1="76" x2="38" y2="56" :stroke="SUB" stroke-width="2" stroke-linecap="round" />
            <circle cx="38" cy="56" r="6.5" :fill="BLUE" />
            <circle cx="66" cy="26" r="6.5" :fill="BLUE" />
            <circle cx="76" cy="76" r="6.5" :fill="BLUE" />
          </g>
          <g class="gw__side gw__side--r-hold">
            <line x1="164" y1="56" x2="192" y2="26" :stroke="SUB" stroke-width="2" stroke-linecap="round" />
            <line x1="192" y1="26" x2="202" y2="76" :stroke="SUB" stroke-width="2" stroke-linecap="round" />
            <line x1="202" y1="76" x2="164" y2="56" :stroke="SUB" stroke-width="2" stroke-linecap="round" />
            <circle cx="164" cy="56" r="6.5" :fill="BLUE" />
            <circle cx="192" cy="26" r="6.5" :fill="BLUE" />
            <circle cx="202" cy="76" r="6.5" :fill="BLUE" />
          </g>
          <line class="gw__bridge gw__bridge--good" x1="76" y1="76" x2="164" y2="56" :stroke="BLUE" stroke-linecap="round" />
        </svg>
        <div class="gw__label">橋が太い配分</div>
        <div class="gw__hint">橋に厚く → 同じ変形のコストが増える</div>
      </div>
    </div>
    <div class="gw__legend">
      <span><i class="gw__leg gw__leg--thick" />太線：配分大</span>
      <span><i class="gw__leg gw__leg--thin" />細線：配分小</span>
      <span><i class="gw__leg gw__leg--pull" />矢印：引っ張り</span>
    </div>
  </div>
</template>

<style scoped>
.gw {
  width: 100%;
  max-width: 44rem;
  margin: 0 auto;
  color: #1a1a1a;
  font-size: 0.95rem;
  line-height: 1.35;
}
.gw__panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.gw__panel { text-align: center; }
.gw__phase {
  font-size: 0.88rem;
  font-weight: 700;
  color: #555555;
  margin-bottom: 0.2rem;
}
.gw__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.gw__label {
  margin-top: 0.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}
.gw__hint {
  margin-top: 0.15rem;
  font-size: 0.88rem;
  color: #444444;
}
.gw__legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.1rem;
  margin-top: 0.65rem;
  font-size: 0.9rem;
  color: #1a1a1a;
}
.gw__legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.gw__leg {
  display: inline-block;
  width: 1.35rem;
  border-top: 3px solid #1c3177;
}
.gw__leg--thin { border-top-width: 1.5px; border-top-color: #7f96c2; }
.gw__leg--pull {
  border-top-style: solid;
  border-top-width: 2px;
}

/* Bad: sides pull apart → gap opens at bridge */
.gw__side--l { animation: side-l 3.4s ease-in-out infinite; }
.gw__side--r { animation: side-r 3.4s ease-in-out infinite; }
.gw__half--bad {
  stroke-width: 1.6;
  animation: half-fade 3.4s ease-in-out infinite;
}
.gw__cut { animation: cut-show 3.4s ease-in-out infinite; transform-origin: 120px 66px; }

/* Good: same pull force, barely moves, bridge thickens */
.gw__side--l-hold { animation: hold-l 3.4s ease-in-out infinite; }
.gw__side--r-hold { animation: hold-r 3.4s ease-in-out infinite; }
.gw__bridge--good {
  stroke-width: 7;
  transform-origin: 120px 66px;
  animation: bridge-hold 3.4s ease-in-out infinite;
}
.gw__pull--l { animation: pull-l 3.4s ease-in-out infinite; }
.gw__pull--r { animation: pull-r 3.4s ease-in-out infinite; }

@keyframes side-l {
  0%, 18% { transform: translateX(0); }
  48%, 72% { transform: translateX(-14px); }
  100% { transform: translateX(0); }
}
@keyframes side-r {
  0%, 18% { transform: translateX(0); }
  48%, 72% { transform: translateX(14px); }
  100% { transform: translateX(0); }
}
@keyframes hold-l {
  0%, 18% { transform: translateX(0); }
  48%, 72% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}
@keyframes hold-r {
  0%, 18% { transform: translateX(0); }
  48%, 72% { transform: translateX(3px); }
  100% { transform: translateX(0); }
}
@keyframes half-fade {
  0%, 22% { opacity: 1; stroke-width: 1.6; }
  48%, 72% { opacity: 0.35; stroke-width: 1.1; }
  100% { opacity: 1; stroke-width: 1.6; }
}
@keyframes cut-show {
  0%, 32% { opacity: 0; transform: scale(0.5); }
  48%, 72% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.5); }
}
@keyframes bridge-hold {
  0%, 18% { stroke-width: 6.5; }
  48%, 72% { stroke-width: 9; }
  100% { stroke-width: 6.5; }
}
@keyframes pull-l {
  0%, 18% { transform: translateX(0); opacity: 0.4; }
  48%, 72% { transform: translateX(-7px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.4; }
}
@keyframes pull-r {
  0%, 18% { transform: translateX(0); opacity: 0.4; }
  48%, 72% { transform: translateX(7px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.4; }
}
</style>
