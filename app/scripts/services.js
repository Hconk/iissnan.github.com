"use strict";


angular.module("services")
    .factory("douban$", function ($q, $http) {
        var doubanApi = "http://api.douban.com/people/iissnan/collection";
        var params = {
            callback: "JSON_CALLBACK", // REQUIRED for AngularJS JSONP call

            alt: "xd",
            cat: "book",
            status: "reading",
            "max-result": 10
        };

        function get() {
            var deferred = $q.defer();

            $http({method: "jsonp", url: doubanApi, params: params})
                .success(function (response, status) {
                    var data = [];
                    if (response && response.entry) {
                        for (var i = 0; i < response.entry.length; i ++) {
                            var entry = response.entry[i]["db:subject"];
                            data.push({
                                title: entry.title["$t"],
                                href: entry["link"][1]["@href"],
                                image: entry["link"][2]["@href"].replace(/spic/, "lpic")
                            });
                        }
                    }

                    deferred.resolve({ status: 0, data: data});
                })

                .error(function (data, status) {
                    deferred.reject({ status: 1, data: data });
                });

           return deferred.promise;
        }
        
        return {
            get: get
        };
    });
