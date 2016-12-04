import Clock from './Clock.js';

class ClockApp extends React.Component {
  constructor(props) {
    super(props)
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

    }
  }
  render() {
    console.log('RENDER', 'ClockApp', this.state)

    const field = (field) => {
      return (
        <div>
          <label>{field}</label>
          {
            typeof this.state[field] === 'boolean'
              ? <input type="checkbox" checked={this.state[field]} onChange={(event)=>{
                this.setState({[field]: event.target.checked})
              }} />
              : <input type="text" value={this.state[field]} onChange={(event)=>{
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
      <div style={{maxWidth: 800}}>
        <Clock {...this.state} style={{maxWidth: 400, color: 'black'}} />
        <br />
        {Object.keys(this.state).map(field)}
        <br />
        <label>Generated SVG</label>
        <div>
          {ReactDOMServer.renderToStaticMarkup(<Clock {...this.state} />)}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <ClockApp />,
  document.getElementById('root')
);
