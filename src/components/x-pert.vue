<template>
  <svg id="pert" oncontextmenu="return false" :width="width" :height="height">
    <svg:defs>

      <svg:marker id="start-arrow" viewBox="0 -5 10 10" refX=4 markerWidth=3 markerHeight=3 orient="auto">
        <svg:path d="M10,-5L0,0L10,5" />
      </svg:marker>

      <svg:marker id="end-arrow" viewBox="0 -5 10 10" refX=8 markerWidth=4 markerHeight=4 orient="auto">
        <svg:path d="M0,-5L10,0L0,5" />
      </svg:marker>

      <!-- line displayed when dragging across two nodes -->
      <svg:path class="link dragline hidden" d="M0,0L0,0" />

    </svg:defs>
  </svg>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';

export default {
  name: 'x-pert',
  data() {
    return {
      width: 600,
      height: 300,
      radius: 20,
      linkPathGroup: null,
      nodePathGroup: null,
      forceSimulation: null,
    };
  },
  computed: {
    ...mapGetters({
      tasks: 'tasklist',
    }),
    nodes() {
      return this.tasks.map(i => ({ id: i.id, r: this.radius, dependon: i.dependon }));
    },
    links() {
      const nodesCache = this.nodes;
      const links = []; // [ { source: (node), target: (node) }, ... ]
      for (let target = 0; target < nodesCache.length; target += 1) {
        for (let source = 0; source < nodesCache.length; source += 1) {
          if (nodesCache[target].dependon &&
              nodesCache[target].dependon.includes(nodesCache[source].id)) {
            links.push({
              source: nodesCache[source].index,
              target: nodesCache[target].index,
              distance: 50,
              strength: 1,
            });
          }
        }
      }
      return links;
    },
  },
  methods: {
    deltaRadius(d) {
      // calculate the x,y point just outside the node circle
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const gamma1 = Math.atan2(-dy, -dx);
      const gamma2 = Math.atan2(dy, dx);
      const tx1 = d.source.x - (Math.cos(gamma1) * this.radius);
      const ty1 = d.source.y - (Math.sin(gamma1) * this.radius);
      const tx2 = d.target.x - (Math.cos(gamma2) * (this.radius + 2));
      const ty2 = d.target.y - (Math.sin(gamma2) * (this.radius + 2));
      return { tx1, ty1, tx2, ty2 };
    },
    ticked() {
      // offset for links outside the radius, to make the arroheads show
      this.linkPathGroup
        .attr('x1', d => this.deltaRadius(d).tx1)
        .attr('y1', d => this.deltaRadius(d).ty1)
        .attr('x2', d => this.deltaRadius(d).tx2)
        .attr('y2', d => this.deltaRadius(d).ty2)
        ;
      this.nodePathGroup
        .attr('transform', d => `translate(${[d.x, d.y]})`)
        ;
    },
    dragStart(d) {
      if (!d3.event.active) {
        this.forceSimulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
    },
    dragProgress(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },
    dragEnd(d) {
      if (!d3.event.active) {
        this.forceSimulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    },
  },
  mounted() {
    this.width = this.$el.parentNode.getBoundingClientRect().width;
    // event handler when this component is mounted for the first time!
    this.forceSimulation = d3.forceSimulation(this.nodes)
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX(this.width / 2))
      .force('y', d3.forceY(this.height / 2))
      .force('links', d3.forceLink())
      .force('collide', d3.forceCollide(d => d.r + 8))
      .force('charge', d3.forceManyBody())
      ;

    // LINKS! Rendered first, even though they no longer overlap nodes.
    this.linkPathGroup = d3.select(this.$el)
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke', 'black')
      .attr('marker-end', 'url(#end-arrow)')
      .attr('style', 'stroke-width:2')
      ;

    // NODES! (groups)
    this.nodePathGroup = d3.select(this.$el)
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g.node')
      .data(this.nodes)
      .enter()
      .append('g')
      .classed('node', true)
      .call(d3.drag()
        .on('start', this.dragStart)
        .on('drag', this.dragProgress)
        .on('end', this.dragEnd)
      )
      ;
    // NODES! (circles)
    this.nodePathGroup.append('circle')
      .attr('r', d => d.r)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black')
      ;
    // NODES! (labels)
    this.nodePathGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dx', '0')
      .attr('dy', '0.25em')
      .text(d => d.id)
      ;

    // TICK TICK TICK!
    this.forceSimulation
      .nodes(this.nodes)
      .on('tick', this.ticked)
      ;

    // FORCES! Tweak the forces working in the simulation
    this.forceSimulation.force('links')
      .links(this.links)
      .distance(d => d.distance) // distance of each node to another
      .strength(d => d.strength)
      .iterations(this.links.length)
      ;
    this.forceSimulation.force('x')
      .strength(0.01)
      ;
    this.forceSimulation.force('y')
      .strength(0.01)
      ;
    this.forceSimulation.force('charge')
      .strength(0.001)
      ;
  },
};
</script>

<style>
</style>
