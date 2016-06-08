(function() {
    "use strict";

    jQuery.sap.require("sap.ui.model.SimpleType");


    sap.ui.model.SimpleType.extend('sap.ui.model.SimpleType.LevelRisk', {
        formatValue: function(oValue) { // Vista
            if (oValue == 1) {
                return "Muy Baja";
            }
            if (oValue == 2) {
                return "Baja";
            }
            if (oValue == 3) {
                return "Medio";
            }
            if (oValue == 4) {
                return "Alto";
            }
            if (oValue == 5) {
                return "Muy Alto";
            }
            return "";
        },
        parseValue: function(oValue) {
            if (oValue == "Muy Baja") {
                return 1;
            }
            if (oValue == "Baja") {
                return 2;
            }
            if (oValue == "Medio") {
                return 3;
            }
            if (oValue == "Alto") {
                return 4;
            }
            if (oValue == "Muy Alto") {
                return 5;
            }
            return 0;
        },
        validateValue: function(oValue) {
            return true;
        }
    });

})();
