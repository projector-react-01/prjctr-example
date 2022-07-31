
module.exports = {
    parser: "@typescript-eslint/parser",
    ignorePatterns: [".eslintrc.js"],
    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:prettier/recommended",
        "plugin:import/typescript",
        "airbnb",
        "airbnb/hooks"
    ],

    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ["@typescript-eslint", "prettier", "import"],
    env: {
        browser: true,
        node: false,
        jest: true
    },
    rules: {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "arrow-parens": [0],
        "import/prefer-default-export": [0],
        "import/extensions": [0],
        "react/function-component-definition": [0],
        "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".jsx"] }],
        "react/prop-types": "off",
        "react/jsx-one-expression-per-line": "off",
        "react/jsx-indent": ["error", 4],
        "react/require-default-props": "off",
        "react/destructuring-assignment": "off",
        "react/jsx-boolean-value": "off",
        "prettier/prettier": ["error"],
        "implicit-arrow-linebreak": 0,
        "object-curly-newline": 0,
        "@typescript-eslint/ban-types": [
            "error",
            {
                "types": {
                    // add a custom message to help explain why not to use it
                    "Foo": "Don't use Foo because it is unsafe",

                    // add a custom message, AND tell the plugin how to fix it
                    "OldAPI": {
                        "message": "Use NewAPI instead",
                        "fixWith": "NewAPI"
                    },

                    // un-ban a type that's banned by default
                    "{}": false
                },
                "extendDefaults": true
            }
        ],
        "comma-dangle": 0,
        "function-paren-newline": 0,
        "quotes": ["error", "double"],
        'prettier/prettier': [
            'warn',
            {
                singleQuote: false
            }
        ],
        "no-unused-vars": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/no-shadow": ["error"]
    },
    settings: {
        react: {
            version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
        },
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx", ".js"]
        },
        "import/resolver": {
            // use <root>/tsconfig.json
            typescript: {},
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
}
