/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This file contains some basic javascript functions */

module.exports = {

    /** convert timestamp to 2400 time object
     * @param {String} t Time object
     */
    time(t) {
        //check if (t) is a valid time string
        let valid = (new Date(t)).getTime() > 0;
        if (valid == true) {
            let time =
                ("0" + t.getHours()).slice(-2) + ":" +
                ("0" + t.getMinutes()).slice(-2);
            return time
        } else return undefined
    },

    /** convert milliseconds to hours, minutes, and seconds
     * @param {*} t 
     * @returns 
     */
    msToTime(t) {
        //get hours, minutes and seconds
        const date = new Date(t * 1000);
        const days = date.getUTCDate() - 1,
            hours = date.getUTCHours(),
            minutes = date.getUTCMinutes(),
            seconds = date.getUTCSeconds()
        let segments = []; //prepare array
        //seperate in segments
        if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
        if (hours > 0) segments.push(hours + ' hr' + ((hours == 1) ? '' : 's'));
        if (minutes > 0) segments.push(minutes + ' min' + ((minutes == 1) ? '' : 's'));
        if (seconds > 0) segments.push(seconds + ' sec' + ((seconds == 1) ? '' : 's'));
        const dateString = segments.join(', ');
        return dateString //return to user
    },

    /** capitalize full string
     * @param {String} str String object
     */
    capitalize(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                if (txt.charAt(0) == "'") {
                    return
                } else {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            }
        );
    },

    /** clean the string object
    * @param {String} string String object
    */
    clean(client, string) {
        if (typeof string === 'string') {
            return string
                .replace(/`/g, '`' + String.fromCharCode(8203))
                .replace(/@/g, '@' + String.fromCharCode(8203))
                .replace(/token/i, '' + String.fromCharCode(8203))
                .replace(client.token || process.env.TOKEN, '')
        } else {
            return string;
        }
    },

    /** slice array in chunks
     * @param {Array} array Lenghy array
     * @param {Number} chunk Chunk size
     */
    chunk(array, chunk) {
        let i, j, temp, returnArray = [];
        for (i = 0, j = array.length; i < j; i += chunk) {
            returnArray.push(temp = array.slice(i, i + chunk));
        }
        return returnArray;
    },

    /** get timestamp from snowflake
     * @param {*} input 
     * @returns 
     */
    convertSnowflake(input) {
        /* set default discord EPOCH from discord documentation
        https://discord.com/developers/docs/reference#snowflakes */
        const DISCORD_EPOCH = 1420070400000

        //convert input (string) to Number
        let snowflake = Number(input)

        //if snowflake is not an number, return false
        if (!Number.isInteger(snowflake)) return false
        //if snowflake is too short, return false
        if (snowflake < 4194304) return false

        //convert snowflake to timestamp
        let timestamp = new Date(snowflake / 4194304 + DISCORD_EPOCH)

        //return timestamp
        return timestamp
    },

    /** seperate string on flags
     * @param {*} str 
     * @param {*} options 
     * @param  {...any} flagsToDetect 
     * @returns 
     */
    async separateFlags(str, options = {}, ...flagsToDetect) {
        class customflag {
            constructor(flagName, flagArgs, validArgs) {
                this.name = flagName // Flag name
                this.args = flagArgs // Flag arguments
                this.validArgs = validArgs // Whether arguments are valid aka not undefined and have a length greater than 0
            }
        }
        if (!options.hasOwnProperty("separator")) Object.assign(options, { separator: 0 })
        if (!options.hasOwnProperty("allowDuplicates")) Object.assign(options, { allowDuplicates: false })
        return new Promise((resolve, reject) => {
            if (options.separator == 0) reject("Nothing to separate the flags with.")

            // setting up variables
            // check to see if we passed all flags we need as an array or individual arguments and makes an appropriate array from it.
            let flags = Array.isArray(flagsToDetect[0]) ? flagsToDetect[0] : Array.from(flagsToDetect)

            // split by '-' to see what we need and remove everything before 1st flag:
            // there will be arguments with spaces inside.
            let args = str.split(options.separator)
            args.splice(0, 1)

            // decide the datatype we need
            // duplicates allowed -> array, if no then set.
            let flagSet = options.allowDuplicates ? [] : new Set()

            try {
                args.forEach(arg => {

                    // flag variables
                    let currArgs = arg.split(' ') // for each argument with spaces inside, split it up
                    let currentFlag = currArgs[0].toLowerCase()
                    currArgs.splice(0, 1) // delete the flag from the arguments
                    let currentFlagArgs = ''

                    // if we don't need to search for the specific flag, ignore it.
                    if (!flags.includes(currentFlag)) return

                    // splitting and finding the flag, and the arguments of the flag
                    currArgs.forEach(flagArg => {
                        if (flagArg != '') currentFlagArgs += `${flagArg} `
                    })
                    currentFlagArgs = currentFlagArgs.substring(0, currentFlagArgs.length - 1) // remove the last space

                    // check if the flag arguments are undefined - if no check if the arguments are actually valid (length > 0) - if yes - set to true
                    let validArgs = currentFlagArgs == undefined ? false : currentFlagArgs.length > 0

                    if (options.allowDuplicates) flagSet.push(new customflag(currentFlag, currentFlagArgs, validArgs))
                    else flagSet.add(new customflag(currentFlag, currentFlagArgs, validArgs))
                })

                resolve(flagSet);
            }
            catch (err) {
                reject(err);
            }
        })
    },

};