importScripts("https://d3js.org/d3-collection.v1.min.js");
importScripts("https://d3js.org/d3-dispatch.v1.min.js");
importScripts("https://d3js.org/d3-timer.v1.min.js");
importScripts("https://d3js.org/d3-force.v1.min.js");
importScripts(
  "https://unpkg.com/d3-force-bounce@0.5.6/dist/d3-force-bounce.min.js"
);

onmessage = function(event) {
  var { nodes, width, height } = event.data;

  var simulation = d3
    .forceSimulation(nodes)
    .velocityDecay(0.02)
    .force("gravity", gravity().strength(0.2))

    .force(
      "bounce",
      forceBounce()
        .elasticity(0.9)
        .radius(function(d) {
          return d.radius;
        })
    )
    .force(
      "box",
      boundingBox()
        .tl({ x: 0, y: -100 })
        .br({ x: width, y: height })
    );

  simulation.tick();

  postMessage({ type: "end", nodes: nodes });
};

const boundingBox = () => {
  var nodes,
    tl = { x: 0, y: 0 },
    br = { x: 0, y: 0 },
    elasticity = 0.4;

  function force() {
    var i,
      n = nodes.length,
      node;

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      const min_x = tl.x + node.radius,
        min_y = tl.y + node.radius,
        max_x = br.x - node.radius,
        max_y = br.y - node.radius;

      if (node.x < min_x) {
        node.x = min_x;
        node.vx *= -1 * elasticity;
      } else if (node.x > max_x) {
        node.x = max_x;
        node.vx *= -1 * elasticity;
      }

      if (node.y < min_y) {
        node.y = min_y;
        node.vy *= -1 * elasticity;
      } else if (node.y > max_y) {
        node.y = max_y;
        node.vy *= -1 * elasticity;
      }
    }
  }

  force.initialize = function(_) {
    nodes = _;
  };

  force.br = function(_) {
    br = _;
    return force;
  };

  force.tl = function(_) {
    tl = _;
    return force;
  };

  return force;
};

const gravity = () => {
  var nodes,
    strength = 1;

  function force() {
    var i,
      n = nodes.length,
      node;

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      node.vy += strength;
    }
  }

  force.initialize = function(_) {
    nodes = _;
  };

  force.strength = function(_) {
    return arguments.length ? ((strength = +_), force) : strength;
  };

  return force;
};
