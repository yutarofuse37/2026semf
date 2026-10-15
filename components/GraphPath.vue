<script setup lang="ts">
const BLUE = '#1c3177'
const SUB = '#7f96c2'
const WEAK = '#b42318'
</script>

<template>
  <div class="gp">
    <div class="gp__panel">
      <div class="gp__title">守備A：橋 <Katex expr="\{2,3\}" /> が細い</div>
      <div class="gp__badge gp__badge--bad">同じ引っ張り → コスト小（攻撃有利）</div>
      <svg viewBox="0 0 300 95" class="gp__svg" aria-hidden="true">
        <text x="40" y="18" class="gp__dir" fill="#7f96c2">左へ</text>
        <text x="240" y="18" class="gp__dir" fill="#7f96c2">右へ</text>
        <g class="gp__arrow-l">
          <line x1="62" y1="28" x2="30" y2="28" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="18,28 32,21 32,35" :fill="BLUE" />
        </g>
        <g class="gp__arrow-r">
          <line x1="238" y1="28" x2="270" y2="28" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="282,28 268,21 268,35" :fill="BLUE" />
        </g>

        <g class="gp__half gp__half--l">
          <line x1="52" y1="58" x2="98" y2="58" :stroke="BLUE" stroke-width="5" stroke-linecap="round" />
          <line class="gp__mid-half gp__mid-half--thin" x1="122" y1="58" x2="142" y2="58" :stroke="WEAK" stroke-linecap="round" />
          <circle cx="40" cy="58" r="13" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
          <circle cx="110" cy="58" r="13" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
          <text x="40" y="62" text-anchor="middle" class="gp__num">1</text>
          <text x="110" y="62" text-anchor="middle" class="gp__num">2</text>
        </g>

        <g class="gp__half gp__half--r">
          <line class="gp__mid-half gp__mid-half--thin" x1="158" y1="58" x2="178" y2="58" :stroke="WEAK" stroke-linecap="round" />
          <line x1="202" y1="58" x2="248" y2="58" :stroke="BLUE" stroke-width="5" stroke-linecap="round" />
          <circle cx="190" cy="58" r="13" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
          <circle cx="260" cy="58" r="13" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
          <text x="190" y="62" text-anchor="middle" class="gp__num">3</text>
          <text x="260" y="62" text-anchor="middle" class="gp__num">4</text>
        </g>
      </svg>
      <div class="gp__meta"><Katex expr="w_{12}=w_{34}=0.45,\ w_{23}=0.10" /></div>
      <div class="gp__result gp__result--bad"><Katex expr="C=w_{23}=0.10" /></div>
    </div>

    <div class="gp__panel">
      <div class="gp__title">守備B：橋 <Katex expr="\{2,3\}" /> が太い</div>
      <div class="gp__badge gp__badge--good">同じ引っ張り → コスト大（守備有利）</div>
      <svg viewBox="0 0 300 95" class="gp__svg" aria-hidden="true">
        <text x="40" y="18" class="gp__dir" fill="#7f96c2">左へ</text>
        <text x="240" y="18" class="gp__dir" fill="#7f96c2">右へ</text>
        <g class="gp__arrow-l">
          <line x1="62" y1="28" x2="30" y2="28" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="18,28 32,21 32,35" :fill="BLUE" />
        </g>
        <g class="gp__arrow-r">
          <line x1="238" y1="28" x2="270" y2="28" :stroke="BLUE" stroke-width="2.2" stroke-linecap="round" />
          <polygon points="282,28 268,21 268,35" :fill="BLUE" />
        </g>

        <g class="gp__half gp__half--l gp__half--hold">
          <line x1="52" y1="58" x2="98" y2="58" :stroke="SUB" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="40" cy="58" r="13" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
          <circle cx="110" cy="58" r="13" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
          <text x="40" y="62" text-anchor="middle" class="gp__num">1</text>
          <text x="110" y="62" text-anchor="middle" class="gp__num">2</text>
        </g>

        <line class="gp__mid-thick" x1="122" y1="58" x2="178" y2="58" :stroke="BLUE" stroke-linecap="round" />

        <g class="gp__half gp__half--r gp__half--hold">
          <line x1="202" y1="58" x2="248" y2="58" :stroke="SUB" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="190" cy="58" r="13" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
          <circle cx="260" cy="58" r="13" fill="#fff" :stroke="BLUE" stroke-width="1.6" />
          <text x="190" y="62" text-anchor="middle" class="gp__num">3</text>
          <text x="260" y="62" text-anchor="middle" class="gp__num">4</text>
        </g>
      </svg>
      <div class="gp__meta"><Katex expr="w_{12}=w_{34}=0.05,\ w_{23}=0.90" /></div>
      <div class="gp__result gp__result--good"><Katex expr="C=w_{23}=0.90" /></div>
    </div>
  </div>
