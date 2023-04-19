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
    } catch(err) {
        if (!err.response) {
            throw new Error("500");
         }
 
         if (!codesAllowedArr.includes(err.response.status)) {
           throw new Error("500");
         }
    
         if (err.response.status == 500) {
             throw new Error("500");
         }
 
         if (err.response.status == 400) {
           throw new Error("400");
         }
 
         if (err.response.status == 401) {
           throw new Error("401");
         }
 
         if (err.response.status == 403) {
           throw new Error("403");
         }
 
         if (err.response.status == 404) {
           throw new Error("404");
         }
    }
})();


