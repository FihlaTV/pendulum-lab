// Copyright 2002-2014, University of Colorado Boulder

/**
 * Single pendulum model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PENDULUM_LAB/common/model/Movable' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} mass of pendulum, kg
   * @param {number} length of pendulum, m
   * @param {string} color of pendulum
   * @constructor
   */
  function Pendulum( mass, length, color ) {
    var self = this;

    Movable.call( this, {
      angle: 0, // value of the angular displacement
      length: length, // length of pendulum
      mass: mass, // mass of pendulum
      acceleration: new Vector2( 0, 0 ), // acceleration value of pendulum
      velocity: new Vector2( 0, 0 ), // velocity value of pendulum
      isUserControlled: false, // flag: is pendulum currently dragging
      isTickVisible: false,  // flag: is pendulum tick visible on protractor

      // energies are in Joules
      kineticEnergy: 0,
      potentialEnergy: 0,
      thermalEnergy: 0,
      totalEnergy: 0
    } );

    // default color for this pendulum
    this.color = color;

    // additional properties for pendulum length
    this.lengthOptions = {
      range: new Range( 0.5, 2.5, length ), // possible length range
      step: 0.1, // absolute value changing after one step
      precision: 2 // numbers after decimal points
    };

    // additional properties for pendulum mass
    this.massOptions = {
      range: new Range( 0.1, 2.1, mass ), // possible mass range
      step: 0.1, // absolute value changing after one step
      precision: 2 // numbers after decimal points
    };

    // make tick on protractor visible after first drag
    this.property( 'isUserControlled' ).once( function() {
      self.isTickVisible = true;
    } );

    // common rounding length value, to prevent rounding in each setter
    this.property( 'length' ).link( function( length ) {
      self.length = Util.toFixedNumber( length, self.lengthOptions.precision );
    } );

    // common rounding mass value, to prevent rounding in each setter
    this.property( 'mass' ).link( function( mass ) {
      self.mass = Util.toFixedNumber( mass, self.massOptions.precision );
    } );
  }

  return inherit( Movable, Pendulum );
} );