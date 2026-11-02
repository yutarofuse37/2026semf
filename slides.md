---
theme: seriph
title: Multiplicative Weights Update for Maximizing Network Connectivity
info: |
  総和1の辺容量を変数に，ANF・Algebraic Connectivity の近似解を MWU で与える．
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
routeAlias: contents
---

# 目次

<DeckContents />

---
class: roomy
routeAlias: problem-setting
---

# 今回の研究の概観

ネットワークの連結性に関する以下の2つの指標の最大化問題を計算する近似アルゴリズムを，Multiplicative Weights Update（MWU） <span class="cite-cf"><a href="https://doi.org/10.4086/toc.2012.v008a006" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012]</a></span> の枠組みをもとに提案する．

- **Average Network Flow（ANF）** <span class="cite-cf"><a href="https://doi.org/10.1109/TNSE.2022.3150289" target="_blank" rel="noopener">[Si, Mburano, Zheng, Qiu 2022]</a></span>

  グラフ上で全ての頂点間の最大流量の平均をとった値
- **Algebraic Connectivity** <span class="cite-cf"><a href="https://dml.cz/handle/10338.dmlcz/101168" target="_blank" rel="noopener">[Fiedler 1973]</a></span>

  グラフのラプラシアン行列の2番目に小さい固有値

---
class: roomy cut-definition
---

# 有向カット/有向 $s$–$t$ 最小カットの定義 <span class="cite-cf"><a href="https://doi.org/10.4153/CJM-1956-045-5" target="_blank" rel="noopener">[Ford, Fulkerson 1956]</a></span>

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

- $S$ **から出る辺**の容量の和を求める．
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
class: roomy anf-introduction
clicks: 7
---

# Average Network Flow <span class="cite-cf"><a href="https://doi.org/10.1109/TNSE.2022.3150289" target="_blank" rel="noopener">[Si, Mburano, Zheng, Qiu 2022]</a></span>

$w\in\Delta_E=\left\{w\in\mathbb R_{\ge0}^E:\sum_{e\in E}w_e=1\right\}$ とする．$\kappa_{st}(w)$ は前頁の $s$–$t$ 最小カット．

<AnfPairExamples />

$n=|V|\ge2$．**向きを区別した $n(n-1)$ 個の頂点対の最小カット値の平均**をとる．

$$
\mathrm{ANF}(w)=\frac1{n(n-1)}\sum_{s\neq t}\kappa_{st}(w),
\qquad
\mathsf{OPT}_{\mathrm{ANF}}=\max_{w\in\Delta_E}\mathrm{ANF}(w).
$$

<!--
例は有向サイクル 1→2→3→1 に，辺 1→3 を追加したグラフのみ．
4 辺の容量は全て 1/4 で総和は 1．
クリックごとに (1,2),(1,3),(2,1),(2,3),(3,1),(3,2) を順に数える．
各対は同じ容量のもとで個別に評価する．同時に全対へ流す意味ではない．
1→3 へは，直接の辺と 1→2→3 の経路に 1/4 ずつ流せるため κ13=1/2．
他の 5 対は κ=1/4．それぞれ容量 1/4 のカットがあり，同量のフローも存在する．
最後のクリックで合計 7/4 を 6 で割り，ANF=7/24 を示す．
-->

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

---
class: roomy
---

# 主結果

$\bar w_T=\frac{1}{T}\sum_{t=1}^T w_t$．$\widetilde O$ は対数因子を省略する．最大流1回の時間を $T_{\mathrm{flow}}$ とする．

<div class="stmt stmt-thm">

**ANF.** 少なくとも $\frac{2}{3}$ の確率で次を満たす解を，強連結なら $\widetilde O\!\left(\frac{n}{\varepsilon^2}(T_{\mathrm{flow}}+m)\right)$ 時間，一般には $\widetilde O\!\left(\frac{n^2}{\varepsilon^2}(T_{\mathrm{flow}}+m)\right)$ 時間で得る．

$$
\mathrm{ANF}(\bar w_T)\ge(1-\varepsilon)\mathsf{OPT}_{\mathrm{ANF}}.
$$
</div>

<div class="stmt stmt-thm">

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
class: roomy mwu-introduction
routeAlias: mwu
---

# Multiplicative Weights Update（MWU） <span class="cite-cf"><a href="https://doi.org/10.4086/toc.2012.v008a006" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012]</a></span>

近似解を求めるため，$d$ 個の選択肢への配分 $p_t\in\Delta_d$ を繰り返し更新する．

$\Delta_d=\{p\in\mathbb R_{\ge0}^d:\sum_{i=1}^d p_i=1\}$，$\eta>0$ とする．

1. **初期化：** $p_{1,i}=1/d$．
2. **利得を計算：** 現在の配分 $p_t$ から，利得ベクトル $g_t\in\mathbb R^d$ を得る．
3. **乗法更新：** 利得の差に応じて，配分比を変える．

$$
p_{t+1,i}=\frac{p_{t,i}\exp(\eta g_{t,i})}{\sum_{j=1}^d p_{t,j}\exp(\eta g_{t,j})}.
$$

4. **出力：** 配分の平均 $\displaystyle\bar p_T=\frac1T\sum_{t=1}^T p_t$ を返す．

<div class="mwu-intro-bridge">

最小化では，利得を損失の負値にする．本発表では $d=m$，$p_{t,e}=w_{t,e}$ として辺容量を更新する．

</div>

<!--
ここでは特定の問題から離れた配分更新として p∈Δ_d を用いる．
利得の大きい成分を増やす gain 形式．損失 ℓ_t の最小化なら g_t=−ℓ_t とする．
更新式だけで近似保証が得られるわけではない．各問題で利得の選び方・範囲・ステップ幅・反復数を解析する．
次頁で MWU の動きを例示した後，ANF・AC の既存手法と本発表を比較する．
関連研究で数えるのは，各欄に定義する処理の呼出し回数．配分更新などの追加処理を含む総計算時間とは読み替えない．
本発表の辺容量配分の初期値や切り詰めは，後の各アルゴリズムで別途指定する．この頁の一様初期化を全ての派生法に強制する意味ではない．
-->

---
class: roomy
---

# 二次元平面で見る MWU の動き

$\mathrm{OBJ}(w)=\min\{w_1,2w_2,3w_3\}$ を $w\in\Delta_3$ 上で最大化する．

<MwuTrajectory />

<!--
3 辺の非負容量の総和を1に固定し，独立な座標w1,w2を平面に描く．w3=1-w1-w2．
右のパスは同じ容量を辺の太さで示す．項 w1, 2w2, 3w3 が最小の辺を赤で示し，次の乗法更新でその辺が太くなる．
破線は目的値の等高線．初期表示では軌跡付近を拡大する．最適解は(6/11,3/11,2/11)，OPT=6/11．
一様初期化．最小の項の係数ベクトル(1,0,0)，(0,2,0)，(0,0,3)から優勾配を選ぶ．
同値の場合は先頭の項を選択する．更新は $w_i\exp(\eta g_i)$ を総和で割る．$g_i$ は係数 $1,2,3$．
表示している $\eta$ は，以前の $\eta/3$ をステップ幅へ吸収した値である．
現在点は最適解の周辺で振れることがある．平均配分はw1から現在のw_tまでの算術平均．
大きいηでは振れが大きく，小さいηでは進み方が遅くなる．固定ηを続けるだけで
任意精度に収束すると主張しない．本編の保証では目標反復数Tに合わせてηを設定する．
PDFではη=0.7，25反復までの軌跡を静止図として表示する．再生はSites上で操作する．
-->


<!--
初めて OPT 依存を除いたとは言わない．Elbassioni–Makino–Najy (2022) の雑誌版と，Elbassioni–Makino のプレプリント v3 (2019) は区別する．
AAC の通常の covering SDP は COVERING-I に対応する．COVERING-II の一般定理だけから本資料の Õ(mn/ε³) を結論しない．既存法への適用評価は AC の関連研究のスライドのノートに記載した．D-最適性は口頭の注意に留める．
添付ノート Appendix B の結果を本資料では定理 9 として述べる．関連研究の引用だけで同じ時間保証や新規性が確立したとはしない．
OPT 依存の時間は別解析であり，このスライドには置かない．
Hao–Orlin と Gabow は，与えられた容量の大域最小カットの計算．最大化のオラクルであり，有向大域最小カットの最良計算量は主張しない．
-->

---
class: roomy related-work applied-mwu
---

# ANF：既存手法と本発表の比較

<AppliedMwuRelated />

<!--
この頁はANFだけを扱い，本発表と同じ(1−ε)相対近似で，最大流の総呼出し回数を比較する．m=|E|，N=n(n−1)．有向グラフの全順序対を平均する．ACの文献・比較は次頁へまとめる．
Nemirovskiら2009は一般の確率的近似・確率的鏡像降下の論文であり，「確率的MWUの論文」としては分類しない．この頁ではMWUと関連する一次法のうち，単体上のエントロピー型の特殊化を取り上げる．
以下の補足計算のαは目的関数の加法誤差．画面の比較はすべて相対誤差εであり，成功保証の列もそろえる．ANFの鏡像降下の行は一般の加法評価からの換算で，最良の既存MWU評価を表すものではない．
ここでの適用と呼出し回数の計算は各一般定理からの帰結であり，引用論文がANF専用の定理を述べたという意味ではない．
各行の回数には，配分更新などの付加処理の計算時間を含めていない．

