<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import Katex from './Katex.vue'

const props = withDefaults(defineProps<{ step?: number, showControls?: boolean, figureOnly?: boolean }>(), { showControls: true, figureOnly: false })
const { $nav, $page, $renderContext } = useSlideContext()
const isActive = computed(() => $nav.value.currentPage === $page.value)
const isPresentation = computed(() => ['slide', 'presenter'].includes($renderContext.value))
const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const headless = typeof navigator !== 'undefined' && /HeadlessChrome/i.test(navigator.userAgent)
const current = ref(0)
const playing = ref(false)
const last = 8
const shown = computed(() => Math.max(0, Math.min(last, props.step ?? (!isPresentation.value || headless ? last : current.value))))
const uid = `ellipsoid-walk-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
const names = ['目標値と初期楕円体を定める', '中心を検査する', '違反した不等式を得る', '中心を通る切断に緩める', '小さい楕円体で包み直す', '次の中心も同じように検査する', '切断と更新を繰り返す', '終了①：全制約を満たす点を得る', '終了②：制約を足して矛盾を示す']

// The drawing uses exact two-dimensional central-cut updates.  Coordinates u
// increase upwards; SVG y coordinates increase downwards.  The fixed blue
// polygon is contained in both retained half ellipses.
const e0 = { cx: 246, cy: 116, rx: 156, ry: 76 }
const e1 = { cx: e0.cx - e0.rx / 3, cy: e0.cy, rx: 2 * e0.rx / 3, ry: 2 * e0.ry / Math.sqrt(3) }
const e2 = { cx: e1.cx, cy: e1.cy + e1.ry / 3, rx: 2 * e1.rx / Math.sqrt(3), ry: 2 * e1.ry / 3 }
const polygon = [[-.78, -.24], [-.57, -.62], [-.31, -.57], [-.24, -.31], [-.38, -.12], [-.65, -.11]]
  .map(([x, y]) => `${e0.cx + e0.rx * x},${e0.cy - e0.ry * y}`).join(' ')
const firstConstraintX = e0.cx - .2 * e0.rx
const secondConstraintY = e1.cy + .08 * e0.ry
const description = computed(() => shown.value === 8
  ? '実行不能の場合の例。左側の制約 u1 以下0と、右側の制約 u1 以上1は同時に満たせない。足すと0以下マイナス1になる。'
  : `楕円体法の${shown.value + 1}段階目、${names[shown.value]}。青は目標値を達成する点の集合。`)
let timer: ReturnType<typeof setTimeout> | undefined

function pause() {
  if (timer) clearTimeout(timer)
  timer = undefined
  playing.value = false
}
function move(to: number) {
  pause()
  current.value = Math.max(0, Math.min(last, to))
}
function schedule() {
  timer = setTimeout(() => {
    if (!isActive.value || !isPresentation.value || current.value >= last) {
      pause()
      return
    }
    current.value += 1
    if (current.value === last) pause()
    else schedule()
  }, 4800)
}
function toggle() {
  if (playing.value) return pause()
  if (!isActive.value || !isPresentation.value || reducedMotion || headless || props.step !== undefined) return
  if (current.value === last) current.value = 0
  playing.value = true
  schedule()
}
watch(isActive, active => {
  pause()
  if (active) current.value = 0
})
watch(isPresentation, () => pause())
onBeforeUnmount(pause)
</script>

<template>
  <div class="ellipsoid-walk" :class="{ 'without-controls': !props.showControls || props.step !== undefined, 'figure-only': props.figureOnly }" @click.stop @keydown.stop>
    <div v-if="!props.figureOnly" class="walk-heading">
      <strong><span v-if="props.step === undefined" class="step-number">{{ shown + 1 }} / {{ last + 1 }}</span>{{ names[shown] }}</strong>
      <span class="dimension-label">図は 2 次元の模式図</span>
    </div>
    <div class="walk-body">
      <svg class="walk-plot" :viewBox="props.figureOnly ? (shown === 8 ? '15 35 420 170' : '65 15 350 195') : '0 0 440 223'" role="img" :aria-label="description">
        <g v-if="shown === 8" class="infeasible-example">
          <rect x="30" y="48" width="135" height="123" rx="3" fill="#afc3e4" fill-opacity=".5" />
          <rect x="275" y="48" width="135" height="123" rx="3" fill="#f0b8b1" fill-opacity=".5" />
          <line x1="165" x2="165" y1="42" y2="179" stroke="#1c3177" stroke-width="2" />
          <line x1="275" x2="275" y1="42" y2="179" stroke="#b42318" stroke-width="2" />
          <line x1="23" x2="417" y1="179" y2="179" stroke="#8796af" stroke-width="1.4" />
          <text x="96" y="105" text-anchor="middle" fill="#1c3177">u₁ ≤ 0</text>
          <text x="342" y="105" text-anchor="middle" fill="#b42318">−u₁ ≤ −1</text>
          <text x="165" y="198" text-anchor="middle" fill="#52637d">0</text>
          <text x="275" y="198" text-anchor="middle" fill="#52637d">1</text>
          <text x="427" y="183" fill="#52637d">u₁</text>
          <text x="220" y="27" text-anchor="middle" class="infeasible-title">実行不能の場合の例：共通部分がない</text>
          <text x="220" y="143" text-anchor="middle" class="contradiction-label">足すと 0 ≤ −1</text>
          <text x="220" y="221" text-anchor="middle" class="plot-caption">制約の矛盾を確かめて「達成できない」と返す</text>
        </g>
        <g v-else>
        <defs>
          <clipPath :id="`${uid}-e0`"><ellipse v-bind="e0" /></clipPath>
          <clipPath :id="`${uid}-e1`"><ellipse v-bind="e1" /></clipPath>
          <pattern :id="`${uid}-hatch`" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="#b42318" stroke-opacity=".18" stroke-width="2" />
          </pattern>
        </defs>

        <ellipse v-bind="e0" fill="#f1f4fa" />
        <g v-if="shown === 2" :clip-path="`url(#${uid}-e0)`">
          <rect :x="firstConstraintX" y="0" width="440" height="223" fill="#b42318" fill-opacity=".08" />
        </g>
        <g v-if="shown === 3 || shown === 4" :clip-path="`url(#${uid}-e0)`">
          <rect :x="e0.cx" y="0" width="440" height="223" fill="#b42318" fill-opacity=".09" />
          <rect :x="e0.cx" y="0" width="440" height="223" :fill="`url(#${uid}-hatch)`" />
        </g>
        <ellipse v-if="shown >= 4" v-bind="e1" fill="#1c3177" fill-opacity=".045" />
        <g v-if="shown === 5 || shown === 6" :clip-path="`url(#${uid}-e1)`">
          <rect x="0" y="0" width="440" :height="shown === 5 ? secondConstraintY : e1.cy" fill="#b42318" fill-opacity=".085" />
          <rect x="0" y="0" width="440" :height="shown === 5 ? secondConstraintY : e1.cy" :fill="`url(#${uid}-hatch)`" />
        </g>

        <ellipse v-bind="e0" fill="none" stroke="#8796af" :stroke-width="shown < 4 ? 2 : 1.5" :stroke-dasharray="shown >= 4 ? '5 4' : undefined" />
        <ellipse v-if="shown >= 4" v-bind="e1" fill="none" stroke="#1c3177" :stroke-width="shown === 6 ? 1.5 : 2.7" :stroke-dasharray="shown === 6 ? '5 4' : undefined" />
        <ellipse v-if="shown === 6" v-bind="e2" fill="#087f8c" fill-opacity=".045" stroke="#087f8c" stroke-width="2.7" />

        <line v-if="shown === 2" :x1="firstConstraintX" :x2="firstConstraintX" y1="30" y2="203" stroke="#b42318" stroke-width="2.3" />
        <line v-if="shown === 3 || shown === 4" :x1="firstConstraintX" :x2="firstConstraintX" y1="38" y2="194" stroke="#b42318" stroke-width="1" stroke-dasharray="3 4" opacity=".5" />
        <line v-if="shown === 3 || shown === 4" :x1="e0.cx" :x2="e0.cx" y1="25" y2="207" stroke="#b42318" stroke-width="2.3" />
        <line v-if="shown === 5" x1="83" x2="304" :y1="secondConstraintY" :y2="secondConstraintY" stroke="#b42318" stroke-width="2.3" />
        <line v-if="shown === 6" x1="81" x2="307" :y1="e1.cy" :y2="e1.cy" stroke="#b42318" stroke-width="2.3" />

        <polygon :points="polygon" fill="#afc3e4" stroke="#1c3177" stroke-width="1.8" />
        <text v-if="shown !== 7" x="162" y="146" text-anchor="middle" class="feasible-label">Kτ</text>
        <circle v-if="shown === 7" cx="160" cy="139" r="5.5" fill="#087f8c" stroke="white" stroke-width="2" />
        <path v-if="shown === 7" d="M157 135 L120 107" fill="none" stroke="#087f8c" stroke-width="1.5" />
        <text v-if="shown === 7" x="115" y="99" text-anchor="middle" class="success-label">{{ props.figureOnly ? 'u' : '実行可能点 u' }}</text>
        <path v-if="shown <= 1" d="M112 158 L82 174" fill="none" stroke="#1c3177" stroke-width="1.2" />
        <text v-if="shown <= 1" x="78" y="192" text-anchor="middle" class="feasible-caption">目標を満たす点</text>

        <circle v-if="shown >= 1" :cx="e0.cx" :cy="e0.cy" :r="shown <= 3 ? 5 : 3" :fill="shown >= 2 ? '#b42318' : '#1c3177'" stroke="white" stroke-width="1.5" />
        <text v-if="shown >= 1 && shown <= 4" :x="e0.cx + 10" :y="e0.cy - 9" class="point-label" :fill="shown >= 2 ? '#b42318' : '#1c3177'">c₀</text>
        <circle v-if="shown >= 4" :cx="e1.cx" :cy="e1.cy" :r="shown === 5 ? 5 : 3.8" :fill="shown === 5 ? '#b42318' : '#1c3177'" stroke="white" stroke-width="1.5" />
        <text v-if="shown >= 4" :x="e1.cx - 6" :y="e1.cy - 10" text-anchor="end" class="point-label" :fill="shown === 5 ? '#b42318' : '#1c3177'">c₁</text>
        <circle v-if="shown === 6" :cx="e2.cx" :cy="e2.cy" r="4" fill="#087f8c" stroke="white" stroke-width="1.5" />
        <text v-if="shown === 6" :x="e2.cx + 11" :y="e2.cy + 2" class="point-label" fill="#087f8c">c₂</text>

        <text x="365" y="50" fill="#64748b">E₀</text>
        <text v-if="shown >= 4" x="122" y="42" fill="#1c3177">E₁</text>
        <text v-if="shown === 6" x="97" y="182" fill="#087f8c">E₂</text>
        <text v-if="shown === 2" :x="firstConstraintX - 9" y="22" text-anchor="end" class="red">aᵀu = b</text>
        <text v-if="shown === 3 || shown === 4" :x="e0.cx + 10" y="21" class="red">中心を通る切断</text>
        <text v-if="shown === 2" x="320" y="137" text-anchor="middle" class="red">制約に違反する側</text>
        <text v-if="shown === 3 || shown === 4" x="320" y="140" text-anchor="middle" class="red">除ける側</text>
        <text v-if="shown === 5 || shown === 6" x="260" y="88" text-anchor="middle" class="red">除ける側</text>
        <text x="245" y="221" text-anchor="middle" class="plot-caption">{{ shown === 7 ? '見つかった点が全制約を満たすことを確認する' : '青い集合を保ったまま，楕円体を更新する' }}</text>
        </g>
      </svg>

      <div v-if="!props.figureOnly" class="walk-explanation" aria-live="polite" aria-atomic="true">
        <template v-if="shown === 0">
          <p>「ANF を <Katex expr="\tau" /> 以上にできるか」を調べる．</p>
          <div class="walk-math compact"><Katex expr="K_\tau\subseteq[0,1]^d\subseteq E_0" display /><Katex expr="E_0:=\{u:\|u\|_2\le\sqrt d\}" display /></div>
          <p>各変数は 0 以上 1 以下なので，この球で包める．<br>初期楕円体を作るために，全制約を列挙する必要はない．</p>
        </template>
        <template v-else-if="shown === 1">
          <p>楕円体の<strong>中心</strong> <Katex expr="c_0" /> を候補にする．</p>
          <div class="walk-math"><Katex expr="c_0\in K_\tau\;?" display /></div>
          <p>LP と目標値の全制約を，分離オラクルで調べる．<br><strong>満たせば，目標値を達成した点が見つかる．</strong></p>
        </template>
        <template v-else-if="shown === 2">
          <p>満たさなければ，違反した<strong>線形不等式</strong>を得る．<br><Katex expr="a,b" /> は，返された不等式の係数．</p>
          <div class="walk-math compact"><Katex expr="K_\tau\subseteq\{u:a^\top u\le b\}" display /><Katex expr="a^\top c_0>b" display /></div>
          <p class="example">例：最小カットが返す制約<br><Katex expr="z_{st}\le\sum_{e\in\delta^+(S)}w_e" /></p>
        </template>
        <template v-else-if="shown === 3">
          <p>中心 <Katex expr="c_0" /> を通る線まで<strong>切断を緩める</strong>．</p>
          <div class="walk-math compact"><Katex expr="H_0:=\{u:a^\top(u-c_0)\le0\}" display /><Katex expr="K_\tau\subseteq E_0\cap H_0" display /></div>
          <p><Katex expr="a^\top c_0>b" /> なので，<br>青い集合はすべて残る．赤い側を除く．</p>
        </template>
        <template v-else-if="shown === 4">
          <p>残した<strong>半楕円体全体</strong>を，新しい楕円体で包む．</p>
          <div class="walk-math compact"><Katex expr="K_\tau\subseteq E_0\cap H_0\subseteq E_1" display /><Katex expr="\frac{\operatorname{area}(E_1)}{\operatorname{area}(E_0)}=\frac4{3\sqrt3}\simeq0.770" display /></div>
          <p>この 2 次元の図では，面積が<strong>約 23% 減る</strong>．</p>
        </template>
        <template v-else-if="shown === 5">
          <p>新しい中心 <Katex expr="c_1" /> を，分離オラクルで調べる．</p>
          <div class="walk-math"><Katex expr="c_1\in K_\tau\;?" display /></div>
          <p>また違反があれば，次の切断を得る．<br>今度は上側の赤い部分を除ける．</p>
        </template>
        <template v-else-if="shown === 6">
          <p>同様に，中心 <Katex expr="c_1" /> を通る半空間 <Katex expr="H_1" /> を作る．</p>
          <div class="walk-math compact"><Katex expr="K_\tau\subseteq E_1\cap H_1\subseteq E_2" display /><Katex expr="\frac{\operatorname{vol}(E_{t+1})}{\operatorname{vol}(E_t)}\le e^{-1/(2(d+1))}" display /></div>
          <p><Katex expr="K_\tau" /> を残し，体積を一定比で減らす（<Katex expr="d\ge2" />）．<br>新しい中心を調べ，同じ操作を繰り返す．</p>
        </template>
        <template v-else-if="shown === 7">
          <p><strong>全制約を満たす点</strong> <Katex expr="u=(w,z)" /> を得たら終了．中心の検査で見つかった場合も含む．</p>
          <div class="walk-math compact"><Katex display expr="u\in P,\qquad\tfrac1N\textstyle\sum_{s\ne t}z_{st}\ge\tau" /><Katex display expr="\Longrightarrow\quad K_\tau\ne\varnothing" /></div>
          <p>「目標値 <Katex expr="\tau" /> は<strong>達成できる</strong>」と返す．<br>二分探索では，下端を <Katex expr="\tau" /> に上げる．</p>
        </template>
        <template v-else>
          <p class="certificate-intro"><Katex expr="a_i^\top u\le b_i" /> は <Katex expr="K_\tau" /> の制約．<br>非負の係数 <Katex expr="\lambda_i" /> を掛けて足す．</p>
          <div class="walk-math certificate"><Katex display expr="\lambda_i\ge0,\quad\sum_i\lambda_i a_i=0,\quad\sum_i\lambda_i b_i<0" /><Katex display expr="0=\sum_i\lambda_i a_i^\top u\le\sum_i\lambda_i b_i<0" /></div>
          <p>これは矛盾なので <strong><Katex expr="K_\tau=\varnothing" /></strong> と確定して終了．<br>「達成できない」と返し，上端を <Katex expr="\tau" /> に下げる．</p>
        </template>
      </div>
    </div>
    <div class="walk-controls" v-if="!props.figureOnly && props.showControls && isPresentation && props.step === undefined && !headless">
      <button type="button" @click="move(shown - 1)" :disabled="shown === 0" aria-label="楕円体法の説明を一段階戻す">前へ</button>
      <button type="button" class="primary" @click="move(shown + 1)" :disabled="shown === last" aria-label="楕円体法の説明を一段階進める">次へ</button>
      <button type="button" @click="toggle" :disabled="reducedMotion" :aria-pressed="playing">{{ playing ? '一時停止' : '再生' }}</button>
      <button type="button" @click="move(0)">最初から</button>
      <span class="control-hint">「次へ」で，図と式が一緒に進む</span>
    </div>
  </div>
</template>

<style scoped>
.ellipsoid-walk { width:100%; height:286px; box-sizing:border-box; color:#263551; font-size:15px; line-height:1.5; }
.ellipsoid-walk.without-controls { height:258px; }
.walk-heading { height:27px; display:flex; align-items:center; justify-content:space-between; gap:12px; border-bottom:1px solid #dce4f0; }
.walk-heading strong { display:flex; align-items:center; gap:10px; color:#1c3177; font-size:16px; font-weight:700; }
.step-number { display:inline-block; background:#edf2fb; border-radius:4px; padding:0 7px; font-size:13px; font-variant-numeric:tabular-nums; }
.dimension-label { font-size:12px; color:#64748b; }
.walk-body { display:grid; grid-template-columns:1.03fr 1fr; gap:14px; height:225px; align-items:center; }
.walk-plot { width:100%; height:223px; display:block; overflow:visible; }
.walk-plot text { font-family:inherit; font-size:14px !important; font-weight:500; }
.walk-plot .feasible-label { fill:#1c3177; font-size:18px !important; font-weight:700; }
.walk-plot .point-label { font-size:16px !important; font-weight:700; paint-order:stroke; stroke:#f8fafc; stroke-width:4px; stroke-linejoin:round; }
.walk-plot .plot-caption { fill:#64748b; font-size:12px !important; }
.walk-plot .red { fill:#b42318; }
.walk-plot .feasible-caption { fill:#1c3177; font-size:13px !important; }
.walk-plot .success-label { fill:#087f8c; font-weight:700; }
.walk-plot .infeasible-title { fill:#52637d; font-size:13px !important; }
.walk-plot .contradiction-label { fill:#b42318; font-size:18px !important; font-weight:700; }
.walk-explanation { min-width:0; height:211px; box-sizing:border-box; padding:15px 3px 0 8px; border-left:2px solid #dce4f0; }
.walk-explanation p { margin:0 0 9px !important; font-size:15px; line-height:1.55; }
.walk-explanation strong { color:#1c3177; font-weight:700; }
.walk-math { margin:10px 0 13px; font-size:20px; color:#1c3177; }
.walk-math.compact { font-size:17px; margin:8px 0 10px; }
.walk-math.certificate { font-size:15.5px; margin:8px 0 12px; }
.walk-explanation .certificate-intro { font-size:14px; }
.walk-math :deep(.katex-display) { margin:5px 0 !important; }
.walk-math :deep(.kx) { display:block; }
.example { color:#596b84; font-size:14px !important; }
.example :deep(.katex) { font-size:15px; }
.walk-controls { height:30px; display:flex; align-items:center; gap:6px; padding-left:8px; border-top:1px solid #e2e8f0; }
.walk-controls button { border:1px solid #a9b8d0; background:#fff; color:#35466a; border-radius:4px; padding:2px 10px; font-size:12px; line-height:1.55; cursor:pointer; }
.walk-controls button.primary { background:#1c3177; border-color:#1c3177; color:#fff; }
.walk-controls button:disabled { opacity:.38; cursor:default; }
.walk-controls button:focus-visible { outline:3px solid #7f96c2; outline-offset:2px; }
.control-hint { color:#64748b; margin-left:8px; font-size:12px; }
.ellipsoid-walk.figure-only { height:98px; }
.figure-only .walk-body { display:block; height:100%; }
.figure-only .walk-plot { height:100%; overflow:hidden; }
.figure-only .walk-plot text { font-size:24px !important; }
.figure-only .walk-plot .point-label { font-size:28px !important; }
.figure-only .walk-plot .feasible-label { font-size:30px !important; }
.figure-only .walk-plot .plot-caption,
.figure-only .walk-plot .infeasible-title,
.figure-only .walk-plot .feasible-caption,
.figure-only .walk-plot .red { display:none; }
@media print { .walk-controls { display:none; } }
</style>
