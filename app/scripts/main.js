'use strict';

require('babel-polyfill');

(function() {
	const detectLocation = () => {
		const $worldMap = document.querySelector('#js-map');
		const $countryName = document.querySelector('#js-country-name');
		const activeCountryClass = 'map__country--active';

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

		function centerSVGPath(svgEl, pathEl) {
			const svg = document.querySelector(svgEl);
			const path = svg.querySelector(pathEl)
			const bbox = path.getBBox();

			let viewBox = svg.getAttribute('viewBox');
			viewBox = viewBox.split(' ');

			const cx = parseFloat(viewBox[0]) + (parseFloat(viewBox[2]) / 2);
			const cy = parseFloat(viewBox[1]) + (parseFloat(viewBox[3]) / 2);

			const x = cx - bbox.x - (bbox.width / 2);
			const y = cy - bbox.y - (bbox.height / 2);
			const matrix = '1 0 0 1 ' + x + ' ' + y;

			path.setAttribute('transform', `translate(${x},${y})`);

		}

		function detectUserIp() {
			fetch('//freegeoip.net/json/').then(function(response) {
				if(response.ok) {
					return response.json();
				}
				throw new Error('Network response was not okay.');
			}).then(function(country) {
				const {country_code, country_name} = country;
				const countryCodeId = `#${country_code}`;
				const $countryImg = $worldMap.querySelector(countryCodeId);

				$countryName.textContent = articleUseCheck(country_name);

				if($countryImg.classList) {
				  $countryImg.classList.add(activeCountryClass);
				} else {
				  $countryImg.setAttribute('class', `map__country ${activeCountryClass}`);
				}

				// centerSVGPath('#js-map', countryCodeId);
			}).catch(function(error) {
				$countryName.textContent = 'a country I\'m not familiar with';
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