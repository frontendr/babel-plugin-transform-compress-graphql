module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          // ie: '10',
          node: "6",
        },
      },
    ],
  ];
  const plugins = [];

  return {
    presets,
    plugins,
  };
};
