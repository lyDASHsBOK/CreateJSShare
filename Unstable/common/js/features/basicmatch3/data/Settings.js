/**
 * @author lys.BOK
 * Date: 13-10-4
 * Time: 上午12:15
 *
 * File over view.
 */
goog.provide("bok.features.basicmatch3.data.Settings");


bok.features.basicmatch3.data.Settings = {
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
        WIDTH : 8,
        HEIGHT : 8,
        FRAME_WIDTH : 5,
        ANIM_DURATION : 900,
        MOVE_DURATION : 950
    },

    ICON: {
        WIDTH : 40,
        HEIGHT : 40,
        ROUND_CORNER : 3,
        ANIMATION_LENGTH : 500
    },

    ICON_COUNTER: {
        TEXT_POS: {x:45, y:7},
        PLUS_TEXT_FLOAT_HEIGHT: 10
    }
};