/**
 * Generate HMAC SHA-256 signature
 */
export async function generateHMAC(data: string, secretKey: string): Promise<string> {
  // Check if we're in a browser or Node.js environment
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // Browser environment
    const encoder = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await window.crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(data)
    );

    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // Node.js environment
    try {
      const crypto = await import('crypto');
      const hmac = crypto.createHmac('sha256', secretKey);
      hmac.update(data);
      return hmac.digest('hex');
    } catch (error) {
      throw new Error('HMAC generation failed: crypto module not available');
    }
  }
}

/**
 * Generate random nonce
 */
export function generateNonce(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    // Browser
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // Node.js
    try {
      const crypto = require('crypto');
      return crypto.randomBytes(16).toString('hex');
    } catch (error) {
      // Fallback to Math.random (not cryptographically secure)
      return Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
    }
  }
}

/**
 * Simple XOR encryption for client-side data obfuscation
 */
export function encryptData(data: any, key: string): string {
  const dataStr = JSON.stringify(data);
  let encrypted = '';
  for (let i = 0; i < dataStr.length; i++) {
    encrypted += String.fromCharCode(
      dataStr.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(encrypted);
}

/**
 * Decrypt XOR encrypted data
 */
export function decryptData(encrypted: string, key: string): any {
  try {
    const dataStr = atob(encrypted);
    let decrypted = '';
    for (let i = 0; i < dataStr.length; i++) {
      decrypted += String.fromCharCode(
        dataStr.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('Decryption failed');
  }
}
