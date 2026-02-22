/**
 * Employee Controller
 * -------------------
 * Handles HTTP req/res for employee CRUD under a hotel.
 * Delegates all business logic to employeeService.
 */

import * as employeeService from '../services/employeeService.js';

export const create = async (req, res, next) => {
    try {
        const employee = await employeeService.createEmployee({
            name: req.body.name,
            role: req.body.role,
            email: req.body.email,
            phone: req.body.phone,
            hotelId: req.params.hotelId,
            ownerId: req.owner._id,
        });
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const employees = await employeeService.getEmployeesByHotel(
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, count: employees.length, data: employees });
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const employee = await employeeService.getEmployeeById(
            req.params.id,
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, data: employee });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const employee = await employeeService.updateEmployee(
            req.params.id,
            req.params.hotelId,
            req.owner._id,
            req.body
        );
        res.json({ success: true, data: employee });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await employeeService.deleteEmployee(
            req.params.id,
            req.params.hotelId,
            req.owner._id
        );
        res.json({ success: true, message: 'Employee deleted' });
    } catch (error) {
        next(error);
    }
};
