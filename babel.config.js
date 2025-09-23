module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './', 
            '@components': './components',
            '@assets': './assets',
          },
          extensions: [
            '.js',
            '.jsx', 
            '.ts',
            '.tsx',
            '.json',
            '.png',
            '.jpg',
            '.jpeg',
            '.gif',
            '.svg'
          ]
        },
      ],
    ],
  };
};
