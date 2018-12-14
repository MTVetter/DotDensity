/* Main JavaScript sheet for Project Request Form by Michael Vetter*/
require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/renderers/DotDensityRenderer",
    "esri/Color",
    "esri/dijit/HomeButton",
    "esri/dijit/Legend",
    "esri/renderers/ScaleDependentRenderer",
    "esri/dijit/PopupTemplate",
    "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/domReady!"
], function(Map, FeatureLayer, DotDensityRenderer, Color, HomeButton, Legend, ScaleDependentRenderer, PopupTemplate, SimpleLineSymbol, SimpleRenderer, array, dom){

    var map = new Map("map", {
        center: [-95.444, 29.756],
        zoom: 9,
        minZoom: 9,
        maxZoom: 15,
        basemap: "dark-gray"
    });

    //Add a home button
    var home = new HomeButton({
        map: map
    }, "HomeButton");
    home.startup();

    //Create the Popup Template
    var template = new PopupTemplate({
        title: "Block Group: {Block_Group}",
        description: "The racial makeup: <br><b>{Pop_White}</b> people that are white<br><b>{Pop_Black}</b> people that are black<br><b>{Pop_Hispanic}</b> people that are Hispanic<br><b>{Pop_Asian}</b> people that are Asian<br><b>{Pop_Other}</b> people that are another race"
    });

    //Add the feature layer to the map
    var blockGroups = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Block_Groups/MapServer/0", {
        outFields: ["Pop_White", "Pop_Black", "Pop_Hispanic", "Pop_Asian", "Pop_Other"]
    });

    var blockGroupOutine = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Block_Groups/MapServer/0", {
        outFields: ["Pop_White", "Pop_Black", "Pop_Hispanic", "Pop_Asian", "Pop_Other", "Block_Group"],
        infoTemplate: template
    });

    // map.addLayer(blockGroups);
    map.addLayer(blockGroupOutine);

    var bgRenderer = new SimpleRenderer(
        new SimpleLineSymbol("SimpleLineSymbol.STYLE_SOLID", new Color([192,192,192]), 1.5)
    );

    blockGroupOutine.setRenderer(bgRenderer);

    //Create the dot density renderer
    // var dotDensityRenderer = new DotDensityRenderer({
    //     fields: [{
    //         name: "Pop_White",
    //         color: new Color([0, 128, 255])
    //     }, {
    //         name: "Pop_Black",
    //         color: new Color([0, 255, 0])
    //     }, {
    //         name: "Pop_Hispanic",
    //         color: new Color([255, 204, 153])
    //     }, {
    //         name: "Pop_Asian",
    //         color: new Color([255, 0, 0])
    //     }, {
    //         name: "Pop_Other",
    //         color: new Color([153, 51, 255])
    //     }],
    //     dotValue: 10,
    //     dotSize: 2,
    //     dotShape: "circle",
    //     legendOptions: {
    //         valueUnit: "people"
    //     }
    // });

    // blockGroups.setRenderer(dotDensityRenderer);

    var createRenderer = function(dotValue){
        return new DotDensityRenderer({
            fields: [{
                name: "Pop_White",
                color: new Color([0,128,255])
            }, {
                name: "Pop_Black",
                color: new Color([0,255,0])
            }, {
                name: "Pop_Hispanic",
                color: new Color([255,255,0])
            }, {
                name: "Pop_Asian",
                color: new Color([255,0,0])
            }, {
                name: "Pop_Other",
                color: new Color([186,85,211])
            }],
            dotValue: dotValue,
            dotSize: 2,
            dotShape: "circle",
            legendOptions: {
                valueUnit: "people"
            }
        });
    };

    var rendererInfos = [
        {
            renderer: createRenderer(100),
            maxZoom: 10,
            minZoom: 9
        },{
            renderer: createRenderer(25),
            maxZoom: 11,
            minZoom: 10
        },{
            renderer: createRenderer(10),
            maxZoom: 12,
            minZoom: 11
        },{
            renderer: createRenderer(1),
            maxZoom: 15,
            minZoom: 12
        }
    ];

    var scaleDependentRenderer = new ScaleDependentRenderer({
        rendererInfos: rendererInfos
    });
    blockGroups.setRenderer(scaleDependentRenderer);
    map.addLayer(blockGroups);

    //Create an alias for the fields being mapped so that it displays nicely in the legend
    blockGroups.on("load", function(e){
        array.forEach(e.layer.fields, function(field){
            if (field.alias === "Pop_White"){
                field.alias = "White Population";
            } else if (field.alias === "Pop_Black") {
                field.alias = "Black Population";
            } else if (field.alias === "Pop_Hispanic"){
                field.alias = "Hispanic Population";
            } else if (field.alias === "Pop_Asian"){
                field.alias = "Asian Population";
            } else if (field.alias === "Pop_Other"){
                field.alias = "Other Population";
            }
        });
    });

    //Create a legend for the dots
    var legend = new Legend({
        map: map,
        layerInfos: [
            {
                layer: blockGroups,
                title: "Population by Race"
            }
        ]
    }, "legend");
    legend.startup();
})
