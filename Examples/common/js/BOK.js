goog.provide('bok.BOK');

//reassign Window Event class as BOK event will pollute its name
var DOMEvent = window.Event;

var BOK = {};

BOK.enableTrace = true;
BOK.enableWarning = true;

/**
 * @param {Function} childClass
 * @param {Function} baseClass
 * */
BOK.inherits = function(childClass, baseClass) {
	//do a deep clone to copy over all static var on parent class
	var parentClassClone = BOK.cloneObject(baseClass);
	for(var index in parentClassClone)
		childClass[index] = parentClassClone[index];

	/** @constructor */
	function tempCtor() {}
	tempCtor.prototype = baseClass.prototype;
	childClass.superClass_ = baseClass.prototype;
	childClass.prototype = new tempCtor();
	childClass.prototype.constructor = childClass;
};

/**
 * @param {Function} childClass
 *      Sub class implements the interface
 * @param {Function} interfaceClass
 *      interface class
 *
 * - This function will try to add all functions defined on interface to sub class
 * if a function already exists in sub class, it will be considered as implemented
 * and will not be overwritten.
 * - All functions in interface class must be virtual thus the base implementation
 * of such function should just throw error, as virtual functions should never be
 * invoked.
 * - Unlike BOK.inherits(), there is no change on class constructor when doing
 * implementation of interface.
 * */
BOK.implement = function(childClass, interfaceClass)
{
	for(var index in interfaceClass.prototype)
	{
		if(!childClass.prototype[index])
		{
			childClass.prototype[index] = interfaceClass.prototype[index];
		}
	}
};

BOK.isAndroid = function()
{
    return (navigator.userAgent.toLowerCase().indexOf("android") >-1);
};

BOK.isAndroid31 = function()
{

    return (navigator.userAgent.indexOf("Android 3.1") >-1);
};

BOK.isIPhone = function()
{
    return (navigator.userAgent.toLowerCase().indexOf("iphone") >-1);
};
BOK.isIOS = function()
{
    return (navigator.userAgent.toLowerCase().indexOf("iphone") >-1 || navigator.userAgent.toLowerCase().indexOf("ipad") >-1 || navigator.userAgent.toLowerCase().indexOf("ipod") >-1);
};
BOK.isIPad = function()
{
    return (navigator.userAgent.toLowerCase().indexOf("ipad") >-1);
};
BOK.isFirefox = function()
{
    //console.log("is firefox: "+navigator.userAgent.toLowerCase())
    return (navigator.userAgent.toLowerCase().indexOf("mozilla") >-1);
};
BOK.isWeiXin = function(){
    return (navigator.userAgent.toLowerCase().indexOf("micromessenger") >-1);
};

BOK.quickRound = function(value)
{
    if(value < 0)
    {
        return (value-0.5)|0;
    }
    else
    {
        return (value+0.5)|0;
    }
};

BOK.requestAnimationFrame = function(callBack)
{
	var requestAnimationFrameFunc = window.requestAnimationFrame ||
								    window.mozRequestAnimationFrame ||
								    window.webkitRequestAnimationFrame ||
								    window.msRequestAnimationFrame ||
								    window.oRequestAnimationFrame ||
								    function(callback) { setTimeout(callback, 1000 / 60); };

	requestAnimationFrameFunc.call(window, callBack);
};


/**
 * @param {String} str
 * */
BOK.TRACE_LAST_MSG = '';
BOK.TRACE_LOOPING = false;
BOK.trace = function(str)
{
	if(this.enableTrace)
    {
        if(BOK.TRACE_LAST_MSG == str)
        {
            if(!BOK.TRACE_LOOPING)
            {
                console.log('**BOK.trace():Looping message**  '+str);
                BOK.TRACE_LOOPING = true;
            }
        }
        else
        {
            BOK.TRACE_LAST_MSG = str;
            BOK.TRACE_LOOPING = false;
            console.log(str);
        }
    }
};

BOK.error = function(str)
{
	console.error("ERROR: "+str);
};

BOK.warn = function(str)
{
	if(this.enableWarning)
		console.warn("WARNING: "+str);
};

/**
 * The passed in function may return 'break' to break the iteration process
 *
 * @param {Array|Object} collection target array/map for iteration
 * @param {Function} func function to run on each iterated item with this signature:
 *                  function(item, index){}
 *                  function may return string 'break' to stop current iteration.
 * @param {Object=null} [scope] The scope of function call, if left as null then use collection as scope.
* */
BOK.BREAK = 'break';
BOK.each = function(collection, func, scope)
{
    if(!scope)
        scope = collection;

	if(collection)
	{
        if(BOK.isArray(collection))
        {
            //return directly if no elements to iterate
            var length = collection.length;
            if(length <= 0)
                return;

            for(var i=0; i<length; ++i)
            {
                //this if check to ensure i return to the correct
                //position if there is reduction of array during loop
                //e.g. using of array.splice() during iteration
                if(length > collection.length)
                {
                    i -= length - collection.length;
                    length = collection.length;
                }

                switch(func.call(scope, collection[i], i))
                {
                    case BOK.BREAK:
                        return;
                }
            }
        }
        else if(typeof collection === 'object')
        {
            for(var key in collection)
            {
                switch(func.call(scope, collection[key], key))
                {
                    case BOK.BREAK:
                        return;
                }
            }
        }
	}
};

