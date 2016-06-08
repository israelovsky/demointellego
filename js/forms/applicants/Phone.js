(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.applicants.Phone");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase");


    sap.ui.base.Object.extend('sap.ui.mw.forms.applicants.Phone', {});
    sap.ui.mw.forms.applicants.Phone.prototype.createPhoneForm = function(_idForm, oController, oModel, isEdited) {
        //Middleware de componentes SAPUI5
        var oInputBase, oDisplayBase, oLayoutBase,  oForm, oModelTypePhone, oItemTypePhone, oPhoneTypeId,txtAppDgPhone,selectAppTypePhone;
        //Variables para formulario

        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase = new sap.ui.mw.InputBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();

        oModelTypePhone = new sap.ui.model.json.JSONModel("data-map/catalogos/phones.json");

        //Se crea formulario
        oForm = oLayoutBase.createForm(_idForm, true, 1, "");
        oForm.addContent(oDisplayBase.createLabel("", "Teléfono *"));
        txtAppDgPhone=oInputBase.createInputText("txtAppDgPhone", "Tel", "Ingrese LADA+TELEFONO...", "", true, true, "^\\d{10}$").setMaxLength(10);
        oForm.addContent(txtAppDgPhone);
        oForm.addContent(oDisplayBase.createLabel("", "Tipo de Teléfono *"));
        oItemTypePhone = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{type}"
        });

        selectAppTypePhone=oInputBase.createSelect("selectAppTypePhone", "/tipo", oItemTypePhone, oModelTypePhone, null, null);
        oForm.addContent(selectAppTypePhone);

        //{oModelPhone>/phoneNumber}

        if (isEdited) {
            oForm.setModel(oModel, "oModelPhone");
            txtAppDgPhone.setValue(oModel.getProperty('/phoneNumber'));
            oPhoneTypeId = oModel.getProperty('/phoneTypeId');
            selectAppTypePhone.setSelectedKey(oPhoneTypeId);
            //selectAppTypePhone.setEnabled(false);
        }


        //oForm.addContent(oDisplayBase.createLabel("", "Teléfono *"));
        
        //oForm.addContent(oDisplayBase.createLabel("", "Tipo de Teléfono *"));
        
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        
        
        

        return oForm;
    }

})();
