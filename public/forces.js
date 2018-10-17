export const simTimer = () => {
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
      node.simulate += 1;
      if (node.simulate > 1000) {
        node.fx = node.x;
        node.fy = node.y;
      }
    }
  }

  force.initialize = function(_) {
    nodes = _;
  };

  return force;
};

export const boundingBox = () => {
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

export const gravity = () => {
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
