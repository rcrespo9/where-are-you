'use strict';

(function() {
	const detectLocation = () => {
		const $worldMap = document.querySelector('#js-map');

		function detectUserIp() {
			fetch('//freegeoip.net/json/').then(function(response) {
				if(response.ok) {
					return response.json();
				}
				throw new Error('Network response was not okay.');
			}).then(function(data) {
				const {country_code, country_name} = data;
				const $country = $worldMap.querySelector(`#${country_code}`);

				console.log(data);

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