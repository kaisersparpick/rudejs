/**
 * @param {Array} incomingRules
 * @param {Function} condition
 * @param {Object} scope
 * @param {String} pathFormat
 * @param {Function} cb
 */
module.exports = (incomingRules = [], condition, scope, pathFormat, cb) => {
    if (!(incomingRules && incomingRules.length)) return false;

    const processArg = arg => {
        if (typeof arg !== "function" && arg !== undefined)
            throw Error(`Invalid argument ${arg}`);

        if (typeof arg === "function")
            arg = { cb: arg, bound: (arg.name.startsWith("bound ")) };

        return arg;
    };

    const addRule = (rules, args) => {
        args = args.map(processArg);
        const key = args[0].cb.name;
        rules[key] = { condition: args[0], yes: args[1], no: args[2] };
        return rules;
    };

    const plain = () => path.reduce((str, p) => {
        if (p.result === false) str += "!";
        str += p.ruleName;
        if (p.result !== null) str += " > ";
        return str;
    }, "");

    const html = () => {
        return "<table><thead><tr><th>idx</th><th>rule name</th><th>result</th></tr></thead>" +
            path.map((item, idx) => `<tr><td>${idx}</td><td>${item.ruleName}</td><td>${item.result}</td></tr>`).join("") +
            "</tbody></table>";
    };

    const path = [];
    const rules = incomingRules.reduce(addRule, {});

    if (typeof condition !== "function") throw Error("Condition must be a function");
    let ruleName = condition.name;

    while (true) {
        const rule = rules[ruleName];
        if (!rule) break;

        const result = rule.condition.bound ? rule.condition.cb() : rule.condition.cb.call(scope);
        path.push({ ruleName, result });

        if (result === null) break;

        let nextRule = result ? rule.yes : rule.no;
        if (!nextRule || !nextRule.cb) break;

        ruleName = nextRule.cb.name;
    }

    const out
        = pathFormat === "raw"   ? path
        : pathFormat === "plain" ? plain()
        : pathFormat === "html"  ? html()
        : pathFormat === "all"   ? { raw: path, plain: plain(), html: html() }
        : undefined;

    return typeof cb === "function" ? cb(out) : out;
};
