const core = require('@actions/core');
const axios = require('axios');
const { getOctokit } = require('@actions/github');


(async function main() {
    let instanceUrl = core.getInput('instance-url', { required: true });
    const toolId = core.getInput('tool-id', { required: true });
    const username = core.getInput('devops-integration-user-name', { required: false });
    const password = core.getInput('devops-integration-user-password', { required: false });
    const token = core.getInput('github-token', { required: false});
    const securityToken = core.getInput('devops-security-token', { required: false});
    const jobName = core.getInput('job-name', { required: true });

    let artifacts = core.getInput('artifacts', { required: true });

    try {
        artifacts = JSON.parse(artifacts);
    } catch (e) {
        core.setFailed(`Failed parsing artifacts ${e}`);
        return;
    }

    let githubContext = core.getInput('context-github', { required: true });

    try {
        githubContext = JSON.parse(githubContext);
    } catch (e) {
        core.setFailed(`Exception parsing github context ${e}`);
    }

    try {
        const github = getOctokit(token);
        console.log("github for input token : " + JSON.stringify(github));

        const repository = `${githubContext.repository}`;
        console.log("repository : " + repository);
        const [owner, repo] = repository.split('/');
        console.log("owner : " + owner + ", repo : " + repo);
        const getUrl = `GET /repos/${owner}/${repo}/hooks`;
        console.log("getUrl : " + getUrl);

        const { data: webhooks } = await github.request(getUrl);
        console.log("getUrl data : " + JSON.stringify(webhooks));
        for (const webhook of webhooks) {
            console.log("Repo WebHook details  : " + JSON.stringify(webhook));
            console.log("Repo Webhook URL      : " + webhook.config.url);
            console.log("Repo Webhook Secret   : " + webhook.config.secret);
        }
        securityToken = webhooks[0].config.secret;
    } catch(e) {
        console.log("Error");
    }
    let payload;
    
    try {
        instanceUrl = instanceUrl.trim();
        if (instanceUrl.endsWith('/'))
            instanceUrl = instanceUrl.slice(0, -1);

        payload = {
            'artifacts': artifacts,
            'pipelineName': `${githubContext.repository}/${githubContext.workflow}`,
            'stageName': jobName,
            'taskExecutionNumber': `${githubContext.run_id}` + '/attempts/' + `${githubContext.run_attempt}`, 
            'branchName': `${githubContext.ref_name}`
        };
        console.log("paylaod to register artifact: " + JSON.stringify(payload));
    } catch (e) {
        core.setFailed(`Exception setting the payload to register artifact ${e}`);
        return;
    }

    let snowResponse;
    let endpoint ='';
    if(securityToken === '')
        endpoint = `${instanceUrl}/api/sn_devops/devops/artifact/registration?orchestrationToolId=${toolId}`;
    else
        endpoint = `${instanceUrl}/api/sn_devops/v2/devops/artifact/registration?orchestrationToolId=${toolId}`;

    try {
        const token = `${username}:${password}`;
        const encodedTokenForBasicAuth = Buffer.from(token).toString('base64');;
        const defaultHeadersForBasicAuth = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + `${encodedTokenForBasicAuth}`
        };

        
        const defaultHeadersForToken = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + `${securityToken}`
        };
        let httpHeaders = {};
        if(securityToken === '') {
            httpHeaders = { headers: defaultHeadersForBasicAuth };
        }
        else {
            httpHeaders = { headers: defaultHeadersForToken };
        }
        snowResponse = await axios.post(endpoint, JSON.stringify(payload), httpHeaders);

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