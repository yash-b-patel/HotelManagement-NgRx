/**
 * Room Controller
 * ---------------
 * Handles HTTP req/res for room CRUD under a hotel.
 * Delegates all business logic to roomService.
 */

import * as roomService from '../services/roomService.js';

export const create = async (req, res, next) => {
    try {
        const room = await roomService.createRoom({
            roomNumber: req.body.roomNumber,
            type: req.body.type,
            price: req.body.price,
            isAvailable: req.body.isAvailable,
            hotelId: req.params.hotelId,
            ownerId: req.owner._id,
        });
        res.status(201).json({ success: true, data: room });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const rooms = await roomService.getRoomsByHotel(
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const room = await roomService.getRoomById(
            req.params.id,
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, data: room });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const room = await roomService.updateRoom(
            req.params.id,
            req.params.hotelId,
            req.owner._id,
            req.body
        );
        res.json({ success: true, data: room });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await roomService.deleteRoom(
            req.params.id,
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, message: 'Room deleted' });
    } catch (error) {
        next(error);
    }
};
