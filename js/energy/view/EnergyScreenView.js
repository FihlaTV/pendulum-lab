// Copyright 2014-2019, University of Colorado Boulder

/**
 * Main view node for Energy screen in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const EnergyBox = require( 'PENDULUM_LAB/energy/view/EnergyBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const PendulumLabScreenView = require( 'PENDULUM_LAB/common/view/PendulumLabScreenView' );

  /**
   * @constructor
   *
   * @param {PendulumLabModel} model
   */
  function EnergyScreenView( model, options ) {

    PendulumLabScreenView.call( this, model, options );

    // @protected {Property.<number>}
    this.chartHeightProperty = new NumberProperty( 200 );

    // create and add energy graph node to the bottom layer
    const energyGraphNode = new EnergyBox( model, this.chartHeightProperty, {
      left: this.layoutBounds.left + PendulumLabConstants.PANEL_PADDING,
      top: this.layoutBounds.top + PendulumLabConstants.PANEL_PADDING
    } );
    this.energyGraphLayer.addChild( energyGraphNode );

    // @protected {EnergyBox}
    this.energyGraphNode = energyGraphNode;

    // move ruler and stopwatch to the right side
    this.rulerNode.centerX += ( energyGraphNode.width + 10 );
    model.ruler.setInitialLocationValue( this.rulerNode.center );

    this.setStopwatchInitialPosition();

    this.resizeEnergyGraphToFit();
  }

  pendulumLab.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( PendulumLabScreenView, EnergyScreenView, {
    /**
     * Changes the chart height so that the energy graph fits all available size
     * @protected
     */
    resizeEnergyGraphToFit: function() {
      const currentSpace = this.toolsControlPanelNode.top - this.energyGraphNode.bottom;
      const desiredSpace = PendulumLabConstants.PANEL_PADDING;

      this.chartHeightProperty.value += currentSpace - desiredSpace;
    }
  } );
} );
