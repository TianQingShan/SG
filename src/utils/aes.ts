import CryptoJS from 'crypto-js'
import { isServer } from '#/utils/get-env'

const KEY = 'AuCkS1i8I0KvuNMB'
const IV = 'AuCkS1i8I0KvuNMB'

/**
 * AES 加密
 * @param plaintext 明文
 * @param key 加密 key
 * @param iv 偏移量
 * @return 密文
 */
export function AESencrypt(plaintext: string) {
  let key = CryptoJS.enc.Utf8.parse(KEY)
  let iv = CryptoJS.enc.Utf8.parse(IV)

  return CryptoJS.AES.encrypt(plaintext, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString()
}

/**
 * AES 解密
 * @param ciphertext 密文
 * @param key 加密 key
 * @param iv 偏移量
 * @return 明文
 */
export function AESdecrypt(ciphertext: string) {
  let key = CryptoJS.enc.Utf8.parse(KEY)
  let iv = CryptoJS.enc.Utf8.parse(IV)

  return CryptoJS.AES.decrypt(ciphertext, key, { iv, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8)
}

/** 是否开启AES */
export const IS_OPEN_AES = isServer || (JSON.parse(import.meta.env.VITE_OPEN_AES) && !sessionStorage.getItem('CLOSE_AES'))
