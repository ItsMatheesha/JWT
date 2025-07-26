import * as func from './functions.ts'

/**
 * 
 * @param payload The data to be signed
 * @param secret The secret key used to sign the data
 * @param alg The algorithm used to sign the JWT [HS256, HS384, HS512]`
 * @param signatureOnly [not required and is false by default] When true, returns only the signature else the full JWT string
 * @returns A Base64Url encoded signature string or the full JWT string in header.payload.signature format
 * 
 * @example
 * ```ts
 * const sign = sign(payload, secret, 'HS256', false)
 * ```
 */
export async function sign(payload: object, secret: string, alg: "HS256" | "HS384" | "HS512", signatureOnly?: boolean): Promise<string> {
    //currently supported algorithms

    if (!(alg in func.algorithmsMap)) {
        throw new Error(
            "Unsupported algorithm. Please refer to the documentation at https://github.com/4zeroiv/jwt#readme for the list of supported algorithms."
        )
    }
    //create the key used for signing
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: func.algorithmsMap[alg] },
        false,
        ['sign']
    )
    //set the header
    const header = {
        alg: alg,
        typ: 'JWT'
    }
    //encode the header into Base64Url
    const encodedHeader = func.encodeJson(header)
    //encode the payload into Base64Url
    const encodedPayload = func.encodeJson(payload)
    const data = `${encodedHeader}.${encodedPayload}`
    //sign the header and payload using HMACSHA256
    const signature = func.base64UrlEncode(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))))
    const token = `${data}.${signature}`
    //return the signature only if signatureOnly is true else the full JWT
    return signatureOnly ? signature : token
}