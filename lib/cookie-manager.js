
var CookieManager = function(config) {

    /**
     * holds the default properties for a cookie
     * @type {Object}
     */
    this.defaults = {
        "name": "",
        "value": "",
        "lifetime": "0", // default lifetime of the cookie
        "path": "/", // default path
        "domain": "",
        "secure": false
    };

    // set user defined defaults
    if (config !== undefined) {
        for (key in config) {
            if (this.defaults.hasOwnProperty(key)) {
                this.defaults[key] = config[key];
            }
        }
    }

    /**
     * allowed flags for lifetime | seconds, minutes, hours, days, months
     * @type {Array}
     */
    this.allowedFlagsForLifetime = ["s", "m", "h", "d", "M"];
};

CookieManager.prototype.getCookies = function() {
    var cookies = document.cookie.trim();
    var cookiesArray = [];
    var split = [];
    var i = 0;

    if (cookies.length === 0) {
        return cookiesArray;
    }

    cookies = cookies.split(";"); // split cookies string by separator

    // iterate through cookies and save them into an array
    while (i < cookies.length) {

        if (cookies[i].trim().length === 0) {
            continue;
        }

        split[i] = cookies[i].trim().split("=");
        cookiesArray[ split[i][0].trim() ] = decodeURIComponent(split[i][1]);

        i++;
    }

    split = null; // remove variable
    cookies = null; // remove variable

    return cookiesArray;
}

/**
 * get a single cookie by its name
 * @param  {string|array|object} name
 * @return {string|bool}
 */
CookieManager.prototype.getCookie = function(name) {
    
    if (typeof name !== "string") {
        throw new Error("Cookie name must represent a string!");
    }

    // get all cookies
    var cookies = this.getCookies();

    // if the cookie exists then return its stored value
    if (cookies.hasOwnProperty(name)) {
        return cookies[name];
    }

    return false;
}

/**
 * add new cookie
 * @param {object} params
 */
CookieManager.prototype.add = function(params) {

    if (params === undefined || params.name === undefined || params.name.length === 0) {
        throw new Error("Cookie name is required!");
    }

    //console.log("New cookie: " + this.getCookieString(params));

    // set cookie
    document.cookie = this.getCookieString(params);

    return true;
};

/**
 * returns the string to be used for setting a cookie
 * @param  {Object} params
 * @return {string}
 */
CookieManager.prototype.getCookieString = function(params) {

    var cookieName = params.hasOwnProperty("name") ? params.name : this.defaults.name;
    var cookieValue = params.hasOwnProperty("value") ? encodeURIComponent(params.value) : this.defaults.value;
    var cookieLifetime = params.hasOwnProperty("lifetime") ? this.parseLifetime(params.lifetime) : this.parseLifetime(this.defaults.lifetime);
    var cookiePath = params.hasOwnProperty("path") ? params.path : this.defaults.path;
    var cookieDomain = params.hasOwnProperty("domain") ? params.domain : this.defaults.domain;
    var cookieSecure = params.hasOwnProperty("secure") ? params.secure : this.defaults.secure;

    var cookieSegments = [
        cookieName + "=" + cookieValue,
    ];

    if (cookieLifetime > 0) {
        cookieSegments.push("expires=" + new Date(Date.now() + cookieLifetime).toUTCString());
    }

    if (cookiePath !== "") {
        cookieSegments.push("path=" + cookiePath);
    }

    if (cookieDomain !== "") {
        cookieSegments.push("domain=" + cookieDomain);
    }

    if (cookieSecure === true) {
        cookieSegments.push("secure");
    }

    return cookieSegments.join(";");
}

/**
 * removes a cookie
 * @param  {object} params
 * @return {Boolean}
 */
CookieManager.prototype.remove = function(name, path) {

    if (name === undefined || name.length === 0) {
        throw new Error("Cookie name is required!");
    }

    var segments = [
        name + "=",
        "expires=" + new Date(Date.now() - 1000).toUTCString(),
        (path !== undefined) ? "path=" + path : ""
    ];

    document.cookie = segments.join(";");

    return true;
}

/**
 * reads the lifetime string received as parameter and checks for a flag
 * and transforms the lifetime from human readable form to milliseconds
 *
 * 1. if lifetime is undefined/null/empty use the default value
 * 2. if lifetime is numeric cast it to int and use that value
 * 3. if lifetime is not numeric and not a string use the default value
 * 4. if lifetime is a string but do not contain any flag try and cast
 *    it to int. If the result is a valid number use that. If the result
 *    is a NaN then use the default value.
 * 5. view which flag is set in the lifetime and return
 *    the according calculated value
 * 6. if not case was validated then use the default value.
 *    NORMALLY THIS SHOUlN'T HAPPEN.
 *
 * @param  {string} lifetime
 *      eg. 300s    = 300 seconds   => 300 * 1000
 *          10m     = 10 minutes    => 10 * 60 * 1000
 *          2h      = 2 hours       => 2 * 60 * 60 * 1000
 *          15d     = 15 days       => 15 * 24 * 60 * 60 * 1000
 *          3M      = 3 months      => 3 * 30 * 24 * 60 * 60 * 1000
 * @return {int} number of milliseconds to live
 */
CookieManager.prototype.parseLifetime = function(lifetime) {

    if (lifetime === undefined || lifetime === null || lifetime.length === 0) {
        return this.parseLifetime(this.defaults.lifetime);
    }

    // if a number was passed as lifetime then do not continue with parsing
    if (!isNaN(lifetime) === true) {
        return parseInt(lifetime, 10);
    }

    // if the lifetime is not a string then it can't contain any flag
    // to indicate the lifetime
    if (typeof lifetime !== "string") {
        console.log(lifetime);
        return this.parseLifetime(self.defaults.lifetime);
    }

    // if no flag was found then it is a chance that lifetime
    // is a number passed as a string and we should cast it to an int
    if (this.spotFlag(lifetime) === false) {
        var parsedLifetime = parseInt(lifetime, 10);

        // if the result of parsing is not a number because the string
        // wasn't a number passed as a string, use the default lifetime
        if (isNaN(parsedLifetime) === true) {
            return this.parseLifetime(this.defaults.lifetime);
        }
    }

    lifetime = lifetime.trim();

    var flag = lifetime.substring(lifetime.length - 1, lifetime.length);
    var value = parseInt(lifetime.substring(0, lifetime.length - 1), 10);

    switch (flag) {
        case "s": // seconds
            return value * 1000;
            // no break;
        
        case "m": // minutes
            return value * 60 * 1000;
            // no break
        
        case "h": // hours
            return value * 60 * 60 * 1000;
            // no break
        
        case "d": // days
            return value * 24 * 60 * 60 * 1000;
            // no break
        
        case "M": // months
            return value * 30 * 24 * 60 * 60 * 1000;
            // no break
    }

    return this.parseLifetime(this.defaults.lifetime);
   
};

/**
 * check if a flag is set in the lifetime
 * @param  {string} lifetime
 * @return {Boolean}
 */
CookieManager.prototype.spotFlag = function(lifetime) {

    for (var i = 0; i < this.allowedFlagsForLifetime.length; i++) {
        if (lifetime.indexOf(this.allowedFlagsForLifetime[i]) !== -1) {
            return true;
        }
    }

    return false;
}