1. Arora–Hazan–Kale (2012), The Multiplicative Weights Update Method: a Meta-Algorithm and Applications.
https://theoryofcomputing.org/articles/v008a006/v008a006.pdf （§2，Theorems 2.3, 2.5，Corollary 2.6；加法評価はTheorem 3.1）．
原典§2（印刷p.126）には期待損失の説明があるが，これは分布p(t)から行動iを選んだときのE_i[m_i(t)]=〈m(t),p(t)〉を指す．各回，全行動の損失ベクトルが観測される設定である．Theorem2.3の不等式自体は，実現した任意の有界ベクトル列ごとに成立する．以下で用いる頂点対の無作為抽出，その履歴に関する条件付き期待値，ANFの相対近似・成功確率2/3は本資料で加える導出であり，AHK原典の直接のANFの定理ではない．したがってAHK＋1対抽出・確率解析を別の既存成果の行としては置かず，本発表の行に統合する．AHKを引用する比較行は，全対を毎回計算する決定的な直接適用である．
ANF(w)=(1/N)Σκ_st(w) は凹かつ1次同次．全対の最小カット指示ベクトルの平均gを取ると，gはANFの優勾配であり，0≤g_e≤1，〈w,g〉=ANF(w)．
全対を毎回計算するMWUの行：AHK Corollary2.6を非負利得g_tに適用する．任意の最適配分w*について〈w*,g_t〉≥OPT_ANF，〈w_t,g_t〉=ANF(w_t)なので，
\[
\sum_{t=1}^T\mathrm{ANF}(w_t)
\ge(1-\eta)T\mathsf{OPT}_{\mathrm{ANF}}-\frac{\log m}{\eta}.
\]
η=ε/2，β≤OPT_ANF，T≥4log(2m)/(ε²β)なら，凹性からANF(w_bar)≥(1−ε)OPT_ANFが決定的に成立する．
各更新で全N対の最小カットを個別に求める直接実装は最大流N回．従って総呼出しはNT=O(N log(2m)/(ε²β))．一般β=1/NならÕ(n⁴/ε²)，強連結β=1/[2(n−1)]ならÕ(n³/ε²)となる．これは必要回数の下界ではなく，この直接実装の回数である．
無向グラフならGomory–Hu木を用い，全対の最小カットをn−1回の最大流で得られる．Gusfield (1990), Very Simple Methods for All Pairs Network Flow Analysis, https://doi.org/10.1137/0219009 ．有向グラフではκ_stとκ_tsが異なり得るため，この無向木の保証を流用しない．

本発表の行の導出：毎回一様に1対を抽出し，その最小カット指示ベクトルg_hat_tを利得にする．1更新につき最大流は1回．
Theorem2.3のHedgeを損失−g_hat_tに適用し，任意の固定比較配分w*で凸結合すると，
Σ_t〈w*,g_hat_t〉≤Σ_t〈w_t,g_hat_t〉+ηΣ_t〈w_t,g_hat_t²〉+log(m)/η．
g_hat_t²=g_hat_tなので，(1+η)Σ_t〈w_t,g_hat_t〉≥Σ_t〈w*,g_hat_t〉−log(m)/η．
条件付き期待値についてE[〈w_t,g_hat_t〉|history]=ANF(w_t)，E[〈w*,g_hat_t〉|history]≥OPT_ANF．凹性と合わせて，
E[OPT_ANF−ANF(w_bar)]≤η OPT_ANF+log(m)/(ηT)．
既知のβ≤OPT_ANFに対しη=ε/6，T≥36 log(2m)/(ε²β)なら，期待劣化はε OPT_ANF/3以下．劣化は非負なのでMarkovの不等式から(1−ε)近似の成功確率は2/3以上．
一般のβ=1/[n(n−1)]，強連結のβ=1/[2(n−1)]を代入し，本発表のÕ(n²/ε²)，Õ(n/ε²)を得る．これはAHKの一般評価を最小カット標本に適用し，ANFの確率解析を加えたもの．AHK原典のANF専用成果として重複掲載しない．

ANF・Blankenburg行：Resource Sharing Revisited: Local Weak Duality and Optimal Convergence (2022), Theorem3．
https://doi.org/10.4230/LIPIcs.ESA.2022.20 ／ https://drops.dagstuhl.de/storage/00lipics/lipics-vol244-esa2022/LIPIcs.ESA.2022.20/LIPIcs.ESA.2022.20.pdf ．
算法の動き：原典Algorithm1では，各順序対を決まった順に処理し，その時点の辺価格を容量として最小カットを求める．最小カットを求めるたびに，カットに含まれる辺の価格を指数更新する．刻み幅によっては同じ対を複数回処理する．価格を総和1に正規化したものが辺容量配分であり，各巡回終了時の配分を平均した双対出力を使う．表の回数は，刻み幅の制限とAlgorithm2による初期の定数近似・スケーリングを含むTheorem3の保証である．
各順序対のカット指示ベクトルの凸包をC_stとし，X_st=C_st/N，X=Σ_st X_stとする．各X_stでの価格ベクトルに対する線形最小化は最大流1回で実装できる．
min_{x∈X}||x||∞=max_{w∈Δ_E}min_{x∈X}〈w,x〉=OPT_ANF．Theorem3の双対出力z∈Δ_mを辺容量に使うとANF(z)≥(1−ε)OPT_ANF．
原典のブロック数nをN=n(n−1)，座標数をm，σ=1，δ=εとするので，決定的にO((N+m)log(m)/ε²)回の最大流．強連結でもこの一般上界をそのまま示す．
単純有向グラフではm≤n(n−1)なので，一般の場合は本発表と同じÕ(n²/ε²)．強連結の比較で回数を減らせるが，本発表の保証は確率2/3であり，決定的算法との違いを残す．


2. Nemirovski–Juditsky–Lan–Shapiro (2009), Robust Stochastic Approximation Approach to Stochastic Programming, SIAM J. Optimization 19(4), 1574–1609.
https://doi.org/10.1137/070704277 ／著者公開版 https://www2.isye.gatech.edu/~nemirovs/SIOPT_RSA_2009.pdf ，§2.3，式(2.58),(2.60)．
式(2.58)は負のエントロピーω(p)=Σ_i p_i ln p_iの定義．その直後に，prox写像[P_p(y)]_i=p_i exp(−y_i)/Σ_j p_j exp(−y_j)という番号のない式が示される（印刷p.1586）．y=ηGを代入すると指数更新となる．
従ってMWUとの対応は，この単体・エントロピー型への特殊化について述べる．論文全体がMWUのみを扱うという意味ではなく，ANFの回数も原典の直接の定理ではなくこの特殊化からの帰結である．
f=−ANFを最小化する．過去と独立に順序対s≠tを一様抽出し，現在の容量wの最小カット指示ベクトルの負値Gを返す．
現在点と履歴で条件付けてE[G]∈∂f(w)，||G||∞≤1，したがって二次モーメント定数M_*≤1．
entropy proxの確率的鏡像降下は指数更新であり，式(2.60)よりE[f(w_bar)]−min f≤O(sqrt(log(2m)/T))．
1更新は最大流1回なので，期待加法誤差αにO(log(2m)/α²)回の最大流で足りる．近似固有ベクトルは一般には不偏な勾配ではないため，この結果をそのままAACの近似Fiedlerオラクルに適用しない．
相対保証には既知の下界β≤OPTを使いα=εβとすればよい．ANFでは一般にβ=1/N，強連結ならβ=1/[2(n−1)]．この基本評価はそれぞれÕ(n⁴/ε²)，Õ(n²/ε²)回．
画面の成功確率2/3への換算ではα=εβ/3としてE[OPT_ANF−ANF(w_bar)]≤ε OPT_ANF/3を保証し，Markovの不等式を用いる．回数の次数は変わらない．本発表の自己有界性を用いた解析とは区別する．

