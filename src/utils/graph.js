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
 * Add a new directed edge to the graph
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

/**
 * Add a new undirected edge to the graph
 * @param {Map<number, Edge[]>} graph Adjaciency list representation of a graph
 * @param {number} from one end of this edge
 * @param {number} to the other end of this edge
 * @param {number} cost the weight/cost of going from one vertex to another
 */
export const addUndirectedEdge = (graph, from, to, cost = 0) => {
  addDirectedEdge(graph, from, to, cost);
  addDirectedEdge(graph, to, from, cost);
};
