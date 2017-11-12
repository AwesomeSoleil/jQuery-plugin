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
        cities: {},
        moveUp: true
        }).matchAndMove({
        cities: {
            "Saint Petersburg": 498817,
            "Moscow": 5601538,
            "Prague": 3067696,
            "Norilsk": 1497337,
            },
        moveUp: false
    }).css("color", "#2F4F4F");
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
                        $(this).prependTo($(this)[0]["parentElement"]);
                    } else {
                        $(this).appendTo($(this)[0]["parentElement"]);
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
        if (matchedCities.length > 0) {
            process(matchedCities);
        }
        return this;
    };
}(jQuery));