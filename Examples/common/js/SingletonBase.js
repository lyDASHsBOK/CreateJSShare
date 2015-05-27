/**
 * Created by lydashsbok on 14-7-11.
 */

goog.provide('bok.SingletonBase');

function SingletonBase() {
    if(!this.constructor._instance_) {
        this.constructor._instance_ = this;
        this.constructor._getInstance_ = function() {
            return new this();
        };
    }

    return this.constructor._instance_;
}
