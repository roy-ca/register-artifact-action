const core = require('@actions/core');
const axios = require('axios');

(async function main() {

    let instanceUrl = core.getInput('instance-url', { required: true });
    const securityToken = core.getInput('devops-security-token', { required: false});
    const toolId = core.getInput('tool-id', { required: true });
    let snowResponse = {};
    try {
        let endpoint = 'https://api.github.com/repos/roy-ca/MyGithubActions/actions/secrets/SN_DEVOPS_PASSWORD';
        console.log("Endpoint:"+endpoint);
        const defaultHeaders = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + `${securityToken}`
         };
         let httpHeaders = { headers: defaultHeaders };
         snowResponse = await axios.get(endpoint, httpHeaders);
         console.log("Response:"+JSON.stringify(snowResponse));
    } catch(e) {
            // Response received, but with an error status code
            console.log("Error:"+JSON.stringify(e));

    }
})();


