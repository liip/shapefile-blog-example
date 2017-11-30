import { open } from 'shapefile'
import has from 'lodash.has'
import get from 'lodash.get'
import set from 'lodash.set'
import leaflet from 'leaflet'
import ch1903ToWgs from './ch1903ToWgs'

export default (elements, map) => {
    /**
     * Shapefile config
     * @type {{ibexColonies: {shapefileName: string, color: string, filter: (function(): boolean)}, avalanchesN: {shapefileName: string, color: string, filter: (function(*))}, avalanchesW: {shapefileName: string, color: string, filter: (function(*))}, avalanchesS: {shapefileName: string, color: string, filter: (function(*))}, avalanchesY: {shapefileName: string, color: string, filter: (function(*))}, alpineConventions: {shapefileName: string, color: string, filter: (function(): boolean)}}}
     */
    const shapefiles = {
        ibexColonies: {
            shapefileName: 'ibex-colonies', // Name of the shapefile folder in src/assets/shapefiles/
            color: '#4E342E', // Color to display the polygons in
            filter: () => true // Filter function to only display certain polygons
        },
        avalanchesN: {
            shapefileName: 'avalanches-communes',
            color: '#C62828',
            filter: (feature) => {
                return feature.properties.LAWINEN_P4 === 'N'
            }
        },
        avalanchesW: {
            shapefileName: 'avalanches-communes',
            color: '#FFB300',
            filter: (feature) => {
                return feature.properties.LAWINEN_P4 === 'W'
            }
        },
        avalanchesS: {
            shapefileName: 'avalanches-communes',
            color: '#1B5E20',
            filter: (feature) => {
                return feature.properties.LAWINEN_P4 === 'S'
            }
        },
        avalanchesY: {
            shapefileName: 'avalanches-communes',
            color: '#7CB342',
            filter: (feature) => {
                return feature.properties.LAWINEN_P4 === 'Y'
            }
        },
        alpineConvention: {
            shapefileName: 'alpine-convention',
            color: '#757575',
            filter: () => true
        }
    }

    const polygons = {
        ibexColonies: [],
        avalanchesN: [],
        avalanchesW: [],
        avalanchesS: [],
        avalanchesY: [],
        alpineConvention: []
    }

    /**
     * Constructs the relative URL for a given shapefile
     * @param shapefile
     * @return {string}
     */
    const getShapefileUrl = (shapefile) => {
        return `assets/shapefiles/${shapefile}/shapefile.shp`
    }

    /**
     * Loads and displays a shapefile
     * @param shapefileKey
     */
    const loadShapeFile = (shapefileKey) => {
        const shapefile = get(shapefiles, shapefileKey)

        const shapefileUrl = getShapefileUrl(shapefile.shapefileName)

        open(shapefileUrl) // Load the shapefile
            .then(source => {
                source.read() // Read feature from the shapefile
                    .then(function apply (result) {
                        if (result.done) {
                            return
                        }

                        if (shapefile.filter(result.value)) {
                            const polygon = result.value.geometry.coordinates[0].map(coordPair => {
                                return ch1903ToWgs(coordPair[0], coordPair[1])
                            })

                            const leafletPolygon = new leaflet.Polygon(polygon, {
                                weight: 0.5,
                                color: shapefile.color,
                                fillOpacity: 0.3,
                                opcacity: 0.3,
                            })

                            get(polygons, shapefileKey).push(leafletPolygon)

                            leafletPolygon.addTo(map)
                        }

                        return source.read().then(apply) // Iterate over result
                    })
            })
            .catch(error => {
                console.error(error.stack)
            })
    }

    /**
     * Toggles the visibility icon of this shapefile
     * @param shapefileKey
     */
    const toggleIcon = (shapefileKey) => {
        const visibleIcon = document.querySelector(`.material-icons[data-shapefile="${shapefileKey}"]:not(.hidden)`)
        const hiddenIcon = document.querySelector(`.material-icons[data-shapefile="${shapefileKey}"].hidden`)

        visibleIcon.classList.add('hidden')
        hiddenIcon.classList.remove('hidden')
    }

    /**
     * Completely removes all polygons of a given shapefile
     * @param shapefileKey
     */
    const removeShapefile = (shapefileKey) => {
        get(polygons, shapefileKey).forEach((polygon) => {
            map.removeLayer(polygon)
        })

        set(polygons, shapefileKey, [])
    }

    /**
     * Function to handle the click on a given shapefile link
     * @param e
     */
    const toggleShapefile = (e) => {
        e.preventDefault()

        const shapefileKey = e.target.dataset.shapefile

        if (!has(shapefiles, shapefileKey)) {
            return
        }

        if (get(polygons, shapefileKey).length > 0) {
            toggleIcon(shapefileKey)
            removeShapefile(shapefileKey)
        } else {
            toggleIcon(shapefileKey)
            loadShapeFile(shapefileKey)
        }
    }

    // Attach click handler to array of given elements
    elements.forEach((el) => {
        el.addEventListener('click', toggleShapefile)
    })
}
