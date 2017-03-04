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
import sameLevelForce from '../lib/d3-force/sameLevel';

export default {
  name: 'x-pert',
  data() {
    return {
      width: 600,
      height: 600,
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
              distance: 200,
              strength: 1,
            });
          }
        }
      }
      return links;
    },
  },
  methods: {
    deltaSourceRadius(d) {
      const sourceX = d.source.x + this.radius;
      const sourceY = d.source.y;
      const targetX = d.target.x - this.radius;
      const targetY = d.target.y;

      // calculate the x,y point just outside the node circle
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const gamma1 = Math.atan2(-dy, -dx);
      const tx = sourceX - (Math.cos(gamma1) * this.radius);
      const ty = sourceY - (Math.sin(gamma1) * this.radius);
      return { tx, ty };
    },
    deltaTargetRadius(d) {
      const sourceX = d.source.x + this.radius;
      const sourceY = d.source.y;
      const targetX = d.target.x - this.radius;
      const targetY = d.target.y;

      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const radius = this.radius + 2; // 2 is stroke width
      const scale = Math.hypot(dx, dy) / Math.hypot(
        radius,
        radius * (Math.abs(dy / dx) < 1 ? dy / dx : dx / dy),
      );
      const tx = targetX - (dx / scale);
      const ty = targetY - (dy / scale);

      return { tx, ty };
    },
    ticked() {
      // offset for links outside the radius, to make the arroheads show
      this.linkPathGroup
        .attr('x1', d => this.deltaSourceRadius(d).tx)
        .attr('y1', d => this.deltaSourceRadius(d).ty)
        .attr('x2', d => this.deltaTargetRadius(d).tx)
        .attr('y2', d => this.deltaTargetRadius(d).ty)
        ;
      this.nodePathGroup
        .attr('transform', d => `translate(${[d.x, d.y]})`)
        .selectAll('text')
        // .style('font-size', '0.3em')
        // .text(d => `${d.id} ${d.x.toPrecision(5)},${d.y.toPrecision(5)}`)
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
      .force('sameLevel', sameLevelForce())
      // .force('x', d3.forceX())
      // .force('y', d3.forceY())
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
      .call(
        d3.drag()
          .on('start', this.dragStart)
          .on('drag', this.dragProgress)
          .on('end', this.dragEnd))
      ;
    // NODES! (rectangles)
    this.nodePathGroup.append('rect')
      .attr('width', d => d.r * 4)
      .attr('height', d => d.r * 2)
      .attr('transform', d => `translate(-${2 * d.r}, -${d.r})`)
      .attr('fill', 'lightblue')
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
      .x(d => (this.width / this.links.length) * (d.index + 1))
      ;
    this.forceSimulation.force('y')
      .strength(0.01)
      ;
    // this.forceSimulation.force('x')
      // .x(d => d.px)
      // .strength(1)
      // .x(d => (this.width / this.links.length) * (d.index + 1))
      // ;
    // this.forceSimulation.force('y')
      // .y(d => d.py)
      // .strength(1)
      // ;
    // this.forceSimulation.force('charge')
    //   .strength(0.01)
    //   ;
  },
};
</script>

<style>
</style>
