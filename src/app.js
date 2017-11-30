// Load SCSS
import './assets/sass/main.scss'

// Load map initializing function
import createMap from './js/map'

// Load shapefile loader
import attachShapefileLoading from './js/shapefileLoader'

// Initialize map
const map = createMap(document.querySelector('#map'))

// Attach hooks for shapefile loading
attachShapefileLoading(document.querySelectorAll('.shapefile-link'), map)
