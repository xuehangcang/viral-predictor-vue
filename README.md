# Viral Predictor

vue implementation of the [viral-predictor](https://github.com/Azure-Vision/viral-predictor) project that helps content creators simulate user engagement before posting by leveraging AI to predict how users might react to different versions of content.

## Features

- A/B test two versions of your content
- Supports multiple platforms (Twitter, TikTok, Instagram, LinkedIn, Facebook, Hacker News, Reddit, Blog Posts)
- Real-time engagement predictions for:
    - Likes
    - Comments
    - Shares
    - Quotes
- Statistical confidence scoring
- Live engagement visualization


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```


## How It Works

1. Enter two versions of your content
2. Select your target platform
3. Set the number of simulated users
4. Enter your OpenRouter API key
5. Click "Predict" to see how users might engage with your content

The app simulates user behavior and provides statistical confidence scores for engagement metrics, helping you choose the most effective version of your content.

## License

This project is licensed under the MIT License.

