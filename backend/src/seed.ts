import { UserService } from './modules/users/user.service';

export const seedInitialUser = async () => {
    try {
        const username = 'mario';
        const existing = await UserService.findByUsername(username);
        
        if (!existing) {
            console.log('Seeding initial admin user...');
            await UserService.create({
                username,
                password: '1234', // Service will hash it
                role: 'admin'
            });
            console.log('Initial admin user created: mario');
        } else {
            console.log('Initial admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding initial user:', error);
    }
};
