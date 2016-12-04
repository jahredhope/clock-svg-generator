class Clock extends React.Component {
  constructor(props) {
    super(props);
    if (typeof props.hours !== 'number') {
      const now = new Date();
      this.state = { hours: now.getHours(), minutes: now.getMinutes(), seconds: now.getSeconds() };
      this.setAuto();
    } else {
      this.state = {};
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (typeof nextProps.hours === 'number') {
      this.state = {};
      this.setControlled();
    } else if (typeof nextState.hours !== 'number') {
      this.setByDate(new Date());
    }
  }
  setByDate(datetime) {
    this.setState({ hours: datetime.getHours(), minutes: datetime.getMinutes(), seconds: datetime.getSeconds() });
  }
  setAuto() {
    this.timer = setInterval(() => {
      this.setByDate(new Date());
    }, this.props.tickInterval || 1000);
  }
  setControlled() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  isControlled() {
    return typeof this.props.hours === 'number';
  }
  render() {
    const {
      outerGutter = 10,
      clockIconGutter = 100,
      iconSize = 10,
      indictatorCount = 12,
      indicatorDistance = 0.8,
      strokeWidth = 4,
      hideSeconds = false,
      useNumbers = true,
      showCircle = true,
      viewBoxHeight = 314,
      viewBoxWidth = 314
    } = this.props;

    let { hours, minutes, seconds } = this.isControlled() ? this.props : this.state;
    hours = typeof hours === 'number' && !isNaN(hours) ? hours : 0;

    minutes = typeof minutes === 'number' && !isNaN(minutes) ? minutes : 0;

    seconds = typeof seconds === 'number' && !isNaN(seconds) ? seconds : 0;

    const radius = viewBoxWidth / 2 - outerGutter;

    const height = radius * 2;
    const width = radius * 2;

    const circleRadius = Math.round(radius);

    const middleX = viewBoxHeight / 2;
    const middleY = viewBoxWidth / 2;

    const hoursInRadians = ((hours + minutes % 60 / 60) / 12 - 1 / 4) * 2 * Math.PI;
    const hoursX = Math.round(Math.cos(hoursInRadians) * radius / 2 + middleX);
    const hoursY = Math.round(Math.sin(hoursInRadians) * radius / 2 + middleY);

    const minutesInRadians = (minutes / 60 - 1 / 4) * 2 * Math.PI;
    const minutesX = Math.round(Math.cos(minutesInRadians) * radius / 1.3 + middleX);
    const minutesY = Math.round(Math.sin(minutesInRadians) * radius / 1.3 + middleY);

    const secondsInRadians = (seconds / 60 - 1 / 4) * 2 * Math.PI;
    const secondsX = Math.round(Math.cos(secondsInRadians) * radius / 1.3 + middleX);
    const secondsY = Math.round(Math.sin(secondsInRadians) * radius / 1.3 + middleY);

    const indictators = new Array(indictatorCount).fill(0).map((zero, index) => {
      const indexInRadians = (index / indictatorCount - 1 / 4) * 2 * Math.PI;
      return {
        x: Math.round(Math.cos(indexInRadians) * radius * indicatorDistance + middleX),
        y: Math.round(Math.sin(indexInRadians) * radius * indicatorDistance + middleX),
        text: index === 0 ? '12' : Math.round(12 / indictatorCount * index).toString()
      };
    });

    return React.createElement(
      'svg',
      { style: Object.assign({ 'stroke': 'currentColor', 'fill': 'currentColor' }, this.props.style), className: this.props.className, version: '1.1', xmlns: 'http://www.w3.org/2000/svg', viewBox: `0 0 ${ viewBoxHeight } ${ viewBoxWidth }`, strokeWidth: strokeWidth },
      showCircle && React.createElement('circle', { cx: middleX, cy: middleY, r: circleRadius, fill: 'none' }),
      React.createElement('circle', { cx: middleX, cy: middleY, r: strokeWidth / 2, stroke: 'none' }),
      indictators && indictators.map(({ x, y, text }, index) => {
        return useNumbers ? React.createElement(
          'text',
          { key: index, x: x, y: y + iconSize * 2, stroke: 'none', textAnchor: 'middle', fontSize: iconSize * 5 },
          text
        ) : React.createElement('circle', { key: index, cx: x, cy: y, r: iconSize, fill: 'none' });
      }),
      React.createElement('line', { x1: middleX, y1: middleY, x2: hoursX, y2: hoursY }),
      React.createElement('line', { x1: middleX, y1: middleY, x2: minutesX, y2: minutesY }),
      !hideSeconds && typeof seconds === 'number' && React.createElement('line', { x1: middleX, y1: middleY, x2: secondsX, y2: secondsY, strokeWidth: strokeWidth / 2 })
    );
  }
}

Clock.propTypes = {
  tickInterval: React.PropTypes.number,
  hours: React.PropTypes.number,
  minutes: React.PropTypes.number,
  seconds: React.PropTypes.number,
  outerGutter: React.PropTypes.number,
  indicatorDistance: React.PropTypes.number,
  indictatorCount: 4,
  iconSize: React.PropTypes.number,
  useNumbers: React.PropTypes.bool,
  showCircle: React.PropTypes.bool,
  hideSeconds: React.PropTypes.bool
};

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class ClockApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      outerGutter: 3,
      indicatorDistance: 0.8,
      indictatorCount: 4,
      strokeWidth: 4,
      radius: 50,
      iconSize: 10,
      useNumbers: true,
      showCircle: true,
      hideSeconds: false,
      viewBoxHeight: 314,
      viewBoxWidth: 314

    };
  }
  render() {
    console.log('RENDER', 'ClockApp', this.state);

    const field = field => {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          null,
          field
        ),
        typeof this.state[field] === 'boolean' ? React.createElement('input', { type: 'checkbox', checked: this.state[field], onChange: event => {
            this.setState({ [field]: event.target.checked });
          } }) : React.createElement('input', { type: 'text', value: this.state[field], onChange: event => {
            this.setState({
              [field]: !isNaN(parseFloat(event.target.value)) ? parseFloat(event.target.value) : undefined
            });
          } })
      );
    };
    return React.createElement(
      'div',
      { style: { maxWidth: 800 } },
      React.createElement(Clock, _extends({}, this.state, { style: { maxWidth: 400, color: 'black' } })),
      React.createElement('br', null),
      Object.keys(this.state).map(field),
      React.createElement('br', null),
      React.createElement(
        'label',
        null,
        'Generated SVG'
      ),
      React.createElement(
        'div',
        null,
        ReactDOMServer.renderToStaticMarkup(React.createElement(Clock, this.state))
      )
    );
  }
}

ReactDOM.render(React.createElement(ClockApp, null), document.getElementById('root'));
