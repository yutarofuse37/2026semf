<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'
import Katex from './Katex.vue'
import EllipsoidWalkthrough from './EllipsoidWalkthrough.vue'
import EllipsoidPrintSummary from './EllipsoidPrintSummary.vue'

const props = withDefaults(defineProps<{ phase?: 'all' | 'lp' | 'ellipsoid' }>(), { phase: 'all' })
const { $clicks, $clicksContext, $frontmatter, $nav, $page, $renderContext } = useSlideContext()
const { isPrintMode, isPrintWithClicks } = useNav()
const showPrintSummary = computed(() => props.phase === 'ellipsoid' && isPrintMode.value && !isPrintWithClicks.value)
const last = computed(() => props.phase === 'lp' ? 0 : props.phase === 'ellipsoid' ? 8 : 10)
const clickId = `anf-exact-${useId()}`
// Register the animation's own range. A frontmatter clicks override is cached
// by Slidev and cannot grow when new stages are added through hot updates.
watch(last, value => {
  $clicksContext.register(clickId, { max: value, delta: 0 })
}, { immediate: true })
const isPresentation = computed(() => ['slide', 'presenter'].includes($renderContext.value))
const active = computed(() => $nav.value.currentPage === $page.value)
const stage = computed(() => isPresentation.value ? Math.max(0, Math.min(last.value, Number($clicks.value ?? 0))) : last.value)
const displayStage = computed(() => stage.value + (props.phase === 'ellipsoid' ? 2 : 0))
const targetExpr = computed(() => props.phase === 'ellipsoid'
  ? 'K_\\tau:=P\\cap\\{u=(w,z):\\tfrac1N\\textstyle\\sum_{s\\ne t}z_{st}\\ge\\tau\\}.'
  : 'K_\\tau:=\\{u=(w,z):\\text{① の LP 制約},\\ \\tfrac1N\\textstyle\\sum_{s\\ne t}z_{st}\\ge\\tau\\}.')
const playing = ref(false)
const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
onMounted(async () => {
  if (!import.meta.hot || !isPresentation.value || props.phase === 'lp') return
  await nextTick()
  // A preview opened before the fixed frontmatter limit was removed can still
  // hold that immutable limit. Reload once; the newly created context uses the
  // registered range instead. Built presentations never need this migration.
  if ($frontmatter.clicks == null && $clicksContext.total < last.value)
    window.location.reload()
})
let timer: ReturnType<typeof setTimeout> | undefined
function pause() {
  if (timer) clearTimeout(timer)
  timer = undefined
  playing.value = false
}
async function move(to: number) {
  pause()
  await $nav.value.go($page.value, Math.max(0, Math.min(last.value, to)))
}
async function advance() {
  pause()
  if (stage.value === last.value) await $nav.value.nextSlide()
  else await move(stage.value + 1)
}
async function retreat() {
  pause()
  if (stage.value === 0) await $nav.value.prev()
  else await move(stage.value - 1)
}
function schedule() {
  timer = setTimeout(async () => {
    if (!active.value || !isPresentation.value || stage.value >= last.value) return pause()
    await $nav.value.go($page.value, stage.value + 1)
    if (stage.value === last.value) pause()
    else schedule()
  }, 5200)
}
async function toggle() {
  if (playing.value) return pause()
  if (!active.value || !isPresentation.value || reducedMotion) return
  if (stage.value === last.value) await $nav.value.go($page.value, 0)
  playing.value = true
  schedule()
}
watch(active, () => pause())
watch(isPresentation, () => pause())
watch(() => props.phase, () => pause())
onBeforeUnmount(() => {
  pause()
  $clicksContext.unregister(clickId)
})
</script>

