import * as func from './functions.ts'
import { sign } from "./sign.ts";

interface verifyResponse {
    status: boolean,
    msg?: string
}

/**
 * 
 * @param token The JWT to verify the validity
 * @param secret The secret used to sign the token
 * @param debugMode [not reqired and is false by default] When true, returns response as a object with the status and a message else just the status
 * 
 * @returns Either true or false if debugMode is false else returns a object with the status and a message
 * @example Usage
 * ```ts
 * const isValid = verify(token, secret, true)
 * ```
 * @example Response
 * ```json
 * {
 *  "status": true,
 *  "msg": "This token is valid"
 * }
 * ```
 */
export async function verify(token: string, secret: string, debugMode: boolean = false): Promise<boolean | verifyResponse> {
    //split the token into 3 by the .
    const parts = token.split('.')
    const [encodedHeader, encodedPayload, receivedSignature] = parts
    let decodedHeader, decodedPayload
    //encoded payload
    //const ep = encodedPayload
    //return false if the token isn't in the header.payload.signature format
    if (parts.length != 3) {
        const res = { status: false, msg: "Token isn't in header.payload.signature format" }
        return debugMode ? res : false
    }
    //decode the header to get it's data
    const header = func.base64UrlDecode(encodedHeader)
    //failed to decode the header
    if (!header) {
        const res = { status: false, msg: "The header isn't in a valid format to decode" }
        return debugMode ? res : false
    }
    //parse the decoded header
    try {
        decodedHeader = JSON.parse(header)
    } catch (_) {
        const res = { status: false, msg: "The header isn't in a valid format to decode" }
        return debugMode ? res : false
    }
    //decode the payload to get it's data
    const payload = func.base64UrlDecode(encodedPayload)
    //failed to decode the payload
    if (!payload) {
        const res = { status: false, msg: "The payload isn't in a valid format to decode" }
        return debugMode ? res : false
    }
    //parse the decoded payload
    try {
        decodedPayload = JSON.parse(payload)
    } catch (_) {
        const res = { status: false, msg: "The payload isn't in a valid format to decode" }
        return debugMode ? res : false
    }
    //check if the token is valid yet
    if (decodedPayload.nbf && Date.now() < decodedPayload.nbf * 1000) {
        const res = { status: false, msg: "This token isn't valid yet" }
        return debugMode ? res : false
    }
    //check if the token is already expired
    if (decodedPayload.exp && Date.now() > decodedPayload.exp * 1000) {
        const res = { status: false, msg: "This token is expired" }
        return debugMode ? res : false
    }
    //check which algorithm has been used to sign the token
    if (!(decodedHeader.alg in func.algorithmsMap)) {
        const res = { status: false, msg: "Token header doesn't have a valid signing algorithm" }
        return debugMode ? res : false
    }
    //re sign the header and the payload for the comparison
    const recomputedSign = await sign(decodedPayload, secret, decodedHeader.alg, true)
    //compare received token and the recomputed token
    const valid = func.timingSafeCompare(receivedSignature, recomputedSign)
    if (!valid) {
        const res = { status: valid, msg: "This token is invalid" }
        return debugMode ? res : valid
    } else {
        const res = { status: valid, msg: "This token is valid" }
        return debugMode ? res : valid
    }
}