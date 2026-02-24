const axios = require('axios');
const captainModel = require("../models/captain.model")

module.exports.getAddressCoordinate = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API; // Replace with your Google Maps API key
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error(`Unable to fetch coordinates: ${data.status}`);
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw error;
    }
};


module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API; // Replace with your Google Maps API key

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.status === 'OK' && data.rows.length > 0) {
            const element = data.rows[0].elements[0];
            if (element.status === 'OK') {
                return {
                    distance: element.distance.text,
                    duration: element.duration.text
                };
            } else {
                throw new Error(`Unable to fetch distance and time: ${element.status}`);
            };
        } else {
            throw new Error(`Unable to fetch distance and time: ${data.status}`);
        };
    } catch (error) {
        console.error('Error fetching distance and time:', error.message);
        throw error;
    };
};


module.exports.getAutocompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    };

    const apiKey = process.env.GOOGLE_MAPS_API; // Replace with your Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.status === 'OK') {
            return data.predictions.map(prediction => ({
                description: prediction.description,
                place_id: prediction.place_id
            }));
        } else {
            throw new Error(`Unable to fetch suggestions: ${data.status}`);
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error.message);
        throw error;
    }

};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ltd, lng], radius / 3963.2 ]
            }
        }
    });

    return captains;
}