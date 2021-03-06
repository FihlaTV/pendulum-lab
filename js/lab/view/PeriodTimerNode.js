// Copyright 2014-2019, University of Colorado Boulder

/**
 * Period trace timer node in 'Pendulum Lab' simulation.
 *
 * @author Andrey Zelenkov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const merge = require( 'PHET_CORE/merge' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const pendulumLab = require( 'PENDULUM_LAB/pendulumLab' );
  const PendulumLabConstants = require( 'PENDULUM_LAB/common/PendulumLabConstants' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const periodString = require( 'string!PENDULUM_LAB/period' );
  const secondsPatternString = require( 'string!PENDULUM_LAB/secondsPattern' );

  const periodTimerBackgroundImage = require( 'mipmap!PENDULUM_LAB/period-timer-background.png' );

  /**
   * @constructor
   *
   * @param {PeriodTimer} periodTimer - Period timer
   * @param {Property.<boolean>} secondPendulumIsVisibleProperty - Second pendulum visibility property.
   * @param {Bounds2} layoutBounds - Bounds of screen view.
   * @param {Object} [options]
   */
  function PeriodTimerNode( periodTimer, secondPendulumIsVisibleProperty, layoutBounds, options ) {
    const self = this;

    options = merge( {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',
      cursor: 'pointer'
    }, options );

    Node.call( this, options );

    // creates Uturn arrow on the period timer tool
    const uArrowShape = new UTurnArrowShape( 10 );

    // creates triangle shape on play button by creating three lines at x,y coordinates.
    const playPauseSize = uArrowShape.bounds.height;
    const halfPlayStroke = 0.05 * playPauseSize;
    const playOffset = 0.15 * playPauseSize;
    const playShape = new Shape().moveTo( playPauseSize - halfPlayStroke * 0.5 - playOffset, 0 )
      .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseSize / 2 - halfPlayStroke - playOffset )
      .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseSize / 2 + halfPlayStroke + playOffset )
      .close()
      .getOffsetShape( -playOffset );

    // creates playPauseButton
    const playPauseButton = new BooleanRectangularToggleButton(
      new Path( uArrowShape, {
        fill: options.iconColor,
        center: Vector2.ZERO,
        pickable: false
      } ),
      new Path( playShape, {
        pickable: false,
        stroke: options.iconColor,
        fill: '#eef',
        lineWidth: halfPlayStroke * 2,
        center: Vector2.ZERO
      } ), periodTimer.isRunningProperty, {
        baseColor: options.buttonBaseColor,
        minWidth: 40
      } );
    playPauseButton.touchArea = playPauseButton.localBounds.dilated( 5 );

    function createPendulumIcon( color, label, padLeft ) {
      const highlightColor = Color.toColor( color ).colorUtilsBrighter( 0.4 );
      const rectBounds = new Bounds2( 0, 0, 17, 20 );
      const icon = new Node( {
        children: [
          Rectangle.bounds( rectBounds, {
            stroke: 'black',
            lineWidth: 0.5,
            fill: new LinearGradient( 0, 0, rectBounds.width, 0 ).addColorStop( 0, color )
                                                                .addColorStop( 0.2, highlightColor )
                                                                .addColorStop( 0.4, color )
                                                                .addColorStop( 1, color )
          } ),
          new Text( label, {
            fill: 'white',
            font: new PhetFont( 14 ),
            center: rectBounds.center
          } )
        ]
      } );

      // Don't pad next to the AB switch, but only away from it
      const touchArea = icon.localBounds.dilated( 5 );
      if ( padLeft ) {
        touchArea.maxX = icon.localBounds.maxX;
      }
      else {
        touchArea.minX = icon.localBounds.minX;
      }
      icon.touchArea = touchArea;
      return icon;
    }

    const firstPendulumIcon = createPendulumIcon( PendulumLabConstants.FIRST_PENDULUM_COLOR, '1', true );
    const secondPendulumIcon = createPendulumIcon( PendulumLabConstants.SECOND_PENDULUM_COLOR, '2', false );

    // creates switch icon for choosing the first or second pendulum
    const graphUnitsSwitch = new ABSwitch( periodTimer.activePendulumIndexProperty, 0, firstPendulumIcon, 1, secondPendulumIcon, {
      xSpacing: 3,
      switchSize: new Dimension2( 25, 12.5 ),
      thumbTouchAreaXDilation: 3.5,
      thumbTouchAreaYDilation: 3.5,
      setEnabled: null // Do not highlight the selected mass more than the other
    } );

    // Switch,Play button, and pendulum icon buttons at the bottom of the period timer tool.
    const periodTimerPendulaSelector = new HBox( {
      spacing: 10,
      children: [ graphUnitsSwitch, playPauseButton ]
    } );

    // Creates time text inside period timer tool.
    const readoutText = new Text( '', {
      font: PendulumLabConstants.PERIOD_TIMER_READOUT_FONT,
      maxWidth: periodTimerPendulaSelector.width * 0.80
    } );
    // present for the lifetime of the sim
    periodTimer.elapsedTimeProperty.link( function updateTime( value ) {
      readoutText.text =  StringUtils.fillIn( secondsPatternString, {
        seconds: Utils.toFixed( value, 4 )
      } );
    } );

    // Creates white background behind the time readout text in period timer tool.
    const textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 20, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)'
    } );

    // Creates the title, time readout, and period timer pendulum selector as one box in period timer tool.
    const vBox = new VBox( {
      spacing: 5,
      align: 'center',
      children: [
        new Text( periodString, {
          font: PendulumLabConstants.PERIOD_TIMER_TITLE_FONT,
          pickable: false,
          maxWidth: periodTimerPendulaSelector.width
        } ),
        new Node( {
          children: [ textBackground, readoutText ],
          pickable: false,
          maxWidth: periodTimerPendulaSelector.width
        } ),
        periodTimerPendulaSelector
      ]
    } );

    // background image
    const background = new Image( periodTimerBackgroundImage, {
      scale: 0.6,
      center: vBox.center
    } );
    this.addChild( background );

    // adds period timer contents on top of yellow background.
    this.addChild( new AlignBox( vBox, {
      alignBounds: background.bounds
    } ) );

    // switch to second pendulum when it visible only
    // present for the lifetime of the sim
    secondPendulumIsVisibleProperty.link( function( isVisible ) {
      periodTimerPendulaSelector.children = isVisible ? [ graphUnitsSwitch, playPauseButton ] : [ playPauseButton ];
      if ( !isVisible ) {
        periodTimer.activePendulumIndexProperty.value = 0;
      }
    } );

    this.movableDragHandler = new MovableDragHandler( periodTimer.locationProperty, {
      dragBounds: layoutBounds.erodedXY( this.width / 2, this.height / 2 ),
      allowTouchSnag: false
    } );
    // add drag and drop events
    this.addInputListener( this.movableDragHandler );

    // prevent dragging the PeriodTimer from the playPause Button and graphUnitSwitch
    const doNotStartDragListener = {
      down: function( event ) {
        event.handle();
      }
    };
    playPauseButton.addInputListener( doNotStartDragListener );
    graphUnitsSwitch.addInputListener( doNotStartDragListener );

    // add update of node location
    periodTimer.locationProperty.lazyLink( function( location ) {
      // Because location is initialized to be null
      if ( location ) {
        self.center = location;
      }
    } );

    // set visibility observer, present for the lifetime of the sim
    periodTimer.isVisibleProperty.linkAttribute( this, 'visible' );
  }

  pendulumLab.register( 'PeriodTimerNode', PeriodTimerNode );

  return inherit( Node, PeriodTimerNode );
} );
