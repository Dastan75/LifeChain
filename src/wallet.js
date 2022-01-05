import crypto from 'crypto';

export default class Wallet {
    encodingType = 'base64'
    signType = 'SHA256'
    formatKey = 'der'

    constructor(name = '', pubKey, privKey) {
        let walletPubKey = pubKey
        let walletPrivKey = privKey
        if (!pubKey && !privKey) {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
                namedCurve: 'secp256k1',
                publicKeyEncoding: {
                    type: 'spki',
                    format: this.formatKey
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: this.formatKey
                }
            });
            walletPubKey = publicKey.toString(this.encodingType)
            walletPrivKey = privateKey.toString(this.encodingType)
        }

        console.log(`New wallet!  Pub_Key: ${walletPubKey}`)
        this.privateKey = walletPrivKey
        this.publicKey = walletPubKey
        this.name = name
    }

    getPrivateKeyObj() {
        return crypto.createPrivateKey({ 
            key: Buffer.from(this.privateKey, this.encodingType), 
            format: 'der', 
            type: 'pkcs8'
        })
    }

    getPublicKeyObj() {
        return crypto.createPublicKey({ 
            key: Buffer.from(this.publicKey, this.encodingType), 
            format: 'der', 
            type: 'spki'
        })
    }

    getSignature(hashTx) {
        try {
            const sign = crypto.createSign(this.signType);
            sign.write(hashTx);
            sign.end();
            return sign.sign(this.getPrivateKeyObj(), this.encodingType);
        } catch (error) {
            throw new Error("Error signature")
        }
    }
}