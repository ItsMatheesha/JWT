# JWT
> A JWT (JSON Web Token) library written in TypeScript which supports Deno, Node.Js, Cloudflare Workers & Bun

> [!IMPORTANT]
> This package is no longer maintained on deno.land/x.  
> Please use the npm package (<a href="https://www.npmjs.com/package/jwtkn">jwtkn</a>) moving forward.

[![Github](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/ItsMatheesha/jwt)
![Repo](https://img.shields.io/badge/ItsMatheesha-JWT-red)
![GitHub License](https://img.shields.io/github/license/ItsMatheesha/jwt)
![GitHub top language](https://img.shields.io/github/languages/top/ItsMatheesha/jwt)

[![NPM](https://skills.syvixor.com/api/icons?i=npm)](https://www.npmjs.com/package/jwtkn)
<!-- [![JSR](https://skills.syvixor.com/api/icons?i=jsr)](https://jsr.io/@usr/jwt) -->

[Live Demo](https://jw-sb.vercel.app/)

## 🔻 Installation
- **From NPM:**
```bash
npm i jwtkn
```
<!-- - **From JSR (JavaScript Registry)**
```bash
deno add jsr:@usr/jwt
``` -->

### Importing the package

<!-- - **JSR**
```ts
import * as jwt from "jsr:@usr/jwt";
``` -->
- **NPM:**
```ts
import { sign } from "jwtkn";
```

### Usage
#### Sign
```ts
//the function expects a object as the payload, pass a JavaScript object to get the expected result
//✅Correct ex:
const payload = { sub: "1234", name: "Matheesha", exp: 1753195572 }
//❌Wrong ex:
const payload = '{ "sub": "1234", "name": "Matheesha", "exp": "1753195572" }'
```
```ts
//the header is added by the function itself and is formatted as below:
{
    alg: [given_algorithm],
    typ: 'JWT'
}
```
```ts
const token = sign(payload, secret, 'HS256', false)
//returns the full JWT ex: Response: xxxxxxxx.yyyyyyyy.zzzzzzzz
//if the signatureOnly is true it will return only the signatre ex: Response: zzzzzzzz
```

##### Supported Algorithms

| Algorithm | Hash |
|-----------|------|
| `HS256` | SHA-256 |
| `HS384` | SHA-384 |
| `HS512` | SHA-512 |

##### Parameters

| Parameters | Type | Required | Description |
|------------|------|----------|-------------|
| payload | `object`  | ✅ | The JavaScript object to encode and sign |
| secret  | `string`  | ✅ | The key used to sign the <span title="JSON Web Token">JWT</span> using the given algorithm |
| alg | `string`  | ✅ | The algorithm used to sign the token |
| signatureOnly | `boolean` | ❌ | If `true`, only the signature is returned (default: `false`) |

##### Returns

| Type | Description |
|------|-------------|
| `string` | Returns the Base64Url encoded signature (if `signatureOnly` is `true`) |
| `string` | Returns the full <span title="JSON Web Token">JWT</span> in `header.payload.signature` format (if `signatureOnly` is `false`) |

#### Verify
```ts
const isValid = verify(token, secret, true)
//returns a object with the status and the messsage
//ex: Response: { status: false, msg: "This token is expired" }
//if debugMode is false it will return just the status in boolean type
//ex: Response: false
```

##### Parameters

| Parameters | Type | Required | Description |
|------------|------|----------|-------------|
| token | `string` | ✅ | The <span title="JSON Web Token">JWT</span> to decode and verify |
| secret | `string` | ✅ | The key used to encode the <span title="JSON Web Token">JWT</span> |
| debugMode | `boolean` | ❌ | If `true`, a object will be returned else just a bool (default: `false`) |

##### Returns

| Type | Description |
|------|-------------|
| `object` | Returns `{ status: boolean, msg: string }` (when `debugMode` is `true`) |
| `boolean` | Returns `true` if valid, `false` if not (when `debugMode` is `false`) |

##### Response Messages

| Status | Message (debugMode: `true`) | Condition |
|--------|-----------------------------|-----------|
| `false` | Token isn't in header.payload.signature format | Token does not have exactly 3 segments separated by `.` operator |
| `false` | The header isn't in a valid format to decode | Header is invalid Base64 or not a valid object |
| `false` | The payload isn't in a valid format to decode | Payload is invalid Base64 or not a valid object |
| `false` | This token isn't valid yet | Payload has nbf (Not Before) and current time is earlier |
| `false` | This token is expired | Payload has exp (Expiration) and current time is later |
| `false` | Token header doesn't have a valid signing algorithm | Header has alg (Algorithm) which isn't supported by the library |
| `false` | This token is invalid | The signature comparision between the given token and the recomputed signature failed |
| `true` | This token is valid | The signature comparision is success |

#### Decode Payload
```ts
const payload = decodePayload(token)
//input the jWT and it will return the decoded payload from the token as a JavaScript object (no secret key required)
//ex: Response: 
{
    sub: "4321",
    name: "Matheesha",
    exp: 1753195572,
    admin: true
}
```

##### Parameters

| Parameters | Type | Required | Description |
|------------|------|----------|-------------|
| token | `string` | ✅ | The <span title="JSON Web Token">JWT</span> from which the payload will be decoded |

##### Returns

| Type | Description |
|------|-------------|
| `object` | Returns the decoded payload as a object |

##### Response Messages

| Status | Message | Condition |
|--------|---------|-----------|
| `false` | Token isn't in header.payload.signature format | Token does not have exactly 3 segments separated by `.` operator |
| `false` | The payload isn't in a valid format to decode | Payload is invalid Base64 or not a valid object |
| `object` | (decoded payload) | The payload is decoded successfully |


### 📄 License
MIT — © 2025 [ItsMatheesha](https://github.com/ItsMatheesha)