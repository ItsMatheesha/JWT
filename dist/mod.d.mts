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
declare function sign(payload: object, secret: string, alg: "HS256" | "HS384" | "HS512", signatureOnly?: boolean): Promise<string>;

interface verifyResponse {
    status: boolean;
    msg?: string;
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
declare function verify(token: string, secret: string, debugMode?: boolean): Promise<boolean | verifyResponse>;

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
declare function decodePayload(token: string): object;

export { decodePayload, sign, verify };
