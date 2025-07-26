//to Encode to Base64Url
export function base64UrlEncode(input: Uint8Array): string {
    return btoa(String.fromCharCode(...input))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}
//to Decode Base64Url
export function base64UrlDecode(input: string) {
    try {
        input = input.replace(/-/g, '+').replace(/_/g, '/')

        const pad = input.length % 4
        if (pad) {
            input += '='.repeat(4 - pad)
        }

        return atob(input)
    }catch(_){
        return null
    }
}

//encode json to U8int8Array and encode to Base64Url
export function encodeJson(obj: object): string {
    return base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)))
}

export function timingSafeCompare(a: string, b: string): boolean {
    if (a.length != b.length) return false

    let result = 0
    for (let i = 0; i < a.length; i++) {
        result |= (a.charCodeAt(i) ^ b.charCodeAt(i))
    }
    return result == 0
}

export const algorithmsMap = {
        HS256: "SHA-256",
        HS384: "SHA-384",
        HS512: "SHA-512"
    } as const