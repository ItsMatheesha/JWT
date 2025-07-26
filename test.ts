import * as jwt from './mod.ts'

const payload = {
    name: "matheesha"
}

const secret = '4321'

const token = await jwt.sign(payload, secret, 'HS512')

console.log(token)