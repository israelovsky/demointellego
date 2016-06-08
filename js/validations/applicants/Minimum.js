(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.validations.applicants.Minimum");
    jQuery.sap.require("sap.ui.base.Object");
    sap.ui.base.Object.extend('sap.ui.mw.validations.applicants.Minimum', {});
    sap.ui.mw.validations.applicants.Minimum.prototype.validateMinimum = function() {
              var currentClass,validationError, oInputBase, selectAppStProspectValidate,validationTab;

              oInputBase = new sap.ui.mw.InputBase();

              currentClass = this;

              //try {
              validationError = 0;
              //
              selectAppStProspectValidate = sap.ui.getCore().byId("selectAppStProspect").getSelectedKey();

              //Valida campos de tab nombre
              if (!oInputBase.validationForForm("txtAppFirstName", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppSecondName", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.validationForForm("txtAppLastName", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppSurname", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.validationForForm("selectAppProduct", "Select").type) {
                  validationError++;
              }
              // console.log("aca ponomos validacion " + selectAppStProspectValidate);
              if (selectAppStProspectValidate === "E0002" || selectAppStProspectValidate === "E0005") {
                  // console.log("aca ponomos validacion " + selectAppStProspectValidate);
                  if (sap.ui.getCore().byId("selectAppReason").getSelectedKey() === "000") {
                      sap.ui.getCore().byId("selectAppReason").removeStyleClass("statusSuccesValue");
                      sap.ui.getCore().byId("selectAppReason").addStyleClass("statusErrorValue");
                      validationError++;
                  } else {
                      sap.ui.getCore().byId("selectAppReason").removeStyleClass("statusErrorValue");
                      sap.ui.getCore().byId("selectAppReason").addStyleClass("statusSuccesValue");
                  }
              }

              if (selectAppStProspectValidate === "E0004") {
                  console.log("entrando a contactar posteriormente");

                  if (sap.ui.getCore().byId("pickerAppContact").getValue() === "") {
                      !oInputBase.validationForForm("pickerAppContact", "Input");
                      console.log("con error en fecha");
                      validationError++;
                  } else {
                      if (!oInputBase.checkStatusValue("pickerAppContact", "Input").type) {
                          console.log("falta poner fecha correcta");
                          validationError++;
                      }
                  }
                  if (sap.ui.getCore().byId("appTimeContect").getValue() === "") {
                      !oInputBase.validationForForm("appTimeContect", "Input");
                      console.log("con error en hora");
                      validationError++;
                  } else {
                      if (!oInputBase.checkStatusValue("appTimeContect", "Input").type) {
                          console.log("falta poner hora correcta");
                          validationError++;
                      }
                  }

              }

              if (!oInputBase.validationForForm("txtNpRol", "Input").type) {
                  validationError++;
              }
              jQuery.sap.require("js.validations.applicants.Basic");
              var basic = new sap.ui.mw.validations.applicants.Basic();
              var fnValidatePhoneAndAddr = basic.validatePhoneAndAddr();
              if (!fnValidatePhoneAndAddr.flagValidate) {
                  validationError++;
                  validationTab=fnValidatePhoneAndAddr.validationTab;
              }
              var fnValidateMaritalStatus = basic.validateMaritalStatus();
              if (!fnValidateMaritalStatus.flagValidate) {
                  validationError++;
                  validationTab=fnValidateMaritalStatus.validationTab;
              }
              var fnValidateEmployment = basic.validateEmployment();
              if (!fnValidateEmployment.flagValidate) {
                  validationError++;
                  validationTab=fnValidateEmployment.validationTab;
              }
              if (sap.ui.getCore().byId("selectAppTypeCommerce") && sap.ui.getCore().byId("selectAppTypeCommerce").getSelectedKey() === '001') {
                  if (!sap.ui.getCore().byId("selectAppLocal")) {
                      validationTab = "itfApplicants5";
                      sap.m.MessageToast.show("Captura ¿El local es?");
                      oInputBase.validationForForm("selectAppLocal", "Select");
                      validationError++;
                  } else {
                      if (!oInputBase.validationForForm("selectAppLocal", "Select").type) {
                          validationTab = "itfApplicants5";
                          sap.m.MessageToast.show("Captura ¿El local es?");
                          validationError++;
                      };
                  };
              };
              if (sap.ui.getCore().byId("chkAppDataManagement")) {
                  if (sap.ui.getCore().byId("chkAppDataManagement").getSelected()) {
                      if (!oInputBase.validationForForm("txtAppManagementName", "Input").type) {
                          validationError++;
                      }
                  }
              }
              if (sap.ui.getCore().byId("chkAppDataPEP")) {
                  if (sap.ui.getCore().byId("chkAppDataPEP").getSelected()) {
                      if (!oInputBase.validationForForm("txtAppPEPName", "Input").type) {
                          validationError++;
                      }
                      if (!oInputBase.validationForForm("selectAppRelation", "Select")) {
                          validationError++;
                      }
                  }
              }
              if (sap.ui.getCore().byId("pickerAppBornDate") != null) {

                  if (sap.ui.getCore().byId("pickerAppBornDate").getDateValue() != null) {
                      var birthday = sap.ui.getCore().byId("pickerAppBornDate").getDateValue();
                      console.log(birthday.getTime());

                      var currentDate = new Date();
                      var currentDay = currentDate.getDate();
                      var currentMonth = currentDate.getMonth();
                      var birthdayDay = birthday.getDate();
                      var birthdayMonth = birthday.getMonth();

                      console.log(currentDay);
                      console.log(currentMonth);
                      console.log(currentDay + "-" + currentMonth);
                      currentDate = currentDay + "-" + currentMonth;
                      console.log(birthdayDay);
                      console.log(birthdayMonth);
                      console.log(birthdayDay + "-" + birthdayMonth);
                      var currentBirthDay = birthdayDay + "-" + birthdayMonth;
                      //console.log(birthday.getDate());

                      var ageDifMs = Date.now() - birthday.getTime();
                      var ageDate = new Date(ageDifMs);
                      var oYears = Math.abs(ageDate.getUTCFullYear() - 1970);
                      console.log("=====================> revisión date");
                      console.log(ageDifMs);
                      console.log(ageDate);
                      console.log(oYears);

                      if (sap.ui.getCore().byId("selectAppProduct") != null) {
                          var oProduct = sap.ui.getCore().byId("selectAppProduct").getSelectedKey();
                          console.log(oProduct);
                          if (oProduct === 'C_GRUPAL_CCR') {
                              console.log(oYears);
                              if (oYears >= 20 && oYears <= 75) {
                                  if (oYears === 76) {
                                      if (currentDate === currentBirthDay) {
                                          sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Error);
                                          setTimeout(function() {
                                              sap.m.MessageToast.show("Para el producto crédito comerciante el rango de edad es de 20 a 75 años.");
                                          }, 3000);

                                          validationError++;
                                      } else {
                                          sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Success);
                                      }
                                  } else {
                                      sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Success);
                                  }
                              } else {
                                  console.log("Comercial Error");
                                  sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Error);
                                  setTimeout(function() {
                                      sap.m.MessageToast.show("Para el producto crédito comerciante el rango de edad es de 20 a 75 años.");
                                  }, 3000);


                                  validationError++;
                              }
                          } else if (oProduct === 'C_IND_CI') {
                              console.log(oYears);
                              if (oYears >= 23 && oYears <= 70) {
                                  if (oYears === 71) {
                                      if (currentDate === currentBirthDay) {
                                          sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Error);
                                          setTimeout(function() {
                                              sap.m.MessageToast.show("Para el producto crédito individual el rango de edad es de 23 a 70 años.");
                                          }, 3000);
                                          validationError++;
                                      } else {
                                          sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Success);
                                      }
                                  } else {
                                      sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Success);
                                  }
                              } else {
                                  console.log("Individual Error");
                                  sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Error);
                                  setTimeout(function() {
                                      sap.m.MessageToast.show("Para el producto crédito individual el rango de edad es de 23 a 70 años.");
                                  }, 3000)

                                  validationError++;
                              }
                          } else if (oProduct === 'C_GRUPAL_CM') {
                              console.log(oYears);
                              if (oYears >= 18 && oYears <= 98) {
                                  if (oYears === 99) {
                                      if (currentDate === currentBirthDay) {
                                          sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Error);
                                          setTimeout(function() {
                                              sap.m.MessageToast.show("Para el producto crédito mujer el rango de edad es de 18 a 98 años.");
                                          }, 3000);

                                          validationError++;
                                      } else {
                                          sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Success);
                                      }
                                  } else {
                                      sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Success);
                                  }
                                  //sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Success);
                              } else {
                                  console.log("Mujer Error");
                                  sap.ui.getCore().byId("pickerAppBornDate").setValueState(sap.ui.core.ValueState.Error);
                                  setTimeout(function() {
                                      sap.m.MessageToast.show("Para el producto crédito mujer el rango de edad es de 18 a 98 años.");

                                  }, 3000);
                                  validationError++;
                              }
                          }
                      }
                  }
              }

              //validacion de género respecto al producto
              if (sap.ui.getCore().byId("selectAppGenre") != null) {
                  var oGender = sap.ui.getCore().byId("selectAppGenre").getSelectedKey();
                  var oProduct = sap.ui.getCore().byId("selectAppProduct").getSelectedKey();

                  if ((oProduct === "C_GRUPAL_CM") && (oGender === "2")) {
                      var genderField = sap.ui.getCore().byId("selectAppGenre");
                      genderField.addStyleClass("statusErrorValue");
                      setTimeout(function() {
                          sap.m.MessageToast.show("El género no corresponde con el tipo de producto.");
                      }, 3000);
                      //sap.m.MessageToast.show("El género no corresponde con el tipo de producto.");
                      validationError++;
                  } else {
                      var genderField = sap.ui.getCore().byId("selectAppGenre");
                      genderField.addStyleClass("statusSuccesValue");
                  }
              }
              if (sap.ui.getCore().byId("rbGroupOption")) {
                  if (sap.ui.getCore().byId("rbGroupOption").getSelectedButton().getText() === 'Si') {
                      if (!oInputBase.validationForForm("txtAppKeyRFC", "Input").type) {
                          validationError++;
                      };
                      if (!oInputBase.validationForForm("txtAppNumFIEL", "Input").type) {
                          validationError++;
                      };
                      if (!oInputBase.validationForForm("txtAppCURP", "Input").type) {
                          validationError++;
                      };
                  } else if (sap.ui.getCore().byId("rbGroupOption").getSelectedButton().getText() === 'No') {
                      if (!oInputBase.checkStatusValue("txtAppCURP", "Input").type) {
                          validationError++;
                      };

                  };
              };
              //basic fiel status value
              if (!oInputBase.checkStatusValue("txtppIdCardKey", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppRegisterId", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("pickerAppBornDate", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppSons", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppManagementName", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppPEPName", "Input").type) {
                  validationError++;
              }
              //complementary fiel status value
              if (!oInputBase.checkStatusValue("txtAppKeyRFC", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppNumFIEL", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppCURP", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppDependents", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppEmail", "Input").type) {
                  validationError++;
              }
              if (!oInputBase.checkStatusValue("txtAppSalary", "Input").type) {
                  validationError++;
              }
              if (sap.ui.getCore().byId("selectAppStProspect").getSelectedKey() === "E0006") {
                  var fnValidarStProcesoOrigin = currentClass.validarStProcesoOrigin();
                  if (fnValidarStProcesoOrigin.validationError > 0) {
                      validationTab = fnValidarStProcesoOrigin.validationTab;
                      validationError++;
                  }
              }
              //valida adicionales
              jQuery.sap.require("js.validations.applicants.Additional");
              var additional = new sap.ui.mw.validations.applicants.Additional();
              var fnAdditional = additional.validateAdditional();
              if (!fnAdditional.flagValidate) {
                  validationError++;
                  validationTab = fnAdditional.validationTab;
              }
              if (validationError !== 0) {
                  return {"flagValidate" : false , "validationTab" : validationTab};
              } else {
                  return {"flagValidate" : true , "validationTab" : validationTab};
              }

    }; // fin validateAdditional
    sap.ui.mw.validations.applicants.Minimum.prototype.validarStProcesoOrigin = function() {
        var currentClass, validationError,validationTab;
        currentClass = this;
        validationError = 0;
            //Valida campos obligatorios de basicos
            if (!oInputBase.validationForForm("selectAppGenre", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("pickerAppBornDate", "Input").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("txtppIdCardKey", "Input").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("txtAppRegisterId", "Input").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppCountryBorn", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppEntityBorn", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppNationality", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppMaritalStatus", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppLevelSchool", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppTypeHouse", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppTypeCommerce", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("txtAppSons", "Input").type) {
                validationError++;
            }
            /*********StartChange DVH 21-04-2016***********/
            /*GAP - El ID de la Clave de la actividad debe ser dato básico - 53*/
            /**********************************************/
            if (!oInputBase.validationForForm("selectTypeBussines", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppIndustry", "Select").type) {
                validationError++;
            }
            if (!oInputBase.validationForForm("selectAppActEconomic", "Select").type) {
                validationError++;
            }
            /**********************************************/
            /*********EndChange DVH 21-04-2016*************/
            /**********************************************/

            var currentModelDocuments = sap.ui.getCore().getModel("oModelDocuments");

            if (currentModelDocuments){
                var oModel = sap.ui.getCore().getModel("oModelDocuments").getProperty("/results");
                var documentStatsTextu = '';
                var docId = "";
                var documentStatusId = "";
              if (Object.keys(oModel).length === 0) {
                  validationError++;
                  validationTab = "navToDocuments";
              }else {
                  $.each(oModel, function() {
                      documentStatsTextu = this.documentStatusText;
                      docId = this.documentId;
                      documentStatusId = this.documentStatusId;
                      if ((documentStatusId !== "ZP1") && (documentStatsTextu != "Documento Capturado") && (documentStatusId !== "ZA1") && (documentStatusId !== "ACE")) {
                          if (docId !== "IMN") {
                              validationError++;
                              validationTab = "navToDocuments";
                          }
                      }
                  });
              } // fin else if (oModel.length === "0") {
            } else {
                validationError++;
                validationTab = "navToDocuments";
            }

            return {"validationError" : validationError , "validationTab" : validationTab};
    };
})();
