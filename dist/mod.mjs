// functions/functions.ts
function base64UrlEncode(input) {
  return btoa(String.fromCharCode(...input)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlDecode(input) {
  try {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = input.length % 4;
    if (pad) {
      input += "=".repeat(4 - pad);
    }
    return atob(input);
  } catch (_) {
    return null;
  }
}
function encodeJson(obj) {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)));
}
function timingSafeCompare(a, b) {
  if (a.length != b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result == 0;
}
var algorithmsMap = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512"
};

// functions/sign.ts
async function sign(payload, secret, alg, signatureOnly) {
  if (!(alg in algorithmsMap)) {
    throw new Error(
      "Unsupported algorithm. Please refer to the documentation at https://github.com/4zeroiv/jwt#readme for the list of supported algorithms."
    );
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: algorithmsMap[alg] },
    false,
    ["sign"]
  );
  const header = {
    alg,
    typ: "JWT"
  };
  const encodedHeader = encodeJson(header);
  const encodedPayload = encodeJson(payload);
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = base64UrlEncode(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))));
  const token = `${data}.${signature}`;
  return signatureOnly ? signature : token;
}

// functions/verify.ts
async function verify(token, secret, debugMode = false) {
  const parts = token.split(".");
  const [encodedHeader, encodedPayload, receivedSignature] = parts;
  let decodedHeader, decodedPayload;
  if (parts.length != 3) {
    const res = { status: false, msg: "Token isn't in header.payload.signature format" };
    return debugMode ? res : false;
  }
  const header = base64UrlDecode(encodedHeader);
  if (!header) {
    const res = { status: false, msg: "The header isn't in a valid format to decode" };
    return debugMode ? res : false;
  }
  try {
    decodedHeader = JSON.parse(header);
  } catch (_) {
    const res = { status: false, msg: "The header isn't in a valid format to decode" };
    return debugMode ? res : false;
  }
  const payload = base64UrlDecode(encodedPayload);
  if (!payload) {
    const res = { status: false, msg: "The payload isn't in a valid format to decode" };
    return debugMode ? res : false;
  }
  try {
    decodedPayload = JSON.parse(payload);
  } catch (_) {
    const res = { status: false, msg: "The payload isn't in a valid format to decode" };
    return debugMode ? res : false;
  }
  if (decodedPayload.nbf && Date.now() < decodedPayload.nbf * 1e3) {
    const res = { status: false, msg: "This token isn't valid yet" };
    return debugMode ? res : false;
  }
  if (decodedPayload.exp && Date.now() > decodedPayload.exp * 1e3) {
    const res = { status: false, msg: "This token is expired" };
    return debugMode ? res : false;
  }
  if (!(decodedHeader.alg in algorithmsMap)) {
    const res = { status: false, msg: "Token header doesn't have a valid signing algorithm" };
    return debugMode ? res : false;
  }
  const recomputedSign = await sign(decodedPayload, secret, decodedHeader.alg, true);
  const valid = timingSafeCompare(receivedSignature, recomputedSign);
  if (!valid) {
    const res = { status: valid, msg: "This token is invalid" };
    return debugMode ? res : valid;
  } else {
    const res = { status: valid, msg: "This token is valid" };
    return debugMode ? res : valid;
  }
}

// functions/decodePayload.ts
function decodePayload(token) {
  const parts = token.split(".");
  if (parts.length != 3) {
    const res = { status: false, msg: "Token isn't in header.payload.signature format" };
    return res;
  }
  const encodedPayload = parts[1];
  let decodedPayload;
  const payload = base64UrlDecode(encodedPayload);
  if (!payload) {
    const res = { status: false, msg: "The payload isn't in a valid format to decode" };
    return res;
  }
  try {
    decodedPayload = JSON.parse(payload);
  } catch (_) {
    const res = { status: false, msg: "The payload isn't in a valid format to decode" };
    return res;
  }
  return decodedPayload;
}
export {
  decodePayload,
  sign,
  verify
};
