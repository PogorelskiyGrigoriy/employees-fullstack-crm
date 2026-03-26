/**
 * @module EmployeesController
 * Handles incoming HTTP requests for employee data.
 */
import type { Request, Response, NextFunction } from 'express';
import { InMemoryEmployeesService } from '../services/implementations/employees-in-memory.service.js';
import { 
  employeeFilterSchema, 
  newEmployeeSchema, 
  employeeUpdateSchema 
} from '@crm/shared/schemas/employee.schema.js';
import { sortParamsSchema } from '@crm/shared/schemas/common.js';

export class EmployeesController {
  constructor(private employeesService: InMemoryEmployeesService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = employeeFilterSchema.parse(req.query);
      const sortParams = sortParamsSchema.parse(req.query);
      const data = await this.employeesService.getAll(filters, sortParams);
      res.json(data);
    } catch (e) { next(e); }
  };

  getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.employeesService.getStatistics();
      res.json(stats);
    } catch (e) { next(e); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = newEmployeeSchema.parse(req.body);
      const result = await this.employeesService.addEmployee(validated);
      res.status(201).json(result);
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== 'string') return res.status(400).json({ error: "Invalid ID" });

      const payload = employeeUpdateSchema.parse({ id, changes: req.body });
      const result = await this.employeesService.updateEmployee(payload);
      res.json(result);
    } catch (e) { next(e); }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (typeof id !== 'string') return res.status(400).json({ error: "Invalid ID" });

      const result = await this.employeesService.deleteEmployee(id);
      res.json(result);
    } catch (e) { next(e); }
  };
}