/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	search: function(req, res) {
    if (!req.session.me) {
      return res.view('index');
    }

    User.findOne(req.session.me, function(err, user) {

      if (err) return res.negotiate(err);

      var history = user.searchHistory;
      history.push(req.param('keyword'));

      User.update(req.session.me, {searchHistory: history}).exec(function(err, updatedUser) {

        if (err) return res.negotiate(err);

        var GOOGLE_API_KEY = 'AIzaSyAbAEugRMkqQFC2PRTs1BvrMDNiUpbicrQ';
        var FORECAST_API_KEY = 'ee17cd367d8f7b705ace75db1bb8efdf'

        var Geocoder  = require('node-geocoder')('google', 'https', {apiKey: GOOGLE_API_KEY});

        var Forecast    = require('forecast.io');
        var forecast    = new Forecast({APIKey: FORECAST_API_KEY});

        Geocoder.geocode(req.param('keyword'), function(err, geocodeRes) {

          // unexpected error occurred
          if (err) return res.negotiate(err);

          // check if we can get some result back
          if (geocodeRes.length == 0) {
            return res.notFound();
          }

          var longitude = geocodeRes[0].longitude;
          var latitude = geocodeRes[0].latitude;

          forecast.get(latitude, longitude, function(err, forecastRes, data) {
            if (err) {
              return res.negotiate(err);
            }

            return res.json({
              keyword: req.param('keyword'),
              history: history,
              src: 'https://www.google.com/maps/embed/v1/place?key=' + GOOGLE_API_KEY + '&q=' + latitude + ", " + longitude,
              data: data.daily.data
            });
          });
        });

      });
    });
  },

  getSearch: function(req, res) {
    console.log('req: ' + req.url)

    var GOOGLE_API_KEY = 'AIzaSyAbAEugRMkqQFC2PRTs1BvrMDNiUpbicrQ';
    var FORECAST_API_KEY = 'ee17cd367d8f7b705ace75db1bb8efdf'

    var Geocoder  = require('node-geocoder')('google', 'https', {apiKey: GOOGLE_API_KEY});

    var Forecast    = require('forecast.io');
    var forecast    = new Forecast({APIKey: FORECAST_API_KEY});

    Geocoder.geocode(req.param('keyword'), function(err, geocodeRes) {

      // unexpected error occurred
      if (err) return res.negotiate(err);

      // check if we can get some result back
      if (res.length == 0) {
        return res.notFound();
      }

      var longitude = geocodeRes[0].longitude;
      var latitude = geocodeRes[0].latitude;

      forecast.get(latitude, longitude, function(err, forecastRes, data) {
        if (err) {
          return res.negotiate(err);
        }

        return res.json({
          keyword: req.param('keyword'),
          data: data.daily.data
        });
      });
    });
  }
};

