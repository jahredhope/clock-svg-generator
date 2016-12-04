import Clock from './Clock.js';


const tickInterval = 20
const spinSpeed = 250

class ClockApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hours: undefined,
      minutes: undefined,
      seconds: undefined,
      outerGutter: 30,
      indicatorDistance: 0.8,
      indictatorCount: 4,
      strokeWidth: 10,
      iconSize: 30,
      useNumbers: true,
      showCircle: true,
      hideSeconds: false,
      viewBoxHeight: 1000,
      viewBoxWidth: 1000

    }
  }
  stopSpin() {
    if (this.spinTimer) {
      clearInterval(this.spinTimer)
      this.spinTimer = null
    }
  }
  startSpin() {
    this.stopSpin()
    this.state.hours = typeof this.state.hours === 'number' ? this.state.hours : 0
    this.state.minutes = typeof this.state.minutes === 'number' ? this.state.minutes : 0
    this.state.seconds = typeof this.state.seconds === 'number' ? this.state.seconds : 0

    this.spinTimer = setInterval(() => {
      const newTime = (this.state.hours * 3600) + (this.state.minutes * 60) + this.state.seconds + (spinSpeed * (tickInterval/1000))
      this.setState({hours: Math.floor(newTime / 3600 % 60), minutes: Math.floor(newTime / 60 % 60), seconds: Math.floor(newTime % 60)})
    }, tickInterval)
  }

  render() {
    const field = (field, index) => {
      return (
        <div key={index}>
          <label>{field}</label>
          {
            typeof this.state[field] === 'boolean'
              ? <input type="checkbox" checked={this.state[field]} onChange={(event)=>{
                this.setState({[field]: event.target.checked})
              }} />
              : <input type="number" value={this.state[field]} onChange={(event)=>{
                this.setState({
                  [field]: (!isNaN(parseFloat(event.target.value))
                  ? parseFloat(event.target.value)
                  : undefined)
                })
              }
              } />
          }
        </div>
      )}
    return (
      <section>
        <div className="horizontalFlex">
          <div>
            <Clock {...this.state} className="clock" />
            <button onClick={() => this.spinTimer ? this.stopSpin() : this.startSpin()}>SPIN</button>
          </div>
          <div>
            <div id="options">
              {Object.keys(this.state).map(field)}
            </div>
          </div>
        </div>
        <h2>Generated SVG</h2>
        <div id="staticMarkup">
          {ReactDOMServer.renderToStaticMarkup(<Clock {...this.state} />)}
        </div>
      </section>
    )
  }
}

ReactDOM.render(
  <ClockApp />,
  document.getElementById('root')
);
