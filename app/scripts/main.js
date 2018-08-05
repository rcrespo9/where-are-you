'use strict';

require('babel-polyfill');

(function() {
	const detectLocation = () => {
		const $pageContent = document.querySelector('#js-page-content');
		const $worldMap = document.querySelector('#js-map');
		const $countryName = document.querySelector('#js-country-name');

		const activeCountryClass = 'map__country--active';
		const showClass = 'page-content--show';

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

		function spotlightCountry(pathEl) {
			const $activeCountry = $worldMap.querySelector(pathEl);
			const $inactiveCountries = $worldMap.querySelectorAll('.map__country:not(.map__country--active)');

			const bbox = $activeCountry.getBBox();
			const svgBBox = $worldMap.getBBox();

			let viewBox = $worldMap.getAttribute('viewBox');
			viewBox = viewBox.split(' ');

			const widthQuotient = svgBBox.width / bbox.width;
			const heightQuotient = svgBBox.height / bbox.height;

			const svgPathScale = Math.min(widthQuotient, heightQuotient);

			const cx = parseFloat(viewBox[0]) + (parseFloat(viewBox[2]) / 2);
			const cy = parseFloat(viewBox[1]) + (parseFloat(viewBox[3]) / 2);

			const x = cx - bbox.x - (bbox.width / 2);
			const y = cy - bbox.y - (bbox.height / 2);
			const matrix = `${svgPathScale} 0 0 ${svgPathScale} ${x} ${y}`;

			const tl = new TimelineLite();

			tl
			  .to($inactiveCountries, 0.75, { opacity:0, delay: 0.75, ease:Power2.easeInOut })
			  .to($activeCountry, 0.75, { x:x, y:y, scale:svgPathScale, transformOrigin:'center center', delay: 0.25, ease:Power2.easeInOut });
    }

		function detectUserIp() {
			fetch('//ip-api.com/json').then(function (response) {
				if(response.ok) {
					return response.json();
				}
				throw new Error('Network response was not okay.');
			}).then(function (detectedCountry) {
				const {countryCode, country} = detectedCountry;
				const countryCodeId = `#${countryCode}`;
				const $countryImg = $worldMap.querySelector(countryCodeId);

				$countryName.textContent = articleUseCheck(country);

				if($countryImg.classList) {
					$countryImg.classList.add(activeCountryClass);
				} else {
					$countryImg.setAttribute('class', `map__country ${activeCountryClass}`);
				}

				$pageContent.classList.add(showClass);
				$pageContent.addEventListener('transitionend', spotlightCountry(countryCodeId));
			}).catch(function(error) {
				$countryName.textContent = 'a country I\'m not familiar with';
				$pageContent.classList.add(showClass);

				throw new Error(`There has been a problem with your fetch operation: ${error.message}`);
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