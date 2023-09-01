document.addEventListener("DOMContentLoaded", function() {
    // Resto de tu código ...

    // Obtener el elemento donde se mostrará el país
    const countryElement = document.getElementById("country");

    // Obtener la geolocalización del usuario
    function getCountryFromGeolocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Utilizar una API de geolocalización inversa para obtener información del país
                const apiURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

                fetch(apiURL)
                    .then(response => response.json())
                    .then(data => {
                        const country = data.address.country;
                        countryElement.textContent = country;
                    })
                    .catch(error => {
                        console.error("Error fetching geolocation data:", error);
                        countryElement.textContent = "No disponible";
                    });
            });
        } else {
            countryElement.textContent = "No disponible";
        }
    }

    // Llamar a la función para obtener y mostrar el país
    getCountryFromGeolocation();

    // Resto de tu código ...
});
