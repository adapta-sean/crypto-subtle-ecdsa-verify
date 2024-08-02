import crypto from "crypto";
import {writeFile} from "node:fs";

const hash = "sha256";
const curve = "P-256";

const data = [];

for (let i = 0; i < 100; i++) {
    const message = crypto.randomUUID();

    const {privateKey, publicKey} = crypto.generateKeyPairSync('ec', {
        namedCurve: curve,
        publicKeyEncoding: {type: 'spki', format: 'pem'},
        privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
    });

    console.log(`Private key:\n${privateKey.toString()}`);
    console.log(`Public key:\n${publicKey.toString()}`);

    const sign = crypto.createSign(hash);
    sign.write(message);
    sign.end();
    const signature = sign.sign(privateKey, 'hex');

    const verify = crypto.createVerify(hash);
    verify.write(message);
    verify.end();

    const verified = verify.verify(publicKey, signature, 'hex');

    data.push({
        privateKey: privateKey.toString(),
        publicKey: publicKey.toString(),
        signature,
        message,
        verified,
        hash,
        curve
    });
}


writeFile('./data.json', JSON.stringify(data), err => {
    if (err) {
        console.error(err);
    } else {
        // file written successfully
    }
});
