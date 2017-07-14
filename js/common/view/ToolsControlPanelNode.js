// Copyright 2014-2015, University of Colorado Boulder

/**
 * Tools control panel node in 'Pendulum Lab' simulation.
 * Contains check box buttons to control visibility of ruler, stopwatch and period trace tools.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );

  // strings
  var rulerString = require( 'string!PENDULUM_LAB/ruler' );
  var stopwatchString = require( 'string!PENDULUM_LAB/stopwatch' );
  var periodTraceString = require( 'string!PENDULUM_LAB/periodTrace' );

  // constants
  var PANEL_WIDTH = PendulumLabConstants.LEFT_PANELS_MIN_WIDTH;
  var TEXT_OPTIONS = {
    font: new PhetFont( 11 ),
    pickable: false,
    maxWidth: PANEL_WIDTH * 0.80 // the maximum width of the text is 80% of the panel width
  };

  /**
   * @constructor
   *
   * @param {Property.<boolean>} isRulerProperty - property to control visibility of ruler.
   * @param {Property.<boolean>} isStopwatchProperty - property to control visibility of stopwatch.
   * @param {Property.<boolean>} isPeriodTraceProperty - property to control visibility of period trace tool.
   * @param {Object} [options]
   */
  function ToolsControlPanelNode( isRulerProperty, isStopwatchProperty, isPeriodTraceProperty, options ) {

    // @private
    this._labels = [
      new Text( rulerString, TEXT_OPTIONS ),
      new Text( stopwatchString, TEXT_OPTIONS ),
      new Text( periodTraceString, TEXT_OPTIONS )
    ];

    Panel.call( this,
      new Node( {
        children: [
          // necessary to expand panel
          new HStrut( PANEL_WIDTH ),

          new VerticalCheckBoxGroup( [ {
            content: this._labels[ 0 ],
            property: isRulerProperty
          }, {
            content: this._labels[ 1 ],
            property: isStopwatchProperty
          }, {
            content: this._labels[ 2 ],
            property: isPeriodTraceProperty
          }
          ], {
            spacing: 7,
            boxWidth: this._labels[ 0 ].height
          } )
        ]
      } ), _.extend( {}, PendulumLabConstants.PANEL_OPTIONS, options ) );
  }

  pendulumLab.register( 'ToolsControlPanelNode', ToolsControlPanelNode );

  return inherit( Panel, ToolsControlPanelNode, {
    /**
     * Set text of label selected by index.
     * @public
     *
     * @param {number} index - Index of label.
     * @param {string} text - New text for label.
     */
    setLabelText: function( index, text ) {
      this._labels[ index ].setText( text );
    }
  } );
} );