3. Chekuri–Quanrud (2018), Randomized MWU for Positive LPs.
https://doi.org/10.1137/1.9781611975031.25 ／ https://www.kentquanrud.com/papers/randomized-mwu.pdf ，Fig.1，Theorem2.1，Lemma3.12とその証明．
ANFのカット双対を，q_st,S≥0，Σ_S q_st,S≥1（各s≠t），Σ_st,S q_st,S χ_{δ⁺(S)}≤Nλ 1 と書く．λ>0は固定目標値．
各対の和を1に正規化すると辺側の負荷は増えない．minimaxより，この系の実行可能性はOPT_ANF≤λと同値．双対のλを上から近似する問題であり，AppendixのLPのように辺容量wを直接変数にした非負係数LPではない．
Packingの行数はm，Coveringの行数はN，変数数はD=N·2^(n−2)．Lemma3.12の証明はO((N+min{m,D})log(m+N)/ε²)回の集約オラクルを与える．
参照用の集約オラクル回数はmin{m,D}≤mを使うとÕ((N+m)/ε²)になる．定理2.1のln Dを単純に「対数だから」と省いて，余分なnを隠す議論ではない．
集約オラクルの実装：Packing行の価格をv_e>0，未充足のCovering行の価格をu_st>0とする．各対についてvを容量とする最小カットを計算し，κ_st(v)/u_stが最小となる対とカットを選ぶ．
共通の係数Nλは比較順を変えない．各列の集約Packing係数とCovering係数の比を最小にする列を選んで，その列だけの非負方向を適切にスケールする．実行可能な解があれば，集約された2本の不等式を満たす方向が存在する．
従って1回の集約オラクルは高々N回の最大流で実装できる．ゼロ容量カットの価格が0なら，比0の方向を選べる．これは最大流1回と同一のオラクルではない．
内部精度をΘ(ε)とし，Covering側を満たすようスケールすればPacking側は1+O(ε)の近似となる．保証は高確率．
係数を1+εに揃える場合は，原定理の両側の誤差δをε/(2+ε)以下にする内部精度を選び，出力を1/(1−δ)倍する．(1+δ)/(1−δ)≤1+εであり，内部精度はΘ(ε)なので回数の次数は変わらない．
この集約オラクル回数は，固定した目標値に対し元の双対LPが実行可能という仮定でのもの．目標値探索と，出力のカット分布から辺容量配分を復元する計算までを完了したANF専用算法の回数としては主張しない．
Young (2014), https://arxiv.org/abs/1407.3015 は遅延更新による決定的な明示行列実装の背景として保存する．
Quanrud (2020), Nearly linear time approximations for mixed packing and covering problems without data structures or randomization, SOSA pp.69–80, https://doi.org/10.1137/1.9781611976014.11 は更新幅の直線探索による決定的な明示行列実装．
明示行列に対する総時間を，指数個の列を持つANF双対の最大流呼出し回数へ読み替えない．表の集約オラクル回数はCQ2018のものであり，Quanrud2020の定理としては引用しない．

-->

---
class: roomy related-work aac-literature-page
---

# Algebraic Connectivity：既存解法と本発表の比較

<AacRelatedWork />

<!--
AACは，本資料では辺容量総和1に正規化したAbsolute Algebraic Connectivityの意味で用いる．Fiedler (1990)の総和mの定義とは1/mのスケール差がある．
連結な無向グラフに限定するのでAAC(G)>0．P_perp=I−11^T/nは1^⊥への直交射影．AppendixのLP領域Pとは記号を分ける．
covering SDPとの等価性を両方向で示す：最適配分w*に対してy=w*/AAC(G)とおくとL(y)≽P_perp，Σy=1/AAC(G)．
逆に実行可能yについてc=Σy>0，w=y/cとすればλ₂(L(w))≥1/cなのでc≥1/AAC(G)．従って逆数とcovering SDPの等式が成り立つ．


MWUの比較（Elbassioni–MakinoのAlgorithm2を本問題へ適用）．
出典は2022年書籍章§4.4.1，Algorithm2，Theorem4.4（印刷p.56）．原典の一般上界はO(m log m/ε²)回だが，AACの行列A_e=b_e b_e^Tの構造を使うとO(n log(2m)/ε²)回へ評価できる．以下はこの適用に追加した抵抗の評価と近似オラクルの解析であり，原典にAAC専用定理が記載されているという意味ではない．

η=ε/8，α=ε/4，τ=η^(−2)log(2m)とし，a_1=0，y_1=0，S_1=0とする．各更新で
\[
p_{t,e}=\frac{(1+\eta)^{a_{t,e}}}{\sum_f(1+\eta)^{a_{t,f}}},\quad
x_t\perp\mathbf1,\quad \|x_t\|_2=1,\quad
x_t^\top L(p_t)x_t\le(1+\alpha)\lambda_2(L(p_t)),
\]
\[
g_{t,e}=(b_e^\top x_t)^2,\quad
r_t=\langle p_t,g_t\rangle,\quad
\delta_t=\frac1{\max_e g_{t,e}},
\]
\[
a_{t+1}=a_t+\delta_tg_t,\qquad
y_{t+1}=y_t+\delta_tp_t,\qquad
S_{t+1}=S_t+\delta_t
\]
とし，初めてM=max_e a_e≥τとなったときw=y/Sを返す．これは原典Algorithm2の出力y_hatを辺容量総和1に正規化したものに対応する．η^(−2)log mをlog(2m)へ変え，m=1も含める．p_tの全成分は正なので，連結な入力では各回のL(p_t)も1^⊥上で正定値．従ってmax_e g_t,e>0でありδ_tは定義できる．

反復数の証明：本資料の基準配分の補題から，解析用のq∈Δ_EでR=max_e R_e(q)<2(n−1)を満たすものが存在する．この算法ではqを実際に計算する必要はない．実効抵抗の不等式より
\[
\max_e g_{t,e}\le R\,x_t^\top L(q)x_t=R\langle q,g_t\rangle.
\]
W_t=〈q,a_t〉とすると，各回で
\[
W_{t+1}-W_t=\frac{\langle q,g_t\rangle}{\max_e g_{t,e}}\ge\frac1R.
\]
各成分の増分δ_tg_t,eは[0,1]に入り，停止直前にはmax_e a_t,e<τなので，停止時にはW≤M<τ+1．よって更新回数Kは
\[
K\le R(\tau+1)\le2(n-1)(\tau+1)
=O\!\left(\frac{n\log(2m)}{\varepsilon^2}\right).
\]
この回数評価は，x_tが零和単位ベクトルなら近似固有ベクトルの精度によらず成り立つ．

近似保証の証明：Φ_t=Σ_e(1+η)^(a_t,e)とする．0≤u≤1では(1+η)^u≤1+ηuなので
\[
\Phi_{t+1}\le\Phi_t(1+\eta\delta_tr_t),\qquad
\log\Phi_{K+1}\le\log m+\eta\sum_{t=1}^K\delta_tr_t.
\]
一方，Φ_(K+1)≥(1+η)^M，M≥τ，log(1+η)≥η−η²/2より
\[
\sum_t\delta_tr_t
\ge\frac{M\log(1+\eta)-\log m}{\eta}
\ge(1-3\eta/2)M.
\]
全ての近似Fiedler計算が成功していれば，P_perp=I−11^T/nに対しL(p_t)≽[r_t/(1+α)]P_perp．また最適配分w*に対し
\[
M\ge\langle w^\star,a\rangle
=\sum_t\delta_t x_t^\top L(w^\star)x_t
\ge S\mathsf{OPT}.
\]
従って
\[
L(w)=\frac1S\sum_t\delta_t L(p_t)
\succeq\frac{\sum_t\delta_tr_t}{(1+\alpha)S}P_\perp
\succeq\frac{1-3\eta/2}{1+\alpha}\mathsf{OPT}\,P_\perp
\succeq(1-\varepsilon)\mathsf{OPT}\,P_\perp.
\]

呼出し回数と総時間：K_max=ceil(2(n−1)(τ+1))とし，各近似Fiedler計算の失敗確率を1/(3K_max)以下にする．条件付きの保証を各回に適用し，和を取ると，全て成功する確率は2/3以上．密な行列X=Σδxx^Tを保持せず，a_e=b_e^T Xb_e，y，Sだけを更新することで，固有ベクトル以外の処理は各回O(m)の実数演算にできる．本資料と同じ近似Fiedler計算を用いれば1回Õ(m/α)=Õ(m/ε)であり，総時間はÕ(mn/ε³)．指数・対数等を単位コストとする本資料の実数算術モデルの評価であって，有限ビット計算量へは読み替えない．

従ってElbassioni–Makinoの既存MWUへ以上のグラフ固有の評価と近似固有ベクトルを適用すると，本発表と同じ回数・総時間が得られる．本発表がこの既存法より漸近的に高速だという比較はしない．本発表の実装は切り詰め付きの指数更新と通常の平均出力であり，上の既存法は可変ステップとδ_tによる加重平均出力である．

