module.exports = {
    extends: 'eslint:recommended',
    env: {
        node: true,
        es6: true
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        babelOptions: {
            configFile: './.babelrc'
        },
        ecmaVersion: 2021
    },
    rules: {
        'no-unused-vars': 'warn',
        'prefer-const': 'warn'
    },
    plugins: ['@babel']
};
