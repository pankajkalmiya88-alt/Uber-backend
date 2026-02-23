const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;
    try {
        const coordinates = await mapsService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ error: 'Coordinates not found' });
    }
};

module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapsService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

module.exports.getAutocompleteSuggestions = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;

        const suggestions = await mapsService.getAutocompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

