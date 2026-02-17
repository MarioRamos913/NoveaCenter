
import { Request, Response } from 'express';
import { LicenseController } from '../src/controllers/licenseController';
import { LicenseModel } from '../src/models/License';

// Mock LicenseModel.create
const originalCreate = LicenseModel.create;
let lastCreatedLicense: any = null;

// Override method
(LicenseModel as any).create = async (license: any) => {
    lastCreatedLicense = license;
    return license;
};

// Mock Response
const mockRes = () => {
    const res: any = {};
    res.statusCode = 0;
    res.body = {};
    res.status = (code: number) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data: any) => {
        res.body = data;
        return res;
    };
    return res;
};

// Mock generateLicenseKey
(LicenseController as any).generateLicenseKey = () => "TEST-KEY";

async function runTests() {
    console.log("Running LicenseController.create verification...");

    // Test 1: Missing expirationDate
    {
        console.log("\nTest 1: Missing expirationDate");
        const req = {
            body: {
                firstName: "John",
                lastName: "Doe",
                idNumber: "12345",
                software: "rutadata"
            }
        } as any;
        const res = mockRes();
        await LicenseController.create(req, res);
        
        if (res.statusCode === 400 && res.body.message === 'Missing required fields') {
            console.log("PASS: Correctly rejected missing expirationDate");
        } else {
            console.error("FAIL: Did not reject missing expirationDate", res.statusCode, res.body);
        }
    }

    // Test 2: Invalid expirationDate
    {
        console.log("\nTest 2: Invalid expirationDate");
        const req = {
            body: {
                firstName: "John",
                lastName: "Doe",
                idNumber: "12345",
                software: "rutadata",
                expirationDate: "invalid-date"
            }
        } as any;
        const res = mockRes();
        await LicenseController.create(req, res);

        if (res.statusCode === 400 && res.body.message === 'Invalid expiration date') {
            console.log("PASS: Correctly rejected invalid expirationDate");
        } else {
            console.error("FAIL: Did not reject invalid expirationDate", res.statusCode, res.body);
        }
    }

    // Test 3: Valid expirationDate
    {
        console.log("\nTest 3: Valid expirationDate");
        const targetDate = "2025-12-31T23:59:59.000Z";
        const req = {
            body: {
                firstName: "John",
                lastName: "Doe",
                idNumber: "12345",
                software: "rutadata",
                expirationDate: targetDate
            }
        } as any;
        const res = mockRes();
        await LicenseController.create(req, res);

        if (res.statusCode === 201 && lastCreatedLicense && lastCreatedLicense.expirationDate.toISOString() === targetDate) {
            console.log("PASS: Correctly created license with provided expirationDate");
        } else {
            console.error("FAIL: Did not create license correctly", res.statusCode, lastCreatedLicense);
        }
    }
}

runTests().catch(console.error);
