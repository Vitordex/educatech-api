import bcrypt from 'bcryptjs';
import { IHashingService } from '../../services/ihashing.service';

export class HashingService implements IHashingService {
    /**
     * @param {Number} saltRounds The number of rounds the hash system must salt the texts
     */
    constructor(private saltRounds: number = 10) {
    }
    /**
     * Hash a string in configured algorithm
     * @param {String} text The string to hash
     *
     * @returns {String}
     */
    public createHash(text) {
        return bcrypt.hash(text, this.saltRounds);
    }

    /**
     * Compare an input string with a hash
     * @param {String} text The input text
     * @param {String} hash The hash to compare
     *
     * @returns {Boolean}
     */

    public compare(text, hash) {
        return bcrypt.compare(text, hash);
    }
}
