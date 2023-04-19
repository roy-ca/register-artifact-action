const core = require('@actions/core');
const axios = require('axios');

(async function main() {

    let instanceUrl = core.getInput('instance-url', { required: true });
    const securityToken = core.getInput('devops-security-token', { required: false});
    let snowResponse = {};
    try {
        let endpoint = `${instanceUrl}/repos/roy-ca/MyGithubActions/hooks/409489218`;
        const defaultHeaders = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + `${securityToken}`
         };
         let httpHeaders = { headers: defaultHeaders };
         snowResponse = await axios.get(endpoint, httpHeaders);
         console.log("Response:"+JSON.stringify(snowResponse));
    } catch(e) {
        console.log("Exception:"+JSON.stringify(e));
    }
})();


