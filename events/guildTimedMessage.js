/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This private-event is triggers by Discord and does processing of data  */

//load required modules
var cron = require('node-cron');

module.exports = async (client, guildId, timedMessage) => {

    //go over all cron tasks and add them to the collection
    for await (let msg of timedMessage) {
        //setup cron name
        var cronName = `${guildId}_${msg.name}`;
        //setup the cron task
        var task = cron.schedule(msg.crontime, () => {

            //setup cron task here
            // console.log(msg.response);

            //FIX SETUP HERE!


        }, {
            scheduled: false
        });
        //set the cron task in Collection
        await client.crons.set(cronName, task);
    }
    return;
}