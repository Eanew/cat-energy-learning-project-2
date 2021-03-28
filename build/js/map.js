"use strict";

document.addEventListener("DOMContentLoaded", function () {
  function init() {
    function setDevice() {
      var breakPoint = {
        mobile: 320,
        tablet: 768,
        desktop: 1300
      };
      var documentWidth = document.documentElement.clientWidth;

      if (documentWidth < breakPoint.tablet) {
        return "mobile";
      }

      if (documentWidth < breakPoint.desktop) {
        return "tablet";
      }

      return "desktop";
    }

    var device = setDevice();
    var iconSize = {
      mobile: [62, 53],
      tablet: [124, 106],
      desktop: [124, 106]
    };
    var iconOffset = {
      mobile: [-31, -53],
      tablet: [-62, -106],
      desktop: [-62, -106]
    };
    var mapCenter = {
      mobile: [59.938631, 30.323055],
      tablet: [59.938631, 30.323055],
      desktop: [59.938631, 30.319299]
    };
    var placemarkCoords = [59.938631, 30.323055];

    function createMap(currentDevice) {
      return new ymaps.Map(document.querySelector(".map"), {
        center: mapCenter[currentDevice],
        zoom: 17,
        controls: []
      });
    }

    function createPlacemark(currentDevice) {
      return new ymaps.Placemark(placemarkCoords, {}, {
        iconLayout: "default#image",
        iconImageHref: "../img/map-pin.png",
        iconImageSize: iconSize[currentDevice],
        iconImageOffset: iconOffset[currentDevice]
      });
    }

    var map = createMap(device);
    var placemark = createPlacemark(device);
    map.geoObjects.add(placemark);

    function actualResizeHandler() {
      map.destroy();
      map = createMap(setDevice());
      placemark = createPlacemark(setDevice());
      map.geoObjects.add(placemark);
    }

    var resizeTimeout = null;

    function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null;
          actualResizeHandler();
        }, 200);
      }
    }

    window.addEventListener("resize", resizeThrottler, false);
  }

  ymaps.ready(init);
});