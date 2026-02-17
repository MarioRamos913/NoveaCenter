import { Request, Response } from 'express';
import { LicenseModel } from '../models/License';
import crypto from 'crypto';

export class LicenseController {
    
    private static generateLicenseKey(data: string): string {
        // Generates a hash based on data + timestamp + random salt
        const salt = crypto.randomBytes(8).toString('hex');
        const hash = crypto.createHmac('sha256', salt)
                           .update(data + Date.now().toString())
                           .digest('hex')
                           .toUpperCase();
        
        // Format: XXXX-XXXX-XXXX-XXXX
        return `${hash.substring(0, 4)}-${hash.substring(4, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}`;
    }

    static async validate(req: Request, res: Response) {
        try {
            const { key } = req.body;
            if (!key) return res.status(400).json({ valid: false, message: 'License key is required' });

            const license = await LicenseModel.findByKey(key);

            if (!license) return res.status(200).json({ valid: false, message: 'License not found' });
            if (license.status !== 'active') return res.status(200).json({ valid: false, message: `License is ${license.status}` });
            if (new Date() > license.expirationDate) return res.status(200).json({ valid: false, message: 'License expired' });

            return res.status(200).json({ valid: true, license });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { firstName, lastName, idNumber, businessName, sector, software, expirationDate } = req.body;

            // Basic validation
            if (!firstName || !lastName || !idNumber || !software || !expirationDate) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Parse expiration date
            const expiration = new Date(expirationDate);
            if (isNaN(expiration.getTime())) {
                return res.status(400).json({ message: 'Invalid expiration date' });
            }

            // Generate Key
            const key = LicenseController.generateLicenseKey(`${idNumber}-${software}`);

            const newLicense = await LicenseModel.create({
                key,
                firstName,
                lastName,
                idNumber,
                businessName: businessName || '',
                sector: sector || '',
                expirationDate: expiration,
                software,
                status: 'active'
            });

            return res.status(201).json(newLicense);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error creating license' });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const licenses = await LicenseModel.getAll();
            return res.json(licenses);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching licenses' });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const { status } = req.body;
            
            if (!['active', 'revoked', 'expired'].includes(status)) {
                 return res.status(400).json({ message: 'Invalid status' });
            }

            const updated = await LicenseModel.updateStatus(key, status);
            if (!updated) return res.status(404).json({ message: 'License not found' });
            
            return res.json(updated);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating license' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { key } = req.params;
            const deleted = await LicenseModel.delete(key);
            if (!deleted) return res.status(404).json({ message: 'License not found' });
            return res.json({ message: 'License deleted' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting license' });
        }
    }
}
