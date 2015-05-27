/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 14-8-29
 * Time: 下午10:28
 * To change this template use File | Settings | File Templates.
 */

var CONST = {
    GAME_PLAY: {
        SWAP_TIMES_FOR_VIEW_BTN: 1,
        MAX_PLAY_TIMES: 50,
        MAX_ENTER_GRID_TIMES: 10
    },

    UI: {
        BUTTON:{
            CHANGE_VIEW:{x:482, y: 33}
        }
    },
    BOARD: {
        zoomOutSetting: {x:0, y:0, scaleX:0.195, scaleY:0.195},
        pos: {x:10, y:10},
        scaleZoomIn: 1,
        width: 5,
        height:5,
        offsetX:470,
        offsetY:470,
        zoomingDuration:500,
        fadeDuration:200,
        nobody:null
    },
    GRID_SETTINGS: {
        MAIN_BOARD: {
            DASH_BOARD_POS: {x:10, y:10},
            GRID_BOARD_POS: {x:10, y:135}
        },

        DASH_BOARD: {
            DISPLAY: true,
            HEIGHT : 115,
            TOP : 20,
            LEFT : 20,
            MAX_ROW : 2,
            MAX_COLUMN : 3,
            ICON_SPACE_H : 100,
            ICON_SPACE_V : 45
        },

        GRID_BOARD: {
            MAX_ICON_TYPES : 5,
            WIDTH : 5,
            HEIGHT : 5,
            FRAME_WIDTH : 5,
            ANIM_DURATION : 500,
            MOVE_DURATION : 550
        },

        ICON: {
            WIDTH : 90,
            HEIGHT : 90,
            ROUND_CORNER : 10,
            ANIMATION_LENGTH : 500
        },

        ICON_COUNTER: {
            TEXT_POS: {x:45, y:7},
            PLUS_TEXT_FLOAT_HEIGHT: 10
        }
    }
};