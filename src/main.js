const core = require('@actions/core');
const axios = require('axios');


(async function main() {
    let instanceUrl = core.getInput('instance-url', { required: true });
    const toolId = core.getInput('tool-id', { required: true });
    const username = core.getInput('devops-integration-user-name', { required: false });
    const password = core.getInput('devops-integration-user-password', { required: false });
    const securityToken = core.getInput('devops-security-token', { required: false});
    const jobName = core.getInput('job-name', { required: true });

    let artifacts = core.getInput('artifacts', { required: true });
    
     try {
        console.log("Entered");
            instanceUrl = "https://api.github.com";
            let endpoint = instanceUrl+"/repos/roy-ca/MyGithubActions/hooks/409489218";
            //const token = process.env.GITHUB_TOKEN
            const token = 'roy-ca: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';
            const encodedToken = Buffer.from(token).toString('base64');
            console.log("Token:"+token);
            const defaultHeaders = {
                       'Content-Type': 'application/json',
                        'Accept': 'application/json' ,
                        'Authorization': 'Basic ' + `${encodedToken}`
                      };
                        let httpHeaders = { headers: defaultHeaders };
                        console.log("Headers:"+JSON.stringify(httpHeaders));
            let snowResponse = await axios.get(endpoint, httpHeaders);
            console.log("Api Response:"+JSON.stringify(snowResponse));
            let responseBody = JSON.parse(snowResponse);
            let secret = responseBody.config.secret;
            console.log("Secret:"+secret);

        
            //     core.setFailed(`Exception setting the payload to register artifact ${e}`);
            //     return;
            // }
    //     artifacts = JSON.parse(artifacts);
    // } catch (e) {
    //     core.setFailed(`Failed parsing artifacts ${e}`);
    //     return;
    // }

    // let githubContext = core.getInput('context-github', { required: true });

    // try {
    //     githubContext = JSON.parse(githubContext);
    // } catch (e) {
    //     core.setFailed(`Exception parsing github context ${e}`);
    // }

    // let payload;
    
    // try {
    //     instanceUrl = instanceUrl.trim();
    //     if (instanceUrl.endsWith('/'))
    //         instanceUrl = instanceUrl.slice(0, -1);

    //     payload = {
    //         'artifacts': artifacts,
    //         'pipelineName': `${githubContext.repository}/${githubContext.workflow}`,
    //         'stageName': jobName,
    //         'taskExecutionNumber': `${githubContext.run_id}` + '/attempts/' + `${githubContext.run_attempt}`, 
    //         'branchName': `${githubContext.ref_name}`
    //     };
    //     console.log("paylaod to register artifact: " + JSON.stringify(payload));
    //     console.log("Token:"+ securityToken);
    //     console.log("Username:"+username);
    // } catch (e) {
    //     core.setFailed(`Exception setting the payload to register artifact ${e}`);
    //     return;
    // }

    // let snowResponse;
    // let endpoint = '';
    // if(securityToken === '')
    //     endpoint = `${instanceUrl}/api/sn_devops/devops/artifact/registration?orchestrationToolId=${toolId}`;
    // else
    //     endpoint = `${instanceUrl}/api/sn_devops/v2/devops/artifact/registration?orchestrationToolId=${toolId}`;

    // try {
    //     const token = '';
    //     const encodedToken = '';

    //     const defaultHeaders = {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     };

    //     if(securityToken === '') {
    //         token = `${username}:${password}`;
    //         encodedToken = Buffer.from(token).toString('base64');
    //         defaultHeaders['Authorization'] = 'Basic ' + `${encodedToken}`;
    //     }
    //     else {
    //         encodedToken = securityToken;
    //         defaultHeaders['Authorization'] = 'Bearer ' + `${encodedToken}`;
    //         defaultHeaders['token'] = encodedToken;
    //     }


    //     let httpHeaders = { headers: defaultHeaders };
    //     snowResponse = await axios.post(endpoint, JSON.stringify(payload), httpHeaders);
    } catch (e) {
        if (e.message.includes('ECONNREFUSED') || e.message.includes('ENOTFOUND') || e.message.includes('405')) {
            core.setFailed('ServiceNow Instance URL is NOT valid. Please correct the URL and try again.');
        } else if (e.message.includes('401')) {
            core.setFailed('Invalid Credentials. Please correct the credentials and try again.');
        } else {
            core.setFailed('ServiceNow Artifact Versions are NOT created. Please check ServiceNow logs for more details.');
        }
    }
    
})();
