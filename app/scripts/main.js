'use strict';

(function() {
	const detectLocation = () => {
		const $worldMap = document.querySelector('#js-map');
		const $countryName = document.querySelector('#js-country-name');

		function articleUseCheck(country) {
			const endsWithEs = country.endsWith('es');
			const endsWithLands = country.endsWith('lands');
			const includesKingdom = country.includes('Kingdom');
			const includesRep = country.includes('Republic');
			const includesIsland = country.includes('Island');
			const isBahamas = country === 'Bahamas';
			const isGambia = country === 'Gambia';
			const isComoros = country === 'Comoros';

			if(endsWithEs || endsWithLands || includesKingdom || includesRep || includesIsland || isBahamas || isGambia || isComoros) {
				return `the ${country}`;
			} else {
				return country;
			}
		}

		function detectUserIp() {
			fetch('//freegeoip.net/json/').then(function(response) {
				if(response.ok) {
					return response.json();
				}
				throw new Error('Network response was not okay.');
			}).then(function(country) {
				const {country_code, country_name} = country;
				const $countryImg = $worldMap.querySelector(`#${country_code}`);

				$countryName.textContent = articleUseCheck(country_name);
				$countryImg.classList.add('map__country--active');
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