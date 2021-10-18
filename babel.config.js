module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // https://babeljs.io/docs/en/babel-preset-env#targets
        'targets': '> 0.25%, not dead',
        // https://babeljs.io/docs/en/usage#polyfill
        'useBuiltIns': 'usage',
        // https://babeljs.io/docs/en/babel-preset-env#corejs
        'corejs': '2.0',
      }
    ],
    '@babel/preset-react', 
    '@babel/preset-typescript'
  ],
};