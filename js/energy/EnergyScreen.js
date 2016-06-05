// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  var EnergyView = require( 'PENDULUM_LAB/energy/view/EnergyView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenEnergyString = require( 'string!PENDULUM_LAB/screen.energy' );

  // images
  var energyImage = require( 'mipmap!PENDULUM_LAB/energy-screen-icon.png' );

  /**
   * @constructor
   */
  function EnergyScreen() {

    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( PendulumLabConstants.MODEL_BOUNDS, PendulumLabConstants.SIM_BOUNDS );

    Screen.call( this, screenEnergyString, new Image( energyImage ),
      function() { return new EnergyModel( true ); },
      function( model ) { return new EnergyView( model, modelViewTransform, 283 ); },
      { backgroundColor: PendulumLabConstants.BACKGROUND_COLOR }
    );
  }

  pendulumLab.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );