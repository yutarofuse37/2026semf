---
theme: seriph
title: Multiplicative Weights Update for Maximizing Network Connectivity
info: |
  総和1の辺重みを変数に，ANF・Algebraic Connectivity の近似解を MWU で与える．
seminar: true
duration: 60min
colorSchema: light
routerMode: history
download: ./seminar.pdf
presenter: true
browserExporter: true
drawings:
  persist: false
fonts:
  sans: Noto Sans JP
  serif: Noto Sans JP
layout: cover
background: /bg_title.png
---

# Multiplicative Weights Update<br>for Maximizing Network Connectivity

<div class="mt-10 text-sm text-gray-600">

ゼミ資料

</div>

<!--
この資料は約60分を想定した発表資料．厳密な証明の一部は付録に回す．
ACのMWUは添付ノート Appendix B（定理B.8，補題B.6，B.9）だけを述べる．
第4章は添付されたANFのノートに基づく．
既存容量0の容量配分モデル，確率的ANFオラクル，期待値とマルコフの不等式による相対保証を中心に再構成した．
-->


<!--
「精度」は最適値との差の理論保証を指す．実験による精度・実行時間の主張は含めない．
ANFが別の重み付きペア平均を指している場合も，同じ構造で係数を差し替えられる．
ただし離散的な辺追加や上限制約がある場合は，現在の単体上の更新をそのまま適用できない．
-->

---
class: roomy
---

# 今回の研究の概観

変数は，総和が $1$ の辺重みである．対象は次の二つの最大化である．

- **Average Network Flow（ANF）** <span class="cite-cf"><a href="https://doi.org/10.1109/TNSE.2022.3150289" target="_blank" rel="noopener">[Si, Mburano, Zheng, Qiu 2022]</a></span>
- **Algebraic Connectivity** <span class="cite-cf"><a href="https://dml.cz/handle/10338.dmlcz/101168" target="_blank" rel="noopener">[Fiedler 1973]</a></span>

いずれも，Multiplicative Weights Update（MWU） <span class="cite-cf">cf. <a href="https://doi.org/10.4086/toc.2012.v008a006" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012]</a></span> で $(1-\varepsilon)$ 近似解を計算する．

---
class: roomy cut-definition
---

# 有向 $s$–$t$ mincut の定義 <span class="cite-cf"><a href="https://doi.org/10.4153/CJM-1956-045-5" target="_blank" rel="noopener">[Ford, Fulkerson 1956]</a></span>

有向グラフ $G=(V,E)$，辺の容量 $x_e\ge0$ を考える．$s\in S$，$t\notin S$ とする．

<div class="grid grid-cols-2 gap-6">
<div>

<DirectedCutDiagram />

<div class="diagram-caption">

$c_x(S)=2+3=5$．

</div>
</div>
<div>

$$
\delta^+(S)=\{(u,v)\in E:u\in S,\ v\notin S\},
$$

$$
c_x(S)=\sum_{e\in\delta^+(S)}x_e.
$$

- 数えるのは $S$ **から出る辺**．
- 図の $b\to a$ は逆向きなので数えない．
- $S$ の内部の辺も数えない．

</div>
</div>

$$
\kappa_{st}(x)=\min_{\substack{S\subseteq V\\s\in S,\ t\notin S}}c_x(S)
=\text{$s$から$t$への最大流量}.
$$

<!--
図ではs→b→tに2，s→a→tに3を流せるので最大流量も5．表示したSは最小カットである．
一般にκ_stとκ_tsは一致しない．到達不能ならκ_st=0．
添付ノートの最大流記号F_stをκ_stとし，図のxは一般の容量を表す．正規化した配分はwとする．
-->

---
class: roomy
---

# 有向カットとAverage Network Flow <span class="cite-cf"><a href="https://doi.org/10.1109/TNSE.2022.3150289" target="_blank" rel="noopener">[Si, Mburano, Zheng, Qiu 2022]</a></span>

$w\in\Delta_E=\left\{w\in\mathbb R_{\ge0}^E:\sum_{e\in E}w_e=1\right\}$ とする．$\kappa_{st}(w)$ は前頁の $s$–$t$ 最小カット．

<AnfPairExamples />

$n=|V|\ge2$ とする．$(s,t)\in V\times V$，$s\neq t$ は $n(n-1)$ 個ある．

$$
\mathrm{ANF}(w)=\frac1{n(n-1)}\sum_{\substack{s,t\in V\\ s\neq t}}\kappa_{st}(w),
\qquad
\mathsf{OPT}_{\mathrm{ANF}}=\max_{w\in\Delta_E}\mathrm{ANF}(w).
$$

左の $(t,s)$ は**到達不能**．右はすべての $s\neq t$ が到達可能なので**強連結**．

---
class: roomy
---

# $\lambda_2$ と Algebraic Connectivity <span class="cite-cf"><a href="https://dml.cz/handle/10338.dmlcz/101168" target="_blank" rel="noopener">[Fiedler 1973]</a></span>

$G=(V,E)$ は連結な無向グラフ．辺 $e=\{a,b\}$ に対し

$$
b_e=((b_e)_v)_{v\in V},\qquad
x=(x_v)_{v\in V},
$$

$(b_e)_a=1$，$(b_e)_b=-1$，他の成分は $0$．

$$
L(w)=\sum_{e\in E}w_e b_eb_e^\top,
\qquad
X=\{x\in\mathbb R^V:x^\top\mathbf1=0,\ \|x\|_2=1\},
$$

$$
\lambda_2(L(w))=\min_{x\in X}x^\top L(w)x.
$$

$\lambda_2(L(w))$ を **Algebraic Connectivity** と呼ぶ．$\mathsf{OPT}_{\mathrm{AC}}=\max_{w\in\Delta_E}\lambda_2(L(w))$．

$x\in X$ が $x^\top L(w)x\le(1+\alpha)\lambda_2(L(w))$ を満たすとき，$x$ を **$\alpha$-近似ベクトル** と呼ぶ．

---
class: roomy
---

# 主結果

<div class="stmt stmt-thm">

$\bar w_T=\frac{1}{T}\sum_{t=1}^T w_t$．$\widetilde O$ は対数因子を省略する．最大流1回の時間を $T_{\mathrm{flow}}$ とする．

**ANF.** 少なくとも $\frac{2}{3}$ の確率で，次を満たす解を得る．時間は，強連結なら $\widetilde O\!\left(\frac{n}{\varepsilon^2}(T_{\mathrm{flow}}+m)\right)$，一般には $\widetilde O\!\left(\frac{n^2}{\varepsilon^2}(T_{\mathrm{flow}}+m)\right)$．

$$
\mathrm{ANF}(\bar w_T)\ge(1-\varepsilon)\mathsf{OPT}_{\mathrm{ANF}}.
$$

**Algebraic Connectivity.** 少なくとも $\frac{2}{3}$ の確率で，次を満たす解を $\widetilde O\!\left(\frac{mn}{\varepsilon^3}\right)$ 時間で得る．
$$
\lambda_2(L(\bar w_T))\ge(1-\varepsilon)\mathsf{OPT}_{\mathrm{AC}}.
$$

</div>

<!--
内部精度を γ=ε のままにすると失敗確率の上界が 1 になり，保証にならない．
OPT=0 のときは保証は自明．任意の δ には γ=εδ で足りるが，反復数に 1/δ² が付く．
高確率化の繰り返しは ANF の目的値評価が要るので，主結果には置かない．
強連結の O(n log m/ε²) は，既存の 1/OPT 型に OPT=Θ(1/n) を入れても出る．
下界用の配分は初期値へ混ぜない．
Algebraic Connectivity のこの頁の時間は，添付ノート Appendix B 定理B.8の Õ(mn/ε³)．
-->

---
class: dense
---

# 関連研究：Average Network Flow

