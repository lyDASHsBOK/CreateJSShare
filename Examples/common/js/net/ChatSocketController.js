/**
 * Created by lys.
 * User: Liu Xinyi
 * Date: 14-6-16
 * Time: 下午3:24
 * Write the description in this section.
 */

goog.provide("net.ChatSocketController");
goog.require("net.DecoratedSocketController");

BOK.inherits(ChatSocketController, DecoratedSocketController);


function ChatSocketController() {
    DecoratedSocketController.call(this);
}

ChatSocketController.EVENT = {
    CONNECTED: 'connected',
    CHAT_MSG: 'chatMsg',
    PRIVATE_CHAT_MSG: 'privateChatMsg',
    USER_LIST: 'userList',
    USER_JOIN: 'userJoin',
    USER_LEFT: 'userLeft'
};

/**
 * @param {Object} data User info, in format:
 *  {
 *      id: {number}
 *      name: {string}
 *      avatar: {string}
 *      sex: {string}
 *  }
 * */
ChatSocketController.prototype.connectToChat = function(data) {
    if(data) {
        this.socket_.emit('enterchat', data);
    }
};

/**
 * @param {number} id
 * @param {string} msg
 * */
ChatSocketController.prototype.sendChatMsg = function(id, msg) {
    this.socket_.emit('postchatmsg', {id: id, msg: msg});
};

/**
 * @param {number} id
 * @param {number} targetId
 * @param {string} msg
 * */
ChatSocketController.prototype.sendPrivateChatMsg = function(id, targetId, msg) {
    this.socket_.emit('postprivatechatmsg', {id: id, receiverId:targetId, msg: msg});
};

/**
 * @override
 */
ChatSocketController.prototype.onConnect = function() {
    this.socket_.emit('init', {types:['chat']});
};


ChatSocketController.prototype.onConnectionReady = function(data) {
    if(data[0] == 'chat'){
        this.socket_.emit('login', {channel:222, name:'guest.'+BOK.randN(1000)});
        this.dispatchEvent(new Event(ChatSocketController.EVENT.CONNECTED, data));
    }
};
/**
 * socket event listener
 * @param {Object} data chat message, in format:
 *  {
 *      id: {number}
 *      msg: {string}
 *  }
 */
ChatSocketController.prototype.onChatMsg = function(data) {
    this.dispatchEvent(new Event(ChatSocketController.EVENT.CHAT_MSG, data));
};
/**
 * socket event listener
 * @param {Object} data chat message, in format:
 *  {
 *      id: {number}
 *      receiverId: {number}
 *      msg: {string}
 *  }
 */
ChatSocketController.prototype.onPrivateChatMsg = function(data) {
    this.dispatchEvent(new Event(ChatSocketController.EVENT.PRIVATE_CHAT_MSG, data));
};
/**
 * socket event listener
 * @param {Object} data User info
 *  {
 *      id: { id:{number}, name:{string}, sex:{string}, avatar:{string}, }
 *  }
 */
ChatSocketController.prototype.onUserList = function(data) {
    this.dispatchEvent(new Event(ChatSocketController.EVENT.USER_LIST, data));
};
/**
 * socket event listener
 * @param {Object} data User info
 *  { id:{number}, name:{string}, sex:{string}, avatar:{string} }
 *
 */
ChatSocketController.prototype.onUserJoin = function(data) {
    this.dispatchEvent(new Event(ChatSocketController.EVENT.USER_JOIN, data));
};
/**
 * socket event listener
 * @param {number} data User id
 *
 */
ChatSocketController.prototype.onUserLeft = function(data) {
    this.dispatchEvent(new Event(ChatSocketController.EVENT.USER_LEFT, data));
};

