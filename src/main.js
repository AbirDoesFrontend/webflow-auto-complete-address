import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Address Lookup</h1>
    <div class="form-group">
      <label for="address-input">Enter your address:</label>
      <input 
        type="text" 
        id="address-input" 
        placeholder="Start typing your address..."
        autocomplete="off"
      >
    </div>
  </div>
`

document.addEventListener('DOMContentLoaded', function() {
    const addressInput = document.getElementById('address-input');
    const suggestionsList = document.createElement('ul');
    suggestionsList.style.cssText = 'list-style: none; padding: 0; margin: 0; border: 1px solid #ccc; border-top: none; max-height: 200px; overflow-y: auto; position: absolute; background: white; width: 100%; display: none; z-index: 1000;';
    addressInput.parentNode.appendChild(suggestionsList);

    let timeoutId;

    addressInput.addEventListener('input', function() {
        clearTimeout(timeoutId);
        
        // Clear previous suggestions
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';

        const query = this.value.trim();
        if (query.length < 3) return;

        // Add delay to prevent too many requests
        timeoutId = setTimeout(() => {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us`)
                .then(response => response.json())
                .then(data => {
                    suggestionsList.innerHTML = '';
                    
                    if (data.length > 0) {
                        data.slice(0, 5).forEach(place => {
                            const li = document.createElement('li');
                            li.style.cssText = 'padding: 10px; cursor: pointer; hover: background-color: #f0f0f0;';
                            li.textContent = place.display_name;
                            
                            li.addEventListener('mouseenter', function() {
                                this.style.backgroundColor = '#f0f0f0';
                            });
                            
                            li.addEventListener('mouseleave', function() {
                                this.style.backgroundColor = 'white';
                            });
                            
                            li.addEventListener('click', function() {
                                addressInput.value = place.display_name;
                                // Store coordinates if needed
                                const lat = place.lat;
                                const lon = place.lon;
                                suggestionsList.style.display = 'none';
                            });
                            
                            suggestionsList.appendChild(li);
                        });
                        suggestionsList.style.display = 'block';
                    }
                })
                .catch(error => console.error('Error:', error));
        }, 300);
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== addressInput) {
            suggestionsList.style.display = 'none';
        }
    });
});