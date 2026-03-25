document.addEventListener('DOMContentLoaded', function() {
    const pricesTable = document.getElementById('pricesTable');
    const form = document.getElementById('priceForm');
    
    // Load prices from prices.json
    fetch('prices.json')
        .then(response => response.json())
        .then(data => displayPrices(data))
        .catch(error => console.error('Error loading prices:', error));
    
    function displayPrices(prices) {
        pricesTable.innerHTML = ''; // Clear existing table
        prices.forEach(price => {
            const row = pricesTable.insertRow();
            row.insertCell(0).textContent = price.item;
            row.insertCell(1).textContent = price.value;
        });
    }

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const item = form.elements['item'].value;
        const value = form.elements['value'].value;

        // Here we would typically send the updated price back to the server
        // For demonstration, we'll just log it to the console
        console.log('Updated price:', { item, value });

        // Optionally, you can update the table directly here
        const row = pricesTable.insertRow();
        row.insertCell(0).textContent = item;
        row.insertCell(1).textContent = value;

        form.reset(); // Reset form fields
    });
});