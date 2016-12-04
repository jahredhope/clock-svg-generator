class Clock extends React.Component {
  constructor(props) {
    super(props)
    if (typeof props.hours !== 'number') {
      const now = new Date()
      this.state = {hours: now.getHours(), minutes: now.getMinutes(), seconds: now.getSeconds()}
      this.setAuto()
    } else {
      this.state = {}
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (typeof nextProps.hours === 'number') {
      this.state = {}
      this.setControlled()
    } else if (typeof nextState.hours !== 'number') {
      this.setByDate(new Date())
    }
  }
  setByDate(datetime) {
    this.setState({hours: datetime.getHours(), minutes: datetime.getMinutes(), seconds: datetime.getSeconds()})
  }
  setAuto() {
    this.timer = setInterval(()=> {
      this.setByDate(new Date())
    }, this.props.tickInterval || 1000)
  }
  setControlled() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
  isControlled() {
    return typeof this.props.hours === 'number'
  }
  render() {
    const {
      outerGutter = 3,
      iconSize = 3,
      indictatorCount = 12,
      indicatorDistance = 0.8,
      strokeWidth = 1,
      hideSeconds = false,
      useNumbers = true,
      showCircle = true,
      viewBoxHeight = 100,
      viewBoxWidth = 100
    } = this.props

    let { hours, minutes, seconds } = this.isControlled() ? this.props : this.state
    hours = (typeof hours === 'number' && !isNaN(hours))
      ? hours : 0

    minutes = (typeof minutes === 'number' && !isNaN(minutes))
      ? minutes : 0

    seconds = (typeof seconds === 'number' && !isNaN(seconds))
      ? seconds : 0

    const radius = (viewBoxWidth / 2) - outerGutter

    const height = radius * 2
    const width = radius * 2

    const circleRadius = Math.round(radius)

    const middleX = viewBoxHeight / 2
    const middleY = viewBoxWidth / 2

    const hoursInRadians = (((hours + ((minutes%60)) / 60) / 12) - (1 / 4)) * 2 * Math.PI
    const hoursX = Math.round((Math.cos(hoursInRadians) * radius) / 2 + middleX)
    const hoursY = Math.round((Math.sin(hoursInRadians) * radius) / 2 + middleY)

    const minutesInRadians = (((minutes + (seconds%60/60)) / 60) - (1 / 4)) * 2 * Math.PI
    const minutesX = Math.round((Math.cos(minutesInRadians) * radius) / 1.3 + middleX)
    const minutesY = Math.round((Math.sin(minutesInRadians) * radius) / 1.3 + middleY)

    const secondsInRadians = ((seconds / 60) - (1 / 4)) * 2 * Math.PI
    const secondsX = Math.round((Math.cos(secondsInRadians) * radius) / 1.3 + middleX)
    const secondsY = Math.round((Math.sin(secondsInRadians) * radius) / 1.3 + middleY)

    const indictators = (new Array(indictatorCount))
      .fill(0)
      .map((zero, index) => {
        const indexInRadians = (index / indictatorCount - (1/4)) * 2 * Math.PI
        return {
          x: Math.round((Math.cos(indexInRadians) * radius) * indicatorDistance + middleX),
          y: Math.round((Math.sin(indexInRadians) * radius) * indicatorDistance + middleX),
          text: index === 0 ? '12' : Math.round((12 / indictatorCount) * (index)).toString()
        }
      })

    return (
      <svg style={Object.assign({'stroke': 'currentColor', 'fill': 'currentColor'}, this.props.style)} className={this.props.className} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewBoxHeight} ${viewBoxWidth}`} strokeWidth={strokeWidth}>
        {showCircle && <circle cx={middleX} cy={middleY} r={circleRadius} fill="none" />}
        <circle cx={middleX} cy={middleY} r={strokeWidth / 2} stroke="none" />

        {indictators &&
          indictators.map(({x, y, text}, index) => {
            return useNumbers
            ? <text key={index} x={x} y={y+(iconSize*2)} stroke="none" textAnchor="middle" fontSize={iconSize * 5}>{text}</text>
            : <circle key={index} cx={x} cy={y} r={iconSize} fill="none" />
          })
        }

        <line x1={middleX} y1={middleY} x2={hoursX} y2={hoursY} />
        <line x1={middleX} y1={middleY} x2={minutesX} y2={minutesY} />
        {!hideSeconds && typeof seconds === 'number'
          && <line x1={middleX} y1={middleY} x2={secondsX} y2={secondsY} strokeWidth={strokeWidth / 2} />
        }
      </svg>
    )
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
}

export default Clock;
