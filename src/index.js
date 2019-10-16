import React from 'react';
import ReactDOM from 'react-dom';

import PokemonWorld from './PokemonWorld.jsx';

ReactDOM.render(
	<div>
		<PokemonWorld />
	</div>,
	document.getElementById('app')
);

module.hot.accept();