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
  }

  startWebWorker = () => {
    this.worker = new Worker("/worker.js");

    this.worker.onmessage = function(event) {
      console.log(event);
      switch (event.data.type) {
        case "tick":
          return this.ticked(event.data.nodes);
      }
    };
    this.tick();
  };

  stopWebWorker = () => this.worker.terminate();

  tick = () =>
    this.worker.postMessage({
      nodes: this.state.nodes,
      height: this.height,
      width: this.width
    });

  ticked = nodes => {
    this.frames = [...this.frames, nodes];
  };

  renderFrame = () => {
    if (this.frames.length === 0) {
      return;
    }
    const nodes = this.frames.pop();
    console.log(nodes);
    this.setState({ nodes }, this.tick);
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
    this.setState(
      {
        nodes: [
          ...this.state.nodes,
          {
            radius: 20,
            x: this.width / 2 - 2 + Math.random() * 4,
            y: -10,
            vy: 10,
            vx: 0,
            image: "github"
          }
        ]
      },
      () => {
        this.stopWebWorker();
        this.startWebWorker();
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
