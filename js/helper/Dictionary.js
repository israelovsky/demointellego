(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.helper.Dictionary");
    jQuery.sap.require("sap.ui.base.Object");

    sap.ui.base.Object.extend('sap.ui.helper.Dictionary', {});

    sap.ui.helper.Dictionary.prototype.oTypes = {
        Customer: "Customer",
        LoanRequest: "LoanRequest",
        Insurance: "Insurance",
        LoanRequestCustomerRelation: "LoanRequestCustomerRelation",
        InsuranceLoanRequestRelationSet: "InsuranceLoanRequestRelationSet",
        CustomerLoanRelationship: "CustomerLoanRelationship",
		GuaranteeLoanRelationship: "GuaranteeLoanRelationship"
    };
    sap.ui.helper.Dictionary.prototype.oDataTypes = {
        Customer: "/CustomerSet",
        LoanRequest: "/LoanRequestSet",
        Insurance: "/InsuranceSet"
    };

    sap.ui.helper.Dictionary.prototype.oMethods = {
        POST: "POST",
        PUT: "PUT",
        GET: "GET"
    };


    sap.ui.helper.Dictionary.prototype.oQueues = {
        Customer: "RequestQueueCustomer",
        LoanRequest: "RequestQueueLoanRequest",
        Insurance: "RequestQueueInsurance"
    };

    sap.ui.helper.Dictionary.prototype.oErrors = {
        Customer: "BusinessErrorCustomer",
        LoanRequest: "BusinessErrorLoanRequest",
        Insurance: "BusinessErrorInsurance",
        Notification:"SystemErrorNotification"
    };

    sap.ui.helper.Dictionary.prototype.oRequestStatus = {
        Initial: "Initial",
        Sent: "Sent",
        Error: "Error",
        BusinessError: "BusinessError"
    };
    sap.ui.helper.Dictionary.prototype.oDataRequest = function(_params) {
        return {
            CustomerSet: {
                pouch: {
                    name: "CustomerSet"
                },
                odata: {
                    name: "CustomerSet",
                    get: {
                        filter: {
                            customer: "$filter=collaboratorID eq '" + _params.promoterID + "'&$expand=AddressSet,PersonalReferenceSet,PhoneSet,ImageSet,EmployerSet",
                            loanRequest: "$filter=loanRequestIdCRM eq '0' and statusId eq 'E0006' and productId eq '"+_params.productID+"' and collaboratorID eq '" + _params.promoterID + "'",
                            BPIdCRM: "$filter=BPIdCRM eq '"  + _params.BPIdCRM  + "'"
                        },

                        expand:"&$expand=AddressSet,PersonalReferenceSet,PhoneSet,ImageSet,EmployerSet"
                    }
                }
            },
            LoanRequestSet: {
                pouch: {
                    name: "LoanRequestSet"
                },
                odata: {
                    name: "LoanRequestSet",
                    get: {
                        filter: "$filter=collaboratorID eq '" + _params.promoterID + "'",
                        expand: "?$expand=CustomerSet,IndividualLoanGuaranteeSet"
                    }
                }
            },
            InsuranceSet: {
                pouch: {
                    name: "InsuranceSet"
                },
                odata: {
                    name: "InsuranceSet",
                    get: {
                        filter: "",
                        expand: ""
                    }
                }
            },
            IndividualLoanGuaranteeSet: {
                pouch: {
                    name: "IndividualLoanGuaranteeSet"
                },
                odata: {
                    name: "IndividualLoanGuaranteeSet",
                    get: {
                        filter: "",
                        expand: ""
                    }
                }
            },
            getRequest: function(_oType) {
                var value = eval("this." + _oType);
                return value;
            }
        }
    };
	
	sap.ui.helper.Dictionary.prototype.oInsurance = {
        duracionMensaje: 4000,
		claveCreditoMujer:"C_GRUPAL_CM",
		claveCreditoComerciante:"C_GRUPAL_CCR",
		claveCreditoIndividual:"C_IND_CI",
		modalidadIndividual:"001",
		modalidadFamiliar: "002",
		tipoBeneficiario: "00001100",
		tipoAseguradoFam: "Z0001100"
    };

})();