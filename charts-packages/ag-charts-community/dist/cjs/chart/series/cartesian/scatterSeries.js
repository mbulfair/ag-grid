"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("../../../scene/selection");
var group_1 = require("../../../scene/group");
var array_1 = require("../../../util/array");
var number_1 = require("../../../util/number");
var linearScale_1 = require("../../../scale/linearScale");
var marker_1 = require("../../marker/marker");
var observable_1 = require("../../../util/observable");
var cartesianSeries_1 = require("./cartesianSeries");
var chartAxis_1 = require("../../chartAxis");
var palettes_1 = require("../../palettes");
var util_1 = require("../../marker/util");
var chart_1 = require("../../chart");
var continuousScale_1 = require("../../../scale/continuousScale");
var ScatterSeries = /** @class */ (function (_super) {
    __extends(ScatterSeries, _super);
    function ScatterSeries() {
        var _this = _super.call(this) || this;
        _this.xDomain = [];
        _this.yDomain = [];
        _this.xData = [];
        _this.yData = [];
        _this.sizeData = [];
        _this.sizeScale = new linearScale_1.LinearScale();
        _this.groupSelection = selection_1.Selection.select(_this.group).selectAll();
        _this.marker = new cartesianSeries_1.CartesianSeriesMarker();
        _this._fill = palettes_1.default.fills[0];
        _this._stroke = palettes_1.default.strokes[0];
        _this._strokeWidth = 2;
        _this._fillOpacity = 1;
        _this._strokeOpacity = 1;
        _this.highlightStyle = {
            fill: 'yellow'
        };
        _this.xKey = '';
        _this.yKey = '';
        _this.xName = '';
        _this.yName = '';
        _this.sizeName = 'Size';
        _this.labelName = 'Label';
        var marker = _this.marker;
        marker.addPropertyListener('shape', function () { return _this.onMarkerShapeChange(); });
        marker.addEventListener('change', function () { return _this.update(); });
        _this.addPropertyListener('xKey', function () { return _this.xData = []; });
        _this.addPropertyListener('yKey', function () { return _this.yData = []; });
        _this.addPropertyListener('sizeKey', function () { return _this.sizeData = []; });
        return _this;
    }
    Object.defineProperty(ScatterSeries.prototype, "fill", {
        get: function () {
            return this._fill;
        },
        set: function (value) {
            if (this._fill !== value) {
                this._fill = value;
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "stroke", {
        get: function () {
            return this._stroke;
        },
        set: function (value) {
            if (this._stroke !== value) {
                this._stroke = value;
                this.scheduleData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "strokeWidth", {
        get: function () {
            return this._strokeWidth;
        },
        set: function (value) {
            if (this._strokeWidth !== value) {
                this._strokeWidth = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "fillOpacity", {
        get: function () {
            return this._fillOpacity;
        },
        set: function (value) {
            if (this._fillOpacity !== value) {
                this._fillOpacity = value;
                this.scheduleLayout();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScatterSeries.prototype, "strokeOpacity", {
        get: function () {
            return this._strokeOpacity;
        },
        set: function (value) {
            if (this._strokeOpacity !== value) {
                this._strokeOpacity = value;
                this.scheduleLayout();
            }
        },
        enumerable: true,
        configurable: true
    });
    ScatterSeries.prototype.onMarkerShapeChange = function () {
        this.groupSelection = this.groupSelection.setData([]);
        this.groupSelection.exit.remove();
        this.update();
        this.fireEvent({ type: 'legendChange' });
    };
    ScatterSeries.prototype.processData = function () {
        var _a = this, xKey = _a.xKey, yKey = _a.yKey, sizeKey = _a.sizeKey, xAxis = _a.xAxis, yAxis = _a.yAxis;
        var data = xKey && yKey && this.data ? this.data : [];
        this.xData = data.map(function (d) { return d[xKey]; });
        this.yData = data.map(function (d) { return d[yKey]; });
        if (sizeKey) {
            this.sizeData = data.map(function (d) { return d[sizeKey]; });
        }
        else {
            this.sizeData = [];
        }
        this.sizeScale.domain = array_1.finiteExtent(this.sizeData) || [1, 1];
        if (xAxis.scale instanceof continuousScale_1.default) {
            this.xDomain = this.fixNumericExtent(array_1.finiteExtent(this.xData), 'x');
        }
        else {
            this.xDomain = this.xData;
        }
        if (yAxis.scale instanceof continuousScale_1.default) {
            this.yDomain = this.fixNumericExtent(array_1.finiteExtent(this.yData), 'y');
        }
        else {
            this.yDomain = this.yData;
        }
        return true;
    };
    ScatterSeries.prototype.getDomain = function (direction) {
        if (direction === chartAxis_1.ChartAxisDirection.X) {
            return this.xDomain;
        }
        else {
            return this.yDomain;
        }
    };
    ScatterSeries.prototype.highlightNode = function (node) {
        if (!(node instanceof marker_1.Marker)) {
            return;
        }
        this.highlightedNode = node;
        this.scheduleLayout();
    };
    ScatterSeries.prototype.dehighlightNode = function () {
        this.highlightedNode = undefined;
        this.scheduleLayout();
    };
    ScatterSeries.prototype.update = function () {
        var _a = this, visible = _a.visible, chart = _a.chart, xAxis = _a.xAxis, yAxis = _a.yAxis;
        this.group.visible = visible;
        if (!xAxis || !yAxis || !visible || !chart || chart.layoutPending || chart.dataPending) {
            return;
        }
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        var xOffset = (xScale.bandwidth || 0) / 2;
        var yOffset = (yScale.bandwidth || 0) / 2;
        var _b = this, data = _b.data, xData = _b.xData, yData = _b.yData, sizeData = _b.sizeData, xKey = _b.xKey, yKey = _b.yKey, sizeScale = _b.sizeScale, marker = _b.marker, fill = _b.fill, stroke = _b.stroke, strokeWidth = _b.strokeWidth, fillOpacity = _b.fillOpacity, strokeOpacity = _b.strokeOpacity, highlightedNode = _b.highlightedNode;
        var MarkerShape = util_1.getMarker(marker.shape);
        var markerFormatter = marker.formatter;
        this.sizeScale.range = [marker.minSize, marker.size];
        var groupSelectionData = xData.map(function (xDatum, i) { return ({
            seriesDatum: data[i],
            x: xScale.convert(xDatum) + xOffset,
            y: yScale.convert(yData[i]) + yOffset,
            size: sizeData.length ? sizeScale.convert(sizeData[i]) : marker.size
        }); });
        var updateGroups = this.groupSelection.setData(groupSelectionData);
        updateGroups.exit.remove();
        var enterGroups = updateGroups.enter.append(group_1.Group);
        enterGroups.append(MarkerShape);
        var groupSelection = updateGroups.merge(enterGroups);
        var _c = this.highlightStyle, highlightFill = _c.fill, highlightStroke = _c.stroke;
        var markerStrokeWidth = marker.strokeWidth !== undefined ? marker.strokeWidth : strokeWidth;
        groupSelection.selectByClass(MarkerShape)
            .each(function (node, datum) {
            var isHighlightedNode = node === highlightedNode;
            var markerFill = isHighlightedNode && highlightFill !== undefined ? highlightFill : marker.fill || fill;
            var markerStroke = isHighlightedNode && highlightStroke !== undefined ? highlightStroke : marker.stroke || stroke;
            var markerFormat = undefined;
            if (markerFormatter) {
                markerFormat = markerFormatter({
                    datum: datum.seriesDatum,
                    xKey: xKey,
                    yKey: yKey,
                    fill: markerFill,
                    stroke: markerStroke,
                    strokeWidth: markerStrokeWidth,
                    size: datum.size,
                    highlighted: isHighlightedNode
                });
            }
            node.fill = markerFormat && markerFormat.fill || markerFill;
            node.stroke = markerFormat && markerFormat.stroke || markerStroke;
            node.strokeWidth = markerFormat && markerFormat.strokeWidth !== undefined
                ? markerFormat.strokeWidth
                : markerStrokeWidth;
            node.size = markerFormat && markerFormat.size !== undefined
                ? markerFormat.size
                : datum.size;
            node.fillOpacity = fillOpacity;
            node.strokeOpacity = strokeOpacity;
            node.translationX = datum.x;
            node.translationY = datum.y;
            node.visible = marker.enabled && node.size > 0;
        });
        this.groupSelection = groupSelection;
    };
    ScatterSeries.prototype.getTooltipHtml = function (nodeDatum) {
        var _a = this, xKey = _a.xKey, yKey = _a.yKey;
        if (!xKey || !yKey) {
            return '';
        }
        var _b = this, tooltipRenderer = _b.tooltipRenderer, xName = _b.xName, yName = _b.yName, sizeKey = _b.sizeKey, sizeName = _b.sizeName, labelKey = _b.labelKey, labelName = _b.labelName, fill = _b.fill;
        var color = fill || 'gray';
        if (tooltipRenderer) {
            return tooltipRenderer({
                datum: nodeDatum.seriesDatum,
                xKey: xKey,
                yKey: yKey,
                sizeKey: sizeKey,
                labelKey: labelKey,
                xName: xName,
                yName: yName,
                sizeName: sizeName,
                labelName: labelName,
                title: this.title,
                color: color
            });
        }
        else {
            var title = this.title || yName;
            var titleStyle = "style=\"color: white; background-color: " + color + "\"";
            var titleHtml = title ? "<div class=\"" + chart_1.Chart.defaultTooltipClass + "-title\" " + titleStyle + ">" + title + "</div>" : '';
            var seriesDatum = nodeDatum.seriesDatum;
            var xValue = seriesDatum[xKey];
            var yValue = seriesDatum[yKey];
            var contentHtml = "<b>" + (xName || xKey) + "</b>: " + (typeof xValue === 'number' ? number_1.toFixed(xValue) : xValue)
                + ("<br><b>" + (yName || yKey) + "</b>: " + (typeof yValue === 'number' ? number_1.toFixed(yValue) : yValue));
            if (sizeKey) {
                contentHtml += "<br><b>" + sizeName + "</b>: " + seriesDatum[sizeKey];
            }
            if (labelKey) {
                contentHtml = "<b>" + labelName + "</b>: " + seriesDatum[labelKey] + "<br>" + contentHtml;
            }
            return titleHtml + "<div class=\"" + chart_1.Chart.defaultTooltipClass + "-content\">" + contentHtml + "</div>";
        }
    };
    ScatterSeries.prototype.listSeriesItems = function (legendData) {
        var _a = this, id = _a.id, data = _a.data, xKey = _a.xKey, yKey = _a.yKey, yName = _a.yName, title = _a.title, visible = _a.visible, marker = _a.marker, fill = _a.fill, stroke = _a.stroke, fillOpacity = _a.fillOpacity, strokeOpacity = _a.strokeOpacity;
        if (data && data.length && xKey && yKey) {
            legendData.push({
                id: id,
                itemId: undefined,
                enabled: visible,
                label: {
                    text: title || yName || yKey
                },
                marker: {
                    shape: marker.shape,
                    fill: marker.fill || fill,
                    stroke: marker.stroke || stroke,
                    fillOpacity: fillOpacity,
                    strokeOpacity: strokeOpacity
                }
            });
        }
    };
    ScatterSeries.className = 'ScatterSeries';
    ScatterSeries.type = 'scatter';
    __decorate([
        observable_1.reactive('layoutChange')
    ], ScatterSeries.prototype, "title", void 0);
    __decorate([
        observable_1.reactive('dataChange')
    ], ScatterSeries.prototype, "xKey", void 0);
    __decorate([
        observable_1.reactive('dataChange')
    ], ScatterSeries.prototype, "yKey", void 0);
    __decorate([
        observable_1.reactive('dataChange')
    ], ScatterSeries.prototype, "sizeKey", void 0);
    __decorate([
        observable_1.reactive('dataChange')
    ], ScatterSeries.prototype, "labelKey", void 0);
    return ScatterSeries;
}(cartesianSeries_1.CartesianSeries));
exports.ScatterSeries = ScatterSeries;
//# sourceMappingURL=scatterSeries.js.map