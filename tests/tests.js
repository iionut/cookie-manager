/**
 * @author Ionut Iosif <iosif.liviu.ionut@gmail.com>
 */

var cookieManager = new CookieManager();
var defaultLifetime = cookieManager.parseLifetime(cookieManager.defaults.lifetime);

/**
 * @covers constructor
 */
QUnit.test('constructor', function(assert) {

    var cMan = new CookieManager(),
        cMan2 = new CookieManager({
            path: '/test-path',
            secure: 'true',
            lifetime: '14d'
        });

    assert.strictEqual(cMan.defaults.lifetime, '0', 'default lifetime is still 0');

    assert.notEqual(cMan.defaults.lifetime, cMan2.defaults.lifetime, 'default lifetime is different when config object is used');

    assert.equal(Boolean(cMan2.defaults.secure), true, 'secure was changed to true');

});

/**
 * @covers CookieManager.spotFlag()
 */
QUnit.test( "spotFlag method", function( assert ) {

    assert.strictEqual(cookieManager.spotFlag("3d"), true, 'flag spotted in lifetime');

    assert.strictEqual(cookieManager.spotFlag("3D"), false, 'flag is case insensitive');

});

/**
 * @covers CookieManager.parseLifetime()
 */
QUnit.test('parseLifetime method', function(assert){

    assert.equal(cookieManager.parseLifetime('30m'), 30 * 60 * 1000, 'lifetime correctly calculated: 30m');

    assert.equal(cookieManager.parseLifetime(), defaultLifetime, 'default lifetime used when no lifetime is passed');

    assert.strictEqual(cookieManager.parseLifetime(15*60*1000), 15*60*1000, 'integer lifetime is used');

    assert.strictEqual(cookieManager.parseLifetime("text"), defaultLifetime, 'default lifetime is used when random string is passed');

    assert.strictEqual(cookieManager.parseLifetime("10000"), 10000, 'string integer will be used if valid');
});

/**
 * @covers CookieManager.getCookies()
 */
QUnit.test('getCookies method', function(assert){

    var allCookies = cookieManager.getCookies();
    assert.strictEqual(typeof allCookies, "object", 'cookies object is returned');
});

/**
 * @covers CookieManager.add()
 */
QUnit.test('add method', function(assert){

    assert.throws(function(){
        cookieManager.add()
    }, Error, 'Error raised when calling add() without obj param');

    assert.throws(function(){
        cookieManager.add({})
    }, Error, 'Error raised when calling add({}) without name key in obj param');

    assert.strictEqual(cookieManager.add({name:'two', value: 'value &^%(nm'}), true, 'cookie is set');
});

/**
 * @covers CookieManager.getCookie()
 */
QUnit.test('getCookie method', function(assert){

    assert.expect(2);

    assert.strictEqual(cookieManager.getCookie("nonexisting cookie"), false, 'false is returned when no cookie is found with a given name');

    assert.strictEqual(cookieManager.getCookie('two'), 'value &^%(nm', 'cookie with name "two" is found');
});

/**
 * @covers CookieManager.getCookieString()
 */
QUnit.test('getCookieString method', function(assert){

    var cString = cookieManager.getCookieString(cookieManager.defaults),
        cString2 = cookieManager.getCookieString({value: 'aa'}),
        cString3 = cookieManager.getCookieString({});

    assert.equal(typeof cString, "string", "result is a string");
    assert.equal(typeof cString2, "string", "result is a string");
    assert.equal(typeof cString3, "string", "result is a string");

    assert.throws(function(){
        cookieManager.getCookieString();
    }, TypeError, 'TypeError raised when called without obj param');
});

/**
 * @covers CookieManager.remove()
 */
QUnit.test('remove method', function(assert) {

    cookieManager.add({name: 'test1', value: 'test1 value'});
    cookieManager.add({name: 'test2', value: 'test2 value', path: '/abc'});

    assert.throws(function() {
        cookieManager.remove();
    }, Error, 'Error raised when called without "name" param');

    assert.strictEqual(cookieManager.remove('test1'), true, 'cookie removed by name');

    //assert.strictEqual(cookieManager.remove('test1', '/abc'), true, 'cookie removed by name and path');
});