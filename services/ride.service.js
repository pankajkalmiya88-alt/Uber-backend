const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFares = {
        auto: 30,
        car: 50,
        moto: 20,
    };

    const perKmRates = {
        auto: 10,
        car: 15,
        moto: 8,
    };

    const perMinuteRates = {
        auto: 2,
        car: 3,
        moto: 1.5,
    };

    // Convert distance from '9.5 km' → 9.5
    const distanceInKm = parseFloat(distanceTime.distance.replace(' km', ''));

    // Convert duration from '31 mins' → 31
    const timeInMinutes = parseFloat(distanceTime.duration.replace(' mins', ''));

    const fare = {
        auto: Math.round(
            baseFares.auto +
            (distanceInKm * perKmRates.auto) +
            (timeInMinutes * perMinuteRates.auto)
        ),

        car: Math.round(
            baseFares.car +
            (distanceInKm * perKmRates.car) +
            (timeInMinutes * perMinuteRates.car)
        ),

        moto: Math.round(
            baseFares.moto +
            (distanceInKm * perKmRates.moto) +
            (timeInMinutes * perMinuteRates.moto)
        ),
    };

    return fare;
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {

    if(!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);
    const ride =  rideModel.create({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
    });

    return ride;
};


