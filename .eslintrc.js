module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        'plugin:@newrelic/eslint-plugin-newrelic/react',
        'plugin:@newrelic/eslint-plugin-newrelic/jest',
        'plugin:@newrelic/eslint-plugin-newrelic/prettier'
    ],
    "globals": {
        "$util": "readonly",
        "$http": "readonly",
        "$driver": "readonly",
        "$browser": "readonly",
        "$env": "readonly",
        "$secure": "readonly",
        "previousAction": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "prettier"
    ],
    "rules": {
        "prettier/prettier": "error",
        "no-console": "off",
        "no-unused-vars": ["error", { "varsIgnorePattern": "ScriptTimeout|DefaultTimeout|UserAgent" }]
    }
};
