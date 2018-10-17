import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import "./styles.css";

const images = {
  github: ""
};

class App extends React.Component {
  width = 500;
  height = 500;
  frames = [];

  state = {
    nodes: []
  };

  componentDidMount() {
    this.startWebWorker();
    setInterval(this.renderFrame, 5);
  }

  startWebWorker = () => {
    this.worker = new Worker("/worker.js");

    this.worker.onmessage = event => {
      switch (event.data.type) {
        case "tick":
          return this.ticked(event.data.nodes);
      }
    };
    this.tick();
  };

  tick = () =>
    this.worker.postMessage({
      nodes: this.state.nodes,
      height: this.height,
      width: this.width
    });

  stopWebWorker = () => {
    this.worker && this.worker.terminate();
    this.worker = null;
  };

  ticked = nodes => {
    this.frames = [...this.frames, ...nodes];
  };

  renderFrame = () => {
    console.log(`frame buffer ${this.frames.length}`);
    if (this.frames.length === 0) {
      return;
    } else if (this.frames.length < 60) {
      this.setState({ nodes: this.frames[this.frames.length - 1] });
      this.tick();
    }

    const nodes = this.frames.shift();
    const { height, width } = this;
    var u = d3
      .select("svg")
      .selectAll("circle")
      .data(nodes);

    u.enter()
      .append("circle")
      .attr("r", function(d) {
        return d.radius;
      })
      .merge(u)
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });

    u.exit().remove();

    u.append("div").attr("class", d => d.image);
  };

  addNode = () => {
    console.log(this.frames);
    this.setState(
      {
        nodes: [
          ...this.frames[this.frames.length - 1],
          {
            radius: 20,
            x: this.width / 2 - 2 + Math.random() * 4,
            y: -10,
            vy: 5,
            vx: 0,
            image: "github"
          }
        ]
      },
      () => {
        this.tick();
      }
    );
  };

  render() {
    return (
      <div className="App" style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={this.addNode}>add circle</button>
        <svg ref="canvas" width={this.width} height={this.height} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
