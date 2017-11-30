// Inspired by https://raw.githubusercontent.com/ValentinMinder/Swisstopo-WGS84-LV03/master/scripts/js/wgs84_ch1903.js

/**
 * Converts CH1903(+) to Latitude
 * @param y
 * @param x
 * @return {number}
 * @constructor
 */
const CHtoWGSlat = (y, x) => {
    // Converts military to civil and to unit = 1000km
    // Auxiliary values (% Bern)
    const yAux = (y - 600000) / 1000000
    const xAux = (x - 200000) / 1000000

    // Process lat
    const lat = 16.9023892 +
        (3.238272 * xAux) -
        (0.270978 * Math.pow(yAux, 2)) -
        (0.002528 * Math.pow(xAux, 2)) -
        (0.0447 * Math.pow(yAux, 2) * xAux) -
        (0.0140 * Math.pow(xAux, 3))

    // Unit 10000" to 1" and converts seconds to degrees (dec)
    return lat * 100 / 36
}

/**
 * Converts CH1903(+) to Longitude
 * @param y
 * @param x
 * @return {number}
 * @constructor
 */
const CHtoWGSlng = (y, x) => {
    // Auxiliary values (% Bern)
    const yAux = (y - 600000) / 1000000
    const xAux = (x - 200000) / 1000000

    // Process lng
    const lng = 2.6779094 +
        (4.728982 * yAux) +
        (0.791484 * yAux * xAux) +
        (0.1306 * yAux * Math.pow(xAux, 2)) -
        (0.0436 * Math.pow(yAux, 3))

    // Unit 10000" to 1 " and converts seconds to degrees (dec)
    return lng * 100 / 36
}

/**
 * Convert CH1903(+) to WGS84 (Latitude/Longitude)
 * @param y
 * @param x
 */
export default (y, x) => [
    CHtoWGSlat(y, x),
    CHtoWGSlng(y, x)
]
