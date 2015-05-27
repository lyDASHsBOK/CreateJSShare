/*! UIkit 2.7.1 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-layermask", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }

})(function($, UI){

    UI.component('layermask', {

        defaults: {
            // template
            modal: null,
            template: '<div id="my-id" class="uk-modal example-item">'+
                '<div class="uk-modal-dialog widget-container boxed">'+
                    '<a class="uk-modal-close uk-close"></a>'+
                    '<div class="inner">'+
                        '<h1 class="uk-modal-title"></h1>'+
                        '<p class="uk-modal-p"></p>'+
                    '</div>'+
                '</div>'+
                '<div class="modalBlock"></div>'+
            '</div>'
        },

        callback: null,

        init: function() {
            var $this   = this;
            this.template = this.find('script[type="text/layermask"]').html();
            this.template = UI.Utils.template(this.template || this.options.template);
            $this.element.append(this.template);
             
            this.modal = UI.modal($(".uk-modal", $this.element));
            this.modal.on({
                'uk.modal.hide': function(){ $this.onModalHide_.call($this); }
            });            
        },
        /**
         * @param {Object} obj show modal display and options, in format:
         *  {
         *      modalBlock: {string}        //
         *      title: {string}
         *      message: {string}
         *  }
         * @param {function} callback hide modal callback.         
         * */                
        show: function(obj, callback) {  
            if(obj.modalBlock){
                $('.uk-modal-dialog .uk-modal-close').css({display: 'none'});
                $('.uk-modal .modalBlock').css({display: ''});
            } else{
                $('.uk-modal-dialog .uk-modal-close').css({display: ''});
                $('.uk-modal .modalBlock').css({display: 'none'});
            }
            $('.uk-modal-title').html(obj.title);
            $('.uk-modal-p').html(obj.message);            
            this.modal.show();
            this.callback = callback;
        },
        hide: function() {
            this.modal.hide();
        },
        onModalHide_: function(){
            if('function' == typeof this.callback)
                this.callback();
        },
        getUkModal: function(){
            return this.modal;
        }


    });

    // init code
    $(document).on("focus.layermask.uikit", "[data-uk-layermask]", function(e) {

        var ele = $(this);
        if (!ele.data("layermask")) {
            var obj = UI.layermask(ele, UI.Utils.options(ele.attr("data-uk-layermask")));
        }
    });

    return UI.layermask;
});
