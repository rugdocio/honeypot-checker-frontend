import { notification } from "antd"
import { HONEYPOT_API_ENDPOINT } from "../config/constants/endpoints"

const checkHoneypot = () => {
    return async (address, chain) => {
        try {
            console.log(chain)
            const res =await fetch(`${HONEYPOT_API_ENDPOINT}?address=${address}&chain=${chain}`)
            if (res.status !== 200) {
                notification.open({
                    message: `Check failed with status ${res.status}`,
                    description: await res.text()
                })
                return undefined
            }
            const body = await res.json()
            return body['status']
        } catch (e) {
            console.error(e)
            let errormsg = e.data
            notification.open({
                message: 'Check failed',
                description: errormsg
            })
            return undefined
        }
    }
}
export default checkHoneypot