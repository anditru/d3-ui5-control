sap.ui.loader.config({
	paths: {
		"d3-cloud": "resources/d3-cloud"
	}
});

sap.ui.define([
        "sap/ui/core/UIComponent",
        "aibuzzwords/model/models"
    ],
    function (UIComponent, models) {
        "use strict";

        return UIComponent.extend("aibuzzwords.Component", {
            metadata: {
                manifest: "json"
            },

            init: function () {
                UIComponent.prototype.init.apply(this, arguments);
                this.getRouter().initialize();
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);