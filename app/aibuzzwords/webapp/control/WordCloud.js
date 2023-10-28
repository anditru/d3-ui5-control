sap.ui.define([
	"sap/ui/core/Control",
    "sap/ui/core/ResizeHandler",
    "sap/ui/core/theming/Parameters",
    "../resources/d3-cloud"
], function(Control, ResizeHandler, ThemingParameters, cloud) {
	"use strict";

	return Control.extend("aibuzzwords.control.WordCloud", {
		metadata: {
			properties: {
                font: {type: "string", defaultValue: "Impact"},
                minFontSize: {type: "int", defaultValue: 10},
                maxFontSize: {type: "int", defaultValue: 60},
                _layout: {type: "object", visibility: "hidden"},
                _layoutComputed: { type: "boolean", defaultValue: false, visibility: "hidden" },
			},
            aggregations: {
                words: {type: "aibuzzwords.control.Word", bindable: "bindable", multiple: true, singularName: "word"},
            },
            defaultAggregation: "words"
		},

        init: function () {
            ResizeHandler.register(this, this._onResize.bind(this));
        },

        exit: function () {
            ResizeHandler.deregister(this);
        },

        _onResize: function () {
            this.setProperty("_layoutComputed", false);
            this.rerender();
        },

        onBeforeRendering: function() {
            if (!this.getProperty("_layoutComputed")) {
                this._setWordFont();
                this._setWordFontSizes();
                this._setWordColors();
                const aPlainWords = this._getPlainWords();
                if (this._isWrongRenderingPhase(aPlainWords)) {
                    return;
                }
                const oParent = this.getParent().getDomRef();
                const iWidth = oParent.clientWidth;
                const iHeight = oParent.clientHeight;
                this._computeLayout(aPlainWords, iWidth, iHeight).then((oLayout) => {
                    this.setProperty("_layoutComputed", true);
                    this.setProperty("_layout", oLayout);
                    this.getWords().forEach((oWord, iWordIndex) => {
                        oWord.setXCoordinate(aPlainWords[iWordIndex].x);
                        oWord.setYCoordinate(aPlainWords[iWordIndex].y);
                        oWord.setRotation(aPlainWords[iWordIndex].rotate);
                    });
                });
            }
		},

        _setWordFont: function() {
            this.getWords().forEach(oWord => oWord.setFont(this.getFont()));
        },

        _setWordFontSizes: function() {
            const aWeights = this.getWords().map(oWord => oWord.getWeight());
            const iMinWeight = Math.min(...aWeights);
            const iMaxWeight = Math.max(...aWeights);
            const iMinFontSize = this.getMinFontSize();
            const iMaxFontSize = this.getMaxFontSize();
            this.getWords().forEach(oWord => {
                const fNormalizedWeight = (oWord.getWeight() - iMinWeight) / (iMaxWeight - iMinWeight);
                const iFontSize = Math.round(fNormalizedWeight * (iMaxFontSize - iMinFontSize) + iMinFontSize);
                oWord.setFontSize(iFontSize);
            }); 
        },

        _setWordColors: function () {
            const aColors = this._getColorArray();
            this.getWords().forEach(oWord => {
                const iColorIndex = Math.floor(Math.random() * (aColors.length + 1));
                oWord.setColor(aColors[iColorIndex]);
            });
        },

        _getColorArray: function() {
            const aColors = [];
            for (let i = 0; i < 12; i++) {
                aColors.push(ThemingParameters.get(`sapUiChart${i}`))
            }
            return aColors;
        },

        _isWrongRenderingPhase(aPlainWords) {
            return aPlainWords.length < 1 || (aPlainWords.length === 1 && isNaN(aPlainWords[0].size));
        },

        _getPlainWords() {
            return this.getAggregation("words").map(oWord => {
                return {
                    text: oWord.getText(),
                    size: oWord.getFontSize(),
                    font: oWord.getFont()
                }
            });
        },
        
        _computeLayout: function (aPlainWords, iWidth, iHeight) {
            return new Promise((resolve) => {
                const oLayout = cloud().size([iWidth, iHeight])
                    .words(aPlainWords)
                    .padding(5)
                    .rotate(() => ~~(Math.random() * 2) * 90)
                    .font(oWord => oWord.font)
                    .fontSize(oWord => oWord.size);
                oLayout.on("end", () => resolve(oLayout));
                oLayout.start();
            });
        },

		renderer: {
			apiVersion: 2,
			render: function(oRm, oControl) {
                const oLayout = oControl.getProperty("_layout");
                if (!oLayout) {
                    return;
                }
        
                oRm.openStart("div", oControl);
                oRm.style("width", "100%");
                oRm.style("height", "100%");
                oRm.style("min-width", "10vh");
                oRm.style("min-height", "10vh");
                oRm.style("max-height", "70vh");
				oRm.openEnd();
                
                oRm.openStart("svg");
                oRm.attr("width", oLayout.size()[0]);
                oRm.attr("height", oLayout.size()[1]);
				oRm.openEnd();
                
                oRm.openStart("g");
                oRm.attr("transform", `translate(${oLayout.size()[0] / 2},${oLayout.size()[1] / 2})`)
				oRm.openEnd();

                oControl.getWords().forEach((oWord) => {
                    oRm.renderControl(oWord);
                });

                oRm.close("g");
                oRm.close("svg")
				oRm.close("div");
			},
		}
	});
});