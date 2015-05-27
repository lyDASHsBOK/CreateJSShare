/**
 * Created by Xinyi Liu.
 * User: Liu Xinyi
 * Date: 14-5-26
 * Time: 2:41 PM
 * This helper requires JQuery
 */

var AnimateHelper = {
    NAME: {
        NONE: 'null',

        FADE_IN: 'fadeIn',
        FADE_IN_LEFT: 'fadeInLeft',
        FADE_IN_LEFT_BIG: 'fadeInLeftBig',
        FADE_IN_UP: 'fadeInUp',
        FADE_IN_UP_BIG: 'fadeInUpBig',
        FADE_IN_DOWN: 'fadeInDown',
        FADE_IN_DOWN_BIG: 'fadeInDownBig',
        BOUNCE_IN: 'bounceIn',
        BOUNCE_IN_LEFT: 'bounceInLeft'
    },

    ANIMATION_EVENTS: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    /**
     * @param {$Object} elements The elements to be animated.
     * @param {string} animateName The name of animation as in animate.css
     * @param {number} introDelay The time delay before the animation starts, in ms.
     * @param {number} itemDelayRange The time delay range for element to be randomly shown,
     *          e.g. 500 mean any element within collection will have a 0 - 500 ms random delay before shown..
     * */
    fadeInElementListRandom: function(elements, animateName, introDelay, itemDelayRange) {
        var fadeInTimeArray = [];
        var $els = $(elements);
        for(var i=0, l = $els.length; i < l; ++i) {
            fadeInTimeArray[i] = (itemDelayRange / l) * (i + 1);
        }

        AnimateHelper.shuffleArray(fadeInTimeArray);

        $els.each(function(index){
            AnimateHelper.animateOnceWithFadeInDelay(this, animateName, introDelay + fadeInTimeArray[index]);
        });
    },

    /**
     * @param {$Object} elements The elements to be animated.
     * @param {string} animateName The name of animation as in animate.css
     * @param {number} introDelay The time delay before the animation starts, in ms.
     * @param {number} itemDelay The time delay of each element in the show sequence.
     * */
    fadeInElementList: function(elements, animateName, introDelay, itemDelay) {
        $(elements).each(function(index){
            AnimateHelper.animateOnceWithFadeInDelay(this, animateName, introDelay + index * itemDelay);
        });
    },

    /**
     * @param {$Object} element The element to be animated.
     * @param {string} animateName The name of animation as in animate.css
     * @param {number} delay The time delay before showing the element.
     * */
    animateOnceWithFadeInDelay: function(element, animateName, delay) {
        var $e = $(element);
        //remove the same animate in case there is unfinished previous animation
        $e.removeClass('animated ' + animateName);
        $e.css({opacity: 0});
        setTimeout(function(){
            $e.css({opacity: ''});
            AnimateHelper.animateOnce(element, animateName);
        }, delay);
    },

    /**
     * @param {$Object} element The element to be animated.
     * @param {string} animateName The name of animation as in animate.css
     * */
    animateOnceAndShow: function(element, animateName) {
        var $e = $(element);
        $e.show();
        this.animateOnce(element, animateName);
    },

    /**
     * @param {$Object} element The element to be animated.
     * @param {string} animateName The name of animation as in animate.css
     * */
    animateOnceAndHide: function(element, animateName) {
        var $e = $(element);
        $e.one(this.ANIMATION_EVENTS, function(){
            $e.hide();
        });
        this.animateOnce(element, animateName);
    },

    /**
     * @param {$Object} element The element to be animated.
     * @param {string} animateName The name of animation as in animate.css
     * */
    animateOnce: function(element, animateName) {
        var $e = $(element);
        $e.addClass('animated ' + animateName);
        $e.one(this.ANIMATION_EVENTS, function(e){
            e.stopPropagation();
            $e.removeClass('animated ' + animateName);
        });
    },

    /**
     * @param {$Object} element The element to be animated.
     * @param {string} inAnimationName The name of animation as in animate.css
     * @param {number} delay The time delay before showing the element.
     * */
    fadeInStringContent: function(element, inAnimationName, introDelay, itemDelay) {
        var $e = $(element);

        if($('span', $e).length <= 0) {
            var contentStrAry = $e.html().split('');
            $e.html('');

            for(var i = 0; i < contentStrAry.length; ++i) {
                $e.append('<span>'+contentStrAry[i]+'</span>');
            }
        }
        $('span', $e).removeClass();


        AnimateHelper.fadeInElementList($('span', $e), inAnimationName, introDelay, itemDelay);
    },

    shuffleArray: function(array)
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
    }
};
