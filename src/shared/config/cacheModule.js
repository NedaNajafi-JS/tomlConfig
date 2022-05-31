const NodeCache = require('node-cache');

class Cache {
    constructor() {
        this.cache = new NodeCache();
    }

    get(key) {

        const value = this.cache.get(key);
        if (value) {
            return value;
        }

    }

    set(key, value) {
        value ? this.cache.set(key, value) : '';
    }

    take(key) {

        const value = this.cache.take(key);
        return Promise.resolve(value);
    }

    push(key, ...value) {
        console.log(...value)

        this
            .take(key)
            .then(result => {
                let tt = result ? result : [];
                console.log(tt)
                    (result ? result : []).push(1);
                this.cache.set(key, result);
                return result;
            })
            .catch(err => {
                console.log(err)
            });
    }

    del(keys) {

    }

    flush() {
        this.cache.flushAll();
    }
}

module.exports = Cache;