</template>

<style scoped>
.gp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  color: #1a1a1a;
  font-size: 0.95rem;
  line-height: 1.35;
}
.gp__panel { text-align: center; }
.gp__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
}
.gp__badge {
  display: inline-block;
  margin: 0.3rem 0 0.2rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid #cfdbed;
  background: #f9fbff;
  color: #1a1a1a;
}
.gp__badge--bad { border-color: #f3c1bc; background: #fff5f4; color: #b42318; }
.gp__badge--good { border-color: #cfdbed; background: #e4ebf6; color: #1c3177; }
.gp__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.gp__dir {
  font-size: 11px;
  font-family: system-ui, sans-serif;
}
.gp__num {
  font-size: 12px;
  fill: #1a1a1a;
  font-family: system-ui, sans-serif;
}
.gp__meta {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: #444444;
}
.gp__result {
  margin-top: 0.15rem;
  font-size: 1.05rem;
  font-weight: 700;
}
.gp__result--bad { color: #b42318; }
.gp__result--good { color: #1c3177; }

.gp__arrow-l { animation: a-l 2.8s ease-in-out infinite; }
.gp__arrow-r { animation: a-r 2.8s ease-in-out infinite; }
.gp__half--l { animation: half-l 2.8s ease-in-out infinite; }
.gp__half--r { animation: half-r 2.8s ease-in-out infinite; }
.gp__half--hold.gp__half--l { animation-name: half-l-hold; }
.gp__half--hold.gp__half--r { animation-name: half-r-hold; }
.gp__mid-half--thin {
  stroke-width: 1.5;
  animation: mid-thin 2.8s ease-in-out infinite;
}
.gp__mid-thick {
  stroke-width: 7;
  animation: mid-thick 2.8s ease-in-out infinite;
}

@keyframes a-l {
  0%, 18% { transform: translateX(0); opacity: 0.4; }
  50%, 72% { transform: translateX(-8px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.4; }
}
@keyframes a-r {
  0%, 18% { transform: translateX(0); opacity: 0.4; }
  50%, 72% { transform: translateX(8px); opacity: 1; }
  100% { transform: translateX(0); opacity: 0.4; }
}
@keyframes half-l {
  0%, 18% { transform: translateX(0); }
  50%, 72% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}
@keyframes half-r {
  0%, 18% { transform: translateX(0); }
  50%, 72% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}
@keyframes half-l-hold {
  0%, 18% { transform: translateX(0); }
  50%, 72% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}
@keyframes half-r-hold {
  0%, 18% { transform: translateX(0); }
  50%, 72% { transform: translateX(3px); }
  100% { transform: translateX(0); }
}
@keyframes mid-thin {
  0%, 18% { stroke-width: 1.5; opacity: 0.9; stroke-dasharray: none; }
  50%, 72% { stroke-width: 1; opacity: 0.25; stroke-dasharray: 3 4; }
  100% { stroke-width: 1.5; opacity: 0.9; stroke-dasharray: none; }
}
@keyframes mid-thick {
  0%, 18% { stroke-width: 6; }
  50%, 72% { stroke-width: 9; }
  100% { stroke-width: 6; }
}
</style>
