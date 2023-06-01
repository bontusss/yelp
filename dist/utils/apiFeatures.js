"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var APIFEATURES = /** @class */ (function () {
    function APIFEATURES(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    APIFEATURES.prototype.filter = function () {
        var queryObj = __assign({}, this.queryStr);
        var excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(function (el) { return delete queryObj[el]; });
        var queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$".concat(match); });
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };
    APIFEATURES.prototype.sort = function () {
        if (this.queryStr.sort) {
            var sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
            // sort('price, rating')
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    };
    APIFEATURES.prototype.limitFields = function () {
        if (this.queryStr.fields) {
            var fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    };
    APIFEATURES.prototype.paginate = function () {
        var page = this.queryStr.page * 1 || 1;
        var limit = this.queryStr.limit || 100;
        var skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
    return APIFEATURES;
}());
exports.default = APIFEATURES;