<template>
  <EllipsoidPrintSummary v-if="showPrintSummary" />
  <div v-else class="exact-lesson" :data-step="stage" :data-display-step="displayStage" :data-phase="props.phase" @keydown.right.capture.prevent.stop="advance" @keydown.left.capture.prevent.stop="retreat">
    <div v-if="props.phase !== 'lp'" class="lesson-path">
      <template v-if="props.phase === 'ellipsoid'">
        <span :class="{ current: stage === 0 }">目標値を固定</span><span>→</span>
        <span :class="{ current: stage >= 1 && stage <= 3 || stage === 5 }">中心を検査・切断</span><span>→</span>
        <span :class="{ current: stage === 4 || stage === 6 }">楕円体を更新</span>
        <span>→</span><span :class="{ current: stage >= 7 }">終了を判定</span>
      </template>
      <template v-else>
        <span :class="{ current: stage === 0 }">① ANF を LP にする</span><span>→</span>
        <span :class="{ current: stage === 1 }">② 最小カットで検査</span><span>→</span>
        <span :class="{ current: stage >= 2 }">③ 楕円体を更新</span>
      </template>
    </div>

    <div class="lesson-body">
      <div v-if="displayStage === 0 || props.phase === 'lp'" class="lesson-columns">
        <div>
          <p class="lesson-label">ANF 最大化と同じ最適値を持つ LP</p>
          <div class="lp-formula"><Katex display expr="\begin{aligned}\max\quad&\frac1N\sum_{s\ne t}z_{st}\\\mathrm{s.t.}\quad&w\in\Delta_E,\quad 0\le z_{st}\le1,\\&z_{st}\le\sum_{e\in\delta^+(S)}w_e.\end{aligned}" /></div>
          <p class="quantifiers"><Katex expr="\forall s\ne t,\quad\forall S\subseteq V:\ s\in S,\ t\notin S" /></p>
          <p><Katex expr="N=n(n-1)" />：順序付き頂点対の数．</p>
          <p><Katex expr="\delta^+(S)" />：<Katex expr="S" /> から外へ出る辺の集合．</p>
        </div>
        <div class="lesson-explanation">
          <p v-if="props.phase === 'lp'" class="lesson-label">LP と ANF の対応</p>
          <p><Katex expr="z_{st}" /> は，各対の最大流値以下に置く変数．</p>
          <div class="equivalence"><Katex display expr="z_{st}\le\min_{S:s\in S,\ t\notin S}\sum_{e\in\delta^+(S)}w_e" /><Katex display expr="\Longleftrightarrow\quad z_{st}\le\kappa_{st}(w)" /></div>
          <p>上は<strong>最大流最小カット定理</strong>による．</p>
          <p>固定した <Katex expr="w" /> では，各 <Katex expr="z_{st}" /> を<br><Katex expr="\kappa_{st}(w)" /> まで増やせる．<br><strong>したがって，目的値の最大化は ANF 最大化．</strong></p>
        </div>
      </div>

      <div v-else-if="displayStage === 1" class="lesson-columns">
        <div>
          <p class="lesson-label">候補点 <Katex expr="u=(w,z)" /> が全制約を満たすか調べる</p>
          <p>まず，非負性・辺容量の総和・<Katex expr="z" /> の上下限を検査．<br>次に，各対の最小カット <Katex expr="S" /> と値を計算する．</p>
          <div class="oracle-formula"><Katex display expr="\kappa_{st}(w)=\sum_{e\in\delta^+(S)}w_e" /></div>
          <p><strong><Katex expr="z_{st}>\kappa_{st}(w)" /> なら，この制約に違反：</strong></p>
          <div class="oracle-formula"><Katex display expr="z_{st}-\sum_{e\in\delta^+(S)}w_e\le0" /></div>
          <p>どの対でも違反しなければ，全てのカット制約を満たす．</p>
        </div>
        <div class="lesson-explanation">
          <p class="lesson-label">これが「分離オラクル」</p>
          <p>候補点が実行可能なら，それを確認する．<br>実行不能なら，<strong>違反した不等式を 1 本返す</strong>．</p>
          <div class="equivalence"><Katex display expr="a^\top u\le b" /></div>
          <p>この不等式は，<strong>実行可能な全点</strong>で成立し，<br>今の候補点では成立しない．</p>
          <p class="oracle-count">分離 1 回：高々 <Katex expr="N=n(n-1)" /> 回の最大流．</p>
        </div>
      </div>

      <div v-else class="geometry-lesson">
        <div class="target-definition">
          <p><Katex expr="P" /> は LP の実行可能領域，<Katex expr="\tau" /> は目標値．次の集合に点があるかを調べる：</p>
          <div class="target-math"><Katex :expr="targetExpr" /></div>
        </div>
        <EllipsoidWalkthrough :step="displayStage - 2" :show-controls="false" />
      </div>
    </div>

    <div v-if="props.phase === 'ellipsoid'" class="termination-guarantee" :class="{ visible: stage >= 7 }">
      <template v-if="stage >= 7">
        <strong>有限回で終了：</strong>有理 LP 版（GLS）は，実行可能点または矛盾の証明を求める．<br>
        分離の呼出し回数は，変数数と各制約のビット長の多項式で抑えられる（次頁）．
      </template>
    </div>

    <div v-if="props.phase !== 'ellipsoid'" class="lesson-conclusion" :class="{ 'is-final': stage === last && props.phase !== 'lp' }" aria-live="polite">
      <template v-if="props.phase === 'lp'">
        <p>変数は <Katex expr="d=m+N" /> 個，カット制約は指数個．実行可能領域は <Katex expr="[0,1]^d" /> 内．</p>
        <p class="theorem-source">各制約の係数・右辺は <Katex expr="0,\pm1" />．</p>
      </template>
      <template v-else-if="stage === last">
        <p><strong>有界な有理 LP ＋ 多項式時間の分離 ⇒ 厳密な最適解を多項式時間で計算できる．</strong></p>
        <p class="theorem-source">変数 <Katex expr="d=m+N" />．入力ビット長に関する保証．<a href="https://www.zib.de/userpage/groetschel/pubnew/paper/groetschellovaszschrijver1988.pdf" target="_blank" rel="noopener">[Grötschel–Lovász–Schrijver, §6.4]</a></p>
      </template>
      <template v-else>
        <p>変数は <Katex expr="d=m+N" /> 個，制約係数は <Katex expr="0,\pm1" />．領域は <Katex expr="[0,1]^d" /> 内．</p>
        <p class="theorem-source">指数個のカット制約を列挙せずに検査できることが，多項式時間解法につながる．</p>
      </template>
    </div>

    <div v-if="isPresentation && props.phase !== 'lp'" class="lesson-controls" @click.stop>
      <button type="button" @click="move(stage - 1)" :disabled="stage === 0">前へ</button>
      <button type="button" class="primary" @click="advance">{{ stage === last ? '次のスライド' : '次へ' }}</button>
      <button type="button" @click="toggle" :disabled="reducedMotion" :aria-pressed="playing">{{ playing ? '一時停止' : '再生' }}</button>
      <button type="button" @click="move(0)">最初から</button>
      <span>{{ stage + 1 }} / {{ last + 1 }}　→ キーでも進む</span>
    </div>
  </div>
