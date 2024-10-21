module.exports = {
    env: {
        node: true,
    },
    extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
    rules: {
        "vue/require-default-prop": "off",
        "vue/multi-word-component-names": "off",
        "no-unused-vars": 'off',
        "no-useless-escape": 'off',
    },
};
