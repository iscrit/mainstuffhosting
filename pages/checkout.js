import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Checkout() {
    const router = useRouter();
    const { product_id, name, price } = router.query;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [serverName, setServerName] = useState('');
    const [egg, setEgg] = useState('default-egg-id');
    const [ram, setRam] = useState(1024);
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/tebexCheckout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id,
                    name,
                    price,
                    email,
                    password,
                    serverName,
                    egg,
                    ram
                })
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = data.payment_url;
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Error during checkout. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="container">
            <h1>Checkout</h1>
            <p>Product: {name}</p>
            <p>Price: ${price}</p>

            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <label>Server Name:</label>
            <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                required
            />

            <label>Egg:</label>
            <select value={egg} onChange={(e) => setEgg(e.target.value)}>
                <option value="default-egg-id">Default Egg</option>
                <option value="egg-id-1">Egg 1</option>
                <option value="egg-id-2">Egg 2</option>
                {/* Add more eggs as needed */}
            </select>

            <label>RAM (MB):</label>
            <input
                type="number"
                value={ram}
                onChange={(e) => setRam(parseInt(e.target.value))}
                required
                min="512"
            />

            <button onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
        </div>
    );
}
