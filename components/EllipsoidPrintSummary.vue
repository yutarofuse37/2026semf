<script setup lang="ts">
import Katex from './Katex.vue'
import EllipsoidWalkthrough from './EllipsoidWalkthrough.vue'

const frames = [
  { step: 2, title: '① 中心を検査し，違反制約を得る', math: String.raw`a^\top c_0>b\ge a^\top u\quad(u\in K_\tau)`, text: '分離オラクルが不等式を1本返す．' },
  { step: 3, title: '② 中心を通る線で切る', math: String.raw`H_0=\{u:a^\top(u-c_0)\le0\}`, text: '目標集合を含む側を残す．' },
  { step: 4, title: '③ 半楕円体を包み直す', math: String.raw`K_\tau\subseteq E_0\cap H_0\subseteq E_1`, text: '元より小さい楕円体へ更新する．' },
  { step: 6, title: '④ 新しい中心で同じ操作を行う', math: String.raw`K_\tau\subseteq E_1\cap H_1\subseteq E_2`, text: '①〜③を繰り返し，体積を減らす．' },
  { step: 7, title: '終了A：実行可能点を得る', math: String.raw`u\in K_\tau\ \Longrightarrow\ \tau\text{ を達成できる}`, text: '全ての制約を満たすことを確認する．' },
  { step: 8, title: '終了B：制約の矛盾を証明する', math: String.raw`\sum_i\lambda_i a_i=0,\quad\sum_i\lambda_i b_i<0`, text: '制約を非負係数で足し，矛盾を示す．' },
]
</script>

<template>
  <div class="ellipsoid-print-summary">
    <div class="print-target">
      <p><Katex expr="P" /> は LP の実行可能領域．目標値 <Katex expr="\tau" /> を固定する．青：<Katex expr="K_\tau" />，赤：除ける側（図は2次元）．</p>
      <Katex expr="K_\tau=P\cap\left\{u=(w,z):\frac1N\sum_{s\ne t}z_{st}\ge\tau\right\}\subseteq E_0" />
    </div>
    <div class="print-frames">
      <section v-for="frame in frames" :key="frame.step" class="print-frame" :class="{ terminal: frame.step >= 7 }">
        <h2>{{ frame.title }}</h2>
        <EllipsoidWalkthrough :step="frame.step" :show-controls="false" figure-only />
        <div class="frame-math"><Katex :expr="frame.math" /></div>
        <p>{{ frame.text }}</p>
      </section>
    </div>
    <p class="print-ending"><strong>有理 LP 版は多項式回の分離で終了A・Bのいずれかを得る（次頁）．</strong></p>
  </div>
</template>

<style scoped>
.ellipsoid-print-summary { color:#263551; font-size:13px; line-height:1.4; }
.ellipsoid-print-summary p { margin:0 !important; }
.print-target { min-height:46px; margin:0 0 6px; font-size:14px; }
.print-target > p { margin-bottom:3px !important; font-size:13px; }
.print-frames { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); column-gap:17px; row-gap:9px; }
.print-frame { min-width:0; border-top:1px solid #cfdbed; padding-top:5px; }
.print-frame h2 { margin:0 0 1px !important; font-size:14px !important; line-height:1.45; font-weight:700; color:#1c3177; }
.print-frame.terminal h2 { color:#087f8c; }
.frame-math { min-height:24px; display:flex; align-items:center; justify-content:center; font-size:12.5px; color:#1c3177; }
.print-frame > p { font-size:12.5px; line-height:1.45; }
.ellipsoid-print-summary .print-ending { margin-top:5px !important; padding-top:5px; border-top:1px solid #cfdbed; color:#596b84; font-size:12px; line-height:1.5; }
.print-ending strong { color:#1c3177; font-weight:600; }
</style>
