// Copyright 2002-2014, University of Colorado Boulder

/**
 * Pendulums system control panel node in 'Pendulum Lab' simulation.
 * Contains radio buttons to control number of pendulums, play/pause and step buttons and time speed control radio buttons.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var NormalString = require( 'string!PENDULUM_LAB/normal' );
  var SlowMotionString = require( 'string!PENDULUM_LAB/slowMotion' );

  // constants
  var FONT = new PhetFont( 11 );
  var ICON_SIZE = 24;
  var RECTANGULAR_BUTTON_BASE_COLOR = 'rgb( 230, 231, 232 )';

  /**
   * {Property} numberOfPendulumsProperty - property to control number of pendulums
   * {Property} playProperty - property to control stream of time
   * {Property} timeSpeedProperty - property to control speed of time
   * {Function} stepFunction - handler for step button
   * {Object} options for tools control panel node
   * @constructor
   */
  function PendulumSystemControlPanelNode( numberOfPendulumsProperty, playProperty, timeSpeedProperty, stepFunction, options ) {
    HBox.call( this, _.extend( { spacing: 26, children: [
      // radio buttons to control number of pendulums
      new RadioButtonGroup( numberOfPendulumsProperty, [
        {node: new Rectangle( 0, 0, ICON_SIZE, ICON_SIZE ), value: 1},
        {node: new Rectangle( 0, 0, ICON_SIZE, ICON_SIZE ), value: 2}
      ], {
        spacing: 9,
        orientation: 'horizontal',
        baseColor: RECTANGULAR_BUTTON_BASE_COLOR,
        disabledBaseColor: RECTANGULAR_BUTTON_BASE_COLOR
      } ),

      // play/pause and step buttons
      new HBox( {spacing: 10, children: [
        new PlayPauseButton( playProperty, {radius: 16} ),
        new StepButton( stepFunction, playProperty, {radius: 12} )
      ]} ),

      // time speed checkbox
      new VerticalAquaRadioButtonGroup( [
        {
          property: timeSpeedProperty,
          value: 1,
          node: new Text( NormalString, {font: FONT} )
        },
        {
          property: timeSpeedProperty,
          value: 1 / 8,
          node: new Text( SlowMotionString, {font: FONT} )
        }
      ], {radius: 6, spacing: 9, radioButtonOptions: {xSpacing: 5}} )
    ] }, options ) );
  }

  return inherit( HBox, PendulumSystemControlPanelNode );
} );