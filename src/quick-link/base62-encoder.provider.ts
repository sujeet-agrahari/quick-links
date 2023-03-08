import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class Base62Encoder {
  private readonly ALPHABET =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly BASE = this.ALPHABET.length;
  /**
   * This method takes a long identifier (longId) and generates a short identifier (shortLink) and a numeric representation (shortId)
   * The short identifier is a Base 62 encoded string with a length of 6 characters
   * The numeric representation is the result of taking the first 6 characters of the hexadecimal representation of the SHA-256 hash of the input longId
   * @param longId {string} The original identifier to be shortened
   * @returns {object} An object containing the short identifier (shortLink) and its numeric representation (shortId)
   */

  async encode(longId: string): Promise<string> {
    const shortId = await this.getSha256Int(longId);
    let num = shortId;

    let shortLink = '';
    while (num > 0) {
      shortLink = this.ALPHABET[num % this.BASE] + shortLink;
      num = Math.floor(num / this.BASE);
    }

    return shortLink.padEnd(8, this.ALPHABET[0]);
  }

  /**
   * decode method to get back the original shortId from the given shortLink
   * @param shortLink - The shortened string representation of the original shortId
   * @returns An object with original shortId and shortLink
   */

  async decode(shortLink: string): Promise<number> {
    let num = 0;
    for (let i = 0; i < shortLink.length; i++) {
      num = num * this.BASE + this.ALPHABET.indexOf(shortLink[i]);
    }
    return num;
  }
  /**
   * getSha256Int
   *
   * Method to generate an integer representation of the SHA-256 hash of the input `longId` string.
   *
   * @param {string} longId - the input string to be hashed
   * @returns {number} - an integer representation of the first 6 characters of the hexadecimal representation of the SHA-256 hash of `longId`
   */

  async getSha256Int(longId) {
    const hash = crypto.createHash('sha256');
    hash.update(longId);
    return parseInt(hash.digest('hex').substring(0, 8), 16);
  }

  /**
   * It takes an array of links, encodes each link, and returns an array of encoded links
   * @param {string[]} links - string[] - an array of links to be encoded
   * @returns An array of strings.
   */
  async encodeLinks(links: string[]): Promise<string[]> {
    const encodedShortLinkPromises = links.map((link) => this.encode(link));
    return Promise.all(encodedShortLinkPromises);
  }
}
