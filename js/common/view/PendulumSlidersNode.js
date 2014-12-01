// Copyright 2002-2014, University of Colorado Boulder

/**
 * Node with sliders for pendulum in 'Pendulum Lab' simulation.
 * Contains length and mass sliders.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PanelPendulumAbstract = require( 'PENDULUM_LAB/common/view/PanelPendulumAbstract' );
  var PendulumOptionSliderNode = require( 'PENDULUM_LAB/common/view/PendulumOptionSliderNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var pattern_0lengthValue_lengthUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0lengthValue.lengthUnitsMetric' );
  var pattern_0massValue_massUnitsMetric = require( 'string!PENDULUM_LAB/pattern.0massValue.massUnitsMetric' );
  var pattern_0propertyName_1pendulumNumber = require( 'string!PENDULUM_LAB/pattern.0propertyName.1pendulumNumber' );

  // constants
  var FONT_TITLE = new PhetFont( {size: 12, weight: 'bold'} );
  var SPACING_CONTENT = 5;

  /**
   * @param {PendulumLabModel} pendulumLabModel
   * @param {Object} options for control panel node
   * @constructor
   */
  function PendulumSlidersNode( pendulumLabModel, options ) {
    var self = this,
      pendulumSlidersNodeStorage = [],
      currentNumberOfSliders = 0;

    this.optionSliders = [];
    var content = new VBox( {spacing: SPACING_CONTENT, align: 'center'} );
    PanelPendulumAbstract.call( this, content, _.extend( {xMargin: 14}, options ) );

    // create sliders for each pendulum and put then into storage for further adding
    pendulumLabModel.pendulumModels.forEach( function( pendulumModel, pendulumModelIndex ) {
      // create length slider
      var lengthSlider = new PendulumOptionSliderNode(
        pendulumModel.property( 'length' ),
        pendulumModel.lengthOptions,
        pattern_0lengthValue_lengthUnitsMetric,
        pendulumModel.color,
        {y: SPACING_CONTENT}
      );
      self.optionSliders.push( lengthSlider );

      // create mass slider
      var massSlider = new PendulumOptionSliderNode(
        pendulumModel.property( 'mass' ),
        pendulumModel.massOptions,
        pattern_0massValue_massUnitsMetric,
        pendulumModel.color,
        {y: SPACING_CONTENT}
      );
      self.optionSliders.push( massSlider );

      pendulumSlidersNodeStorage.push( new VBox( {
        spacing: SPACING_CONTENT, align: 'left', children: [
          new Node( {
            children: [
              // add length slider label
              new Text( StringUtils.format( pattern_0propertyName_1pendulumNumber, 'Length', (pendulumModelIndex + 1).toString() ), {
                font: FONT_TITLE,
                fill: pendulumModel.color
              } ),
              // add length slider
              lengthSlider
            ]
          } ),

          new Node( {
            children: [
              // add mass slider label
              new Text( StringUtils.format( pattern_0propertyName_1pendulumNumber, 'Mass', (pendulumModelIndex + 1).toString() ), {
                font: FONT_TITLE,
                fill: pendulumModel.color
              } ),

              // add mass slider
              massSlider
            ]
          } )
        ]
      } ) );
    } );

    // add necessary pendulum sliders
    pendulumLabModel.property( 'numberOfPendulums' ).link( function( numberOfPendulums ) {
      var numberDifference = currentNumberOfSliders - numberOfPendulums;

      // remove extra sliders
      if ( numberDifference > 0 ) {
        for ( ; numberDifference--; ) {
          content.removeChildWithIndex( pendulumSlidersNodeStorage[currentNumberOfSliders - numberDifference - 1], currentNumberOfSliders - numberDifference - 1 );
          currentNumberOfSliders--;
        }
      }
      // add necessary sliders
      else if ( numberDifference < 0 ) {
        for ( ; numberDifference++; ) {
          content.insertChild( currentNumberOfSliders - numberDifference, pendulumSlidersNodeStorage[currentNumberOfSliders - numberDifference] );
          currentNumberOfSliders++;
        }
      }
    } );
  }

  return inherit( PanelPendulumAbstract, PendulumSlidersNode );
} );