// Copyright 2017-2019, University of Colorado Boulder

/**
 * Panel with length/mass controls for all available pendula
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Panel = require( 'SUN/Panel' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const PendulumNumberControl = require( 'PENDULUM_LAB/common/view/PendulumNumberControl' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const kilogramsPatternString = require( 'string!PENDULUM_LAB/kilogramsPattern' );
  const lengthString = require( 'string!PENDULUM_LAB/length' );
  const massString = require( 'string!PENDULUM_LAB/mass' );
  const metersPatternString = require( 'string!PENDULUM_LAB/metersPattern' );

  /**
   * @constructor
   *
   * @param {Array.<Pendulum>} pendula
   * @param {Property.<number>} numberOfPendulaProperty
   */
  function PendulumControlPanel( pendula, numberOfPendulaProperty ) {

    const content = new VBox( {
      spacing: 16
    } );

    const separator = new Line( {
      stroke: 'rgb(160,160,160)',
      lineWidth: 0.3,
      x2: PendulumLabConstants.RIGHT_CONTENT_WIDTH
    } );

    const pendulumSliderGroups = pendula.map( function( pendulum ) {
      const pendulumNumberString = '' + ( pendulum.index + 1 );
      const lengthTitle = StringUtils.fillIn( lengthString, {
        pendulumNumber: pendulumNumberString
      } );
      const massTitle = StringUtils.fillIn( massString, {
        pendulumNumber: pendulumNumberString
      } );

      //TODO #210 replace '{0}' with SunConstants.VALUE_NAMED_PLACEHOLDER
      const lengthPattern = StringUtils.fillIn( metersPatternString, { meters: '{0}' } );
      const massPattern = StringUtils.fillIn( kilogramsPatternString, { kilograms: '{0}' } );

      return new VBox( {
        spacing: 14,
        align: 'left',
        children: [
          new PendulumNumberControl( lengthTitle, pendulum.lengthProperty, pendulum.lengthRange, lengthPattern, pendulum.color ),
          new PendulumNumberControl( massTitle, pendulum.massProperty, pendulum.massRange, massPattern, pendulum.color )
        ]
      } );
    } );

    numberOfPendulaProperty.link( function( numberOfPendula ) {
      content.children = numberOfPendula === 1 ? [
        pendulumSliderGroups[ 0 ]
      ] : [
        pendulumSliderGroups[ 0 ],
        separator,
        pendulumSliderGroups[ 1 ]
      ];
    } );

    Panel.call( this, content, PendulumLabConstants.PANEL_OPTIONS );
  }

  pendulumLab.register( 'PendulumControlPanel', PendulumControlPanel );

  return inherit( Panel, PendulumControlPanel );
} );
