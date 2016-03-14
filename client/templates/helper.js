var handlebarsHelper = {
    ifCond: function(v1, v2, options) {
        return v1 === v2 ? options.fn(this) : options.inverse(this);
    },

    gt: function(v1, v2, options) {
        return v1 > v2 ? options.fn(this) : options.inverse(this);
    },

    toJSON: function(object) {
        return JSON.stringify(object || {});
    },
    isObjectNotNull: function(object, options) {
        var fnTrue=options.fn, fnFalse=options.inverse;
        return (object !== null && object !== 'null') ? fnTrue(this) : fnFalse(this);
    },
    trim: function(text, maxChars, cutWord) {
        var regex = /(<([^>]+)>)/ig;
        text = text.replace(regex, '');
        if (text.length <= maxChars) {
            return text;
        }
        cutWord = cutWord || '';
        return text.substring(0, maxChars) + ' ... ' + cutWord;
    },
    isActive: function(data, condition) {
        return (data === condition) ? 'active' : '';
    },
    getTitle: function (data) {
        return data.title;
    }
};

if (typeof module !== 'undefined') {
    module.exports = handlebarsHelper;
}
