// Copyright 2014-2015, University of Colorado Boulder

/**
 * The 'Pendulum's Lab' Intro screen.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab');
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PendulumLabModel = require( 'PENDULUM_LAB/common/model/PendulumLabModel' );
  var PendulumLabView = require( 'PENDULUM_LAB/common/view/PendulumLabView' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenIntroString = require( 'string!PENDULUM_LAB/screen.intro' );

  // images
  var introImage = require( 'mipmap!PENDULUM_LAB/intro-screen-icon.png' );

  /**
   * @constructor
   */
  function IntroScreen() {

    // model coordinates are the same as view coordinates
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( PendulumLabConstants.MODEL_BOUNDS, PendulumLabConstants.SIM_BOUNDS );

    Screen.call( this, screenIntroString, new Image( introImage ),
      function() { return new PendulumLabModel( true ); },
      function( model ) { return new PendulumLabView( model, modelViewTransform ); },
      { backgroundColor: PendulumLabConstants.BACKGROUND_COLOR }
    );
  }

  pendulumLab.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );