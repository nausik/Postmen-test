'use strict';

export default {
    pluck(array, key) {
        return array.map(o => o[key]);
    },

    trimAndSplit(src) {
        if (typeof src !== "undefined") {
            return src.trim().split(/\s*,\s*/);
        }

        return "";
    },
    arrayToObjectsArray(src, property_name) {
        return src.map(function(el) {
            return {
                [property_name]: el
            };
        });
    },
    objectsArrayToString(src, property_name) {
        return this.pluck(src, property_name).join(',');
    }
}