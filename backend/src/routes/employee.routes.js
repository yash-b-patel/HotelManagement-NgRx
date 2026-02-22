/**
 * Employee Routes (protected, nested under hotel)
 * ------------------------------------------------
 * All routes require JWT authentication.
 * Employees are scoped to a hotel via :hotelId param.
 *
 * GET    /api/hotels/:hotelId/employees        → List employees
 * POST   /api/hotels/:hotelId/employees        → Add employee
 * GET    /api/hotels/:hotelId/employees/:id    → Get employee
 * PUT    /api/hotels/:hotelId/employees/:id    → Update employee
 * DELETE /api/hotels/:hotelId/employees/:id    → Delete employee
 */

import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validate.js';
import protect from '../middlewares/auth.js';
import * as employeeController from '../controllers/employeeController.js';

// mergeParams lets us access :hotelId from the parent router
const router = Router({ mergeParams: true });

router.use(protect);

router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Employee name is required'),
        body('role')
            .notEmpty()
            .withMessage('Role is required')
            .isIn(['manager', 'receptionist', 'housekeeping', 'chef', 'security', 'other'])
            .withMessage('Invalid role'),
    ],
    validate,
    employeeController.create
);

router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getOne);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.remove);

export default router;
