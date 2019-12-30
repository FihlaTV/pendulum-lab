// Copyright 2017-2019, University of Colorado Boulder

/**
 * NumberControl with custom Pendulum Lab options
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );

  /**
   * @constructor
   *
   * @param {string} title
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {string|Color} color
   * @param {string} pattern
   * @param {Object} [options]
   */
  function PendulumNumberControl( title, property, range, pattern, color, options ) {
    options = merge( {
      hasReadoutProperty: null,
      minTick: null,
      maxTick: null,
      sliderPadding: 0,
      createBottomContent: null
    }, options );

    const numberControlOptions = merge( {
      delta: 0.01,
      layoutFunction: NumberControl.createLayoutFunction4( options ),

      // subcomponent options
      titleNodeOptions: {
        font: PendulumLabConstants.TITLE_FONT_BOLD,
        maxWidth: 70
      },
      numberDisplayOptions: {
        font: PendulumLabConstants.READOUT_FONT,
        valuePattern: pattern,
        maxWidth: 100,
        decimalPlaces: 2,
        useRichText: true
      },
      arrowButtonOptions: { scale: 0.56 },
      sliderOptions: null
    }, options );

    const sliderOptions = merge( {
      majorTickLength: 5,
      constrainValue: function( value ) {
        return Utils.roundSymmetric( value * 10 ) / 10;
      },
      thumbSize: PendulumLabConstants.THUMB_SIZE,
      thumbTouchAreaXDilation: PendulumLabConstants.THUMB_TOUCH_AREA_X_DILATION,
      thumbTouchAreaYDilation: PendulumLabConstants.THUMB_TOUCH_AREA_Y_DILATION,
      thumbFill: color,
      thumbFillHighlighted: Color.toColor( color ).colorUtilsBrighter( 0.6 ),
      majorTicks: [ {
        value: range.min,
        label: new Text( options.minTick || range.min, { font: PendulumLabConstants.TICK_FONT, maxWidth: 50 } )
      }, {
        value: range.max,
        label: new Text( options.maxTick || range.max, { font: PendulumLabConstants.TICK_FONT, maxWidth: 50 } )
      } ]
    }, options.sliderOptions );

    const trackWidth = 500;
    const testControlSliderOptions = merge( {}, sliderOptions, {
      trackSize: new Dimension2( trackWidth, PendulumLabConstants.TRACK_HEIGHT )
    } );
    numberControlOptions.sliderOptions = testControlSliderOptions;
    const testControl = new NumberControl( title, property, range, numberControlOptions );

    const testWidth = testControl.width;
    testControl.dispose();
    const numberControlSliderOptions = merge( {}, sliderOptions, {
      trackSize: new Dimension2( trackWidth + PendulumLabConstants.RIGHT_CONTENT_WIDTH - testWidth, PendulumLabConstants.TRACK_HEIGHT )
    } );
    numberControlOptions.sliderOptions = numberControlSliderOptions;
    NumberControl.call( this, title, property, range, numberControlOptions );
  }

  pendulumLab.register( 'PendulumNumberControl', PendulumNumberControl );

  return inherit( NumberControl, PendulumNumberControl );
} );
