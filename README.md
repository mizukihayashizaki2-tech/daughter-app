# 娘とおでかけ駅ガチャ

京王線 武蔵野台駅を起点に、東京都・埼玉県・神奈川県・千葉県の駅からランダムに3駅を表示し、娘と休日のおでかけ先を選ぶためのReactアプリです。

## 重要：npm installに失敗する場合

前回版の `package-lock.json` に生成環境の内部npmレジストリURLが入っていたため、通常のPCでは `ETIMEDOUT` になることがあります。

この版では `package-lock.json` を削除し、`.npmrc` に以下を設定しています。

```text
registry=https://registry.npmjs.org/
```

古いフォルダで作業している場合は、以下を実行してから `npm install` してください。

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npm run dev
```

OneDrive配下で `EPERM` が出る場合は、OneDrive同期のロックが原因になることがあります。その場合は `C:\dev\daughter-app` など、OneDrive外に配置するのがおすすめです。

## 実装済み機能

- 駅を3件ランダム表示
- 3候補を「くま」「うさぎ」「とり」のかわいいアニメーション付きカードで表示
- 候補カードをクリックすると「今日の目的地」画面へ遷移
- 都県ウェイト設定
  - 東京都: 70
  - 埼玉県: 15
  - 神奈川県: 10
  - 千葉県: 5
- 距離ウェイト設定
  - 2km以内: 5
  - 2km〜7km: 40
  - 7km〜12km: 25
  - 12km〜18km: 20
  - 18km以上: 10
- 設定値のLocalStorage保存
- 初期値リセット
- データベース不要
- 駅データJSON同梱
- 駅データ生成スクリプト同梱

## 実行方法

```bash
npm install
npm run dev
```

ブラウザで表示されたURLを開いてください。

## ビルド方法

```bash
npm run build
```

## 駅データについて

`src/data/stations.json` に、動作確認用の駅データを同梱しています。

本格的に1都3県の駅を網羅したい場合は、駅データ.jpなどから以下のCSVを取得し、`raw/` 配下に配置してください。

```text
raw/station.csv
raw/line.csv
raw/pref.csv
```

その後、以下を実行します。

```bash
npm run generate:stations
```

生成された `src/data/stations.json` がアプリで読み込まれます。

## 抽選ロジック

抽選は、駅データの件数に極端に引っ張られないように、以下の2段階で実施します。

1. 都県ウェイトに基づき、都県を選ぶ
2. 選ばれた都県内で、距離ウェイトに基づき、距離帯を選ぶ
3. 選ばれた都県・距離帯に属する駅から1件選ぶ
4. 同じ駅が重複しないように3件まで繰り返す

例えば、東京都の駅がデータ上多くても、東京都ばかりに偏りすぎないようにしています。
