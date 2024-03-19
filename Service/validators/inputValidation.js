const validateSearchInput = (searchInput) => {
    // Check if the locationName is a string
    if (searchInput.locationName && typeof searchInput.locationName !== 'string') {
        throw new Error('Query parameter <locationName> must be a string');
    }

    // Check if the category is a string
    if (searchInput.category && typeof searchInput.category !== 'string') {
        throw new Error('Query parameter <category> must be a string');
    }

    // Check if the priceRange is an array
    if (searchInput.priceRange && !Array.isArray(searchInput.priceRange)) {
        throw new Error('Query parameter <priceRange> must be an array');
    }

    // Check if the radius is a number between 100 and 10000
    if (searchInput.radius && (typeof searchInput.radius !== 'number' || searchInput.radius < 100 || searchInput.radius > 10000)) {
        throw new Error('Query parameter <radius> must be a number between 100 and 10000, representing the search radius in meters');
    }

    // Check if the location is a valid Point
    if (searchInput.location && !validatePoint(searchInput.location)) {
        throw new Error('Query parameter <location> must be a valid Point');
    }
};

const validatePoint = (point) => {
    // Check if the point is an object
    if (typeof point !== 'object') {
        return false;
    }

    // Check if the type is a string
    if (typeof point.type !== 'string') {
        return false;
    }

    // Check if the coordinates is an array of numbers
    if (!Array.isArray(point.coordinates) || point.coordinates.some(coord => typeof coord !== 'number')) {
        return false;
    }

    return true;
};

export { validateSearchInput };
