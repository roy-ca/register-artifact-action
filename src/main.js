const core = require('@actions/core');
const axios = require('axios');
const { getOctokit } = require('@actions/github');

(async function main() {
    try {
        let githubContext = core.getInput('context-github', { required: true });
        try {
            githubContext = JSON.parse(githubContext);
        } catch (e) {
            core.setFailed(`Exception parsing github context ${e}`);
        }
        const securityToken = core.getInput('devops-security-token', { required: false});
        const github = getOctokit(securityToken);
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
        let url = webhooks[0].config.url;
        let token = webhooks[0].config.secret;
        console.log("TOken Length:"+token.length);
    } catch(e) {
            // Response received, but with an error status code
            console.log("Error:"+JSON.stringify(e));

    }
})();


