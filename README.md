# RemoWeb

[![](https://i.imgur.com/7l6VY3p.png)](https://i.imgur.com/7l6VY3p.png)

Web client for Nature Remo

## 開発

- Node.js 16.x以上
- yarn 1.x

が必要です。

```sh
yarn
yarn watch:nature
```

NatureのAPIはレートリミットが厳しいので、取得系のみmockして緩和できます。  

```sh
ACCESS_TOKEN=XXXXXXXXXXXXXX yarn fetchMock
yarn startMockProxy
```

```sh
yarn watch
```