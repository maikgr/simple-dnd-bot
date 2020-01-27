class RandomQueue {
    constructor(arr = []) {
        this.queue = arr
    }

    pop() {
        if (this.queue.length === 0) {
            return;
        }

        const queue = this.queue;
        const queueLength = queue.length;
        const randomIndex = Math.floor(Math.random() * queueLength);
        const temp = queue[queueLength - 1];
        queue[queueLength - 1] = queue[randomIndex];
        queue[randomIndex] = temp;
        return queue.pop();
    }
}

module.exports = RandomQueue;