- <span class="cite-cf"><a href="https://doi.org/10.1109/TNSE.2022.3150289" target="_blank" rel="noopener">[Si, Mburano, Zheng, Qiu 2022]</a></span> は ANF をネットワークの頑健性の指標として導入している．
- <span class="cite-cf"><a href="https://doi.org/10.1137/070704277" target="_blank" rel="noopener">[Nemirovski, Juditsky, Lan, Shapiro 2009]</a></span> の 4.3 節は，容量がランダムなネットワークで，固定した始点と終点の期待最大流を確率的鏡像降下法で最大化する．
- <span class="cite-cf"><a href="https://doi.org/10.4230/LIPIcs.ESA.2022.20" target="_blank" rel="noopener">[Blankenburg 2022]</a></span> の定理 3 を ANF に適用すると，最大流の呼び出しが

$$
\widetilde O\!\left(\frac{n^2+m}{\varepsilon^2}\right)
$$

回で，決定的な近似解が得られる．

<div class="callout-strong">

**本研究.** 頂点対を抽出し，1反復につき最大流を 1 回計算して更新する．強連結グラフでは，呼び出し $\widetilde O(n/\varepsilon^2)$ 回で，成功確率 $\frac23$ の近似保証を得る．

</div>

<!--
Fuse らは与えられた容量の ANF を評価する．重みの最適化ではない．
Nemirovski らの 4.3 節は固定した s-t の数値例である．
Blankenburg の定理 3 は資源配分のオラクル回数であり，ANF 専用の定理ではない．(n^2+m)/ε^2 は対をブロック，辺を資源と見た適用．
単純有向グラフでは m≤n(n-1) なので，この回数は本資料の一般の場合の最大流回数 Õ(n^2/ε^2) と同じオーダー．改善として言うのは強連結の Õ(n/ε^2) 回に限る．
-->

---
class: roomy
---

# 関連研究：Algebraic Connectivity

- <span class="cite-cf"><a href="https://doi.org/10.1137/S0036144504443821" target="_blank" rel="noopener">[Sun, Boyd, Xiao, Diaconis 2006]</a></span> は，辺の遷移率に線形な予算のもとで $\lambda_2(L(w))$ を最大化する問題を，連続時間 Markov 過程の混合速度として研究し，半正定値計画に書いた．
- <span class="cite-cf"><a href="https://doi.org/10.1137/20M137570X" target="_blank" rel="noopener">[Elbassioni, Makino, Najy 2022]</a></span> は，packing と covering の半正定値計画に対するオラクル型近似法を与える．Algebraic Connectivity の最適化も covering として書ける．行列 MWU による解析は <span class="cite-cf"><a href="https://arxiv.org/abs/1809.09698v3" target="_blank" rel="noopener">[Elbassioni, Makino 2018]</a></span> の Appendix A にある．
- 本資料の解析は <span class="cite-cf"><a href="https://doi.org/10.4086/toc.2012.v008a006" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012]</a></span> の regret 評価をもとにしている．

<div class="callout-strong">

**本発表.** 近似Fiedlerベクトルを用いた更新を解析し，$\widetilde O(mn/\varepsilon^3)$ 時間の既存保証を，ANF と共通の MWU の観点から整理する．

</div>

<!--
雑誌版の著者は Elbassioni, Makino, Najy．Appendix A の行列 MWU は Elbassioni–Makino のプレプリント v3．
ここで述べるのは Õ(mn/ε^3) の既存保証の整理であり，プレプリント本文の行列 MWU による Õ(m) は本資料の結果にしない．
-->

---
class: roomy
---

# Multiplicative Weights Update (MWU) <span class="cite-cf">cf. <a href="https://doi.org/10.4086/toc.2012.v008a006" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012]</a></span>

$\eta>0$ とする．次の手続きを **Multiplicative Weights Update（MWU）** と呼ぶ．

1. **初期化.** 正の配分から始める．$w_1\in\Delta_E, w_{1,e}>0\quad(e\in E).$

2. **利得.** 各 $t$ で，配分 $w_t\in\Delta_E$ から $g_t=(g_{t,e})_{e\in E}\in\mathbb R^E$ を得る．

3. **更新.** 利得が大きい辺ほど重みを掛け，総和が $1$ になるよう割る．

$$
w_{t+1,e}
=\frac{w_{t,e}\exp(\eta g_{t,e})}{\sum_{f\in E}w_{t,f}\exp(\eta g_{t,f})}.
$$

4. **出力.** $T$ 回の配分の平均を返す．

$$
\bar w_T=\frac{1}{T}\sum_{t=1}^T w_t.
$$

<!--
辺集合は固定し，非負の実数重みを連続的に配分する問題を扱う．全章で自己ループはないとする．
m=1なら単体は一点なので最適化は不要．m=0はこの正規化では定義しない．
「凹関数の最大化」は標準的な凸最適化の問題に含まれる．
配分は全て w\in\Delta_E で表す．
-->

---
class: roomy
---

# 二次元平面で見るMWUの動き

$\mathrm{OBJ}(w)=\min\{w_1,2w_2,3w_3\}$ を $w\in\Delta_3$ 上で最大化する．

<MwuTrajectory />

<!--
三つの非負重みの総和を1に固定し，独立な座標w1,w2を平面に描く．w3=1-w1-w2．
右のパスは同じ重みを辺の太さで示す．項 w1, 2w2, 3w3 が最小の辺を赤で示し，次の乗法更新でその辺が太くなる．
破線は目的値の等高線．初期表示では軌跡付近を拡大する．最適解は(6/11,3/11,2/11)，OPT=6/11．
一様初期化．最小の項の係数ベクトル(1,0,0)，(0,2,0)，(0,0,3)から優勾配を選ぶ．
同値の場合は先頭の項を選択する．更新は $w_i\exp(\eta g_i)$ を総和で割る．$g_i$ は係数 $1,2,3$．
表示している $\eta$ は，以前の $\eta/3$ をステップ幅へ吸収した値である．
現在点は最適解の周辺で振れることがある．平均配分はw1から現在のw_tまでの算術平均．
大きいηでは振れが大きく，小さいηでは進み方が遅くなる．固定ηを続けるだけで
任意精度に収束すると主張しない．次の保証では目標反復数Tに合わせてηを設定する．
PDFではη=0.7，25反復までの軌跡を静止図として表示する．再生はSites上で操作する．
-->


<!--
初めて OPT 依存を除いたとは言わない．雑誌版は著者三人．付録Aが引く先行版は Elbassioni–Makino, arXiv:1809.09698v3．
AAC の covering は旧プレプリント Appendix A の Covering-II の対角特殊例．D-最適性は口頭の注意に留める．
添付の定理 B.8 は既存保証の回収であり，本文のほぼ線形時間アルゴリズムと混同しない．
OPT 依存の時間は別解析であり，このスライドには置かない．
Hao–Orlin と Gabow は，与えられた容量の大域最小カットの計算．最大化のオラクルであり，有向大域最小カットの最良計算量は主張しない．
-->

---
layout: section
---

# ANF 最大化

---
class: roomy
---

# アルゴリズムの全体像

入力は有向グラフと $0<\varepsilon<1$．出力は配分 $\bar w_T\in\Delta_E$．目的は $\mathrm{ANF}(\bar w_T)$ を $\mathsf{OPT}_{\mathrm{ANF}}$ に近づけることである．

1. **初期化.** 各辺で $w_{1,e}=\frac1m$ とする．
2. **反復.** 時刻 $t=1,\ldots,T$ で次を行う．
   - 順序対 $(s,r)\in V\times V$，$s\neq r$ を，全順序対から一様に一つ取る．
   - 時刻 $t$ での重みベクトル $w_t$ における $(s,r)$ 最小カットを最大流 $1$ 回で求め，その指示ベクトル $\widehat g_t\in\{0,1\}^E$ を得る．辺 $e$ がカットから出るとき $\widehat g_{t,e}=1$．
   - すでに定めた指数更新を，$\widehat g_t$ を利得として行う．
3. **出力.** $\displaystyle\bar w_T=\frac1T\sum_{t=1}^T w_t$ を返す．

<!--
抽出は常に全順序対．T だけが下界で変わる．強連結は 1/(2(n-1))，一般は 1/(n(n-1))．定数は定理 3．
-->

---
class: roomy
---

# ANFの勾配の計算

<div class="stmt stmt-lem">

**補題 1.** 各順序対 $(s,r)$ の，$w_t$ における最小カットを $S_{sr}^{(t)}$ とし

