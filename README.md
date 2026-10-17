# 浜名湖うなぎ

静岡県・浜名湖のうなぎと食文化を紹介する、静的な日本語 Web サイトです。GitHub Pages で公開しています。

## 公開 URL

https://katzkawai.org/kklab-ds-hamanako-unagi/

## 内容

- 浜名湖と汽水湖の恵み
- 1879 年から続く養鰻の歴史
- 稚魚から蒲焼きまでの手仕事
- 蒲焼き・白焼き・うなぎ飯・肝吸いの味わい方
- 弁天島・館山寺温泉・今切口の周辺案内
- アクセスとよくある質問

## 構成

```
index.html          トップページ
404.html            404 ページ
assets/style.css    スタイルシート
assets/script.js    ナビゲーション・スクロール演出
assets/favicon.svg  ファビコン
assets/ogp.png      OGP 画像（1200 × 630）
```

画像は使用せず、ヒーローのうなぎや周辺の風景はすべて SVG / CSS で描画しています。外部依存は Google Fonts のみです。

## ローカルで見る

```bash
python3 -m http.server 8000
```

`http://localhost:8000/` を開いてください。

## GitHub Pages

`main` ブランチのルートをそのまま公開する構成です。ビルド工程はありません。

## 注意

本サイトは浜名湖うなぎの魅力を伝える非公式の紹介サイトです。掲載内容は一般的な情報であり、店舗・生産者によって詳細は異なります。
