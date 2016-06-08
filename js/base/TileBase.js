(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.TileBase");
    jQuery.sap.require("sap.ui.base.Object");

    sap.ui.base.Object.extend('sap.ui.mw.TileBase', {});
    sap.ui.mw.TileBase.prototype.createTileContainer = function(_path, _jsonStructureTile, _oModel, _view, _dataView) {
        var oTileContainer, oStandardTile;
        oTileContainer = new sap.m.TileContainer({});
        oStandardTile = new sap.m.StandardTile(_jsonStructureTile);
        oStandardTile.attachPress(function(evt) {
            var currentItem = evt.getSource().getBindingContext().getObject().option.view;
            var router = sap.ui.core.UIComponent.getRouterFor(_view);
            console.log(evt.getSource().getBindingContext().getObject().option.dashBoardOpt);
            _dataView.dashBoardOpt = evt.getSource().getBindingContext().getObject().option.dashBoardOpt;
            router.navTo(currentItem, _dataView, false);
        });
        oTileContainer.bindAggregation(
            'tiles',
            _path,
            oStandardTile
        );
        oTileContainer.setModel(_oModel);
        return oTileContainer;
    };

    sap.ui.mw.TileBase.prototype.createMenuContainer = function(_path, _jsonStructureTile, _oModel, _view, _dataView) {
    var oTileContainer, oStandardTile, currentItem, router;
        oTileContainer = new sap.m.FlexBox({
             justifyContent : sap.m.FlexJustifyContent.Center,
             alignItems: sap.m.FlexAlignItems.Center,
        }).addStyleClass('box');
        oStandardTile = new sap.m.StandardTile(_jsonStructureTile).addStyleClass("relocateTile");
        oStandardTile.attachPress(function(evt) {
            currentItem = evt.getSource().getBindingContext().getObject().option.view;
            _dataView.dashBoardOpt = evt.getSource().getBindingContext().getObject().option.dashBoardOpt;
            console.log("====================> currentItem");
            console.log(currentItem);
            if(currentItem==="Applicants"){
                _dataView.typeId = evt.getSource().getBindingContext().getObject().option.typeId;
            }
            router = sap.ui.core.UIComponent.getRouterFor(_view);
            router.navTo(currentItem, _dataView, false);
        });
        oTileContainer.bindAggregation(
            'items',
            _path,
            oStandardTile
        );
        oTileContainer.setModel(_oModel);
        return oTileContainer;
    };

})();