$$
g_{t,e}=\frac{1}{n(n-1)}\sum_{s\ne r}
\mathbf1\{e\in\delta^+(S_{sr}^{(t)})\}
$$

とする．このとき

$$
\mathrm{ANF}(u)\le\mathrm{ANF}(w_t)+\langle g_t,u-w_t\rangle
\qquad(u\in\Delta_E).
$$

</div>

つまり，$g_{t,e}$ は，選んだ最小カットに辺 $e$ が現れる割合である．

**証明**．各ペアで，$S_{sr}^{(t)}$ は $w_t$ で最小なので内積は $\kappa_{sr}(w_t)$ と一致し，$u$ のカットの一つなので $\kappa_{sr}(u)$ を上から抑える．全ペアで平均すると

$$
\mathrm{ANF}(u)\le\langle g_t,u\rangle
=\mathrm{ANF}(w_t)+\langle g_t,u-w_t\rangle.
$$

<!--
s,rを頂点対，tを反復番号とする．本スライドは全ペアを使う厳密版．
次は同じ平均を不偏に推定することで1反復の計算量を減らす．
-->

---
class: dense
---

# 1ペアの最小カットの期待値

順序対 $(s_k,r_k)\in\{(s,r)\in V\times V:s\neq r\}$，$\widehat g_k\in\{0,1\}^E$ とし

$$
\mathcal H_t
=\bigl((s_k,r_k),\widehat g_k\bigr)_{k<t}
\in\bigl(\{(s,r)\in V\times V:s\neq r\}\times\{0,1\}^E\bigr)^{t-1}.
$$

$w_t=w_t(\mathcal H_t)\in\Delta_E$ であり，$\mathbb E[\,\cdot\mid\mathcal H_t]$ は $\mathcal H_t$ を固定した期待値である．

<div class="stmt stmt-lem">

**補題 2.** 順序対 $(s,r)\in V\times V$，$s\neq r$ を一様に抽出し，$S_{sr}^{(t)}\in\{S\subseteq V:s\in S,\ r\notin S\}$ を $w_t$ における最小カット，$\widehat g_t\in\{0,1\}^E$ をその指示ベクトルとする．

$$
\widehat g_{t,e}=\mathbf1\{e\in\delta^+(S_{sr}^{(t)})\}
$$

$g_t$ は補題 1 の全ペア平均とする．このとき

$$
\mathbb E[\widehat g_t\mid\mathcal H_t]=g_t.
$$

</div>

**証明**．順序対 $(s,r)$ は $n(n-1)$ 通りから等確率で選ばれる．条件付き期待値は補題 1 の平均 $g_t$ に一致する．$\square$

<div class="callout-bar">

この指示ベクトルで更新する．最大流計算は，抽出した1ペアについて <strong>1回</strong>．

</div>

<!--
本章では利得の成分が0以上1以下なので，R=1で更新する．
各ペアで複数の最小カットがある場合も，履歴に応じた選択規則を固定すればよい．
ランダム性は頂点対の抽出に由来し，個々の最大流・最小カットは厳密に解く．
-->

---
class: roomy
---

# 確率的な勾配計算を含むMWUによる近似比

$\log$ は自然対数とする．$0<\varepsilon<1$，$n\ge2$，$m\ge1$．出力は $\bar w_T=\frac1T\sum_{t=1}^T w_t\in\Delta_E$．

<div class="stmt stmt-thm">

**定理 3.** 全順序対から $(s,r)$ を一様に抽出し，10ページの手順で更新する．$\eta=\frac{\varepsilon}{6}$．このとき

$$
\Pr\!\left[\mathrm{ANF}(\bar w_T)\ge(1-\varepsilon)\mathsf{OPT}_{\mathrm{ANF}}\right]\ge\frac23.
$$

強連結なら

$$
T=\left\lceil\frac{72(n-1)\log(2m)}{\varepsilon^2}\right\rceil.
$$

一般には

$$
T=\left\lceil\frac{36n(n-1)\log(2m)}{\varepsilon^2}\right\rceil.
$$

</div>

<div class="callout-bar">

1反復は最大流1回と $O(m)$．平均は常に全順序対 $n(n-1)$ 個で取り，反復数に $\mathsf{OPT}_{\mathrm{ANF}}$ は入らない．

</div>

<!--
二次regretは既存のMWU評価．0/1応答の二乗が応答自身に一致することを使い，
下界から反復数を決める．新規性は主張しない．内部精度はε/3．ξ=εだと失敗確率の上界は1になる．
下界用の配分は初期値へ混ぜない．増幅のためのANF評価はこの定理には不要．
-->

---
class: roomy
---

# 抽出したカットの内積

$\mathsf{OPT}_{\mathrm{ANF}}=\max_{w\in\Delta_E}\mathrm{ANF}(w)$．

<div class="stmt stmt-lem">

**補題 4.** 各 $t$ で $(s,r)\in V\times V$，$s\neq r$ を一様に抽出し，$S_t\in\{S\subseteq V:s\in S,\ r\notin S\}$ を $w_t$ における最小カット，$\widehat g_t\in\{0,1\}^E$ をその指示ベクトルとする．$w^\star\in\Delta_E$ を $\mathrm{ANF}$ の最適解とする．このとき

$$
\begin{aligned}
\mathbb E[\langle w_t,\widehat g_t\rangle\mid\mathcal H_t]
&=\mathrm{ANF}(w_t),\\
\mathbb E[\langle w^\star,\widehat g_t\rangle\mid\mathcal H_t]
&\ge\mathsf{OPT}_{\mathrm{ANF}},\\
\mathbb E\!\left[\sum_{e\in E}w_{t,e}\widehat g_{t,e}^{2}\mid\mathcal H_t\right]
&=\mathrm{ANF}(w_t).
\end{aligned}
$$

</div>

---
class: roomy proof-steps
---

# 補題 4 の証明（1）

履歴 $\mathcal H_t$ を固定する．$w_t\in\Delta_E$ はこの履歴から決まる定数であり，$w^\star\in\Delta_E$ は抽出前に固定した最適解である．

各順序対 $(s,r)$，$s\neq r$ について，最小カット $S_{sr}^{(t)}\in\{S\subseteq V:s\in S,\ r\notin S\}$ を $w_t$ から決まる規則で一つ選ぶ．指示ベクトル $g_t^{sr}\in\{0,1\}^E$ を $g_{t,e}^{sr}=\mathbf1\{e\in\delta^+(S_{sr}^{(t)})\}$ とする．任意の $z\in\Delta_E$ で，この $S_{sr}^{(t)}$ は $z$ の $s$–$r$ カットなので

$$
\kappa_{sr}(z)
\le\sum_{e\in\delta^+(S_{sr}^{(t)})}z_e
=\langle z,g_t^{sr}\rangle.
$$

$w_t$ では $S_{sr}^{(t)}$ が最小なので，$\kappa_{sr}(w_t)=\langle w_t,g_t^{sr}\rangle$．

今期の抽出は $n(n-1)$ 個の順序対から一様なので，選ばれた対の指示ベクトルが $\widehat g_t$ である．したがって

$$
g_t
=\mathbb E[\widehat g_t\mid\mathcal H_t]
=\frac1{n(n-1)}\sum_{\substack{s,r\in V\\ s\neq r}}g_t^{sr}\in[0,1]^E.
$$

---
class: roomy proof-steps
---

# 補題 4 の証明（2）

$w_t$ も $w^\star$ も $\mathcal H_t$ を固定すれば定数なので，内積と条件付き期待値は交換できる．和は $s,r\in V$，$s\neq r$ にわたる．

$$
\mathbb E[\langle w_t,\widehat g_t\rangle\mid\mathcal H_t]
=\langle w_t,g_t\rangle
=\frac1{n(n-1)}\sum_{s\neq r}\langle w_t,g_t^{sr}\rangle,
$$

各対で $\langle w_t,g_t^{sr}\rangle=\kappa_{sr}(w_t)$ なので

$$
\langle w_t,g_t\rangle
=\frac1{n(n-1)}\sum_{s\neq r}\kappa_{sr}(w_t)
=\mathrm{ANF}(w_t).
$$

