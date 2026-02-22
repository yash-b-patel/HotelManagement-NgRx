/**
 * Owner Controller (Auth)
 * -----------------------
 * Thin layer: parses the request, delegates to ownerService,
 * and sends the response. No database logic here.
 */

import * as ownerService from '../services/ownerService.js';

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const result = await ownerService.registerOwner({ name, email, password });
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await ownerService.loginOwner({ email, password });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const owner = await ownerService.getOwnerById(req.owner._id);
        res.json({ success: true, data: owner });
    } catch (error) {
        next(error);
    }
};