Sun–Boyd–Xiao–Diaconis (2006), The Fastest Mixing Markov Process on a Graph and a Connection to a Maximum Variance Unfolding Problem, SIAM Review 48(4), 681–699.
https://doi.org/10.1137/S0036144504443821 ／ https://stanford.edu/~boyd/papers/pdf/fmmp.pdf ，§1.2，§3.2–3.3．
連続時間の最速混合をmaxλ₂(w), Σd_e²w_e≤1,w≥0として定式化する．d_e²=1とし，同次性から予算を等号にすると本資料と同じ問題．covering SDPへの逆数の変換も§3.2–3.3で直接扱う．
SDP・双対・最適性条件，内点法と劣勾配型の方法を議論するが，この原典から明示的なFiedler呼出し回数を引用してはいない．SDPだから有理数として厳密な最適解が必ず多項式時間で出るとはしない．
Boyd (2006), Convex Optimization of Graph Laplacian Eigenvalues, Proceedings of the International Congress of Mathematicians, Vol.III, pp.1311–1319.
https://stanford.edu/~boyd/papers/cvx_opt_graph_lapl_eigs.html ／ https://stanford.edu/~boyd/papers/pdf/cvx_opt_graph_lapl_eigs.pdf ，§3,§7．
§3は同じ単体上のλ₂最大化，§7は内点法・固有ベクトルを用いる一次法・疎性・対称性の概説．Sunらと合わせ，AACの最適化自体やFiedlerベクトルを用いる更新自体は既存であると説明する．
Boyd–Diaconis–Xiao (2004)は離散時間のMarkov連鎖を扱い，今回の連続配分との直接の対応にはSunら2006を使う．

SDPソルバーの計算時間：Jiang–Lee–Song–Wong (2020), An Improved Cutting Plane Method for Convex Optimization, Convex-Concave Games and its Applications, STOC 2020, pp.944–953．
https://doi.org/10.1145/3357713.3384284 ／ https://arxiv.org/abs/2004.04250 ，Theorem1.1，TheoremC.1．
D変数，分離オラクルの時間SOに対して，O(D log κ)回のオラクル呼出しとO(D³ log κ)の追加時間，合計O((D·SO+D³)log κ)を与える切断平面法である．以下のACの上界は，この一般定理とSDPの分離オラクルからの適用評価であり，原典にAC専用定理が記載されているという意味ではない．

本問題では，P_perp=I−11^T/n，J=11^T/nとして
\[
\max_{w,t}\{t:\ w\ge0,\ \mathbf1^\top w\le1,\ 0\le t\le2,\ L(w)-tP_\perp+J\succeq0\}
\]
を解く．最後の行列は1方向で固有値1を持ち，1^⊥上でL(w)−tIに一致するので，半正定値条件はλ₂(L(w))≥tと同値．OPT_AC>0と同次性により，予算を≤1としても最適値は総和1の問題と等しい．D=m+1=O(m)変数であり，w≥0を大きさmの半正定値ブロックへ埋め込む必要はない．

線形制約の検査はO(m)．行列L(w)−tP_perp+JはO(n²+m)演算で組み立てられる．半正定値条件に対する分離では，負の二次形式を持つベクトルxを求め，
\[
\sum_{e=\{u,v\}}w_e(x_u-x_v)^2
-t\!\left(\|x\|_2^2-\frac{(\mathbf1^\top x)^2}{n}\right)
+\frac{(\mathbf1^\top x)^2}{n}\ge0
\]
という違反した線形不等式を返す．係数の計算はO(n+m)．SDPの弱分離オラクルには高速行列積による固有値計算を使え，所要精度までÕ(n^ω+m)時間となる．ωは利用する行列積アルゴリズムの指数であり，指数の下限そのものでの達成を仮定しない．
このSDPオラクルの構成はLee–Sidford–Wong (2015), https://arxiv.org/abs/1508.04874 ，§10.2，Lemma43–44，Theorem45も参照．

したがって，グラフサイズおよび精度に関する多重対数因子を除き，総時間は
\[
\widetilde O\!\left(m(m+n^\omega)+m^3\right)
=\widetilde O(m^3+mn^\omega).
\]
主画面のÕにはpolylog(nm/ε)を含める．精度依存は多項式1/εではなく多重対数である．一般SDP法からの上界であり，ACに対する最速上界とは主張しない．実数算術モデルでの時間であり，有限ビット計算時間や厳密な最適解の保証へは読み替えない．

相対精度への換算：連結グラフで一様容量1/mを使えば，λ₂(L_G)/m≥4/[mn(n−1)]なので，β=1/(mn²)≤OPT_ACが分かる．従って所要加法精度をεβの多項式倍にしても，log(1/ε)以外に増えるのはグラフサイズの対数因子だけである．例えば，弱分離・最適化の許容誤差をδ=εβ/[4(m+1)]とし，出力をw_e≥−δ，Σw_e≤1+δ，λ₂(L(w))≥t−δ，t≥OPT_AC−δに揃える．w'_e=max{w_e,0}，c=Σw'_e，w=w'/cと補正すれば，L(w')≽L(w)，0<c≤1+(m+1)δより
\[
\lambda_2(L(w))\ge\frac{\mathsf{OPT}_{\rm AC}-2\delta}{1+(m+1)\delta}
\ge(1-\varepsilon)\mathsf{OPT}_{\rm AC}.
\]
ここでδ>0は多項式精度で十分であり，非負性と総和1は補正後に厳密に満たす．切断平面法とオラクルの失敗確率を各々定数未満に取れば，表で比較する成功確率2/3にも揃えられる．

Elbassioni–Makino (2022), Oracle-Based Primal-Dual Algorithms for Packing and Covering Semidefinite Programs, §4.5.2, Algorithm5, Theorem4.9（印刷pp.60–61）．
https://link.springer.com/chapter/10.1007/978-981-16-4095-7_4 ／ https://link.springer.com/content/pdf/10.1007/978-981-16-4095-7_4.pdf ．
Elbassioni–Makino–Najy (2022), Finding Sparse Solutions for Packing and Covering Semidefinite Programs, SIAM J. Optimization 32(2), https://doi.org/10.1137/20M137570X ．
表の数値は二著者の書籍章Theorem4.9をAACへ適用したもの．三著者の雑誌論文は，対数ポテンシャルによる主双対近似と疎な解の構成という手法・対象を引用する．
AACではA_e=U^T b_e b_e^T U，行列次元d=n−1とする．Uは1^⊥の正規直交基底．全r=m辺で一様初期化するとΣA_e≻0，max_e λmax(A_e)=2，λmin(ΣA_e)=λ₂(L_G)．
Theorem4.9はO(d logψ+d/ε²)反復であり，ψ=r max_e λmax(A_e)/λmin(Σ_{e=1}^r A_e)=2m/λ₂(L_G)．
非重み付きの連結グラフではλ₂(L_G)≥4/[n(n−1)]．実際，零和単位ベクトルxの最大値と最小値の差をRとすると，それらを結ぶ長さ高々n−1の道でx^T L_Gx≥R²/(n−1)，また1=||x||²≤nR²/4．
従ってψ≤mn(n−1)/2，logψ=O(log(nm))となり，表示したO(n log(nm)+n/ε²)回を得る．この初期化の回数と，疎な解の構成の保証を同時に主張する意味ではない．
各反復はMax(X)=argmax_e b_e^T U X U^T b_eを1回呼び，その前に逆行列などの行列計算も行う．このMaxはFiedlerベクトルを計算する処理ではないので，同じ頁のMWUの呼出し回数と単位を混同しない．
主画面の対数ポテンシャル法の数値は，公開済みの2022年書籍章の定理で支える．

Yan Wan, Sandip Roy, Xu Wang, Ali Saberi, Tao Yang, Mengran Xue, Babak Malek (2008), On the Structure of Graph Edge Designs that Optimize the Algebraic Connectivity, 47th IEEE Conference on Decision and Control, pp.805–810, https://doi.org/10.1109/CDC.2008.4738734 ．
https://skoge.folk.ntnu.no/prost/proceedings/cdc-2008/data/papers/0353.pdf ，§II，§IV．
Σ_e w_e≤Γという連続予算でλ₂を最大化する．木では最適な辺容量配分を厳密にO(n²)算術演算で求め，葉を1つ加えた後の更新はO(n)演算．ここでの数字は算術演算数であり，最大流・固有ベクトルの呼出し回数やビット計算時間とは区別する．
Richter–Rocha (2016), Absolute algebraic connectivity of double brooms and trees, Discrete Applied Mathematics 201, 213–221.
https://doi.org/10.1016/j.dam.2015.08.009 ．出版論文の要旨はdouble broomの明示式と木のAACの多項式時間組合せアルゴリズムを述べる．木の算法が含まれない2014年の旧プレプリントをこの主張の根拠にはしない．
原典の予算の正規化が本資料と異なる場合には辺容量を共通の定数でスケールする．λ₂は1次同次なので最適配分は対応し，表示した演算数の次数は変わらない．

Doherty–Papalia–Huang–Rosen–Englot–Leonard (2024), MAC: Graph Sparsification by Maximizing Algebraic Connectivity, arXiv:2403.19879v2.
https://arxiv.org/html/2403.19879v2 ，§IV-A–IV-D．
x∈{0,1}^m, Σx=Kという辺数制約付き選択と，0≤x≤1の連続緩和を扱う．L_fixed+Σx_eL_eで固定辺を含み得るため，総和1の連続配分とは異なる．
Fiedlerベクトルからg_e=q₂^T L_e q₂という優勾配を作り，Frank–Wolfe型更新・丸め・事後の最適性ギャップ評価を行う．1更新で必要なFiedler計算は1回．
λ₂は重複固有値で微分不可能になり得る．滑らかなFrank–Wolfe一般論のO(1/T)を今回のAACに無条件に適用するという比較はしない．