---
class: roomy proof-steps
---

# 補題 4 の証明（3）

第2式も同じ交換から始まる．各対の不等式に $z=w^\star$ を入れ，全順序対で平均する．

$$
\mathbb E[\langle w^\star,\widehat g_t\rangle\mid\mathcal H_t]
=\langle w^\star,g_t\rangle
=\frac1{n(n-1)}\sum_{s\neq r}\langle w^\star,g_t^{sr}\rangle,
$$

各対で $\langle w^\star,g_t^{sr}\rangle\ge\kappa_{sr}(w^\star)$ なので

$$
\langle w^\star,g_t\rangle
\ge\frac1{n(n-1)}\sum_{s\neq r}\kappa_{sr}(w^\star)
=\mathrm{ANF}(w^\star)
=\mathsf{OPT}_{\mathrm{ANF}}.
$$

$\widehat g_{t,e}\in\{0,1\}$ なので $\widehat g_{t,e}^{2}=\widehat g_{t,e}$ であり，$\sum_{e\in E}w_{t,e}\widehat g_{t,e}^{2}=\langle w_t,\widehat g_t\rangle$．第1式から，この条件付き期待値も $\mathrm{ANF}(w_t)$ に一致する．$\square$

---
class: dense proof-steps
---

# 抽出の各結果での二次評価

各時刻の $\widehat g_t\in\{0,1\}^E$ は補題 4 で得た指示ベクトルであり，$w_t$ は $w_{1,e}=\frac1m$ とそれまでの抽出結果から定まる．

<div class="stmt stmt-lem">

**補題 5.** 定数 $0<\eta\le\frac12$ とする．どの抽出結果についても，任意の $u\in\Delta_E$ に対し

$$
\sum_{t=1}^{T}\langle u-w_t,\widehat g_t\rangle
\le\frac{\log m}{\eta}
+\eta\sum_{t=1}^{T}\sum_{e\in E}w_{t,e}\widehat g_{t,e}^{2}.
$$

</div>

**証明.** $u_e=0$ の項は $0$ とし，$\mathrm{KL}(u\Vert w_t)=\sum_{e:u_e>0}u_e\log\frac{u_e}{w_{t,e}}$ とおく．$Z_t=\sum_{f\in E}w_{t,f}\exp(\eta\widehat g_{t,f})$ と更新式から

$$
\mathrm{KL}(u\Vert w_{t+1})
=\mathrm{KL}(u\Vert w_t)-\eta\langle u,\widehat g_t\rangle+\log Z_t.
$$

$0\le x\le1$ では $k\ge2$ のとき $x^k\le x^2$ なので，$\mathrm{e}^{x}\le1+x+x^2$．

$0\le\eta\widehat g_{t,e}\le\frac12$ なので $Z_t\le1+\eta\langle w_t,\widehat g_t\rangle+\eta^2\sum_e w_{t,e}\widehat g_{t,e}^{2}$．$\log(1+y)\le y$ を代入して

$$
\langle u-w_t,\widehat g_t\rangle
\le\frac{\mathrm{KL}(u\Vert w_t)-\mathrm{KL}(u\Vert w_{t+1})}{\eta}
+\eta\sum_{e\in E}w_{t,e}\widehat g_{t,e}^{2}.
$$

$t=1,\ldots,T$ で足す．$-\log x\ge1-x$ より終端の KL は $0$ 以上．$w_{1,e}=\frac1m$ と $u_e\log u_e\le0$ より $\mathrm{KL}(u\Vert w_1)\le\log m$．$\square$

---
class: roomy proof-steps
---

# 期待値での収束

<div class="stmt stmt-prop">

**命題 6.** 補題 4 の $\mathrm{ANF}$ に，補題 5 の更新を行う．$0<\eta\le\frac12$ とする．このとき

$$
\mathbb E[\mathrm{ANF}(\bar w_T)]
\ge\frac{\mathsf{OPT}_{\mathrm{ANF}}-\frac{\log m}{\eta T}}{1+\eta}.
$$

</div>

**証明**．$u,v\in\Delta_E$，$0\le\theta\le1$ に対し，各カット容量は線形なので

$$
\kappa_{sr}(\theta u+(1-\theta)v)
\ge\theta\kappa_{sr}(u)+(1-\theta)\kappa_{sr}(v).
$$

従って $\mathrm{ANF}$ は連続かつ凹であり，最適解 $w^\star\in\Delta_E$ が存在する．補題 5 で $u=w^\star$ とし，補題 4 と期待値の反復を使うと

$$
T\cdot\mathsf{OPT}_{\mathrm{ANF}}-\sum_{t=1}^{T}\mathbb E[\mathrm{ANF}(w_t)]
\le\frac{\log m}{\eta}
+\eta\sum_{t=1}^{T}\mathbb E[\mathrm{ANF}(w_t)].
$$

凹性より $\mathrm{ANF}(\bar w_T)\ge\frac1T\sum_{t=1}^T\mathrm{ANF}(w_t)$ が成り立つ．両辺の期待値を取り，上の不等式を $(1+\eta)$ で割ると所望の式が得られる．$\square$

---
class: roomy proof-steps
---

# 強連結グラフの下界

<div class="stmt stmt-lem">

**補題 7.** $G$ が強連結で $n\ge2$ のとき

$$
\mathsf{OPT}_{\mathrm{ANF}}\ge\frac1{2(n-1)}.
$$

</div>

**証明**．根 $r\in V$ を固定する．$r$ から全頂点へ向かう有向全域木と，全頂点から $r$ へ向かう有向全域木の和集合を $H$ とする．辺数は $k\le2(n-1)$．任意の $u,v$ は $u\to r\to v$ と進めるので $H$ は強連結．

$$
q\in\Delta_E,\qquad
q_e=\begin{cases}\frac1k,&e\in E(H),\\ 0,&e\notin E(H).\end{cases}
$$

任意の $\emptyset\neq S\subsetneq V$ は $H$ の経路で外へ出るので，$c_q(S)=\sum_{e\in\delta^+(S)}q_e\ge\frac1k$．全ての順序対で $\kappa_{sr}(q)\ge\frac1{2(n-1)}$．平均しても同じ下界を得る．$\mathsf{OPT}_{\mathrm{ANF}}$ はこの $q$ の値以上である．$\square$



---
class: roomy proof-steps
---

# 全順序対の平均の下界

<div class="stmt stmt-lem">

**補題 8.** $n\ge2$，$m\ge1$ のとき

$$
\mathsf{OPT}_{\mathrm{ANF}}\ge\frac{1}{n(n-1)}.
$$

</div>

**証明**．辺 $e=(a,b)$ に $w_e=1$，他の辺に $0$ を置く．$w\in\Delta_E$ であり，$\kappa_{ab}(w)\ge1$．

容量は非負なので，他の順序対の流量も $0$ 以上である．

全順序対で平均すると $\mathrm{ANF}(w)\ge\frac{1}{n(n-1)}$．最適値はこの $w$ の値以上である．$\square$

---
class: roomy proof-steps
---

# 定理 3 の証明（1）

$0<\delta<1$ とし，$\xi=\varepsilon\delta$ とおく．$\beta\le\mathsf{OPT}_{\mathrm{ANF}}$ は，強連結なら補題 7 の $\frac1{2(n-1)}$，一般には補題 8 の $\frac1{n(n-1)}$ である．

$$
\eta=\frac{\varepsilon\delta}{2},\qquad
T=\left\lceil\frac{4\log(2m)}{\xi^2\beta}\right\rceil.
$$

$\xi<1$ なので $0<\eta\le\frac12$．切り上げにより $T\ge\frac{4\log(2m)}{\xi^2\beta}$．$\frac{\log m}{\log(2m)}\le1$ と $\beta\le\mathsf{OPT}_{\mathrm{ANF}}$ より

$$
\frac{\log m}{\eta T}
\le\frac{\xi\beta}{2}
\le\frac{\xi\mathsf{OPT}_{\mathrm{ANF}}}{2}.
$$

