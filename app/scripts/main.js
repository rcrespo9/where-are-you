'use strict';

(function() {
	function init() {
		fetch('//freegeoip.net/json/').then(function(response) {
			return response.json();
		}).then(function(data) {
			console.log(data); 
		});
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