本発表は近似Fiedler計算O(n log(2m)/ε²)回，1回Õ(m/ε)，基準配分と切り詰めも含めてÕ(mn/ε³)，成功確率2/3．上記のElbassioni–Makinoの適用評価も同じ保証・次数になる．一般定理の厳密Fiedler・m依存の上界とだけ比較して優位性を述べない．
-->

---
layout: section
routeAlias: anf
---

# Average Network Flow 最大化

---
class: roomy
---

# アルゴリズムの全体像

入力は有向グラフと $0<\varepsilon<1$．出力は配分 $\bar w_T\in\Delta_E$．目的は $\mathrm{ANF}(\bar w_T)$ を $\mathsf{OPT}_{\mathrm{ANF}}$ に近づけることである．

1. **初期化.** 各辺で $w_{1,e}=\frac1m$ とする．
2. **反復.** 時刻 $t=1,\ldots,T$ で次を行う．
   - 順序対 $(s,r)\in V\times V$，$s\neq r$ を，全順序対から一様に一つ取る．
   - 時刻 $t$ での辺容量ベクトル $w_t$ における $(s,r)$ 最小カットを最大流 $1$ 回で求め，その指示ベクトル $\widehat g_t\in\{0,1\}^E$ を得る．辺 $e$ がカットから出るとき $\widehat g_{t,e}=1$．
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

**定理 3.** 全順序対から $(s,r)$ を一様に抽出し，「アルゴリズムの全体像」の手順で更新する．$\eta=\frac{\varepsilon}{6}$．このとき

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

履歴 $\mathcal H_t$ を固定する．$w_t\in\Delta_E$ はこの履歴から決まる定数であり，$w^\star\in\Delta_E$ は最適解である．

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
class: roomy
---

# 強連結グラフの下界

$G=(V,E)$ は有向グラフ，$n=|V|\ge2$ とする．

<div class="stmt stmt-lem">

**補題 7.** $G$ が強連結ならば

$$
\mathsf{OPT}_{\mathrm{ANF}}\ge\frac{1}{2(n-1)}.
$$

</div>

<!--
この補題は最適値の下界であり，任意の配分の ANF の下界ではない．
以降の図は同じ6頂点の例を使うが，証明は任意の n>=2 に対して成立する．
-->

---
class: anf-proof
---

# 根から全頂点へ向かう有向全域木

根 $v_0\in V$ を固定する．強連結なので，$v_0$ からすべての頂点に到達できる．

<div class="anf-split">
<AnfArborescence mode="out" />
<div>

<span class="anf-out">外向き全域木 <Katex expr="T^+" /></span> を取る．

すべての $v\in V$ に対し，$T^+$ に

$$
v_0\longrightarrow v
$$

という有向路が存在する．

<div class="anf-reason">

**構成：** $v_0$ から幅優先探索を行い，各頂点を初めて発見した辺を残す．

根以外の各頂点に入る辺がちょうど1本なので，

$$
|E(T^+)|=n-1.
$$

</div>
</div>
</div>

<!--
探索時に選ぶ辺はすべて G の有向辺である．
根以外の各頂点には，探索木の親から入る辺をちょうど1本選ぶ．
選んだ辺に沿って探索深さが1増えるので有向閉路はなく，
発見時の探索路が根から各頂点への有向路となる．
-->

---
class: anf-proof
---

# 全頂点から根へ向かう有向全域木

強連結なので，すべての頂点から同じ根 $v_0$ に到達できる．

<div class="anf-split">
<AnfArborescence mode="in" />
<div>

<span class="anf-in">内向き全域木 <Katex expr="T^-" /></span> を取る．

すべての $v\in V$ に対し，$T^-$ に

$$
v\longrightarrow v_0
$$

という有向路が存在する．

<div class="anf-reason">

**構成：** $G$ の全辺を反転したグラフで，$v_0$ から外向き全域木を取る．選んだ辺を元の向きに戻す．

$$
|E(T^-)|=n-1.
$$

</div>
</div>
</div>

<!--
反転グラフでは v_0 から全頂点に到達可能なので，前頁と同じ探索ができる．
そこで選んだ木の各辺を元の向きに戻すと，すべての辺は G に属し，
各頂点から v_0 への有向路が得られる．
T^+ の各辺を単に反転して T^- を作るのではない．二つの木は独立に選ぶ．
-->

---
class: anf-proof
---

# 二つの木の辺に容量を配る

二つの木の辺集合の和集合を $A:=E(T^+)\cup E(T^-)$，その辺数を $k:=|A|$ とおく．

<div class="anf-split">
<AnfArborescence mode="union" />
<div>

共通する有向辺は1回だけ数えるので，

$$
1\le k\le(n-1)+(n-1)=2(n-1).
$$

選んだ $k$ 本に，予算 $1$ を均等に配分する：

$$
q_e:=
\begin{cases}
1/k,&e\in A,\\
0,&e\notin A.
\end{cases}
$$

$$
q_e\ge0,\qquad
\sum_{e\in E}q_e=k\cdot\frac1k=1.
$$

したがって $q\in\Delta_E$ である．

</div>
</div>

<div class="anf-note">逆向きの辺は別の有向辺として数える．図では，元のグラフのうち <Katex expr="A" /> に属する辺だけを描いている．</div>

<!--
この図では外向きの木5辺と内向きの木5辺に共通辺が1本あるので，和集合は9辺．
一般の証明では共通辺の数を知る必要はなく，k<=2(n-1) だけを用いる．
-->

---
class: anf-proof
---

# 根がカットの内側にある場合

任意の $\emptyset\neq S\subsetneq V$ を固定する．まず $v_0\in S$ の場合を考える．

<div class="anf-split">
<AnfArborescence mode="cut-inside" animate-cut />
<div>

$S\neq V$ なので，$b\in V\setminus S$ を選べる．

<span class="anf-out">外向き全域木 <Katex expr="T^+" /></span> の有向路

$$
v_0\longrightarrow b
$$

は，$S$ の内側から外側へ向かう．

この経路が**最初に $S$ から出る辺**を $e$ とすると，

$$
e\in\delta^+(S)\cap E(T^+)
\subseteq\delta^+(S)\cap A.
$$

</div>
</div>

<div class="anf-note"><Katex expr="\delta^+(S):=\{(u,v)\in E:u\in S,\ v\notin S\}" />．破線は頂点集合 <Katex expr="S" /> の区分を表す．</div>

<!--
経路を v_0=x_0,x_1,...,x_l=b とする．
j=min{i:x_i が S の外側} は終点が外側なので存在し，始点が内側なので j>=1．
従って x_{j-1} は S の内側，x_j は外側であり，(x_{j-1},x_j) が所望の辺．
S 自体の連結性は仮定していない．
-->

---
class: anf-proof
---

# 根がカットの外側にある場合

次に $v_0\notin S$ の場合を考える．$S\neq\emptyset$ なので，$a\in S$ を選べる．

<div class="anf-split">
<AnfArborescence mode="cut-outside" animate-cut />
<div>

<span class="anf-in">内向き全域木 <Katex expr="T^-" /></span> の有向路

$$
a\longrightarrow v_0
$$

は，$S$ の内側から外側へ向かう．

この経路が**最初に $S$ から出る辺**を $e$ とすると，

$$
e\in\delta^+(S)\cap E(T^-)
\subseteq\delta^+(S)\cap A.
$$

途中で $S$ に入り直しても，最初の1本は必ず存在する．

</div>
</div>

<div class="anf-note">二つの場合を合わせると，任意の非自明な <Katex expr="S" /> から <Katex expr="A" /> の辺が少なくとも1本出る．</div>

<!--
図の経路は a から一度 S の外へ出て，再び S に入り，最後に根へ至る．
経路が境界を1回だけ横切るという仮定は不要であることも示している．
内向きの木を使う理由は，この場合も S から「出る」有向辺が必要だからである．
-->

---
class: anf-proof
---

# すべてのカットに容量がある

任意の $\emptyset\neq S\subsetneq V$ について，$|\delta^+(S)\cap A|\ge1$ が示された．

<AnfArborescence mode="cut-cases" />

$$
\begin{aligned}
c_q(S)
&=\sum_{e\in\delta^+(S)}q_e
=\sum_{e\in\delta^+(S)\cap A}\frac1k\\
&=\frac{|\delta^+(S)\cap A|}{k}
\ge\frac1k
\ge\frac1{2(n-1)}.
\end{aligned}
$$

<!--
第2の等号は A 以外の辺の容量が0であることによる．
最初の不等号は二つの場合分け，最後の不等号は k<=2(n-1) による．
同じ配分 q について，すべての非自明な S の下界が同時に成り立つ．
-->

---
class: anf-proof
---

