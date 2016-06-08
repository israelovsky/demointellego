(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.applicants.Basic");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase");


    sap.ui.base.Object.extend('sap.ui.mw.forms.applicants.Basic', {});
    sap.ui.mw.forms.applicants.Basic.prototype.createBasicForm = function(_idForm,oController) {
        //Middleware de componentes SAPUI5
        var oInputBase, oActionBase, oDisplayBase, oLayoutBase, oPopupBase, oListBase;
        //Variables para formulario
        var oForm, oFlex, oFlex2,dataGenre,oItemGenre;
        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase   = new sap.ui.mw.InputBase();
        oActionBase  = new sap.ui.mw.ActionBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase  = new sap.ui.mw.LayoutBase();
        oPopupBase   = new sap.ui.mw.PopupBase();
        oListBase    = new sap.ui.mw.ListBase();
        //Se crea formulario
        oForm = oLayoutBase.createForm(_idForm, true, 1, "Básicos");
        //se agregan objetos a formulario
        oForm.addContent(oDisplayBase.createLabel("", "Género*"));
        dataGenre = new sap.ui.model.json.JSONModel("data-map/catalogos/genero.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        oItemGenre = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppGenre","/genero",oItemGenre,dataGenre,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Fecha de Nacimiento*"));
        oForm.addContent(oInputBase.createDatePicker("pickerAppBornDate", "", "", "dd.MM.yyyy"));
        oForm.addContent(oDisplayBase.createLabel("", "Clave de Elector*"));
        oForm.addContent(oInputBase.createInputText("txtppIdCardKey", "Text", "", "", true, true, "^[A-Za-z]{6}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|[1-2][0-9]|3[0-2])(H|M|h|m)[0-9]{3}$").setMaxLength(18));
        oForm.addContent(oDisplayBase.createLabel("", "Registro Electoral*"));
        oForm.addContent(oInputBase.createInputText("txtAppRegisterId", "Number", "", "", true, true, "^[0-9]{13}$").setMaxLength(13));
        oForm.addContent(oDisplayBase.createLabel("", "País de Nacimiento*"));
        var AppCountry = new sap.ui.model.json.JSONModel("data-map/catalogos/pais.json");
        AppCountry.setSizeLimit(300);
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppCountry = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppCountryBorn","/pais",oItemAppCountry,AppCountry,null,null).setEnabled(true));
            var myDialogMaps = sap.ui.getCore().byId("npDialogMaps");


        oForm.addContent(oDisplayBase.createLabel("", "Entidad Federativa de Nacimiento*"));
        var AppEntityBorn = new sap.ui.model.json.JSONModel("data-map/catalogos/entidadNac.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppEntityBorn = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppEntityBorn","/entidad",oItemAppEntityBorn,AppEntityBorn,null,null));
        var AppNationality = new sap.ui.model.json.JSONModel("data-map/catalogos/nationality.json");
        var oItemAppNationality = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oDisplayBase.createLabel("", "Nacionalidad*"));
        oForm.addContent(oInputBase.createSelect("selectAppNationality","/nationality",oItemAppNationality,AppNationality,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Estado Civil*"));
        var AppMaritalStatus = new sap.ui.model.json.JSONModel("data-map/catalogos/civilStatus.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppMaritalStatus = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppMaritalStatus","/eCivil",oItemAppMaritalStatus,AppMaritalStatus,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Hijos*"));
        oForm.addContent(oInputBase.createInputText("txtAppSons", "Number", "", "", true, true, "^[0-9]+$").setMaxLength(2));
        oForm.addContent(oDisplayBase.createLabel("", "Nivel Escolar*"));
        var AppLevelSchool = new sap.ui.model.json.JSONModel("data-map/catalogos/levelSchool.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppLevelSchool = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppLevelSchool","/nivel",oItemAppLevelSchool,AppLevelSchool,null,null));

        oForm.addContent(oDisplayBase.createLabel("", "Tipo de vivienda*"));
        var AppTypeHouse = new sap.ui.model.json.JSONModel("data-map/catalogos/livingPlace.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppTypeHouse = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppTypeHouse","/tipo",oItemAppTypeHouse,AppTypeHouse,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Tipo de Local*"));
        var AppTypeCommerce = new sap.ui.model.json.JSONModel("data-map/catalogos/localType.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppTypeCommerce = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        // oForm.addContent(oInputBase.createSelect("selectAppTypeCommerce","/tipoLocal",oItemAppTypeCommerce,AppTypeCommerce,oController.chanceAppTypeCommerce,oController));
        oForm.addContent(oInputBase.createSelect("selectAppTypeCommerce","/tipoLocal",oItemAppTypeCommerce,AppTypeCommerce,null,null));

        // console.log("el controlador  "  +  oController);
        /*********StartChange DVH 21-04-2016***********/
        /*GAP - El ID de la Clave de la actividad debe ser dato básico - 53*/
        /**********************************************/
        oForm.addContent(oDisplayBase.createTitle("", "Actividad Económica"));
        oForm.addContent(oDisplayBase.createLabel("", "Giro*"));
        var TypeBussines = new sap.ui.model.json.JSONModel("data-map/catalogos/rolAE.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppTypeBussines = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectTypeBussines","/giro",oItemAppTypeBussines,TypeBussines,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Industria o Sector*"));
        oForm.addContent(oInputBase.createComboBox("selectAppIndustry",null,null,null,oController.onChangeIndustry, oController).setEnabled(false));
        oForm.addContent(oDisplayBase.createLabel("", "Actividad económica*"));
        oForm.addContent(oInputBase.createComboBox("selectAppActEconomic",null,null,null,oController.onChangeActEconomic,oController).setEnabled(false));
        oForm.addContent(oDisplayBase.createLabel("", "Clave de actividad económica*"));
        oForm.addContent(oInputBase.createInputText("txtAppKeyActivity", "Text", "0000000", "0000000", true, false));
        /**********************************************/
        /**********EndChange DVH 21-04-2016************/
        /**********************************************/

        oForm.addContent(oDisplayBase.createTitle("", "Datos Directivo Compartamos"));
        oFlex = oLayoutBase.createFlexBox();
        oFlex.addItem(oInputBase.createCheckBox("chkAppDataManagement","",false,true,oController.onSelchkAppDataMagmt,oController));
        oFlex.addItem(oDisplayBase.createLabelHTML("lblAppManagementName", "", "¿Es usted Consejero/Director de grupo Gentera o Familiar de alguno de ellos?"));
        oForm.addContent(oFlex);
        oForm.addContent(oDisplayBase.createLabel("", "Nombre Completo"));
        oForm.addContent(oInputBase.createInputText("txtAppManagementName", "Text", "Ingrese Nombre Completo", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(60));
        oForm.addContent(oDisplayBase.createTitle("", "Datos PEP"));
        oFlex2 = oLayoutBase.createFlexBox();
        oFlex2.addItem(oInputBase.createCheckBox("chkAppDataPEP","",false,true,oController.onSelchkAppDataPEP,oController));
        oFlex2.addItem(oDisplayBase.createLabelHTML("lblAppDataPEP", "", "¿Ocupa usted o alguno de sus familiares puestos de alta relevancia en el Servicio Público?"));
        oForm.addContent(oFlex2);
        oForm.addContent(oDisplayBase.createLabel("", "Nombre Completo"));
        oForm.addContent(oInputBase.createInputText("txtAppPEPName", "Text", "Ingrese Nombre Completo...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(60));
        //oForm.addContent(oDisplayBase.createLabel("", "Apellidos"));
        //oForm.addContent(oInputBase.createInputText("txtAppPEPApellidos", "Text", "Ingresa Apellidos....", "", true, true, "^[A-Za-zÑñ+][\\s[A-Za-zÑñ]+]*$").setMaxLength(60));
        oForm.addContent(oDisplayBase.createLabel("", "Parentesco"));
        // ***PENDIENTE***
        var AppRelation = new sap.ui.model.json.JSONModel("data-map/catalogos/parentescoPEP.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppRelation = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}",
            familiar: "{familiar}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppRelation","/parentescoPEP",oItemAppRelation,AppRelation,null,null));
        oForm.addContent(oInputBase.createInputText("pickerAppBasicDate", "Text", "", "", true, false).setVisible(false));
        return oForm;
    }

})();
