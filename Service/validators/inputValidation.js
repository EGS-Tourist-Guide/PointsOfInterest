const validateSearchInput = (searchInput) => {
    // This is not necessary because schema already defines category as a string (What i can do is to check if the category is in a list of valid categories)
    if (searchInput.category && typeof searchInput.category !== 'string') {
        throw new Error('Query parameter <category> must be a string');
    }

    // Check if the radius is a number between 100 and 10000
    if (searchInput.radius && (typeof searchInput.radius !== 'number' || searchInput.radius < 100 || searchInput.radius > 50000)) {
        throw new Error('Query parameter <radius> must be a number between 100 and 10000, representing the search radius in meters');
    }

    // Check if the location is a valid Point (type: "Point", coordinates: [longitude from -180 to 180, latitude from -90 to 90])
    if (searchInput.location && !validatePoint(searchInput.location)) {
        throw new Error('Query parameter <location> must be of type Point, with longitude from -180 to 180 and latitude from -90 to 90');
    }
};

const validatePoint = (point) => {

    if (point.coordinates[0] < -180 || point.coordinates[0] > 180 || point.coordinates[1] < -90 || point.coordinates[1] > 90){
        return false;
    }

    return true;
};

export { validateSearchInput };
