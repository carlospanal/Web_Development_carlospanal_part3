module.exports = {
'env': {
    'commonjs': true,
    'es2020': true,
    'node': true
},
'extends': 'airbnb',
'parserOptions': {
    'ecmaVersion': 11
},
'rules': {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    'indent': [
        'error',
        2
    ],
    'linebreak-style': [
        'error',
        'windows'
    ],
    'quotes': [
        'error',
        'single'
    ],
    'semi': [
        'error',
        'never'
    ]
}
}
