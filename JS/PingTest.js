document.addEventListener('DOMContentLoaded', () => {
    const pingUsButton = document.getElementById('ping-us');
    const pingDeButton = document.getElementById('ping-de');
    const usResult = document.getElementById('us-time');
    const deResult = document.getElementById('de-time');
    const resultsContainer = document.getElementById('results');

    function pingServer(url, resultElement) {
        const startTime = Date.now();
        fetch(url)
            .then(response => {
                const duration = Date.now() - startTime;
                resultElement.textContent = `${duration} ms`;
            })
            .catch(() => {
                resultElement.textContent = 'Error occurred';
            });
    }

    pingUsButton.addEventListener('click', () => {
        pingServer('http://23.167.232.6', usResult);
    });

    pingDeButton.addEventListener('click', () => {
        pingServer('http://77.90.14.183', deResult);
    });
});
