<template>
  <svg id="pert" oncontextmenu="return false" :width="width" :height="height">
    <svg:defs>

      <svg:marker id="start-arrow" viewBox="0 -5 10 10" refX=4 markerWidth=3 markerHeight=3 orient="auto">
        <svg:path d="M10,-5L0,0L10,5" fill="#000" />
      </svg:marker>

      <svg:marker id="end-arrow" viewBox="0 -5 10 10" refX=6 markerWidth=3 markerHeight=3 orient="auto">
        <svg:path d="M0,-5L10,0L0,5" fill="#000" />
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
      return this.tasks.map(i => ({ id: i.id, label: i.id, r: 20, dependon: i.dependon }));
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
              distance: 60,
              strength: 0.0001,
            });
          }
        }
      }
      return links;
    },
  },
  methods: {
    ticked() {
      this.linkPathGroup
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
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
      .force('links', d3.forceLink(this.links).iterations(6))
      .force('collide', d3.forceCollide(d => d.r + 8).iterations(6))
      .force('charge', d3.forceManyBody().strength(-150).distanceMax(1))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('y', d3.forceY(this.height / 2))
      .force('x', d3.forceX(this.width / 2))
      ;
    this.linkPathGroup = d3.select(this.$el)
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke', 'black')
      ;
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
    this.nodePathGroup.append('circle')
      .attr('r', d => d.r)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black')
      ;
    this.nodePathGroup.append('title')
      .text(d => d.label)
      ;
    this.nodePathGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dx', '')
      .attr('dy', '0.25em')
      .text(d => d.label)
      ;

    this.forceSimulation
      .nodes(this.nodes)
      .on('tick', this.ticked)
      ;

    this.forceSimulation.force('links')
      .links(this.links)
      .distance(d => d.distance) // distance of each node to another
      .strength(d => d.strength)
      ;
  },
};
</script>

<style>
</style>
