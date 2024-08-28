import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { product_id, name, price, email, password, serverName, egg, ram } = req.body;

    try {
        // Step 1: Check if the user exists on Pterodactyl
        let user;
        try {
            const userResponse = await axios.get(`https://client.hostfinder.top/api/application/users?filter[email]=${email}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`
                }
            });

            user = userResponse.data.data[0];

            if (!user) {
                // Step 2: Create a new user if not found
                const createUserResponse = await axios.post('https://client.hostfinder.top/api/application/users', {
                    email: email,
                    username: email.split('@')[0], // Use part of email as username
                    first_name: 'FirstName', // Customize as needed
                    last_name: 'LastName',  // Customize as needed
                    password: password
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`
                    }
                });

                user = createUserResponse.data;
            }
        } catch (error) {
            console.error('Error fetching or creating user:', error.response?.data || error.message);
            return res.status(500).json({ success: false, message: 'Error creating or finding user' });
        }

        // Step 3: Create the server
        try {
            const serverResponse = await axios.post('https://client.hostfinder.top/api/application/servers', {
                name: serverName,
                user: user.attributes.id,
                egg: egg,
                limits: {
                    memory: ram,
                    swap: 0,
                    disk: 10240,  // Example disk space
                    io: 500,
                    cpu: 100
                },
                feature_limits: {
                    databases: 1,
                    allocations: 1
                },
                environment: {
                    // Add environment variables required by the egg
                },
                startup: 'default_startup_command', // Set your startup command
                image: 'default_docker_image', // Set the Docker image
                skip_scripts: false,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`Server created for user ${user.attributes.email}`);
        } catch (error) {
            console.error('Error creating server:', error.response?.data || error.message);
            return res.status(500).json({ success: false, message: 'Error creating server' });
        }

        // Step 4: Create an order in Tebex
        try {
            const tebexResponse = await axios.post('https://plugin.tebex.io/payments', {
                buyer: {
                    id: user.attributes.id,
                    email: email,
                },
                packages: [
                    {
                        id: product_id,
                        price: price
                    }
                ]
            }, {
                headers: {
                    'X-Tebex-Secret': process.env.TEBEX_SECRET_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (tebexResponse.data.url) {
                return res.status(200).json({ success: true, payment_url: tebexResponse.data.url });
            } else {
                return res.status(500).json({ success: false, message: 'Failed to create Tebex order' });
            }
        } catch (error) {
            console.error('Error creating Tebex order:', error.response?.data || error.message);
            return res.status(500).json({ success: false, message: 'Error processing payment' });
        }

    } catch (error) {
        console.error('Error during checkout:', error.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'Server creation or Tebex payment failed' });
    }
}
