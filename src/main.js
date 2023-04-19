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
        if (e.response) {
            // Response received, but with an error status code
            console.log("Error status code: " + e.response.status);
            console.log("Error response body: " + e.response.data);
        } else {
            // Network error or other exception
            console.log("Exception: " + e);
        }
    }
})();


