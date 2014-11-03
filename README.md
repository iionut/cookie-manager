#README# 

Javascript library to easily manage cookies.

##How to##

####Set up the manager####
After loading the JS file into the web page a _CookieManager_ object has to be instantiated. There are 2 ways of doing this:

1. var manager = new CookieManager().
 In this case, every time a cookie is created/deleted/fetched the manager will use it's default settings:
>  - cookie name: "",
>  - cookie value: "",
>  - cookie lifetime: "0",
>  - cookie path: "/",
>  - cookie domain: "",
>  - cookie is secure: false.

2. The second way of instantiating the object is by passing a json object on instantiation. The object can have as keys any of the default settings. By using this way, the defaults are overridden.

#####Cookie lifetime#####
The lifetime can be set using one of 5 available flags appended to a number:

- 120s => 120 seconds
- 15m  => 15 minutes
- 10h  => 10 hours
- 7d   => 7 days
- 6M   => 6 months

or it can be set like an integer: 1800000 (30 minutes) or like "1800000".

####Create a cookie#### 

> manager.add({"name": "cookie name", "value": "cookie value", "lifetime":"15d", "path": "/admin", "domain": ".example.com", "secure": true}); 

When adding a cookie the name of the cookie is mandatory. If no other parameters are set then the defaults are used.

####Get a cookie####
> manager.getCookie("cookie name");

The result will be a string representing the value of the cookie or FALSE if a cookie with that name is not set.

####Delete a cookie####
> manager.remove({"name": "cookie name", "path": "cookie path"});

Only the cookie name is mandatory for removal.

####Get all cookies####
> manager.getCookies();

Returns an object with all the cookies set for the current path and domain.
