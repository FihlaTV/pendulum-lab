// Copyright 2002-2014, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Energy screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var EnergyModel = require( 'PENDULUM_LAB/energy/model/EnergyModel' );
  var EnergyView = require( 'PENDULUM_LAB/energy/view/EnergyView' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var energyString = require( 'string!PENDULUM_LAB/tab.energy' );

  // images
  var energyImage = require( 'mipmap!PENDULUM_LAB/energy-screen-icon.png' );

  /**
   * @constructor
   */
  function EnergyScreen() {

    // model coordinates are the same as view coordinates
    var modelViewTransform = ModelViewTransform2.createIdentity();

    Screen.call( this, energyString, new Image( energyImage ),
      function() { return new EnergyModel(); },
      function( model ) { return new EnergyView( model, modelViewTransform ); },
      { backgroundColor: PendulumLabConstants.BACKGROUND_COLOR }
    );
  }

  return inherit( Screen, EnergyScreen );
} );