// Add this script in the before </body> tag in your Webflow page settings
// First, load the Google Places API script
{
  /* <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script> */
}

// Main implementation
document.addEventListener('DOMContentLoaded', function () {
  // Replace 'address-input' with your Webflow input element's ID
  const addressInput = document.getElementById('address-input');

  if (addressInput) {
    // Initialize Google Places Autocomplete
    const autocomplete = new google.maps.places.Autocomplete(addressInput, {
      componentRestrictions: { country: 'US' }, // Restrict to USA
      fields: ['address_components', 'formatted_address', 'geometry'],
      types: ['address'],
    });

    // Handle place selection
    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        console.log("No details available for input: '" + place.name + "'");
        return;
      }

      // You can access various address components here
      const addressComponents = {
        street_number: '',
        route: '',
        locality: '',
        administrative_area_level_1: '',
        postal_code: '',
      };

      // Extract address components
      place.address_components.forEach((component) => {
        const type = component.types[0];
        if (addressComponents.hasOwnProperty(type)) {
          addressComponents[type] = component.long_name;
        }
      });

      // Example: If you want to store the latitude and longitude
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Example: If you want to store the full formatted address
      const formattedAddress = place.formatted_address;

      // You can now use these values to populate other fields or store them
      // For example, if you have hidden fields for lat/lng:
      if (document.getElementById('latitude')) {
        document.getElementById('latitude').value = lat;
      }
      if (document.getElementById('longitude')) {
        document.getElementById('longitude').value = lng;
      }
    });

    // Prevent form submission on enter key (optional)
    addressInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }
});