# 最大流を評価し，全順序対で平均する

任意の異なる $s,t\in V$ を取る．$\mathcal C_{st}:=\{S\subseteq V:s\in S,\ t\notin S\}$ とおく．

最大流・最小カット定理と，すべてのカットの下界から，

$$
\kappa_{st}(q)
=\min_{S\in\mathcal C_{st}}c_q(S)
\ge\frac1k
\ge\frac1{2(n-1)}.
$$

<div class="anf-final-chain">

この評価を $n(n-1)$ 個の順序対で平均すると，

$$
\begin{aligned}
\mathrm{ANF}(q)
&=\frac1{n(n-1)}
\sum_{\substack{(s,t)\in V\times V\\s\ne t}}\kappa_{st}(q)\\
&\ge\frac1{n(n-1)}\cdot n(n-1)\cdot\frac1{2(n-1)}
=\frac1{2(n-1)}.
\end{aligned}
$$

</div>

$q\in\Delta_E$ なので，最適値はこの配分の値以上である：

$$
\mathsf{OPT}_{\mathrm{ANF}}
=\max_{w\in\Delta_E}\mathrm{ANF}(w)
\ge\mathrm{ANF}(q)
\ge\frac1{2(n-1)}.\qquad\square
$$

<!--
ANF は各頂点対の最大流を個別に計算して平均する指標である．
全頂点対のフローを同時に流す多品種流の主張ではない．
これで補題7の証明が完了する．次は補題8の一般グラフの下界へ進む．
-->


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
routeAlias: ac
---

# Algebraic connectivity 最大化


---
class: roomy
---

# Algebraic Connectivity <span class="cite-cf"><a href="https://dml.cz/handle/10338.dmlcz/101168" target="_blank" rel="noopener">[Fiedler 1973]</a></span>

辺容量の配分を $w\in\Delta_E$ とする．辺 $e=\{u,v\}$ に対し，$(b_e)_u=1$，$(b_e)_v=-1$，他の成分は $0$ とする．

$$
\begin{aligned}
L(w)&=\sum_{e\in E}w_e b_eb_e^\top,\qquad
x^\top L(w)x = \sum_{\{u,v\}\in E}w_{uv}(x_u-x_v)^2.
\end{aligned}
$$

行列 $L(w)$ は対称・半正定値で $L(w)\mathbf1=0$．固有値を $0=\lambda_1\le\lambda_2\le\cdots\le\lambda_n$ と並べる．**Algebraic connectivity** は $\lambda_2(L(w))$ であり，$\lambda_2>0$ と，正の容量を持つ辺からなるグラフの連結性は同値．

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
元グラフGが連結でも，容量0の辺を除いた支持グラフが非連結ならλ2=0．
正規化ラプラシアンでは次数行列も辺容量に依存し，以下の線形性と優勾配式はそのままでは使えない．
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
各頂点の変位x_uは，符号が向き，絶対値が大きさを表す．薄い輪郭は変位前の位置であり，辺を切断する操作ではない．
xの成分の和が0で，かつノルムが1なので，正の変位と負の変位を両方持つ．
図のxは変位の一例であり，最小化を達成するFiedlerベクトルとは限らない．次頁でこの固定したxのコストを計算する．
物理的な弾性エネルギーは通常この式の1/2だが，指標としては二次形式自体を用いる．
辺の離散的な切断数そのものではなく，全体的な変形しにくさを測る．
-->

---
class: roomy
---

# 同じ変位に対するコストの比較

パス $1$–$2$–$3$–$4$ で，変位 $x=(-\frac12,-\frac12,\frac12,\frac12)\in X$ を固定する．

<GraphPath />

<div class="ac-path-calculation">

両端の辺では変位差が $0$，中央の辺では $x_2-x_3=-1$ なので，

$$
C(w,x):=x^\top L(w)x
=w_{12}\cdot0^2+w_{23}\cdot(-1)^2+w_{34}\cdot0^2=w_{23}.
$$

</div>

<div class="ac-path-bound">

この固定した $x$ は，$\lambda_2(L(w))\le C(w,x)$ という**上界**を与える．<br>
AC の大小を比べるには，各配分で $x\in X$ に関する最小値を求める．

</div>

<div class="ac-click-sink" aria-hidden="true">
<span v-click>1</span>
<span v-click>2</span>
</div>

<!--
直前のスライドと同じ4頂点のパスで，両方の配分に同じ変位を与える．1クリック目で変位，2クリック目で各辺の寄与を示す．
xの成分の和は0，二乗和は1なのでx∈X．両側の変位差は0，中央の変位差は-1．
このxが各wのFiedlerベクトルだとは主張しない．
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

**定理 12**（<span class="cite-cf"><a href="https://doi.org/10.1137/090771430" target="_blank" rel="noopener">[Spielman, Teng 2014]</a></span>）．精度 $0<\alpha<1$ と失敗確率 $0<\rho<1$ に対し，辺容量付きの連結グラフの $\alpha$-近似Fiedlerベクトルを確率 $1-\rho$ 以上で出力する乱択アルゴリズムがある．時間は

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
   - 応答 $h_t$ を利得とする指数更新を行い，各辺の容量が $\delta q_e$ を下回らないよう切り詰める．
4. **出力.** 平均 $\displaystyle\bar w_T=\frac1T\sum_{t=1}^T w_t$ を返す．

<!--
ノート Algorithm 4 の骨格．T と η は切り詰め付き更新の頁で定める．
中心化ベクトルのノルムが 0 のときは一様配分を返して停止する．詳細は更新の頁．
-->

---
class: roomy
---

# 実効抵抗 <span class="cite-cf"><a href="https://doi.org/10.1007/BF01164627" target="_blank" rel="noopener">[Klein, Randić 1993]</a></span>

正の容量を持つ辺が $V$ を連結する $w\in\Delta_E$ に対し，$L(w)$ の擬似逆行列を $L(w)^+$ とする．辺 $e\in E$ の実効抵抗は

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

正の容量を持つ辺が $V$ を連結するなら，辺容量と実効抵抗の積の和は $\sum_{e\in E}w_e R_e(w)=n-1$ である．各辺の抵抗を $1$ としたネットワークでは，実効抵抗そのものの和 $\sum_{e\in E}R_e$ が $n-1$ になる．この場合を <span class="cite-cf">[Foster 1949]</span> が示している．

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
- 正の容量を持つ辺が $V$ を連結するとき，真の抵抗は $1\le R_e(v_k)\le\frac1{v_{k,e}}$ に入る．近似をこの区間へ切り詰め，$\widehat R_{k,e}$ とする．抵抗が大きい辺ほど，次の配分を増やす．

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

推定が全て成功したとする．各辺で $(1-\zeta)R_e(v_k)\le\widehat R_{k,e}\le(1+\zeta)R_e(v_k)$．記号を $d=n-1$ とおく．正の容量を持つ辺が $V$ を連結するなら $\sum_e v_{k,e}R_e(v_k)=d$ なので，$(1-\zeta)d\le Z_k\le(1+\zeta)d$．更新式とこの比較から，各辺で

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

補題 13 で等号になるベクトルをとると，$R_e(w)$ は $\frac{(b_e^\top x)^2}{x^\top L(w)x}$ の，$x^\top\mathbf1=0$ かつ $x\neq0$ での最大値である．分母は $w$ について線形なので，各項の対数は凸であり，最大をとっても凸である．したがって $\log R_e$ は，正の容量を持つ辺が $V$ を連結する配分の上で凸であり，平均 $q$ でも同じ上界が成り立つ．評価 $\mathrm{e}^{1/4}<\frac43$ より

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

**証明**．補題 13 を $q$ と $x_t$ に使うと $g_{t,e}\le R_e(q)\,x_t^\top L(q)x_t$．上界 $R_e(q)<2(n-1)$ と $x_t^\top L(q)x_t=\langle q,g_t\rangle$ より $h_{t,e}\le 2(n-1)s_t$．各辺で $w_{t,e}h_{t,e}$ を掛けて足し，$\langle w_t,h_t\rangle=1$ を使う．$\square$

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
routeAlias: summary
---

# まとめ

辺へ総量 $1$ を配分し，MWU の平均 $\bar w_T\in\Delta_E$ で次の二つの最大化を $(1-\varepsilon)$ 近似した．成功確率はいずれも $\frac23$ 以上である．

**ANF（定理 3）.** 有向グラフで，全順序対から1ペアの最小カットを一様に抽出し，その指示ベクトルを利得として更新する．最大流 1 回の時間を $T_{\mathrm{flow}}$ とすると，時間は強連結なら $\widetilde O\!\left(\frac{n}{\varepsilon^2}(T_{\mathrm{flow}}+m)\right)$，一般には $\widetilde O\!\left(\frac{n^2}{\varepsilon^2}(T_{\mathrm{flow}}+m)\right)$ である．

