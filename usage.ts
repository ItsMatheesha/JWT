//this imports the lib directly from the source code,
//replace {./mod.ts} with {@matheesha/jwt} if you are installing the library from npm or jsr.

//keep it as it is if you cloned the git repo and run `npm run test` or `deno test usage.ts` to test this (requires Deno)
import { sign, verify, decodePayload } from './mod.ts'

const payload = {
    sub: "4321",
    name: "matheesha",
    //expires in 30 seconds
    exp: Math.floor((Date.now() + 30 * 1000) / 1000)
}

const secret = '4321'

const token = await sign(payload, secret, 'HS512')
const validity = JSON.stringify(await verify(token, secret, true))
const decodedPayload = JSON.stringify(await decodePayload(token))

console.log(`Signed JWT: ${token}`)
console.log(`Validity of token: ${validity}`)
console.log(`Decoded payload: ${decodedPayload}`)