// Copyright 2014-2015, University of Colorado Boulder

/**
 * Single pendulum model.
 *
 * @author Andrey Zelenkov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PeriodTrace = require( 'PENDULUM_LAB/common/model/PeriodTrace' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TWO_PI = Math.PI * 2;

  // scratch vector for convenience
  var scratchVector = new Vector2();

  /**
   * Constructor for single pendulum model.
   *
   * @param {number} mass - mass of pendulum, kg.
   * @param {number} length - length of pendulum, m.
   * @param {string} color - color of pendulum.
   * @param {boolean} isVisible - Initial visibility of pendulum.
   * @param {Property.<number>} gravityProperty - Property with current gravity value.
   * @param {Property.<number>} frictionProperty - Property with current friction value.
   * @param {Property.<boolean>} isPeriodTraceVisibleProperty - Flag property to track check box value of period trace visibility.
   * @param {boolean} isPeriodTraceRepeating
   * @constructor
   */
  function Pendulum( mass, length, color, isVisible, gravityProperty, frictionProperty, isPeriodTraceVisibleProperty, isPeriodTraceRepeating ) {
    var self = this;

    // save link to global properties
    // @private
    this.gravityProperty = gravityProperty;
    this.frictionProperty = frictionProperty;

    PropertySet.call( this, {
      // Primary variables
      length: length, // length of pendulum in meters
      mass: mass, // mass of pendulum in kg
      angle: 0, // radians, 0 indicates straight down, pi/2 is to the right
      angularVelocity: 0, // angular velocity in rad/s

      // Derived variables
      angularAcceleration: 0, // angular acceleration in rad/s^2
      position: new Vector2( 0, 0 ), // from the rotation point
      velocity: new Vector2( 0, 0 ),
      acceleration: new Vector2( 0, 0 ),
      kineticEnergy: 0, // Joules
      potentialEnergy: 0, // Joules
      thermalEnergy: 0, // Joules
      totalEnergy: 0, // Joules

      // UI??
      isUserControlled: false, // flag: is pendulum currently being dragged
      isTickVisible: false,  // flag: is pendulum tick visible on protractor
      isVisible: isVisible, // flag: is pendulum visible
      energyMultiplier: 40 // coefficient for drawing energy graph
    } );

    // @public
    this.stepEmitter = new Emitter();
    this.userMovedEmitter = new Emitter();
    this.crossingEmitter = new Emitter();
    this.peakEmitter = new Emitter();
    this.resetEmitter = new Emitter();

    // default color for this pendulum
    // @public (read-only)
    this.color = color; // {string}
    
    // possible length range in meters
    this.lengthRange = new Range( 0.1, 2.0, length ); // @public (read-only)

    // possible mass range in kg
    this.massRange = new Range( 0.1, 2.10, mass ); // @public (read-only)

    this.periodTrace = new PeriodTrace( this, isPeriodTraceVisibleProperty, isPeriodTraceRepeating ); // @private


    // make tick on protractor visible after first drag
    this.isUserControlledProperty.lazyLink( function( isUserControlled ) {
      if ( isUserControlled ) {
        self.isTickVisible = true; // Seems like an UI-specific issue, not model

        self.angularVelocity = 0;
        self.updateDerivedVariables( false );
      }
    } );

    // make the angle value visible after the first drag
    this.angleProperty.lazyLink( function() {
      if ( self.isUserControlled ) {
        self.updateDerivedVariables( false );
        self.userMovedEmitter.emit();
      }
    } );

    // update the angular velocity when the length changes
    this.lengthProperty.lazyLink( function( newLength, oldLength ) {
      self.angularVelocity = self.angularVelocity * oldLength / newLength;
      self.updateDerivedVariables( false ); // preserve thermal energy
    } );

    this.updateListener = this.updateDerivedVariables.bind( this, false ); // don't add thermal energy on these callbacks
    this.massProperty.lazyLink( this.updateListener );
    gravityProperty.lazyLink( this.updateListener );
  }

  pendulumLab.register( 'Pendulum', Pendulum );

  return inherit( PropertySet, Pendulum, {
    /**
     * Function that returns the instantaneous angular acceleration
     * @param {number} theta - angular position
     * @param {number} omega - angular velocity
     * @returns {number}
     * @private
     */
    omegaDerivative: function( theta, omega ) {
      return -this.frictionTerm( omega ) - ( this.gravityProperty.value / this.length ) * Math.sin( theta );
    },

    /**
     * Function that returns the tangential drag force on the pendulum per unit mass per unit length
     * The friction term has units of angular acceleration.
     * The friction has a linear and quadratic component (with speed)
     * @param {number} omega - the angular velocity of the pendulum
     * @returns {number}
     * @private
     */
    frictionTerm: function( omega ) {
      return this.frictionProperty.value * this.length / Math.pow( this.mass, 1 / 3 ) * omega * Math.abs( omega ) +
             this.frictionProperty.value / Math.pow( this.mass, 2 / 3 ) * omega;
    },

    /**
     * Stepper function for the pendulum model.
     * It uses a Runge-Kutta approach to solve the angular differential equation
     * @param {number} dt
     * @public
     */
    step: function( dt ) {
      var theta = this.angle;

      var omega = this.angularVelocity;

      var numSteps = Math.max( 7, dt * 120 );

      // 10 iterations typically maintains about ~11 digits of precision for total energy
      for ( var i = 0; i < numSteps; i++ ) {
        var step = dt / numSteps;

        // Runge Kutta (order 4), where the derivative of theta is omega.
        var k1 = omega * step;
        var l1 = this.omegaDerivative( theta, omega ) * step;
        var k2 = ( omega + 0.5 * l1 ) * step;
        var l2 = this.omegaDerivative( theta + 0.5 * k1, omega + 0.5 * l1 ) * step;
        var k3 = ( omega + 0.5 * l2 ) * step;
        var l3 = this.omegaDerivative( theta + 0.5 * k2, omega + 0.5 * l2 ) * step;
        var k4 = ( omega + l3 ) * step;
        var l4 = this.omegaDerivative( theta + k3, omega + l3 ) * step;
        var newTheta = Pendulum.modAngle( theta + ( k1 + 2 * k2 + 2 * k3 + k4 ) / 6 );
        var newOmega = omega + ( l1 + 2 * l2 + 2 * l3 + l4 ) / 6;

        // did the pendulum crossed the vertical axis (from below)
        // is the pendulum going from left to right or vice versa, or (is the pendulum on the vertical axis and changed position )
        if ( (newTheta * theta < 0) || (newTheta === 0 && theta !== 0 ) ) {
          this.cross( i * step, ( i + 1 ) * step, newOmega > 0, theta, newTheta );
        }

        // did the pendulum reach a turning point
        // is the pendulum changing is speed from left to right or is the angular speed zero but wasn't zero on the last update
        if ( (newOmega * omega < 0) || (newOmega === 0 && omega !== 0 ) ) {
          this.peak( theta, newTheta );
        }

        theta = newTheta;
        omega = newOmega;
      }

      // update the angular variables
      this.angle = theta;
      this.angularVelocity = omega;

      // update the derived variables, taking into account the transfer to thermal energy if friction is present
      this.updateDerivedVariables( this.frictionProperty.value > 0 );

      this.stepEmitter.emit1( dt );
    },

    /**
     * Function that emits when the pendulum is crossing the equilibrium point (theta=0)
     * Given that the time step is finite, we attempt to do a linear interpolation, to find the
     * precise time at which the pendulum cross the vertical.
     * @param {number} oldDT
     * @param {number} newDT
     * @param {boolean} isPositiveDirection
     * @param {number} oldTheta
     * @param {number} newTheta
     * @private
     */
    cross: function( oldDT, newDT, isPositiveDirection, oldTheta, newTheta ) {
      // If we crossed near oldTheta, our crossing DT is near oldDT. If we crossed near newTheta, our crossing DT is close
      // to newDT.
      var crossingDT = Util.linear( oldTheta, newTheta, oldDT, newDT, 0 );

      this.crossingEmitter.emit2( crossingDT, isPositiveDirection );
    },

    /**
     * Sends a signal that the peak angle (turning angle) has been reached
     * It sends the value of the peak angle
     * @param {number} oldTheta
     * @param {number} newTheta
     * @private
     */
    peak: function( oldTheta, newTheta ) {
      // TODO: we could get a much better theta estimate.
      // a better estimate is theta =  ( oldTheta + newTheta ) / 2 + (dt/2)*(oldOmega^2+newOmega^2)/(oldOmega-newOmega)
      var turningAngle = (oldTheta + newTheta > 0) ? Math.max( oldTheta, newTheta ) : Math.min( oldTheta, newTheta );
      this.peakEmitter.emit1( turningAngle );
    },

    /**
     * Given the angular position and velocity, this function updates derived variables :
     * namely the various energies( kinetic, thermal, potential and total energy)
     * and the linear variables (position, velocity, acceleration) of the pendulum
     * @param {boolean} energyChangeToThermal - is Friction present in the model
     * @private
     */
    updateDerivedVariables: function( energyChangeToThermal ) {
      var speed = Math.abs( this.angularVelocity ) * this.length;

      this.angularAcceleration = this.omegaDerivative( this.angle, this.angularVelocity );
      var height = this.length * ( 1 - Math.cos( this.angle ) );

      var oldKineticEnergy = this.kineticEnergy;
      this.kineticEnergy = 0.5 * this.mass * speed * speed;

      var oldPotentialEnergy = this.potentialEnergy;
      this.potentialEnergy = this.mass * this.gravityProperty.value * height;

      if ( energyChangeToThermal ) {
        this.thermalEnergy += ( oldKineticEnergy + oldPotentialEnergy ) - ( this.kineticEnergy + this.potentialEnergy );
      }
      this.totalEnergy = this.kineticEnergy + this.potentialEnergy + this.thermalEnergy;

      this.position.setPolar( this.length, this.angle - Math.PI / 2 );
      this.velocity.setPolar( this.angularVelocity * this.length, this.angle ); // coordinate frame -pi/2, but perpendicular +pi/2

      // add up net forces for the acceleration

      // tangential friction
      this.acceleration.setPolar( -this.frictionTerm( this.angularVelocity ) / this.mass, this.angle );
      // tangential gravity
      this.acceleration.add( scratchVector.setPolar( -this.gravityProperty.value * Math.sin( this.angle ), this.angle ) );
      // radial (centripetal acceleration)
      this.acceleration.add( scratchVector.setPolar( this.length * this.angularVelocity * this.angularVelocity, this.angle + Math.PI / 2 ) );

      this.velocityProperty.notifyObserversStatic();
      this.accelerationProperty.notifyObserversStatic();
      this.positionProperty.notifyObserversStatic();
    },

    /**
     * Reset all the properties of this model.
     * @public
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.updateDerivedVariables( false );
    },

    /**
     * Function that determines if the pendulum is stationary, i.e. is controlled by the user or not moving
     * @returns {boolean}
     * @public (read-only)
     */
    isStationary: function() {
      return this.isUserControlled || ( this.angle === 0 && this.angularVelocity === 0 && this.angularAcceleration === 0 );
    },

    /**
     * Functions returns an approximate period of the pendulum
     * The so-called small angle approximation is a lower bound to the true period in absence of friction
     * This function is currently used to fade out the path of the period trace
     * @public
     * @returns {number}
     */
    getApproximatePeriod: function() {
      return 2 * Math.PI * Math.sqrt( this.length / this.gravityProperty.value );
    },

    /**
     * Resets the motion of the Pendulum
     * @public
     */
    resetMotion: function() {
      this.angleProperty.reset();
      this.angularVelocityProperty.reset();
      this.isTickVisibleProperty.reset(); // TODO: why?

      this.periodTrace.resetPathPoints();

      this.updateDerivedVariables( false );

      this.resetEmitter.emit();
    },
    /**
     * Resets the thermal energy to zero
     * @public
     */
    resetThermalEnergy: function() {
      this.thermalEnergyProperty.reset();
    }
  }, {
    /**
     * Takes our angle modulo 2pi between -pi and pi.
     * @public
     *
     * @param {number} angle
     * @returns {number}
     */
    modAngle: function( angle ) {
      angle = angle % TWO_PI;

      if ( angle < -Math.PI ) {
        angle += TWO_PI;
      }
      if ( angle > Math.PI ) {
        angle -= TWO_PI;
      }

      return angle;
    }
  } );
} );