/*
*
* Options:
* - cities: [],
* - moveUp: boolean
*
*please refer http://openweathermap.org/help/city_list.txt for city ids
*/

$(document).ready(function() {
    $("#list").matchAndMove({
        cities: {"Saint Petersburg": 498817, //list of predefined cities's got overwritten with custom list
                "Moscow": 5601538,
                "Prague": 3067696,
                "Norilsk": 1497337,
                },
        moveUp: false //default slide direction's got owerwritten
}).css("color", "blue").matchAndMove({
    cities: {"Saint Petersburg": 498817, //list of predefined cities's got overwritten with custom list
            "Moscow": 5601538,
            "Prague": 3067696,
            "Norilsk": 1497337,
            },
    moveUp: true //default slide direction's got owerwritten
}); //chainable
});

(function($) {
    "use strict";

    $.fn.matchAndMove = function(options) {
        const self = this;
        let ops = $.extend({
                        cities: {
                                "London": 2643743,
                                "Tokyo": 1850147,
                                "Frankfurt am Main": 3220968,
                                },
                        moveUp: true
        }, options);
        let listItems = self.children();
        let matchedCities = [];

        function process(matched) {
            const APIKey = "bf03de8120fbabf27fdd083f9d1fddc0";
            const baseAPICall = "http://api.openweathermap.org/data/2.5/group?id=";
            const metricSystem = "units=metric";       
            const message = " , but who cares?";
            let url = baseAPICall + matched.toString() + "&" + metricSystem + "&&APPID=" + APIKey;
            $.getJSON(url, function(data) {
                $.each(data.list, function(index) {
                    let tailText = " " + data.list[index]["main"]["temp"].toFixed(0) + " degrees in " + data.list[index]["name"] + message;
                    $("#" + data.list[index]["id"]).append(tailText);
                });
            }).fail(function() {
                console.log("Failed to retrieve data from the OpenWeatherMap");
              });
        }

        function clickHandler(li) {
            $(li).on("click", function() {
                $(this).fadeOut(function() {
                    $(this).css("display", "list-item");
                    if (ops.moveUp) {
                        $(this).prependTo(self);
                    } else {
                        $(this).appendTo(self);
                    }
                });
            });
        }

        $.each(ops.cities, function(cityName, cityId) {
            $.each(listItems, function() {
                let match = this.innerText.toLowerCase().includes(cityName.toLowerCase());
                if(match) {
                    matchedCities.push(cityId);
                    this.setAttribute("id", cityId);
                    $(this).off("click");
                    clickHandler(this);
                }
            });
        });
        
        process(matchedCities);
        return self;
    };
}(jQuery));