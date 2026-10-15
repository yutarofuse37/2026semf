<script setup lang="ts">
const BLUE = '#1c3177'
const SUB = '#7f96c2'
const WEAK = '#b42318'
</script>

<template>
  <div class="gb">
    <div class="gb__panel">
      <div class="gb__phase">細い接続</div>
      <svg viewBox="0 0 240 120" class="gb__svg" aria-hidden="true">
        <g class="gb__pull-l">
          <line x1="36" y1="60" x2="22" y2="60" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="12,60 24,54 24,66" :fill="BLUE" />
        </g>
        <g class="gb__pull-r">
          <line x1="204" y1="60" x2="218" y2="60" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="228,60 216,54 216,66" :fill="BLUE" />
        </g>
        <g class="gb__side gb__side--l">
          <line x1="40" y1="50" x2="68" y2="22" :stroke="SUB" stroke-width="2" />
          <line x1="68" y1="22" x2="80" y2="72" :stroke="SUB" stroke-width="2" />
          <line x1="80" y1="72" x2="40" y2="50" :stroke="SUB" stroke-width="2" />
          <line class="gb__half gb__half--thin" x1="80" y1="72" x2="112" y2="61" :stroke="WEAK" stroke-linecap="round" />
          <circle cx="40" cy="50" r="6.5" :fill="BLUE" />
          <circle cx="68" cy="22" r="6.5" :fill="BLUE" />
          <circle cx="80" cy="72" r="6.5" :fill="BLUE" />
        </g>
        <g class="gb__side gb__side--r">
          <line class="gb__half gb__half--thin" x1="128" y1="61" x2="160" y2="50" :stroke="WEAK" stroke-linecap="round" />
          <line x1="160" y1="50" x2="188" y2="22" :stroke="SUB" stroke-width="2" />
          <line x1="188" y1="22" x2="200" y2="72" :stroke="SUB" stroke-width="2" />
          <line x1="200" y1="72" x2="160" y2="50" :stroke="SUB" stroke-width="2" />
          <circle cx="160" cy="50" r="6.5" :fill="BLUE" />
          <circle cx="188" cy="22" r="6.5" :fill="BLUE" />
          <circle cx="200" cy="72" r="6.5" :fill="BLUE" />
        </g>
        <g class="gb__cut">
          <line x1="108" y1="50" x2="126" y2="68" :stroke="WEAK" stroke-width="2.4" />
          <line x1="108" y1="68" x2="126" y2="50" :stroke="WEAK" stroke-width="2.4" />
        </g>
      </svg>
      <div class="gb__label gb__label--atk">攻撃側に有利</div>
      <div class="gb__hint">引っ張ると橋が伸びて切れる</div>
    </div>

    <div class="gb__panel">
      <div class="gb__phase">太い接続</div>
      <svg viewBox="0 0 240 120" class="gb__svg" aria-hidden="true">
        <g class="gb__pull-l">
          <line x1="36" y1="60" x2="22" y2="60" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="12,60 24,54 24,66" :fill="BLUE" />
        </g>
        <g class="gb__pull-r">
          <line x1="204" y1="60" x2="218" y2="60" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="228,60 216,54 216,66" :fill="BLUE" />
        </g>
        <g class="gb__side gb__side--l-hold">
          <line x1="40" y1="50" x2="68" y2="22" :stroke="SUB" stroke-width="2" />
          <line x1="68" y1="22" x2="80" y2="72" :stroke="SUB" stroke-width="2" />
          <line x1="80" y1="72" x2="40" y2="50" :stroke="SUB" stroke-width="2" />
          <circle cx="40" cy="50" r="6.5" :fill="BLUE" />
          <circle cx="68" cy="22" r="6.5" :fill="BLUE" />
          <circle cx="80" cy="72" r="6.5" :fill="BLUE" />
        </g>
        <line class="gb__bridge-thick" x1="80" y1="72" x2="160" y2="50" :stroke="BLUE" stroke-linecap="round" />
        <g class="gb__side gb__side--r-hold">
          <line x1="160" y1="50" x2="188" y2="22" :stroke="SUB" stroke-width="2" />
          <line x1="188" y1="22" x2="200" y2="72" :stroke="SUB" stroke-width="2" />
          <line x1="200" y1="72" x2="160" y2="50" :stroke="SUB" stroke-width="2" />
          <circle cx="160" cy="50" r="6.5" :fill="BLUE" />
          <circle cx="188" cy="22" r="6.5" :fill="BLUE" />
          <circle cx="200" cy="72" r="6.5" :fill="BLUE" />
        </g>
      </svg>
      <div class="gb__label gb__label--def">守備側に有利</div>
      <div class="gb__hint">同じ引っ張りでも橋が耐える</div>
    </div>
  </div>
</template>

<style scoped>
.gb {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  color: #1a1a1a;
  font-size: 0.95rem;
  line-height: 1.35;
}
.gb__panel { text-align: center; }
.gb__phase {
  font-size: 0.88rem;
  font-weight: 700;
  color: #555555;
}
.gb__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.gb__label {
  margin-top: 0.2rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
}
.gb__hint {
  font-size: 0.88rem;
  color: #444444;
  margin-top: 0.1rem;
}
.gb__label--atk { color: #b42318; }
.gb__label--def { color: #1c3177; }
.gb__pull-l { animation: pl 2.8s ease-in-out infinite; }
.gb__pull-r { animation: pr 2.8s ease-in-out infinite; }
.gb__side--l { animation: side-l 2.8s ease-in-out infinite; }
.gb__side--r { animation: side-r 2.8s ease-in-out infinite; }
.gb__side--l-hold { animation: hold-l 2.8s ease-in-out infinite; }
.gb__side--r-hold { animation: hold-r 2.8s ease-in-out infinite; }
.gb__half--thin {
  stroke-width: 1.5;
  animation: thin 2.8s ease-in-out infinite;
}
.gb__bridge-thick {
  stroke-width: 7.5;
  animation: thick 2.8s ease-in-out infinite;
}
.gb__cut { animation: cut 2.8s ease-in-out infinite; }

@keyframes pl {
  0%, 18% { transform: translateX(0); opacity: 0.4; }
  50%, 72% { transform: translateX(-6px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.4; }
}
@keyframes pr {
  0%, 18% { transform: translateX(0); opacity: 0.4; }
  50%, 72% { transform: translateX(6px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.4; }
}
@keyframes side-l {
  0%, 18% { transform: translateX(0); }
  50%, 72% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
@keyframes side-r {
  0%, 18% { transform: translateX(0); }
  50%, 72% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}
@keyframes hold-l {
  0%, 18% { transform: translateX(0); }
  50%, 72% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}
@keyframes hold-r {
  0%, 18% { transform: translateX(0); }
  50%, 72% { transform: translateX(3px); }
  100% { transform: translateX(0); }
}
@keyframes thin {
  0%, 22% { stroke-width: 1.5; opacity: 1; stroke-dasharray: none; }
  50%, 72% { stroke-width: 1; opacity: 0.2; stroke-dasharray: 3 4; }
  100% { stroke-width: 1.5; opacity: 1; stroke-dasharray: none; }
}
@keyframes thick {
  0%, 18% { stroke-width: 6; }
  50%, 72% { stroke-width: 9.5; }
  100% { stroke-width: 6; }
}
@keyframes cut {
  0%, 35% { opacity: 0; }
  50%, 72% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
