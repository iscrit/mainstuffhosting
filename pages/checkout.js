const axios = require('axios');

module.exports = async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { product_id, name, price, email, password, serverName, egg, ram } = req.body;

    try {
        // Fetch user or create user
        let user;
        try {
            const userResponse = await axios.get(`https://client.hostfinder.top/api/application/users?filter[email]=${email}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`
                }
            });

            user = userResponse.data.data[0];

            if (!user) {
                const createUserResponse = await axios.post('https://client.hostfinder.top/api/application/users', {
                    email,
                    username: email.split('@')[0],
                    first_name: 'FirstName',
                    last_name: 'LastName',
                    password
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`
                    }
                });

                user = createUserResponse.data;
            }
        } catch (error) {
            console.error('Error fetching or creating user:', error.message);
            return res.status(500).json({ success: false, message: 'Error creating or finding user' });
        }

        // Create server
        try {
            await axios.post('https://client.hostfinder.top/api/application/servers', {
                name: serverName,
                user: user.attributes.id,
                egg,
                limits: {
                    memory: ram,
                    swap: 0,
                    disk: 10240,
                    io: 500,
                    cpu: 100
                },
                feature_limits: {
                    databases: 1,
                    allocations: 1
                },
                environment: {},
                startup: 'default_startup_command',
                image: 'default_docker_image',
                skip_scripts: false
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`Server created for user ${user.attributes.email}`);
        } catch (error) {
            console.error('Error creating server:', error.message);
            return res.status(500).json({ success: false, message: 'Error creating server' });
        }

        // Tebex payment
        try {
            const tebexResponse = await axios.post('https://plugin.tebex.io/payments', {
                buyer: {
                    id: user.attributes.id,
                    email
                },
                packages: [{ id: product_id, price }]
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
            console.error('Error creating Tebex order:', error.message);
            return res.status(500).json({ success: false, message: 'Error processing payment' });
        }

    } catch (error) {
        console.error('Error during checkout:', error.message);
        return res.status(500).json({ success: false, message: 'Server creation or Tebex payment failed' });
    }
}
