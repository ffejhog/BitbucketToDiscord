exports.bitbucketContent = function bitbucketContent (req, res) {

    const DiscordWebhook = require("discord-webhooks");
    var type;
    var actor;
    var repository;
    var commitmessage;
    var link;
    var status;
    var message;
    let webhook = new DiscordWebhook("PUT-DISCORD-SERVER-WEBHOOK-HERE")
    type = req.get('X-Event-Key');
    console.log(type);
    console.log(req.body);
 
    switch(type){
        case 'repo:push':
            actor = req.body.actor.display_name;
            repository = req.body.repository.name; 
            commitmessage = req.body.push.changes[0].new.target.message;
            link = req.body.push.changes[0].new.links.html.href;
            message = "Push made to " + repository + " by " + actor + " -- " + commitmessage + " -- " + link;
            break;
        case 'repo:commit_status_updated':
            repository = req.body.repository.name; 
            commitmessage = req.body.commit_status.name;
            link = req.body.commit_status.links.html.href;
            status = req.body.state;
            if( status == "INPROGRESS"){
                break;
            }
            message = "Build " + status + " in " + repository + " -- " + link;
            break;      
        case 'pullrequest:created':
        case 'pullrequest:fulfilled':
            actor = req.body.actor.display_name;
            repository = req.body.repository.name; 
            status = req.body.pullrequest.state;
            link = req.body.pullrequest.links.html.href;
            message = "Pull request " + status + " by " + actor + " in " + repository + " - " + link;
    }

    webhook.on("ready", () => {
        webhook.execute({
            content: message,

        });
    });

    webhook.on("error", (error) => {
        console.warn(error);
    });

    res.status(200).end()
}