命題 6 に代入すると，期待値は $\frac{1-\xi/2}{1+\xi/2}\mathsf{OPT}_{\mathrm{ANF}}$ 以上である．

$$
\frac{1-\xi/2}{1+\xi/2}-(1-\xi)
=\frac{\xi^2/2}{1+\xi/2}\ge0.
$$

したがって $\mathbb E[\mathrm{ANF}(\bar w_T)]\ge(1-\xi)\mathsf{OPT}_{\mathrm{ANF}}$．

---
class: roomy proof-steps
---

# 定理 3 の証明（2）

$X=\mathsf{OPT}_{\mathrm{ANF}}-\mathrm{ANF}(\bar w_T)$ とおく．$\bar w_T\in\Delta_E$ なので $X\ge0$．いま示した評価から $\mathbb E[X]\le\xi\mathsf{OPT}_{\mathrm{ANF}}=\varepsilon\delta\,\mathsf{OPT}_{\mathrm{ANF}}$．

マルコフの不等式より $\Pr[X>\varepsilon\mathsf{OPT}_{\mathrm{ANF}}]\le\delta$．したがって

$$
\Pr\!\left[\mathrm{ANF}(\bar w_T)\ge(1-\varepsilon)\mathsf{OPT}_{\mathrm{ANF}}\right]\ge1-\delta.
$$

$\delta=\frac13$ を代入する．$\xi=\frac{\varepsilon}{3}$，$\eta=\frac{\varepsilon}{6}$ であり，失敗確率は $\frac13$ 以下，成功確率は $\frac23$ 以上である．$\frac{4}{(\varepsilon/3)^2\beta}=\frac{36}{\varepsilon^2\beta}$ なので，強連結では $\beta=\frac1{2(n-1)}$ より

$$
T=\left\lceil\frac{72(n-1)\log(2m)}{\varepsilon^2}\right\rceil,
$$

一般には $\beta=\frac1{n(n-1)}$ より

$$
T=\left\lceil\frac{36n(n-1)\log(2m)}{\varepsilon^2}\right\rceil.
$$

これが定理 3 である．$\square$


---
layout: section
---

# Algebraic connectivity 最大化


---
class: roomy
---

# Algebraic Connectivity <span class="cite-cf"><a href="https://dml.cz/handle/10338.dmlcz/101168" target="_blank" rel="noopener">[Fiedler 1973]</a></span>

重みの配分を $w\in\Delta_E$ とする．辺 $e=\{u,v\}$ に対し，$(b_e)_u=1$，$(b_e)_v=-1$，他の成分は $0$ とする．

$$
\begin{aligned}
L(w)&=\sum_{e\in E}w_e b_eb_e^\top,\qquad
x^\top L(w)x = \sum_{\{u,v\}\in E}w_{uv}(x_u-x_v)^2.
\end{aligned}
$$

行列 $L(w)$ は対称・半正定値で $L(w)\mathbf1=0$．固有値を $0=\lambda_1\le\lambda_2\le\cdots\le\lambda_n$ と並べる．**Algebraic connectivity** は $\lambda_2(L(w))$ であり，$\lambda_2>0$ と，正の重みを持つ辺からなるグラフの連結性は同値．

$$
X=\{x\in\mathbb R^V:x^\top\mathbf1=0,\ \|x\|_2=1\},
$$

$$
\begin{aligned}
\lambda_2(L(w))
=\min_{x\in X}x^\top L(w)x
=\min_{x\in X}\sum_{\{u,v\}\in E}w_{uv}(x_u-x_v)^2.
\end{aligned}
$$

この最小値を与える $x\in X$ を，$L(w)$ の **Fiedlerベクトル** と呼ぶ．

<!--
向きはb_eの符号を決めるだけで，b_e b_e^Tは変わらない．
元グラフGが連結でも，重み0の辺を除いた支持グラフが非連結ならλ2=0．
正規化ラプラシアンでは次数行列も重みに依存し，以下の線形性と優勾配式はそのままでは使えない．
-->

---
class: roomy
---

# 変位による解釈

<AcInterpretation />

<div class="ac-click-sink" aria-hidden="true">
<span v-click>1</span>
<span v-click>2</span>
<span v-click>3</span>
</div>

<!--
既存資料の「引っ張り」を，二次形式と整合する変位として説明し直した．
物理的な弾性エネルギーは通常この式の1/2だが，指標としては二次形式自体を用いる．
辺の離散的な切断数そのものではなく，全体的な変形しにくさを測る．
-->

---
class: roomy
---

# 例：中央の橋を強める効果

パス $1$–$2$–$3$–$4$ に $x=(-\frac{1}{2},-\frac{1}{2},\frac{1}{2},\frac{1}{2})$ を与える．

<div class="diagram-wrap mt-8">

<GraphPath />

</div>

$$
x^\top L(w)x=w_{23}.
$$


<!--
図は既存AC資料のGraphPathを再利用．このxが各wのFiedlerベクトルだとは主張しない．
右の配分は中央を強める代わりに端の辺を弱めるため，AC自体が右のほうで大きいとも主張しない．
任意の固定xから得られる値はλ2の上界であり，下界ではない．
-->

---
class: roomy
---

# Absolute Algebraic Connectivity <span class="cite-cf"><a href="https://doi.org/10.1080/03081089008817967" target="_blank" rel="noopener">[Fiedler 1990]</a></span>

連結な無向グラフ $G=(V,E)$ に対し，$\Delta_E=\left\{w\in\mathbb R_{\ge0}^E:\sum_e w_e=1\right\}$ 上で

$$
\mathsf{OPT}_{\mathrm{AC}}:=\max_{w\in\Delta_E}\lambda_2(L(w))
$$

を **Absolute Algebraic Connectivity（AAC）** と呼ぶ．これは

$$
\max_{w\in\Delta_E}\min_{x\in X}x^\top L(w)x
$$

に等しい．

<div class="stmt stmt-thm">

**定理 9.** 連結な無向グラフと $0<\varepsilon<1$ に対し，以下で構成する手続きは

$$
\Pr\!\left[\lambda_2(L(\bar w_T))\ge(1-\varepsilon)\mathsf{OPT}_{\mathrm{AC}}\right]\ge\frac23
$$

を満たす $\bar w_T\in\Delta_E$ を返す．総時間は $\widetilde O\!\left(\frac{mn}{\varepsilon^3}\right)$．

</div>

---
class: roomy
---

# Fiedlerベクトルが与える上界

<div class="stmt stmt-lem">

**補題 10.** ベクトル $x_t\in X$ を現在の $L(w_t)$ のFiedlerベクトルとし，

$$
g_{t,\{a,b\}}=(x_{t,a}-x_{t,b})^2
$$

とする．このとき，任意の $u\in\Delta_E$ に対し

$$
\lambda_2(L(u))\le\lambda_2(L(w_t))+\langle g_t,u-w_t\rangle.
$$

</div>


**証明**．任意の $u\in\Delta_E$ に対し

$$
\begin{aligned}
\lambda_2(L(u))
&\le x_t^\top L(u)x_t=\langle g_t,u\rangle \\
&=\lambda_2(L(w_t))+\langle g_t,u-w_t\rangle. \square
\end{aligned}
$$

- 固有値 $\lambda_2$ が単純なら，これが通常の勾配．
- 重複固有値でも，$X$ 内の対応固有ベクトルを一つ選べばよい．

<!--
線形関数〈w,g(x)〉の点ごとの最小値であることが凹性と優勾配の根拠．
単純固有値の微分公式でも同じ式を得るが，この導出は重複を含めて使える．
重複の場合は単一のxによるrank-oneな選択も有効であり，固有空間を全て混ぜる必要はない．
-->

---
class: roomy
---

# 近似Fiedlerベクトル <span class="cite-cf"><a href="https://doi.org/10.1137/090771430" target="_blank" rel="noopener">[Spielman, Teng 2014]</a></span>

<div class="stmt stmt-def">

**定義 11.** 定数 $\alpha\ge0$ とする．ラプラシアン $L(w)$ に対し，$x\in X$ が

$$
x^\top L(w)x\le(1+\alpha)\lambda_2(L(w))
$$

