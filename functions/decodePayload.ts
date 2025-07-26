import * as func from "./functions.ts";

/**
 * 
 * @param token The JWT to decode
 * @returns The decoded payload in json format
 * 
 * @example
 * ```ts
 * const payload = decodePayload(token)
 * ```
 */
export function decodePayload(token: string): object{
    //split the token into 3 parts by .
    const parts = token.split('.')
    //return false if the token isn't in the header.payload.signature format
    if(parts.length != 3){
        const res = { status: false, msg: "Token isn't in header.payload.signature format"}
        return res
    }
    const encodedPayload = parts[1]
    let decodedPayload

    const payload = func.base64UrlDecode(encodedPayload)
        //failed to decode the payload
        if(!payload){
            const res = { status: false, msg: "The payload isn't in a valid format to decode"}
            return res
        }
        //parse the decoded payload
        try{
        decodedPayload = JSON.parse(payload)
        }catch(_){
            const res = { status: false, msg: "The payload isn't in a valid format to decode"}
            return res
        }
    //return the decoded payload
    return decodedPayload
}