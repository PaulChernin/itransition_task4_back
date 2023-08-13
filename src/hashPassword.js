import crypto from 'crypto'

export default password => {
    const hash = crypto.createHash('sha256')
    const buffer = hash.update(password).digest()
    return buffer.toString('hex')
}