class CleverCreatureIdentifier {
    constructor() {
        this.result = "";
    }

    isAnimal() {
        const animal = new Date().getSeconds() % 2 === 0;
        if (!animal) this.result = "a cherry tree";
        return animal;
    }
    hasLegs() {
        const legs = true;
        if (!legs) this.result = "a snake";
        return legs;
    }
    hasTwoLegs() {
        return new Date().getMilliseconds() % 2 === 0
    }
    canCountToInfinity() {
        const superhuman = CleverCreatureIdentifier.canCountToInfinity;
        this.result = superhuman ? "Chuck Norris" : "a caveman";
        return superhuman;
    }

    static get canCountToInfinity() { return true; }
    static hasHorns() {
        return getMyVerySecretValue(5) === 7;
    }
}
CleverCreatureIdentifier.type = "mythical";
Object.freeze(CleverCreatureIdentifier);

class SmartPrinter {
    constructor(cleverInst) {
        this.cleverInst = cleverInst;
    }
    poodle() {
        this.cleverInst.result = "OK, so it's a Poodle!";
        return null;
    }
    creatureFound() {
        this.cleverInst.result = `It must be ${this.cleverInst.result}!`;
        return null;
    }
    printResult() {
        document.getElementById("result").innerText = this.cleverInst.result;
    }
    printLog(html) {
        document.getElementById("log").innerHTML = html;
    }
}

const getMyVerySecretValue = function(val) { return val + 2; };
function hasOneHorn() {
    const one = CleverCreatureIdentifier.type === "mythical";
    c.result = one ? "a unicorn" : "a stag";
    return one;
}

// ---------------

const rude = require("rudejs");

const c = new CleverCreatureIdentifier();
const s = new SmartPrinter(c);

rude([
    [c.isAnimal, c.hasLegs, s.creatureFound.bind(s)],
    [c.hasLegs, c.hasTwoLegs, s.creatureFound.bind(s)],
    [c.hasTwoLegs, c.canCountToInfinity, CleverCreatureIdentifier.hasHorns],
    [c.canCountToInfinity, s.creatureFound.bind(s), s.creatureFound.bind(s)],
    [CleverCreatureIdentifier.hasHorns, hasOneHorn, s.poodle.bind(s)],
    [hasOneHorn, s.creatureFound.bind(s), s.creatureFound.bind(s)],
    [s.creatureFound.bind(s)]
], c.isAnimal, c, "all", console.log);

console.log("\n" + c.result);

console.log("\n-----------------\n");

/**
 * This is the callback function. It runs after the processing of rules has finished.
 * @param {Object|Array|String} path
 */
const done = path => {
    const msg = `The result is: "${c.result}". Here is the path taken: "${path}"`;
    console.log(msg);
};

rude([
  [c.hasLegs, c.canCountToInfinity, s.creatureFound.bind(s)],
  [c.canCountToInfinity, s.creatureFound.bind(s), s.creatureFound.bind(s)],
  [s.creatureFound.bind(s)]
], c.hasLegs, c, "plain", done);
