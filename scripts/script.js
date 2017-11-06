/*
*
* Options:
* - cities: [],
* - moveUp: boolean
*/
$(document).ready(function() {
    $("#list").matchAndMove({cities: ["Moscow", "Washington, DC.", "Saint Petersburg"], moveUp: false}).css("color", "blue");
});

(function($) {
    "use strict";
    $.fn.matchAndMove = function(options) {
        const self = this;
        let ops = $.extend({
            cities: ["Saint Petersburg", "Moscow", "Prague"],
            moveUp: true
        }, options);
        let cities = ops.cities.map(function(cityName) {
            return cityName.toLowerCase();
        });
        const APIKey = "bf03de8120fbabf27fdd083f9d1fddc0";
        const baseAPICall = "http://api.openweathermap.org/data/2.5/weather?q=";
        const metricSystem = "units=metric";
        const message = " , but who cares?";
        let listItems = self.children();
        function animate(li) {
            $(li).click(function() {
                $(this).fadeOut(function() {
                    if (ops.moveUp) {
                        $(this).css("display", "list-item").prependTo(self);
                    } else {
                        $(this).css("display", "list-item").appendTo(self);
                    }
                });
            });
        }
        for (let i = 0; i < cities.length; i ++) {
            for (let j = 0; j < listItems.length; j ++) {
                let listItem = listItems[j];
                let match = listItem.innerText.toLowerCase().includes(cities[i]); // if includes() is not acceptable, switch to indexOf();
                if(match) {
                    let url = baseAPICall + cities[i] + "&" + metricSystem + "&&APPID=" + APIKey;
                    $.getJSON(url, function(data) {
                        let appendText = " " + data["main"]["temp"].toFixed(0) + " degrees in " + data["name"] + message;
                        listItem.innerText += appendText;
                    });
                    animate(listItem);
/*                     $(listItem).click(function() {
                        $(this).fadeOut(function() {
                            if (ops.moveUp) {
                                $(this).css("display", "list-item").prependTo(self);
                            } else {
                                $(this).css("display", "list-item").appendTo(self);
                            }
                        });
                    }); */
                }
            }
        }
        return self;
    };
}(jQuery));