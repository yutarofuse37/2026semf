# 2026semf

**Multiplicative Weights Update for Maximizing Network Connectivity**

全86枚のSlidevスライドです。GitHub Pagesで閲覧・発表でき、PDFもダウンロードできます。

- スライド：<https://yutarofuse37.github.io/2026semf/>
- PDF：<https://yutarofuse37.github.io/2026semf/seminar.pdf>
- 原稿：<https://yutarofuse37.github.io/2026semf/seminar.md>

## 初回の公開設定

GitHubの [Settings → Pages](https://github.com/yutarofuse37/2026semf/settings/pages) で、**Build and deployment → Source** を **GitHub Actions** に設定してください。

設定後、[Actions](https://github.com/yutarofuse37/2026semf/actions) の **Deploy slides to GitHub Pages** を実行します。設定前に失敗した実行がある場合は **Re-run failed jobs** で再開できます。すべてのジョブが成功すると、上のURLで公開されます。

## 編集と更新

編集元は `slides.md`、図や操作部分は `components/`、画像は `public/` です。

```bash
git add .
git commit -m "Update seminar slides"
git push
```

`main` へのpushでGitHub ActionsがPDFを再生成し、配布用原稿を同期して、サイトをビルド・公開します。生成された最新PDFと原稿は公開サイトで配布されます。Actionsは生成物をリポジトリへcommitしません。

## 手元で表示する

Node.js 22.12以降が必要です。

```bash
npm ci
npm run dev
```

GitHub Pagesと同じパスでビルドする場合：

```bash
npm run build:pages
```

PDFを手元で再生成する場合：

```bash
npx playwright install chromium
npm run export
```

Linuxでブラウザのシステム依存が不足する場合は `npx playwright install --with-deps chromium` を使ってください。

## 内容

1. 勾配法の基礎
2. Mirror descentとMWU、リグレット解析
3. ネットワーク最適化のゲーム解釈
4. 有向ANF / global mincut、近似保証、OPTのオーダー
5. 無向algebraic connectivity、近似Fiedlerベクトル、計算量、OPTのオーダー

発表者ノートは各スライド末尾のHTMLコメントに含まれ、発表者モードでも表示できます。第4章の総容量と第5章の総重みはともに1です。

元のSites版とは別のコピーです。このリポジトリの変更は元のSites版に自動反映されません。