を満たすとき，$x$ を **$\alpha$-近似Fiedlerベクトル** と呼ぶ．

</div>

<div class="stmt stmt-thm">

**定理 12**（<span class="cite-cf"><a href="https://doi.org/10.1137/090771430" target="_blank" rel="noopener">[Spielman, Teng 2014]</a></span>）．精度 $0<\alpha<1$ と失敗確率 $0<\rho<1$ に対し，重み付き連結グラフの $\alpha$-近似Fiedlerベクトルを確率 $1-\rho$ 以上で出力する乱択アルゴリズムがある．時間は

$$
O\!\left(m\log^c m\,\log\frac1\rho\,\frac{\log(2/\alpha)}{\alpha}\right).
$$
</div>

- 以下では $\alpha=\frac{\varepsilon}{4}$，各回の失敗確率を $\frac{1}{6T}$ とする．1回の時間は $\widetilde O(\frac{m}{\varepsilon})$．



<!--
原資料のDefinition 2.1と同じ定義．Spielman–Teng (2014) の Definition 7.1 と同じ条件．α=0なら正確なFiedlerベクトル．
ベクトル自体の距離や角度をα以内にする定義ではない．重複固有値でもこの定義を使える．
引用する外部の定理は Spielman–Teng (2014) Theorem 7.2．本資料の番号は定理 12．線形方程式ソルバ自体の証明は行わない．
原定理のmは非零要素数であり，連結グラフの辺数とは定数倍の差しかない．
近似ベクトルは1への直交を保ち，最後に単位ノルムに正規化する．
-->

---
class: roomy
---

# アルゴリズムの全体像

入力は連結な無向グラフと $0<\varepsilon<1$．出力は配分 $\bar w_T\in\Delta_E$．目的は $\lambda_2(L(\bar w_T))$ を $\mathsf{OPT}_{\mathrm{AC}}$ に近づけることである．

1. **基準配分.** 全辺で正の $q\in\Delta_E$ を一つ求める．作り方は次頁から与える．
2. **初期化.** 定数を $\delta=\frac{\varepsilon}{4}$ とし，各辺で $w_{1,e}=\frac{1-\delta}{m}+\delta q_e$ とする．
3. **反復.** 時刻 $t=1,\ldots,T$ で次を行う．
   - ラプラシアン $L(w_t)$ の $\alpha$-近似Fiedlerベクトル $x_t$ を求める．近似比は $\alpha=\delta$．
   - 各辺の応答を $g_{t,e}=(b_e^\top x_t)^2$ とし，$h_t=\frac{g_t}{\langle w_t,g_t\rangle}$ とおく．応答 $h_t$ は $\mathbb R^E$ に属する．
   - 応答 $h_t$ を利得とする指数更新を行い，各辺の重みが $\delta q_e$ を下回らないよう切り詰める．
4. **出力.** 平均 $\displaystyle\bar w_T=\frac1T\sum_{t=1}^T w_t$ を返す．

<!--
ノート Algorithm 4 の骨格．T と η は切り詰め付き更新の頁で定める．
中心化ベクトルのノルムが 0 のときは一様配分を返して停止する．詳細は更新の頁．
-->

---
class: roomy
---

# 実効抵抗 <span class="cite-cf"><a href="https://doi.org/10.1007/BF01164627" target="_blank" rel="noopener">[Klein, Randić 1993]</a></span>

正の重みを持つ辺が $V$ を連結する $w\in\Delta_E$ に対し，$L(w)$ の擬似逆行列を $L(w)^+$ とする．辺 $e\in E$ の実効抵抗は

$$
R_e(w)=b_e^\top L(w)^+b_e\in\mathbb R.
$$

<div class="stmt stmt-lem">

**補題 13.** ベクトル $x\in\mathbb R^V$ が $x^\top\mathbf1=0$ を満たすとき，各辺 $e$ で

$$
(b_e^\top x)^2\le R_e(w)\,x^\top L(w)x.
$$

</div>

**証明**．内積 $b_e^\top x$ を $(L(w)^+)^{1/2}b_e$ と $L(w)^{1/2}x$ の内積と見て，Cauchy–Schwarz を使う．$\square$

正の重みを持つ辺が $V$ を連結するなら，重みと実効抵抗の積の和は $\sum_{e\in E}w_e R_e(w)=n-1$ である．各辺の抵抗を $1$ としたネットワークでは，実効抵抗そのものの和 $\sum_{e\in E}R_e$ が $n-1$ になる．この場合を <span class="cite-cf">[Foster 1949]</span> が示している．

---
class: dense
---

# 基準配分

<div class="stmt stmt-lem">

**補題 14.** 定数 $0<\rho<1$ とする．確率 $1-\frac{\rho}{2}$ 以上，時間 $\widetilde O(m\log\frac{2}{\rho})$ で $q\in\Delta_E$ を計算でき，

$$
q_e>0\quad(e\in E),\qquad \max_{e\in E}R_e(q)<2(n-1).
$$

</div>

初期値は各辺 $v_{1,e}=\frac1m$ とし，回数を $N=\lceil 4\log(2m)\rceil$，相対誤差を $\zeta=\frac18$ とする．

- 各回 $k=1,\ldots,N$ で，配分 $v_k$ の全辺の実効抵抗を近似する．各値はベクトル $L(v_k)^{+/2}b_e$ の長さの二乗で，ランダムな低次元射影が全辺の長さを同時に保つ．計算はラプラシアン方程式 $O(\log n)$ 本に帰着する（<span class="cite-cf"><a href="https://doi.org/10.1137/080734029" target="_blank" rel="noopener">[Spielman, Srivastava 2011]</a></span>，ソルバは <span class="cite-cf"><a href="https://doi.org/10.1137/090771430" target="_blank" rel="noopener">[Spielman, Teng 2014]</a></span>）．
- 正の重みを持つ辺が $V$ を連結するとき，真の抵抗は $1\le R_e(v_k)\le\frac1{v_{k,e}}$ に入る．近似をこの区間へ切り詰め，$\widehat R_{k,e}$ とする．抵抗が大きい辺ほど，次の配分を増やす．

$$
Z_k=\sum_{f\in E}v_{k,f}\widehat R_{k,f},\qquad
v_{k+1,e}=\frac{v_{k,e}\widehat R_{k,e}}{Z_k}.
$$

出力は平均 $q=\frac1N\sum_{k=1}^N v_k\in\Delta_E$ である．

<!--
ノートの補題B.9とProposition B.13．
Spielman–Srivastava 2011 から使うのは全辺の実効抵抗の同時近似であり，スペクトル・スペーシファイアの抽出ではない．
真の抵抗は[1,1/v_e]に入る．下界は単位流のエネルギーが1以上であること，上界は当該辺だけを使う経路の抵抗1/v_e．切り詰めはこの区間への射影で，相対誤差の向きを保つ．
-->

---
class: roomy proof-steps
---

# 補題 14 の評価（1）

推定が全て成功したとする．各辺で $(1-\zeta)R_e(v_k)\le\widehat R_{k,e}\le(1+\zeta)R_e(v_k)$．記号を $d=n-1$ とおく．正の重みを持つ辺が $V$ を連結するなら $\sum_e v_{k,e}R_e(v_k)=d$ なので，$(1-\zeta)d\le Z_k\le(1+\zeta)d$．更新式とこの比較から，各辺で

$$
R_e(v_k)
\le d\cdot\frac{1+\zeta}{1-\zeta}\cdot\frac{v_{k+1,e}}{v_{k,e}}.
$$

ここで $\zeta=\frac18$ なので，右辺は $d\cdot\frac97\cdot\frac{v_{k+1,e}}{v_{k,e}}$ である．対数を $k$ について平均する．

初期値 $v_{1,e}=\frac1m$，上端 $v_{N+1,e}\le1$，回数 $N\ge4\log(2m)$ より

$$
\frac1N\sum_{k=1}^N\log R_e(v_k)
\le\log d+\log\frac97+\frac14.
$$

---
class: roomy proof-steps
---

# 補題 14 の評価（2）

