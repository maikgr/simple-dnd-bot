const constants = require('../utils/dice/constants');

describe("RandomQueue", function() {
    const Die = require('../utils/dice/RandomQueue');

    it("should pop and remove correctly", function() {
        let die = new Die([1, 2, 3, 4, 5]);
        let rolls = [];
        let roll;

        for (let i = 0; i < 5; i++) {
            roll = die.pop();
            expect(roll).toBeDefined();
            expect(rolls).not.toContain(roll);
            rolls.push(roll);
        }
  } );
});

describe("Algorithm", function() {
    const Algo = require('../utils/dice/algorithm');

    const total = 10;
    const minBad = 10;
    const maxBad = 10;
    const minGood = 0;
    const maxGood = 0;

    const algo =
        new Algo({
            total: total,
            minBad: minBad,
            maxBad: maxBad,
            minGood: minGood,
            maxGood: maxGood
        });


    it ("should set up", function() {
        const setUp = algo.setUp();
console.log(setUp);
        let numGood = 0, numOk = 0, numBad = 0;
        for (let i = 0; i < total; i++) {
            if (setUp[i] === constants.GOOD) {
                numGood++
            } else if (setUp[i] === constants.BAD) {
                numBad++
            } else if (setUp[i] === constants.OK) {
                numOk++;
            }
        }

        expect(numGood).toBeGreaterThanOrEqual(minGood);
        expect(numGood).toBeLessThanOrEqual(maxGood);
        expect(numBad).toBeGreaterThanOrEqual(minBad);
        expect(numBad).toBeLessThanOrEqual(maxBad);
    })

    it ('should calc based on luck eyes: 6, good', function() {
        const eyes = 6,
            luck = [constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD];

        for (let i = 0; i < luck.length; i++) {
            let roll = algo.getRoll({
                eyes: eyes,
                currRound: i,
                luck: luck
            });
            expect(roll).toBeGreaterThanOrEqual(5);
            expect(roll).toBeLessThanOrEqual(6);
        }
    })

    it ('should calc based on luck eyes: 20, good', function() {
        const eyes = 20,
            luck2 = [constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD, constants.GOOD];

        for (let i = 0; i < luck2.length; i++) {
            let roll2 = algo.getRoll({
                eyes: eyes,
                currRound: i,
                luck: luck2
            });

            expect(roll2).toBeGreaterThanOrEqual(16);
            expect(roll2).toBeLessThanOrEqual(20);
        }
    })

    it ('should calc based on luck eyes: 6, bad', function() {
        const eyes = 6,
            luck3 = [constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD];

        let roll3;
        for (let i = 0; i < luck3.length; i++) {
            roll3 = algo.getRoll({
                eyes: eyes,
                currRound: i,
                luck: luck3
            })

            expect(roll3).toBeGreaterThanOrEqual(1);
            expect(roll3).toBeLessThanOrEqual(2);
        }
    })

    it ('should calc based on luck eyes: 20, bad', function() {
        const eyes = 20
            luck4 = [constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD,constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD, constants.BAD];

        for (let i = 0; i < luck4.length; i++) {
            let roll4 = algo.getRoll({
                eyes: eyes,
                currRound: i,
                luck: luck4
            })

            expect(roll4).toBeGreaterThanOrEqual(1);
            expect(roll4).toBeLessThanOrEqual(4);
        }
    })


    it ('should calc based on luck eyes: 6, ok', function() {
        const eyes = 6,
            luck5 = [constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK, constants.OK];

        let roll5;
        for (let i = 0; i < luck5.length; i++) {
            roll5 = algo.getRoll({
                eyes: eyes,
                currRound: i,
                luck: luck5
            })

            expect(roll5).toBeGreaterThanOrEqual(2);
            expect(roll5).toBeLessThanOrEqual(4);
        }
    })
});


describe("Die", function() {
    const Die = require('../utils/dice/die');


    it("should have the correct rolls", function() {
        const total = 10;
        const minBad = 5;
        const maxBad = 8;
        const minGood = 1;
        const maxGood = 4;

        const myDie = new Die({
            total: total,
            minBad: minBad,
            maxBad: maxBad,
            minGood: minGood,
            maxGood: maxGood
        })

        let roll;
        let numGood = 0, numBad = 0, numOk = 0;

        for (let i = 0; i < total; i++) {
            roll = myDie.roll(6, "friedSardine")
            if (roll >= 5) {
                numGood++
            } else if (roll <= 2) {
                numBad++
            } else {
                numOk++;
            }
        }

        expect(numGood).toBeGreaterThanOrEqual(minGood);
        expect(numGood).toBeLessThanOrEqual(maxGood);
        expect(numBad).toBeGreaterThanOrEqual(minBad);
        expect(numBad).toBeLessThanOrEqual(maxBad);

        numGood = 0, numBad = 0, numOk = 0;
        for (let i = 0; i < total; i++) {
            roll = myDie.roll(6, "friedSardine")
            if (roll >= 5) {
                numGood++
            } else if (roll <= 2) {
                numBad++
            } else {
                numOk++;
            }
        }

        expect(numGood).toBeGreaterThanOrEqual(minGood);
        expect(numGood).toBeLessThanOrEqual(maxGood);
        expect(numBad).toBeGreaterThanOrEqual(minBad);
        expect(numBad).toBeLessThanOrEqual(maxBad);

    });

    it("should handle new users", function() {
        const total = 5;
        const minBad = 5;
        const maxBad = 5;
        const minGood = 0;
        const maxGood = 0;

        const myDie = new Die({
            total: total,
            minBad: minBad,
            maxBad: maxBad,
            minGood: minGood,
            maxGood: maxGood
        })

        let roll;
        let numGood = 0, numBad = 0, numOk = 0;

        for (let i = 0; i < total; i++) {
            roll = myDie.roll(6, "user1");
            if (roll >= 5) {
                numGood++
            } else if (roll <= 2) {
                numBad++
            } else {
                numOk++;
            }
        }

        expect(numGood).toBeGreaterThanOrEqual(minGood);
        expect(numGood).toBeLessThanOrEqual(maxGood);
        expect(numBad).toBeGreaterThanOrEqual(minBad);
        expect(numBad).toBeLessThanOrEqual(maxBad);

        expect(myDie.roll(6, "user1")).toBeLessThanOrEqual(2);
        expect(myDie.roll(6, "user2")).toBeLessThanOrEqual(2);
        expect(myDie.roll(6, "user3")).toBeLessThanOrEqual(2);
        expect(myDie.roll(6, "user4")).toBeLessThanOrEqual(2);
        expect(myDie.roll(6, "user5")).toBeLessThanOrEqual(2);
    });
});
