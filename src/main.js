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
            // Response received, but with an error status code
            let v = JSON.parse(e);
            console.log("Error status code: " + v.response.status);
            console.log("Error response body: " + v.response.data);
            // Network error or other exception
            console.log("Exception: " + v);

    }
})();


