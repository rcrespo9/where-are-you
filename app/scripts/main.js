'use strict';

(function() {
	const detectLocation = () => {
		const $worldMap = document.querySelector('#js-map');
		const $countryName = document.querySelector('#js-country-name');

		function articleUseCheck(country) {
		}

		function detectUserIp() {
			fetch('//freegeoip.net/json/').then(function(response) {
				if(response.ok) {
					return response.json();
				}
				throw new Error('Network response was not okay.');
			}).then(function(countries) {
				const {country_code, country_name} = countries;
				const $country = $worldMap.querySelector(`#${country_code}`);

				console.log(countries);

				$countryName.innerHTML = country_name;
				$country.classList.add('active-country');
			}).catch(function(error) {
				console.log('There has been a problem with your fetch operation: ' + error.message);
			});
		}

		return {
			init: () => {
				detectUserIp();
			}
		};
	};

	function init() {
		const newDetectLoc = detectLocation();

		newDetectLoc.init();
	}

	function ready(fn) {
	  if (document.readyState != 'loading'){
	    fn();
	  } else {
	    document.addEventListener('DOMContentLoaded', fn);
	  }
	}

	ready(init);
})();