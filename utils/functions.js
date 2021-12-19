/*  Fluxpuck © Creative Commons Attribution-NoDerivatives 4.0 International Public License  
    This file contains some basic javascript functions */

module.exports = {

    /**
     * Convert timestamp to 2400 time object.
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

    /**
     * Capitalize full string
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

    /**
    * Clean the string object.
    * @param {String} string String object
    */
    clean(string) {
        if (typeof text === 'string') {
            return string
                .replace(/`/g, '`' + String.fromCharCode(8203))
                .replace(/@/g, '@' + String.fromCharCode(8203))
                .replace(client.token || process.env.TOKEN, '[-- REDACTED --]')
        } else {
            return string;
        }
    },

    /**
     * slice array in chunks
     * @param {Array} array Lenghy array
     * @param {Number} chunk Chunk size
     */
    chunk(array, chunk) {
        var i, j, temp, returnArray = [];
        for (i = 0, j = array.length; i < j; i += chunk) {
            returnArray.push(temp = array.slice(i, i + chunk));
        }
        return returnArray;
    },

};