/**
 * Find and remove object from given collection.
 *
 * @param {Array} collection
 * @param {*} object
 * @return {number} The index of removed item, -1 if not find.
 * */
BOK.findAndRemove = function(collection, object) {
    var index = BOK.findInArray(collection, object);
    if(index >= 0)
        collection.splice(index, 1);

    return index;
};

/**
 * Find object from given collection.
 *
 * @param {Array} collection
 * @param {*} object
 * @return {number} The index of removed item, -1 if not find.
 * */
BOK.findInArray = function(collection, object) {
    for(var i=0; i<collection.length; ++i) {
        if(collection[i] == object) {
            return i;
        }
    }

    return -1;
};

//check is an object is array
BOK.isArray = function(array)
{
    if(Array.isArray)
        return Array.isArray(array);
    else
        return Object.prototype.toString.call( array ) === '[object Array]';
};

/**
 * @param {int} scale The result is 0 to (scale-1) in int value.
 * @return {int}
 * */
BOK.randN = function(scale)
{
	return Math.floor(Math.random() * scale);
};

/**
 * @param {Object} obj
 * @return {String}
 * */
BOK.randObjectProperty = function(obj)
{
	var result = null;
	var count = 0;
	for (var prop in obj)
		if (Math.random() < 1/++count)
			result = prop;
	return result;
};

/**
 * @param {Object} obj
 * @return {*}
 * */
BOK.randObjectContent = function(obj)
{
	return obj[BOK.randObjectProperty(obj)];
};

/**
 * @param {Array} array
 * @return {*}
 * */
BOK.randArrayItem = function(array)
{
	return array[BOK.randN(array.length)];
};

/**
 * Shuffles a provided array, note that the original array WILL be changed during the process.
 * This process is using Fisher–Yates algorithm.
 * @see http://bost.ocks.org/mike/shuffle/
 * @param {Array} array
 * @return {Array}
 * */
BOK.shuffleArray = function(array)
{
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
};

BOK.setInnerText = function(elem, text)
{
	if(elem.innerText != null)
		elem.innerText = text;
	else if(elem.textContent != null)
		elem.textContent = text;
	else
		throw Error('BOK.setInnerText: target element dont support innerText.');
};

/*
* convert relative url to absolute url
* */
BOK.absPath = function(url)
{
	var Loc = location.href;
	Loc = Loc.substring(0, Loc.lastIndexOf('/'));
	while (/^\.\./.test(url)){
		Loc = Loc.substring(0, Loc.lastIndexOf('/'));
		url= url.substring(3);
	}
	return Loc + '/' + url;
};

/**
 * @public add a ClassName to an element
 * */
BOK.addClassName = function(elem, name)
{
	if(!BOK.hasClassName(elem, name))
		elem.className += ' '+name;
};

/**
 * @public remove a ClassName to an element
 * */
BOK.removeClassName = function(elem, name)
{
	var classes = elem.className.split(' ');
	BOK.each(classes, function(className, index){
		if(className == name)
			classes.splice(index, 1);
	});

	elem.className = classes.join(' ');
};

/**
* @public check a ClassName to an element
* */
BOK.hasClassName = function(elem, name)
{
	var classes = elem.className.split(' ');
	var hasClass = false;
	BOK.each(classes, function(className){
		if(className == name)
			hasClass = true;
	});

	return hasClass;
};

/*
* deep clone object
* */
BOK.cloneObject = function(obj)
{
	var clone;
	if (obj && typeof(obj) == 'object')
	{
		if (obj instanceof Array)
		{
			var l = obj.length;
			var cloneAry = new Array(l);
			for (var i = 0; i < l; i++)
			{
				if(obj[i] === obj)
					cloneAry[i] = cloneAry;
				else
					cloneAry[i] = BOK.cloneObject(obj[i]);
			}

			return cloneAry;
		}
		else
		{
			clone = {};
			for (var k in obj)
			{
				if(obj[k] === obj)
					clone[k] = clone;
				else
					clone[k] = BOK.cloneObject(obj[k]);
			}
			return clone;
		}
	}
	else if(typeof(obj) == 'function')
	{
		clone = {};
		for (var k in obj)
		{
			if(obj[k] == obj)
				clone[k] = clone;
			else if(typeof(obj[k]) == 'function')  //only clone 1 level of function as it could be static fun of a class
				clone[k] = obj[k];
			else
				clone[k] = BOK.cloneObject(obj[k]);
		}
		return clone;
	}
	else
		return obj;
};

/**
 * Pad a number with 0 (or given char) on a certain length.
 * @param {number} n The number to be padded
 * @param {number} width The width of final string
 * @param {String=} padWith (optional) The char used for padding, default is 0
 * @return {string}
 * */
BOK.padNumber = function(n, width, padWith) {
    padWith = padWith || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(padWith) + n;
};

