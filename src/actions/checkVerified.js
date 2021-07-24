import { notification } from "antd"
import { EXPLORER_ENDPOINTS } from "../config/constants/endpoints"

const checkVerified = () => {
    return async (address, chain) => {
        try {
            const endpoint = EXPLORER_ENDPOINTS[chain];

            const res =await fetch(`${endpoint}/api?module=contract&action=getsourcecode&address=${address}`)
    
            console.log(res)
            if (res.status !== 200) {
                notification.open({
                    message: `Contract verification fetch failed (error ${res.status})`,
                    description: await res.text()
                })
                return undefined
            }
            const body = await res.json()
            if (body['status'] !== "1") {
                notification.open({
                    message: `Contract verification fetch failed (error ${body['status']})`,
                    description: `${body['message']}`
                })
                return undefined
            }
            if (body['result'].length === 0) {
                return false
            }
            let verified = true
            for (let el of body['result']){
                if (el['sourceCode'] === "") {
                    verified = false;
                }
            }
            return verified;
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
export default checkVerified