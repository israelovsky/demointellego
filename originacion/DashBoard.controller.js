sap.ui.controller("originacion.DashBoard", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf originacion.DashBoard
     */
    getTemplate: function() {
        return '<div class="row">\
                    <div id="idFirstPie" class="col-sm-8" style="height: 250px;" ></div>\
                    <div id="idSecondPie" style=" height: 250px; margin: 0 auto" class="col-sm-4"></div>\
                </div>\
                <div class="row">\
                    <div id="idThirdPie" style=" height: 250px; margin: 0 auto" class="col-sm-4"></div>\
                    <div id="idFourthPie" class="col-sm-4" style=" height: 250px; margin: 0 auto"></div>\
                    <div id="idFifthPie" class="col-sm-4" style=" height: 250px; margin: 0 auto"></div>\
                </div>';
    },
    createChart: function(_idDiv, _title) {

        Highcharts.theme = {
            chart: {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#2a2a2b'],
                        [1, '#3e3e40']
                    ]
                },
                style: {
                    fontFamily: "Arial,Helvetica,sans-serif"
                },
                plotBorderColor: '#606063'
            },
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                }
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'

                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#B0B0B3'
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#707073'
                }
            },

            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },

            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },

            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },

            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            },

            // special colors for some of the
            legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
            background2: '#505053',
            dataLabelsColor: '#B0B0B3',
            textColor: '#C0C0C0',
            contrastTextColor: '#F0F0F3',
            maskColor: 'rgba(255,255,255,0.3)'
        };

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);


        return new Highcharts.Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgba(255, 255, 255,0)'],
                        [1, 'rgba(255, 255, 255,0)']
                    ]
                },
                dataLabels: {
                    color: "red"
                },
                plotShadow: false,
                type: 'pie',
                renderTo: _idDiv
            },
            title: {
                text: _title,
                style: { "color": "#fff", "fontSize": "16px" }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            yAxis: {

                labels: {
                    style: {
                        "color": "red"
                    }
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        style: { "color": "#fff", "fontSize": "12px" }
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Respuestas',
                colorByPoint: true,
                data: [{
                    name: 'A',
                    y: 56.33
                }, {
                    name: 'B',
                    y: 24.03,
                    sliced: true,
                    selected: true
                }, {
                    name: 'C',
                    y: 10.38
                }, {
                    name: 'D',
                    y: 4.77
                }]
            }]
        });
    },
    renderDatabyChart: function(_currentChart, _data) {
        _currentChart.series[0].setData(_data);
    },
    onInit: function() {
        console.log("########## CLIENTE ##########");
        console.log("Estatus: CONECTADO al servidor.");
        var oModel, oPage, oHeader, _self;
        var arrayIDDivs = ["idFirstPie", "idSecondPie", "idThirdPie", "idFourthPie", "idFifthPie"];
        var arrayQuestions = ["Pregunta 1", "Pregunta 2", "Pregunta 3", "Pregunta 4", "Pregunta 5"];
        //var socket = io.connect('http://localhost:1337');
        //var socket = io.connect('http://172.20.200.176:1337');
        //Servicio eexpuesto en Openshift
        var socket = io.connect('http://movilitysap-eliteware.rhcloud.com');
        _self = this;

        socket.on('dashboard', function(data) {
            oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(data);
            var questions = oModel.getProperty("/preguntas");

            for (i = 0; i < arrayIDDivs.length; i++) {
                var tempChart = Highcharts.charts[i];
                var data = [{
                    name: 'A',
                    y: questions[i].a
                }, {
                    name: 'B',
                    y: questions[i].b
                }, {
                    name: 'C',
                    y: questions[i].c
                }, {
                    name: 'D',
                    y: questions[i].d
                }, {
                    name: 'E',
                    y: questions[i].d
                }];
                _self.renderDatabyChart(tempChart, data);
            }
        });

        var ohtml = new sap.ui.core.HTML({
            preferDOM: true,
            content: this.getTemplate()
        });

        oHeader = new sap.m.ObjectHeader({
            title: "Nombre de Usuario",
            intro: "Demostración SAP Mobile Platform",
            responsive: true,
            number: "",
            numberUnit: "",
            numberState: sap.ui.core.ValueState.Success,
            markFavorite: true,
            markFlagged: false,
            showMarkers: true
        })

        oPage = sap.ui.getCore().byId("dashBoardPoll");
        oPage.addContent(oHeader);
        oPage.addContent(ohtml);

        //se crea chart
        setTimeout(function() {
            for (var i = 0; i < arrayIDDivs.length; i++) {
                _self.createChart(arrayIDDivs[i], arrayQuestions[i]);
            };
        }, 1000);
    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf originacion.DashBoard
     */
    onBeforeRendering: function() {},
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf originacion.DashBoard
     */
    onAfterRendering: function() {}
});
