(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.helper.Schema");
    jQuery.sap.require("sap.ui.base.Object");
    sap.ui.base.Object.extend('sap.ui.helper.Schema', {});


    sap.ui.helper.Schema.prototype.getDataDBName = function() {

        return "dataDB"

    };


    sap.ui.helper.Schema.prototype.getSyncDBName = function() {

        return "syncDB"

    };


    sap.ui.helper.Schema.prototype.getDataDBSchema = function() {
        return [{
            singular: "Customer",
            plural: "CustomerSet",
            relations: {
                LoanRequestSet: {
                    belongsTo: "LoanRequest"
                }
            }
        }, {
            singular: "LoanRequest",
            plural: "LoanRequestSet",
            relations: {

                CustomerSet: {
                    hasMany: "Customer"
                }
            }
        },{
            singular: "CustomerLoanRelationship",
            plural: "CustomerLoanRelationshipSet"
        },
        {
            singular: "GuaranteeLoanRelationship",
            plural: "GuaranteeLoanRelationshipSet",
        },{
            singular:"Insurance",
            plural:"InsuranceSet"
        }

        ];

    }

    sap.ui.helper.Schema.prototype.getSyncDBSchema = function() {
        return [{
            singular: "RequestQueueCustomer",
            plural: "RequestQueueCustomerSet"
        }, {
            singular: "RequestQueueLoanRequest",
            plural: "RequestQueueLoanRequestSet"
        }, {
            singular: "RequestQueueInsurance",
            plural: "RequestQueueInsuranceSet"
        }, {
            singular: "LoanRequestCustomerRelation",
            plural: "LoanRequestCustomerRelationSet"
        }, {
            singular: "InsuranceLoanRequestRelation",
            plural: "InsuranceLoanRequestRelationSet"
        }, {
            singular: "BusinessErrorLoanRequest",
            plural: "BusinessErrorLoanRequestSet"
        }, {
            singular: "BusinessErrorCustomer",
            plural: "BusinessErrorCustomerSet"
        }, {
            singular: "BusinessErrorInsurance",
            plural: "BusinessErrorInsuranceSet"
        },{
            singular: "SystemErrorNotification",
            plural: "SystemErrorNotificationSet"
        }
        ];

    }

})();
