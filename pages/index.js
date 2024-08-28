import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    const handleProductSelect = (product_id, name, price) => {
        router.push({
            pathname: '/checkout',
            query: { product_id, name, price }
        });
    };

    return (
        <div>
            <h1>Select a Product</h1>
            <button onClick={() => handleProductSelect('product-1-id', 'Product 1', 10)}>
                Buy Product 1 - $10
            </button>
            <button onClick={() => handleProductSelect('product-2-id', 'Product 2', 20)}>
                Buy Product 2 - $20
            </button>
        </div>
    );
}
