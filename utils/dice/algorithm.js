const RandomQueue = require('./RandomQueue');
const constants = require('./constants');

function Algorithm({total, minGood, minBad, maxGood, maxBad}) {
    if (minBad > maxBad || minGood > maxGood || maxGood > total || minGood > total || minGood + minBad > total) {
        throw "Invalid configuration";
    }

    this.total = total;
    this.minGood = minGood;
    this.minBad = minBad;
    this.maxGood = maxGood;
    this.maxBad = maxBad;
}

Algorithm.prototype.setUp = function setUp() {
    const {total, minGood, minBad, maxGood, maxBad} = this;
    const numGood = getRandomInt(minGood, maxGood);
    const numBad = getRandomInt(minBad, Math.min(maxBad, total - numGood));
    const numOk = total - numGood - numBad;
    return setUpQueue(numGood, numBad, numOk, total);
}

Algorithm.prototype.getRoll = function getRoll({eyes, currRound, luck}) {
    const currLuck = luck[currRound];

    if (currLuck === constants.GOOD) {
        return getRandomInt(constants.GOOD_RANGE[0]*eyes, constants.GOOD_RANGE[1]*eyes);
    } else if (currLuck === constants.BAD) {
        return getRandomInt(Math.max(1, constants.BAD_RANGE[0]*eyes), constants.BAD_RANGE[1]*eyes);
    } else {
        return getRandomInt(constants.OK_RANGE[0]*eyes, constants.OK_RANGE[1]*eyes);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setUpQueue(numGood, numBad, numOk, total) {
    const indices = setUpIndices(total);
    const indicesQueue = new RandomQueue(indices);
    let luck = new Array(total);

    luck = setLuck(luck, indicesQueue, numGood, constants.GOOD);
    luck = setLuck(luck, indicesQueue, numBad, constants.BAD);
    luck = setLuck(luck, indicesQueue, numOk, constants.OK);

    return luck;
}

function setUpIndices(total) {
    const indices = new Array(total);
    for (let i = 0; i < total; i++) {
        indices[i] = i;
    }
    return indices;
}

function setLuck(luck, indices, num, type) {
    for (let i = 0; i < num; i++) {
        luck[indices.pop()] = type;
    }
    return luck;
}

module.exports = Algorithm;
