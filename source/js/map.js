document.addEventListener("DOMContentLoaded", () => {

  function init() {

    function setDevice() {
      const breakPoint = {
        mobile: 320,
        tablet: 768,
        desktop: 1300,
      };

      const documentWidth = document.documentElement.clientWidth;

      if (documentWidth < breakPoint.tablet) {
        return "mobile";
      }

      if (documentWidth < breakPoint.desktop) {
        return "tablet";
      }

      return "desktop";
    }

    const device = setDevice();

    const iconSize = {
      mobile: [62, 53],
      tablet: [124, 106],
      desktop: [124, 106],
    };

    const iconOffset = {
      mobile: [-31, -53],
      tablet: [-62, -106],
      desktop: [-62, -106],
    };

    // const mapZoom = {
    //   mobile: 17,
    //   tablet: 17,
    //   desktop: 17,
    // }

    const mapCenter = {
      mobile: [59.938631, 30.323055],
      tablet: [59.938631, 30.323055],
      desktop: [59.938631, 30.319299],
    };

    const placemarkCoords = [59.938631, 30.323055];

    function createMap(currentDevice) {
      return new ymaps.Map(document.querySelector(".map"), {
        center: mapCenter[currentDevice],
        // zoom: mapZoom[currentDevice],
        zoom: 17,
        controls: []
      })
    }

    function createPlacemark(currentDevice) {
      return new ymaps.Placemark(placemarkCoords, {}, {
        iconLayout: "default#image",
        iconImageHref: "../img/map-pin.png",
        iconImageSize: iconSize[currentDevice],
        iconImageOffset: iconOffset[currentDevice],
      })
    }

    let map = createMap(device);
    let placemark = createPlacemark(device);

    map.geoObjects.add(placemark);

    function actualResizeHandler() {
      map.destroy();

      map = createMap(setDevice());
      placemark = createPlacemark(setDevice());

      map.geoObjects.add(placemark);
    }

    let resizeTimeout = null;

    function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          actualResizeHandler();
        }, 200);
      }
    }

    window.addEventListener("resize", resizeThrottler, false);
  }

  ymaps.ready(init);
});
