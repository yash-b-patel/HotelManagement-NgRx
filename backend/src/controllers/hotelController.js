/**
 * Hotel Controller
 * ----------------
 * Handles HTTP req/res for hotel CRUD.
 * Delegates all business logic to hotelService.
 */

import * as hotelService from '../services/hotelService.js';

export const create = async (req, res, next) => {
    try {
        const hotel = await hotelService.createHotel({
            name: req.body.name,
            address: req.body.address,
            ownerId: req.owner._id,
        });
        res.status(201).json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const hotels = await hotelService.getHotelsByOwner(req.owner._id);
        res.json({ success: true, count: hotels.length, data: hotels });
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const hotel = await hotelService.getHotelById(req.params.id, req.owner._id);
        res.json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const hotel = await hotelService.updateHotel(
            req.params.id,
            req.owner._id,
            req.body
        );
        res.json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await hotelService.deleteHotel(req.params.id, req.owner._id);
        res.json({ success: true, message: 'Hotel deleted' });
    } catch (error) {
        next(error);
    }
};
