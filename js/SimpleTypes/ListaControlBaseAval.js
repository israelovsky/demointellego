(function() {
    "use strict";

    jQuery.sap.require("sap.ui.model.SimpleType");


    sap.ui.model.SimpleType.extend('sap.ui.model.SimpleType.ListaControlAval', {
        formatValue: function(oValue) { // Vista

            if (typeof sap.ui.getCore().AppContext.IndividualLoanGuaranteeRiskLevel != "undefined") {
                if (sap.ui.getCore().AppContext.IndividualLoanGuaranteeRiskLevel == 0) {
                    return "";
                } else {
                    if (oValue) {
                        return "Aprobado";
                    } else if (oValue === undefined) {
                        return "";
                    } else if (oValue === "") {
                        return "";
                    } else {
                        return "Rechazado";
                    }
                }
            }

            if (sap.ui.getCore().AppContext.bIsCreating) {
                return "";
            }

            if (sap.ui.getCore().AppContext.oCurrentLoanRequest) {

                if (sap.ui.getCore().AppContext.oCurrentLoanRequest == null) {
                    return "";
                } else if (sap.ui.getCore().AppContext.oCurrentLoanRequest.loanRequestIdCRM == "") {
                    return "";
                }

            }


            if (oValue) {
                return "Aprobado";
            } else if (oValue === undefined) {
                return "";
            } else if (oValue === "") {
                return "";
            } else {
                return "Rechazado";
            }
        },
        parseValue: function(oValue) {
            if (oValue == "Aprobado") {
                return true;
            } else if (oValue === undefined) {
                return "";
            } else if (oValue === "") {
                return "";
            } else {
                return false;
            }
        },
        validateValue: function(oValue) {
            return true;
        }
    });


})();
