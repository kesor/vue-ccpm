export default function () {
  let nodes;

  function force(alpha) {
    const k = alpha * 1;
    for (const node of nodes) {
      const nextNode = nodes.find(m => m.dependon.indexOf(node.id) >= 0);
      if (nextNode) {
        node.vy += nextNode.dependon.indexOf(node.id) === 0 && nextNode.y ?
          (nextNode.y - node.y) * k : 0;
        node.vx += node.x > nextNode.x - 40 ? -1 * k : 0;
        node.vx += node.x < nextNode.x - 80 ? 1 * k : 0;
      }
    }
  }

  force.initialize = (_) => {
    nodes = _;
  };

  return force;
}
