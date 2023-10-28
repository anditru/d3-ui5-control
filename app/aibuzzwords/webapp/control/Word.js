sap.ui.define([
	"sap/ui/core/Control",
], function(Control) {
	"use strict";

	return Control.extend("aibuzzwords.control.Word", {
		metadata: {
			properties: {
                text: {type: "string", defaultValue: "text"},
                weight: {type: "string", defaultValue: "weight"},
                color: {type: "sap.ui.core.CSSColor"},
                fontSize: {type: "int"},
                font: {type: "string"},
                xCoordinate: {type: "int"},
                yCoordinate: {type: "int"},
                rotation: {type: "int"},
			}
		},

		renderer: {
			apiVersion: 2,
			render: function(oRm, oControl) {
                oRm.openStart("text", oControl);
                oRm.attr("text-anchor", "middle");
                oRm.attr("transform", `translate(${[oControl.getXCoordinate(), oControl.getYCoordinate()]})rotate(${oControl.getRotation()})`);
                oRm.style("font-size", oControl.getFontSize() + "px");
                oRm.style("font-family", oControl.getFont()),
                oRm.style("fill", oControl.getColor());
				oRm.openEnd();
                oRm.text(oControl.getText());
				oRm.close("text");
			}
		},
	});
});