補題 13 で等号になるベクトルをとると，$R_e(w)$ は $\frac{(b_e^\top x)^2}{x^\top L(w)x}$ の，$x^\top\mathbf1=0$ かつ $x\neq0$ での最大値である．分母は $w$ について線形なので，各項の対数は凸であり，最大をとっても凸である．したがって $\log R_e$ は，正の重みを持つ辺が $V$ を連結する配分の上で凸であり，平均 $q$ でも同じ上界が成り立つ．評価 $\mathrm{e}^{1/4}<\frac43$ より

$$
R_e(q)\le\frac97\,\mathrm{e}^{1/4}\,d<\frac{12}{7}d<2d.
\quad\square
$$

---
class: dense
---

# 正規化した応答

ベクトル $x_t\in X$ を $L(w_t)$ の $\alpha$-近似Fiedlerベクトルとする．各辺の応答を $g_{t,e}=(b_e^\top x_t)^2$ とし，$r_t=\langle w_t,g_t\rangle$，$h_t=\frac{g_t}{r_t}$ とおく．このとき $h_t\in\mathbb R^E$ であり $\langle w_t,h_t\rangle=1$．

$$
\lambda_2(L(w_t))\le r_t\le(1+\alpha)\lambda_2(L(w_t)).
$$

任意の $z\in\Delta_E$ に対し

$$
\langle z,h_t\rangle
\ge\frac{\lambda_2(L(z))}{(1+\alpha)\lambda_2(L(w_t))}.
$$

<div class="stmt stmt-lem">

**補題 15.** 内積を $s_t=\langle q,h_t\rangle$ とする．補題 14 の $q$ に対し，各辺で $h_{t,e}\le 2(n-1)s_t$ であり

$$
\sum_{e\in E}w_{t,e}h_{t,e}^2\le 2(n-1)\,s_t.
$$

</div>

**証明**．補題 13 を $q$ と $x_t$ に使うと $g_{t,e}\le R_e(q)\,x_t^\top L(q)x_t$．上界 $R_e(q)<2(n-1)$ と $x_t^\top L(q)x_t=\langle q,g_t\rangle$ より $h_{t,e}\le 2(n-1)s_t$．重み $w_{t,e}h_{t,e}$ を掛けて足し，$\langle w_t,h_t\rangle=1$ を使う．$\square$

---
class: roomy
---

# 切り詰め付きの指数更新

精度を $0<\varepsilon<1$ とし，$d=n-1$ とする．パラメータは $\delta=\alpha=\frac{\varepsilon}{4}$，$\eta=\frac{\varepsilon}{16d}$，

$$
T=\left\lceil\frac{64d\log(2m)}{\varepsilon^2}\right\rceil.
$$

実行可能集合は $K_\delta=\{w\in\Delta_E:w_e\ge\delta q_e\ (e\in E)\}$．初期値は

$$
w_{1,e}=\frac{1-\delta}{m}+\delta q_e.
$$

各時刻 $t=1,\ldots,T$ で $\alpha$-近似Fiedlerベクトル $x_t$ を求め，$h_t$ を前頁のとおり作る．中心化したベクトルのノルムが $0$ なら，一様配分 $\frac1m$ を返して停止する．そうでなければ

$$
v_{t,e}=w_{t,e}\exp(\eta h_{t,e}),\qquad
w_{t+1,e}=\max\{\delta q_e,\ c_t v_{t,e}\}.
$$

正の数 $c_t>0$ は $\sum_e w_{t+1,e}=1$ となる唯一の定数で，$O(m\log m)$ 時間で求まる．この写像は，指数更新を $K_\delta$ へ KL 射影したものである．出力は $\bar w_T=\frac1T\sum_{t=1}^T w_t$．


<!--
ノート Algorithm 4 と補題 B.6．初期値も射影後の配分も K_δ に入る．
η h_{t,e}≤1/2 は，K_δ 上の h_{t,e}≤2d/δ と η=δ/(4d) から従う．
-->

---
class: roomy proof-steps
---

# 切り詰めた更新の二次評価

<div class="stmt stmt-lem">

**補題 16.** 前頁の切り詰め付き更新を行う．各時刻 $t$ と各辺 $e$ で $0\le\eta h_{t,e}\le\frac12$ とする．このとき任意の $u\in K_\delta$ に対し

$$
\sum_{t=1}^T\langle u-w_t,h_t\rangle
\le\frac{\mathrm{KL}(u\Vert w_1)}{\eta}
+\eta\sum_{t=1}^T\sum_{e\in E}w_{t,e}h_{t,e}^2.
$$

</div>

**証明**．指数更新を正規化した配分を $\widehat w_{t+1}\in\Delta_E$ とする．補題 5 の証明と同じ計算で

$$
\langle u-w_t,h_t\rangle
\le\frac{\mathrm{KL}(u\Vert w_t)-\mathrm{KL}(u\Vert\widehat w_{t+1})}{\eta}
+\eta\sum_{e\in E}w_{t,e}h_{t,e}^2.
$$

$w_{t+1}$ は $\widehat w_{t+1}$ の $K_\delta$ への KL 射影なので，$u\in K_\delta$ なら $\mathrm{KL}(u\Vert w_{t+1})\le\mathrm{KL}(u\Vert\widehat w_{t+1})$ である．差の中の KL を $w_{t+1}$ に替えても不等式は成り立つ．$t$ について足すと終端の KL は $0$ 以上なので，初期値の KL だけが残る．$\square$

---
class: dense proof-steps
---

# 近似比

<div class="stmt stmt-thm">

**定理 9.** 連結な無向グラフと $0<\varepsilon<1$ に対し，切り詰め付きの指数更新は

$$
\Pr\!\left[\lambda_2(L(\bar w_T))\ge(1-\varepsilon)\mathsf{OPT}_{\mathrm{AC}}\right]\ge\frac23
$$

を満たす $\bar w_T\in\Delta_E$ を返す．近似Fiedlerベクトルの呼び出しは $O\!\left(\frac{n\log(2m)}{\varepsilon^2}\right)$ 回，総時間は $\widetilde O\!\left(\frac{mn}{\varepsilon^3}\right)$．

</div>

**証明**．基準配分に失敗確率 $\frac16$，各Fiedlerベクトルに $\frac{1}{6T}$ を割り当てる．失敗確率を足すと $\frac13$ 以下なので，成功確率は $\frac23$ 以上．この事象上で考える．

最適配分を $w^\star$ とし，$u=(1-\delta)w^\star+\delta q\in K_\delta$ とおく．初期値 $w_{1,e}\ge\frac{1-\delta}{m}$ と $u_e\log u_e\le0$ より $\mathrm{KL}(u\Vert w_1)\le\log\frac{m}{1-\delta}\le\log(2m)$ である．
各辺で $0\le\eta h_{t,e}\le\frac12$ なので，補題 16 より

$$
\sum_{t=1}^T\langle u-w_t,h_t\rangle
\le\frac{\mathrm{KL}(u\Vert w_1)}{\eta}
+\eta\sum_{t=1}^T\sum_{e\in E}w_{t,e}h_{t,e}^2.
$$

補題 15 で $\sum_{e\in E}w_{t,e}h_{t,e}^2\le 2(n-1)s_t$ を使う．積 $\eta\cdot 2(n-1)=\frac{\delta}{2}$ なので，$u$ の中の $\delta q$ がこの項を吸収する．正規化応答の不等式を $z=w^\star$ に使うと

$$
\frac1T\sum_{t=1}^T\frac1{\lambda_2(L(w_t))}
\le\frac{1+\alpha}{(1-\delta)\mathsf{OPT}_{\mathrm{AC}}}\left(1+\frac{\mathrm{KL}(u\Vert w_1)}{\eta T}\right).
$$

---
class: roomy proof-steps
---

# 定理 9 の証明（2）

各 $t$ で $\lambda_2(L(w_t))>0$ とする．ベクトル $y,z\in\mathbb R^T$ の第 $t$ 成分を

$$
y_t=\sqrt{\lambda_2(L(w_t))},\qquad
z_t=\frac1{\sqrt{\lambda_2(L(w_t))}}
$$

とする．積は $y_tz_t=1$ なので，内積は $\langle y,z\rangle=T$ である．Cauchy–Schwarz $\langle y,z\rangle^2\le\|y\|_2^2\|z\|_2^2$ より

