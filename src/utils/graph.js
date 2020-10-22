/**
 * An object that hold info of an edge in a graph.
 * @param {number} from the start vertex index of this edge
 * @param {number} to the end vertex index of this edge
 * @param {number} cost the weight/cost of going from start vertex to end vertex
 */
export function Edge (from, to, cost) {
  this.from = from;
  this.to = to;
  this.cost = cost;
  this.toString = () => `(${this.from}, ${this.to}, ${this.cost})`;
}

/**
 * Add a new edge to the graph
 * @param {Map<number, Edge[]>} graph Adjaciency list representation of a graph
 * @param {number} from the start vertex index of this edge
 * @param {number} to the end vertex index of this edge
 * @param {number} cost the weight/cost of going from start vertex to end vertex
 */
export const addDirectedEdge = (graph, from, to, cost) => {
  let list = graph.get(from);
  if (!list) {
    list = [];
    graph.set(from, list);
  }

  list.push(new Edge(from , to, cost));
};
