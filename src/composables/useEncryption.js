import { ref, onMounted } from 'vue'
import sodium from 'libsodium-wrappers'

const isReady = ref(false)
const error = ref(null)

// 初始化 sodium
export async function initSodium() {
  try {
    await sodium.ready
    isReady.value = true
  } catch (err) {
    error.value = err
    console.error('Failed to initialize libsodium:', err)
  }
}

// 加密函数
export async function encryptMessage(message, key) {
  if (!isReady.value) {
    await initSodium()
  }
  
  try {
    // 将消息和密钥转换为 Uint8Array
    const messageBytes = sodium.from_string(message)
    const keyBytes = sodium.from_hex(key)
    
    // 使用 XSalsa20-Poly1305 算法加密
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)
    const encrypted = sodium.crypto_secretbox_easy(messageBytes, nonce, keyBytes)
    
    // 返回 nonce 和加密后的数据
    return {
      nonce: sodium.to_hex(nonce),
      encrypted: sodium.to_hex(encrypted)
    }
  } catch (err) {
    console.error('Encryption failed:', err)
    throw err
  }
}

// 解密函数
export async function decryptMessage(encryptedData, nonce, key) {
  if (!isReady.value) {
    await initSodium()
  }
  
  try {
    // 将十六进制数据转换为字节数组
    const encryptedBytes = sodium.from_hex(encryptedData)
    const nonceBytes = sodium.from_hex(nonce)
    const keyBytes = sodium.from_hex(key)
    
    // 解密
    const decrypted = sodium.crypto_secretbox_open_easy(encryptedBytes, nonceBytes, keyBytes)
    
    // 将解密后的数据转换为字符串
    return sodium.to_string(decrypted)
  } catch (err) {
    console.error('Decryption failed:', err)
    throw err
  }
}

// 生成密钥
export async function generateKey() {
  if (!isReady.value) {
    await initSodium()
  }
  
  try {
    const key = sodium.crypto_secretbox_keygen()
    return sodium.to_hex(key)
  } catch (err) {
    console.error('Key generation failed:', err)
    throw err
  }
}

// 生成密钥对（用于公钥加密）
export async function generateKeyPair() {
  if (!isReady.value) {
    await initSodium()
  }
  
  try {
    const keyPair = sodium.crypto_box_keypair()
    return {
      publicKey: sodium.to_hex(keyPair.publicKey),
      privateKey: sodium.to_hex(keyPair.privateKey)
    }
  } catch (err) {
    console.error('Key pair generation failed:', err)
    throw err
  }
}

// 使用公钥加密
export async function encryptWithPublicKey(message, publicKey) {
  if (!isReady.value) {
    await initSodium()
  }
  
  try {
    const messageBytes = sodium.from_string(message)
    const publicKeyBytes = sodium.from_hex(publicKey)
    
    // 生成临时密钥对用于加密
    const ephemeralKeyPair = sodium.crypto_box_keypair()
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES)
    
    // 加密消息
    const encrypted = sodium.crypto_box_easy(
      messageBytes,
      nonce,
      publicKeyBytes,
      ephemeralKeyPair.privateKey
    )
    
    return {
      nonce: sodium.to_hex(nonce),
      encrypted: sodium.to_hex(encrypted),
      ephemeralPublicKey: sodium.to_hex(ephemeralKeyPair.publicKey)
    }
  } catch (err) {
    console.error('Public key encryption failed:', err)
    throw err
  }
}

// 使用私钥解密
export async function decryptWithPrivateKey(encryptedData, nonce, ephemeralPublicKey, privateKey) {
  if (!isReady.value) {
    await initSodium()
  }
  
  try {
    const encryptedBytes = sodium.from_hex(encryptedData)
    const nonceBytes = sodium.from_hex(nonce)
    const ephemeralPublicKeyBytes = sodium.from_hex(ephemeralPublicKey)
    const privateKeyBytes = sodium.from_hex(privateKey)
    
    // 解密消息
    const decrypted = sodium.crypto_box_open_easy(
      encryptedBytes,
      nonceBytes,
      ephemeralPublicKeyBytes,
      privateKeyBytes
    )
    
    return sodium.to_string(decrypted)
  } catch (err) {
    console.error('Private key decryption failed:', err)
    throw err
  }
}

export function useEncryption() {
  return {
    isReady: isReady.value,
    error: error.value,
    initSodium,
    encryptMessage,
    decryptMessage,
    generateKey,
    generateKeyPair,
    encryptWithPublicKey,
    decryptWithPrivateKey
  }
}