$$
\begin{aligned}
T^2
&=\langle y,z\rangle^2
\le\|y\|_2^2\|z\|_2^2\\
&=\Bigl(\sum_{t=1}^T\lambda_2(L(w_t))\Bigr)
\Bigl(\sum_{t=1}^T\frac1{\lambda_2(L(w_t))}\Bigr).
\end{aligned}
$$

---
class: roomy proof-steps
---

# 定理 9 の証明（3）

両辺を $T\sum_{t=1}^T\frac1{\lambda_2(L(w_t))}$ で割る．$\frac1{\lambda_2(L(w_t))}$ の平均の上界は正なので，その逆数をとると

$$
\begin{aligned}
\frac1T\sum_{t=1}^T\lambda_2(L(w_t))
&\ge\frac{T}{\sum_{t=1}^T\frac1{\lambda_2(L(w_t))}}
=\Bigl(\frac1T\sum_{t=1}^T\frac1{\lambda_2(L(w_t))}\Bigr)^{-1}\\
&\ge\frac{(1-\delta)\mathsf{OPT}_{\mathrm{AC}}}{(1+\alpha)\bigl(1+\frac{\mathrm{KL}(u\Vert w_1)}{\eta T}\bigr)}.
\end{aligned}
$$

関数 $\lambda_2(L(\cdot))$ は凹なので，$\lambda_2(L(\bar w_T))$ はこの平均以上である．

---
class: roomy proof-steps
---

# 定理 9 の証明（4）

パラメータ $\delta=\frac{\varepsilon}{4}<\frac12$ と $T$ の選び方から $\frac{\mathrm{KL}(u\Vert w_1)}{\eta T}\le\frac{\varepsilon}{4}$．変数を $x=\frac{\varepsilon}{4}$ とおくと

$$
\frac{\lambda_2(L(\bar w_T))}{\mathsf{OPT}_{\mathrm{AC}}}
\ge\frac{1-x}{(1+x)^2}.
$$

展開すると $(1-x)-(1-4x)(1+x)^2=x+7x^2+4x^3\ge0$ なので，右辺は $1-4x=1-\varepsilon$ 以上である．

基準配分は $\widetilde O(m)$．各反復はFiedlerベクトル $\widetilde O(\frac{m}{\varepsilon})$ と切り詰め $O(m\log m)$．反復回数 $T=O(\frac{n\log(2m)}{\varepsilon^2})$ なので総時間は $\widetilde O(\frac{mn}{\varepsilon^3})$．$\square$


---
class: roomy
---

# まとめ

辺へ総量 $1$ を配分し，MWU の平均 $\bar w_T\in\Delta_E$ で次の二つの最大化を $(1-\varepsilon)$ 近似した．成功確率はいずれも $\frac23$ 以上である．

**ANF（定理 3）.** 有向グラフで，全順序対から1ペアの最小カットを一様に抽出し，その指示ベクトルを利得として更新する．最大流 1 回の時間を $T_{\mathrm{flow}}$ とすると，時間は強連結なら $\widetilde O\!\left(\frac{n}{\varepsilon^2}(T_{\mathrm{flow}}+m)\right)$，一般には $\widetilde O\!\left(\frac{n^2}{\varepsilon^2}(T_{\mathrm{flow}}+m)\right)$ である．

**Algebraic Connectivity（定理 9）.** 連結な無向グラフで，基準配分 $q$ へ切り詰める指数更新と，近似Fiedlerベクトルから作る正規化応答 $h_t=\frac{g_t}{\langle w_t,g_t\rangle}$ を使う．時間は $\widetilde O\!\left(\frac{mn}{\varepsilon^3}\right)$ である．

---
class: dense refs
---

# 参考文献

- <span class="cite-cf"><a href="https://doi.org/10.4086/toc.2012.v008a006" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012]</a></span> The Multiplicative Weights Update Method: a Meta-Algorithm and Applications. *Theory of Computing*, 8(6), 121–164.
- <span class="cite-cf"><a href="https://doi.org/10.4230/LIPIcs.ESA.2022.20" target="_blank" rel="noopener">[Blankenburg 2022]</a></span> Resource Sharing Revisited: Local Weak Duality and Optimal Convergence. *30th European Symposium on Algorithms*, LIPIcs 244, 20:1–20:14.
- <span class="cite-cf"><a href="https://arxiv.org/abs/1809.09698v3" target="_blank" rel="noopener">[Elbassioni, Makino 2018]</a></span> Finding Sparse Solutions for Packing and Covering Semidefinite Programs. arXiv:1809.09698v3.
- <span class="cite-cf"><a href="https://doi.org/10.1137/20M137570X" target="_blank" rel="noopener">[Elbassioni, Makino, Najy 2022]</a></span> Finding Sparse Solutions for Packing and Covering Semidefinite Programs. *SIAM Journal on Optimization*, 32(2), 321–353.
- <span class="cite-cf"><a href="https://dml.cz/handle/10338.dmlcz/101168" target="_blank" rel="noopener">[Fiedler 1973]</a></span> Algebraic Connectivity of Graphs. *Czechoslovak Mathematical Journal*, 23(2), 298–305.
- <span class="cite-cf"><a href="https://doi.org/10.1080/03081089008817967" target="_blank" rel="noopener">[Fiedler 1990]</a></span> Absolute Algebraic Connectivity of Trees. *Linear and Multilinear Algebra*, 26, 85–106.
- <span class="cite-cf"><a href="https://doi.org/10.4153/CJM-1956-045-5" target="_blank" rel="noopener">[Ford, Fulkerson 1956]</a></span> Maximal Flow Through a Network. *Canadian Journal of Mathematics*, 8, 399–404.
- <span class="cite-cf">[Foster 1949]</span> The average impedance of an electrical network. In *Contributions to Applied Mechanics (Reissner Anniversary Volume)*, 333–340.

---
class: dense refs
---

# 参考文献

- <span class="cite-cf"><a href="https://doi.org/10.15807/jorsj.69.39" target="_blank" rel="noopener">[Fuse, Matsui, Shimizu, Shioura 2026]</a></span> An Efficient Algorithm for Computing Average Network Flow. *Journal of the Operations Research Society of Japan*, 69(2), 39–46.
- <span class="cite-cf"><a href="https://doi.org/10.1007/BF01164627" target="_blank" rel="noopener">[Klein, Randić 1993]</a></span> Resistance Distance. *Journal of Mathematical Chemistry*, 12, 81–95.
- <span class="cite-cf"><a href="https://doi.org/10.1137/070704277" target="_blank" rel="noopener">[Nemirovski, Juditsky, Lan, Shapiro 2009]</a></span> Robust Stochastic Approximation Approach to Stochastic Programming. *SIAM Journal on Optimization*, 19(4), 1574–1609.
- <span class="cite-cf"><a href="https://doi.org/10.1109/TNSE.2022.3150289" target="_blank" rel="noopener">[Si, Mburano, Zheng, Qiu 2022]</a></span> Measuring Network Robustness by Average Network Flow. *IEEE Transactions on Network Science and Engineering*, 9(3), 1697–1712.
- <span class="cite-cf"><a href="https://doi.org/10.1137/080734029" target="_blank" rel="noopener">[Spielman, Srivastava 2011]</a></span> Graph Sparsification by Effective Resistances. *SIAM Journal on Computing*, 40(6), 1913–1926.
- <span class="cite-cf"><a href="https://doi.org/10.1137/090771430" target="_blank" rel="noopener">[Spielman, Teng 2014]</a></span> Nearly Linear Time Algorithms for Preconditioning and Solving Symmetric, Diagonally Dominant Linear Systems. *SIAM Journal on Matrix Analysis and Applications*, 35(3), 835–885.
- <span class="cite-cf"><a href="https://doi.org/10.1137/S0036144504443821" target="_blank" rel="noopener">[Sun, Boyd, Xiao, Diaconis 2006]</a></span> The Fastest Mixing Markov Process on a Graph and a Connection to a Maximum Variance Unfolding Problem. *SIAM Review*, 48(4), 681–699.
