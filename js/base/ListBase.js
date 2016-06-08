(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.ListBase");
    jQuery.sap.require("sap.ui.base.Object");
    sap.ui.base.Object.extend('sap.ui.mw.ListBase', {});
    sap.ui.mw.ListBase.prototype.createList = function(_id, _title, _mode, _oModel, _path, _oListItemTemplate, _eventHandler, _oController) {
        var oList = new sap.m.List(_id, {
            headerText: _title,
            noDataText: "No se encontraron datos",
            mode: _mode,
            itemPress: [_eventHandler, _oController]
        });

        oList.setModel(_oModel);

        oList.bindItems({
            path: _path,
            template: _oListItemTemplate
        });

        return oList;
    };
    sap.ui.mw.ListBase.prototype.createTable = function(_id, _header, _mode, _fields, _fieldsVisibility, _fieldsDemandPopin, _fieldsWidth, _eventHandler, _oController) {
        var oColumn;

        if (_id !== "tblApprovedInd" && _id !== "tblApproved" ) {
            var oTable = new sap.m.Table(_id, {
                headerText: _header,
                noDataText: "No se encontraron datos",
                mode: _mode
            });
        }else{
            var oTable = new sap.m.Table(_id, {
                headerText: _header,
                noDataText: "Exitoso",
                mode: _mode
            });
        }


        if (_eventHandler) {
            oTable.attachItemPress(_eventHandler, _oController);
        }

        if (_fields instanceof Array) {
            for (var i = 0; i < _fields.length; i++) {
                oColumn = new sap.m.Column({
                    header: new sap.m.Label({
                        text: _fields[i]
                    })
                });

                if (_fieldsDemandPopin instanceof Array) {
                    if (_fieldsDemandPopin[i] === true) {
                        oColumn.setMinScreenWidth("48em");
                        oColumn.setDemandPopin(_fieldsDemandPopin[i]);
                    };
                };

                if (_fieldsVisibility instanceof Array) {
                    if (_fieldsVisibility[i] === false) {
                        oColumn.setVisible(_fieldsVisibility[i]);
                    };
                };

                if (_fieldsWidth instanceof Array) {
                    oColumn.setWidth(_fieldsWidth[i]);
                };

                oTable.addColumn(oColumn);
                oColumn = null;
            }
        }

        return oTable;
    };
})();
