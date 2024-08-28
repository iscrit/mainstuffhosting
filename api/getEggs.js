import axios from 'axios';

export default async function handler(req, res) {
    try {
        const response = await axios.get('https://client.hostfinder.top/api/application/eggs', {
            headers: {
                'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`
            }
        });

        return res.status(200).json({ eggs: response.data.data });
    } catch (error) {
        console.error('Error fetching eggs:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Error fetching eggs' });
    }
}