**Algebraic Connectivity（定理 9）.** 連結な無向グラフで，基準配分 $q$ へ切り詰める指数更新と，近似Fiedlerベクトルから作る正規化応答 $h_t=\frac{g_t}{\langle w_t,g_t\rangle}$ を使う．時間は $\widetilde O\!\left(\frac{mn}{\varepsilon^3}\right)$ である．

---
class: dense refs
routeAlias: references
---

# 参考文献

- <span class="cite-cf"><a href="https://doi.org/10.4086/toc.2012.v008a006" target="_blank" rel="noopener">[Arora, Hazan, Kale 2012]</a></span> The Multiplicative Weights Update Method: a Meta-Algorithm and Applications. *Theory of Computing*, 8(6), 121–164.
- <span class="cite-cf"><a href="https://doi.org/10.4230/LIPIcs.ESA.2022.20" target="_blank" rel="noopener">[Blankenburg 2022]</a></span> Resource Sharing Revisited: Local Weak Duality and Optimal Convergence. *30th European Symposium on Algorithms*, LIPIcs 244, 20:1–20:14.
- <span class="cite-cf"><a href="https://doi.org/10.1137/1.9781611975031.25" target="_blank" rel="noopener">[Chekuri, Quanrud 2018]</a></span> Randomized MWU for Positive LPs. *29th Annual ACM–SIAM Symposium on Discrete Algorithms*, 358–377.
- <span class="cite-cf"><a href="https://arxiv.org/abs/1809.09698v3" target="_blank" rel="noopener">[Elbassioni, Makino 2019]</a></span> Finding Sparse Solutions for Packing and Covering Semidefinite Programs. arXiv:1809.09698v3 (15 February 2019).
- <span class="cite-cf"><a href="https://doi.org/10.1137/20M137570X" target="_blank" rel="noopener">[Elbassioni, Makino, Najy 2022]</a></span> Finding Sparse Solutions for Packing and Covering Semidefinite Programs. *SIAM Journal on Optimization*, 32(2), 321–353.
- <span class="cite-cf"><a href="https://dml.cz/handle/10338.dmlcz/101168" target="_blank" rel="noopener">[Fiedler 1973]</a></span> Algebraic Connectivity of Graphs. *Czechoslovak Mathematical Journal*, 23(2), 298–305.
- <span class="cite-cf"><a href="https://doi.org/10.1080/03081089008817967" target="_blank" rel="noopener">[Fiedler 1990]</a></span> Absolute Algebraic Connectivity of Trees. *Linear and Multilinear Algebra*, 26, 85–106.
- <span class="cite-cf"><a href="https://doi.org/10.4153/CJM-1956-045-5" target="_blank" rel="noopener">[Ford, Fulkerson 1956]</a></span> Maximal Flow Through a Network. *Canadian Journal of Mathematics*, 8, 399–404.
- <span class="cite-cf">[Foster 1949]</span> The average impedance of an electrical network. In *Contributions to Applied Mechanics (Reissner Anniversary Volume)*, 333–340.
- <span class="cite-cf"><a href="https://doi.org/10.1137/050639430" target="_blank" rel="noopener">[Göring, Helmberg, Wappler 2008]</a></span> Embedded in the Shadow of the Separator. *SIAM Journal on Optimization*, 19(1), 472–501.
- <span class="cite-cf"><a href="https://doi.org/10.1007/978-3-642-78240-4" target="_blank" rel="noopener">[Grötschel, Lovász, Schrijver 1993]</a></span> Geometric Algorithms and Combinatorial Optimization. 2nd ed., Algorithms and Combinatorics 2, Springer.

---
class: dense refs
---

# 参考文献

- <span class="cite-cf"><a href="https://doi.org/10.1016/0041-5553(80)90061-0" target="_blank" rel="noopener">[Khachiyan 1980]</a></span> Polynomial algorithms in linear programming. *USSR Computational Mathematics and Mathematical Physics*, 20(1), 53–72.
- <span class="cite-cf"><a href="https://doi.org/10.1007/BF01164627" target="_blank" rel="noopener">[Klein, Randić 1993]</a></span> Resistance Distance. *Journal of Mathematical Chemistry*, 12, 81–95.
- <span class="cite-cf"><a href="https://doi.org/10.4230/LIPIcs.ESA.2020.70" target="_blank" rel="noopener">[Manghiuc, Peng, Sun 2020]</a></span> Augmenting the Algebraic Connectivity of Graphs. *28th European Symposium on Algorithms*, LIPIcs 173, 70:1–70:22.
- <span class="cite-cf"><a href="https://doi.org/10.1016/j.orl.2008.09.001" target="_blank" rel="noopener">[Mosk-Aoyama 2008]</a></span> Maximum Algebraic Connectivity Augmentation is NP-hard. *Operations Research Letters*, 36(6), 677–679.
- <span class="cite-cf"><a href="https://doi.org/10.1137/070704277" target="_blank" rel="noopener">[Nemirovski, Juditsky, Lan, Shapiro 2009]</a></span> Robust Stochastic Approximation Approach to Stochastic Programming. *SIAM Journal on Optimization*, 19(4), 1574–1609.
- <span class="cite-cf"><a href="https://doi.org/10.1137/1.9781611976014.11" target="_blank" rel="noopener">[Quanrud 2020]</a></span> Nearly linear time approximations for mixed packing and covering problems without data structures or randomization. *Symposium on Simplicity in Algorithms*, 69–80.
- <span class="cite-cf"><a href="https://doi.org/10.1109/TNSE.2022.3150289" target="_blank" rel="noopener">[Si, Mburano, Zheng, Qiu 2022]</a></span> Measuring Network Robustness by Average Network Flow. *IEEE Transactions on Network Science and Engineering*, 9(3), 1697–1712.
- <span class="cite-cf"><a href="https://doi.org/10.1137/080734029" target="_blank" rel="noopener">[Spielman, Srivastava 2011]</a></span> Graph Sparsification by Effective Resistances. *SIAM Journal on Computing*, 40(6), 1913–1926.
- <span class="cite-cf"><a href="https://doi.org/10.1137/090771430" target="_blank" rel="noopener">[Spielman, Teng 2014]</a></span> Nearly Linear Time Algorithms for Preconditioning and Solving Symmetric, Diagonally Dominant Linear Systems. *SIAM Journal on Matrix Analysis and Applications*, 35(3), 835–885.
- <span class="cite-cf"><a href="https://doi.org/10.1137/S0036144504443821" target="_blank" rel="noopener">[Sun, Boyd, Xiao, Diaconis 2006]</a></span> The Fastest Mixing Markov Process on a Graph and a Connection to a Maximum Variance Unfolding Problem. *SIAM Review*, 48(4), 681–699.
- <span class="cite-cf"><a href="https://arxiv.org/abs/1407.3015" target="_blank" rel="noopener">[Young 2014]</a></span> Nearly Linear-Work Algorithms for Mixed Packing/Covering and Facility-Location Linear Programs. arXiv:1407.3015v3 (5 November 2014).

---
class: roomy anf-exact
clicks: 0
routeAlias: appendix
---

# Appendix：ANF の LP 定式化

<AnfExactLesson phase="lp" />

<!--
前提は n≥2, E≠∅．強連結性は不要．辺容量は非負，総和1．N=n(n−1)．
κ_st(w) は同じ容量 w を各対で独立に使う最大流値であり，同時多品種流ではない．

固定した w に対し，全てのカットの制約は z_st≤min_{S:s∈S,t∉S}Σ_{e∈δ⁺(S)}w_e=κ_st(w) と同値．
容量の総和が1なので κ_st(w)≤1．目的関数で各 z_st の係数は正であり，固定した w では全て z_st=κ_st(w) とできる．したがって最適値は ANF 最大化と一致する．

左側に LP，右側に ANF との同値性を示す．分離オラクルは次頁で独立に説明する．
-->

---
class: roomy anf-exact
clicks: 0
---

# 分離オラクル：違反した線形不等式を見つける

<AnfSeparationOracle />

<!--
Pは前頁のLPの実行可能領域，候補点はu_hat=(w_hat,z_hat)．
返す不等式は変数u=(w,z)に関するものであり，候補点だけを代入した数値不等式ではない．
S*は候補容量w_hatに対して選ぶが，返す不等式z_st−Σ_{e∈δ⁺(S*)}w_e≤0ではS*を固定し，w,zを変数のままにする．
不等式の係数(a,b)を出力することを「返す」と呼ぶ．全てのu∈Pでa^T u≤b，候補点ではa^T u_hat>bなので，候補点とPを分離する．
候補点が単体制約・z の上下限に違反していれば，その不等式を返す．その他では各対の最小カットを求める．
総容量の等式に違反している場合も，Σw≤1または−Σw≤−1の違反した向きを返せる．負容量はこの基本制約の検査で排除し，その後に最大流を呼ぶ．
z_hat_st>κ_st(w_hat) なら，その最小カット S* の不等式 z_st−Σ_{e∈δ⁺(S*)}w_e≤0 が分離を与える．
全対で違反がなければ，指数個の全カット制約を満たす．分離1回は高々 N 回の最大流と多項式時間の付加処理で実装できる．
-->

