const Algorithm = require('./Algorithm');


class Die {
    constructor(config = {
        total: 7,
        minBad: 2,
        maxBad: 3,
        minGood: 2,
        maxGood: 3
    }) {
        this.config = config;
        this.algorithm = new Algorithm(config);
        this.userMap = {};
    }

    roll(eyes, user) {
        const userMap = this.userMap;
        const config = this.config;
        const algorithm = this.algorithm;

        if (!userMap[user] || userMap[user].history.length === config.total - 1) {
            const newUser = {}
            newUser.luck = algorithm.setUp(config);
            newUser.history = []
            userMap[user] = newUser;
        }

        const roll = algorithm.getRoll({
            eyes: eyes,
            currRound: userMap[user].history.length,
            luck: userMap[user].luck
        });

        userMap[user].history.push(roll);

        return roll;
    }
}

module.exports = Die;
