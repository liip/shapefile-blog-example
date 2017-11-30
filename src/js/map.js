import leaflet from 'leaflet'

export default element => {
    const map = new leaflet.Map(element, {
        zoomControl: false, // Disable default one to re-add custom one
    }).setView([46.8182, 8.2275], 9);

    // move zoom control to bottom right corner
    map.addControl(leaflet.control.zoom({position: 'bottomright'}))

    const tileLayer = new leaflet.TileLayer('//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        minZoom: 9,
        maxZoom: 20,
        attribution: '&copy; CartoDB basemaps'
    }).addTo(map)

    map.addLayer(tileLayer)

    return map
}
