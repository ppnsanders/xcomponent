
import { SyncPromise as Promise } from 'sync-browser-mocks/src/promise';


/*  DeNodeify
    ---------

    Turns a method from a function which accepts a callback, into a function which returns a promise.
*/

export function denodeify(method) {

    return function() {

        let self = this;
        let args = Array.prototype.slice.call(arguments);

        if (args.length >= method.length) {
            return Promise.resolve(method.apply(self, args));
        }

        return new Promise((resolve, reject) => {
            args.push((err, result) => {

                if (err && !(err instanceof Error)) {
                    throw new Error(`Passed non-Error object in callback: [ ${err} ] -- callbacks should either be called with callback(new Error(...)) or callback(null, result).`);
                }

                return err ? reject(err) : resolve(result);
            });
            return method.apply(self, args);
        });
    };
}