</template>

<style scoped>
.exact-lesson { height:413px; width:100%; color:#263551; font-size:16px; line-height:1.5; }
.lesson-path { display:flex; align-items:center; gap:18px; height:31px; border-bottom:1px solid #cfdbed; color:#6d7891; font-size:16px; }
.lesson-path .current { color:#1c3177; font-weight:700; }
.termination-guarantee { height:48px; box-sizing:border-box; padding:5px 0 0; color:#52637d; font-size:13px; line-height:1.5; }
.termination-guarantee.visible { border-top:1px solid #cfdbed; }
.lesson-body { height:306px; padding-top:8px; box-sizing:border-box; }
.exact-lesson[data-phase='lp'] .lesson-body { height:334px; }
.lesson-columns { display:grid; grid-template-columns:1.08fr 1fr; gap:24px; padding-top:9px; }
.lesson-columns p { margin:0 0 9px !important; font-size:15.5px; line-height:1.55; }
.lesson-label { color:#1c3177; font-weight:700; }
.lesson-explanation { border-left:1px solid #cfdbed; padding-left:22px; }
.lp-formula { font-size:21px; margin:14px 0 10px; }
.quantifiers { font-size:13.5px !important; margin-bottom:13px !important; }
.equivalence { font-size:20px; color:#1c3177; margin:13px 0; }
.oracle-formula { font-size:21px; margin:12px 0; }
.oracle-count { margin-top:18px !important; color:#1c3177; }
.exact-lesson strong { color:#1c3177; }
.exact-lesson :deep(.katex-display) { margin:4px 0 !important; }
.geometry-lesson { margin-top:-4px; }
.target-definition { height:42px; font-size:15px; }
.target-definition p { margin:0 0 2px !important; line-height:1.4; }
.target-math { font-size:15px; line-height:1.5; }
.lesson-conclusion { height:48px; box-sizing:border-box; padding:6px 0 0; border-top:1px solid #cfdbed; font-size:15.5px; }
.lesson-conclusion p { margin:0 0 2px !important; line-height:1.4; }
.theorem-source { font-size:13px; color:#64748b; }
.theorem-source a { color:#526b9d; }
.lesson-controls { display:flex; align-items:center; gap:6px; height:28px; padding-top:2px; box-sizing:border-box; }
.lesson-controls button { border:1px solid #a9b8d0; background:#fff; color:#35466a; border-radius:4px; padding:2px 10px; font-size:12px; line-height:1.5; cursor:pointer; }
.lesson-controls button.primary { background:#1c3177; border-color:#1c3177; color:#fff; }
.lesson-controls button:disabled { opacity:.38; cursor:default; }
.lesson-controls button:focus-visible { outline:3px solid #7f96c2; outline-offset:2px; }
.lesson-controls span { margin-left:7px; font-size:12px; color:#64748b; }
@media print { .lesson-controls { display:none; } }
</style>