---
class: roomy anf-exact
---

# 楕円体法の手順

<AnfExactLesson phase="ellipsoid" />

<!--
LP定式化のスライドの実行可能領域をPとする．目標値 τ を固定し，Pに (1/N)Σz_st≥τ を加えた集合 K_τ の実行可能性を調べる．
段階数はAnfExactLessonコンポーネントがSlidevのclicks contextへ登録する．ここではclicksをfrontmatterで固定しない（ホット更新で古い上限が保持されるのを防ぐ）．
目標集合，中心の検査，違反制約，中心切断，第1更新，次の中心，第2更新，実行可能で終了，実行不能で終了の9段階で説明する．
中心が目標値の制約に違反すればその不等式を返し，それ以外には前頁の最小カットによる分離を使う．
全ての制約を満たす中心は，目標値 τ を達成する点となる．
図の K_τ は空でない場合の2次元模式図であり，集合全体の形を実際に知っているわけではない．
分離不等式を中心まで緩めて中心切断とし，実行可能領域を含む側を残す．
単位円の左半分は，中心(−1/3,0)，半径(2/3,2/√3)の楕円に含まれ，面積比は4/(3√3)<1．図はこの更新の座標変換である．
手順の説明を終えたら，次頁で計算時間の証明を示す．

最後の2段階では，有理LP版の厳密な判定の終了条件を示す．実行可能なら全制約を満たす有理点uを返す．
実行不能なら，Kτの制約a_i^T u≤b_iのうち有限個について，λ_i≥0，Σλ_i a_i=0，Σλ_i b_i<0となる係数を示せる．
これらを足すと0≤Σλ_i b_i<0となるため，実行可能点は存在しない．等式制約は両向きの不等式に直して含める．
左図の実行不能の例はu_1≤0と−u_1≤−1を足した0≤−1である．これはANFの具体的な制約ではなく，矛盾の証明の模式例．
ここで使うのは有理多面体に対するGLSの厳密な実行可能性判定と証明の復元であり，図の中心切断だけを続ければ必ず中心が実行可能になる，という主張ではない．
Σw=1のためKτは最初から周囲の空間の体積が0であり，元のKτに対して単純な体積の閾値だけで空と判断してはいけない．
有理LP版は変数数と各不等式の符号化長の多項式回の分離で終了する．正確な切断の保持と有理数の復元を含む手順の定理を使う．
出典：GLS (1993), §6.4, https://doi.org/10.1007/978-3-642-78240-4 ．強分離から厳密な主・双対LPを解く結果は，Ryan O'Donnell, Lecture 9 (2011), §9.5.3, Theorem 9.9にも明記： https://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15859-f11/www/notes/lecture09.pdf ．
GLS Theorem 6.4.1 の実際の手順では，小体積になった時点で空と即断せず，有理性からP全体が満たす独立な等式を復元して次元を1減らす．高々d回の次元削減で0次元，すなわち唯一の候補点になり，その点を分離して実行可能か判定する．
矛盾の係数λは，GLS §6.4 の強非空性判定と §6.5 Lemma 6.5.15 の返却制約による双対復元の議論から得られる帰結であり，素朴な中心切断の直接の出力ではない．
空と判定された実行で返された多項式本数の不等式だけを残しても，同じ分離応答列を再現できる．各不等式の符号長の上界は元と同じなので，この有限部分系も空である．その明示的な有限LPからFarkasの非負係数λを復元する．
-->

---
class: roomy anf-exact
clicks: 0
---

# ANF の厳密解法：多項式時間の証明

<AnfExactProof />

<!--

厳密な多項式時間の根拠は，有理多面体の強分離から強最適化への帰着である．
d=m+N，各制約の係数は0,±1，右辺0,1，目的係数は1/N．領域は非空かつ[0,1]^d内．
非空性は任意のw∈Δ_Eとz=0から従う．1本の制約のビット長はO(d)で，指数個の制約を列挙する必要はない．
最適頂点で等号になる制約から独立なd本を選び，Au*=bと書く．A,bの成分は0,±1．退化していても独立なd本を選べる．
単体の等式Σw=1は正の向きのまま選べるため，表示した正方系の右辺bは0,1だけとしてよい．
Cramerの公式とHadamardの不等式より，u_i*=det(A_i)/det(A)，共通分母は高々|det(A)|≤d^(d/2)．A_iはAのi列をbに置き換えた行列．
スライドでは同じCramerの公式をu*=adj(A)b/det(A)と行列で書く．Aは整数行列なのでadj(A)bも整数ベクトルであり，D=|det(A)|とすればu*∈D^{-1}Z^dとなる．
座標は[0,1]内なので分子も分母以下であり，各座標のビット長はO(d log d)．最適ANF値q*=(1/N)Σz_st*の既約分母はQ=ceil(N d^(d/2))以下．log Q=O(d log d+log N)．

有理閾値τについてK_τ=P∩{Σz_st≥Nτ}の厳密な空性判定を行う．τ≤q*とK_τ非空は同値．非空の場合には点も返す．
追加制約の右辺のビット長はO(〈τ〉+log N)．有理多面体に対する強分離から強非空性判定への定理を用いる．
[ℓ,r]=[0,1]からτ=(ℓ+r)/2を調べ，非空ならℓ←τ，空ならr←τ．q*∈[ℓ,r]を維持する．
前頁の内側の判定は実行可能点または不可能性の証明を得て終了し，ここで説明する外側の二分探索は区間幅で終了する．両者の終了条件を混同しない．
スライドの[ℓ_k,h_k]はk回の二分後の区間であり，h_kがここでの上端rに対応する．区間幅は2^{-k}，k=ceil(log2(2Q²))+1なら幅<1/(2Q²)．
O(log Q)回で幅<1/(2Q²)とできる．これは外側の実行可能性判定回数であり，分離や最大流の総呼出し回数ではない．
分母Q以下の異なる有理数の差は1/Q²以上．区間内の該当値はq*だけである．
区間の中点xについて，q*の既約分母b≤Qとすると|x−q*|<1/(4Q²)<1/(2b²)なので，q*はxの連分数の収束分数として現れる．収束分数から分母≤Qかつ区間内の唯一の値を選ぶ．この処理もpoly(log Q)時間．
最後にK_{q*}の実行可能点を求めれば，そのwは最適な辺容量配分である．二分探索だけで厳密な有理数が得られると主張するのではなく，有理数復元まで行う．
アルゴリズム全体は，最適値q*の復元とK_{q*}内の点の取得を終え，最適配分wを返した時点で終了する．

有理版楕円体法の定理は，候補点と中間計算の各有理数のビット長を一様にB=poly(d,log Q)で抑え，判定1回の分離呼出し回数もR(d,B)=poly(d,B)で抑える．
楕円体の更新は有限精度で丸め，必要に応じて膨らませることで包含を維持する．図の正確な中心切断の更新式をそのまま無限精度で実装するわけではない．
最大流1回のビット計算時間をT_MF(n,m,B)とする．分離1回は高々N回の最大流とpoly(d,B)時間の単体・上下限・目標値の検査．楕円体更新もpoly(d,B)時間．
全体はO(log Q)·R(d,B)·[N T_MF(n,m,B)+poly(d,B)]時間で抑えられる．最後の実行可能点取得と有理数復元もこの多項式上界に含める．
最大流は有理容量のビット長に関して多項式時間であり，d=m+n(n−1)，log Q=O(d log d+log N)なので，全体はpoly(n,m)時間．今回の入力はグラフのみで，既存容量w+C pという添付の別設定は持ち込まない．
例えば Edmonds–Karp の最短増加道法を使えば，容量の大きさに依存しない多項式回の増加で最大流を計算できる．候補容量の分母を払った整数容量のビット長もpoly(m,B)であり，整数演算を含めたビット計算時間はpoly(n,m,B)となる．出典：Edmonds and Karp (1972), Theoretical Improvements in Algorithmic Efficiency for Network Flow Problems, https://web.eecs.umich.edu/~pettie/matching/Edmonds-Karp-network-flow.pdf ．
単体の等式により最初から低次元なので，素朴な体積減少と目標値の二分探索だけでは厳密性は結論できない．
低次元の領域と有理数の復元も含む定理を用いる．
Grötschel–Lovász–Schrijver, Geometric Algorithms and Combinatorial Optimization, 2nd ed. (1993), Chapter 6, §6.4, https://doi.org/10.1007/978-3-642-78240-4 ．著者公開の1988年版の Theorem 6.4.1 と 6.4.9 および後者の証明でも，厳密な非空性判定・有理数復元を含む最適化を確認できる： https://www.zib.de/userpage/groetschel/pubnew/paper/groetschellovaszschrijver1988.pdf ．
一般のコンパクト凸集合に対する厳密解の主張ではなく，この有界な有理 LP に限定した入力ビット長に関する保証である．
以上で，ANF の厳密な最適配分を多項式時間で計算できることが示された．
-->
