// default dimension of svg
// const len = Math.min(window.innerWidth*2/5, window.innerHeight)
// const dimen = { width: len - 112, height: len - 112 }
const dimen = { width: 500, height: 500 }
const range = {
  x: { lo: -4.5, hi: 4.5 },
  y: { lo: -4.5, hi: 4.5 },
}
const MAX_SAMPLE = 2000;

const xScale = d3.scaleLinear()
  .domain([range.x.lo , range.x.hi])
  .range([0, dimen.width])
const yScale = d3.scaleLinear()
  .domain([range.y.lo , range.y.hi])
  .range([dimen.height, 0])

const xAxis = d3.axisBottom(xScale)
  .tickSize(-dimen.height)
  .tickPadding(6)
const yAxis = d3.axisLeft(yScale)
  .tickSize(-dimen.width)
  .tickPadding(6)

const line = d3.line()
  .x(d => xScale(d.x))
  .y(d => yScale(d.y))

const canvas = d3.select('.plot')
    .attr('width', dimen.width + 56*2)
    .attr('height', dimen.height + 56*2)
  .append('g')
    .attr('id', 'canvas')
    .attr('transform', `translate(56, 56)`)

// Draw Grid
// =========
const grid = canvas.append('g')
    .attr('class', 'grid')
// add vertical-grid
grid.append('g')
    .attr('transform', `translate(0, ${dimen.height})`)
    .call(xAxis)
// add horizontal-grid
grid.append('g')
    .call(yAxis)

// Draw Axis
// =========
const x_axis = [
  { x: xScale.domain()[0], y: 0 },
  { x: xScale.domain()[1], y: 0 },
]
const y_axis = [
  { x: 0, y: yScale.domain()[0] },
  { x: 0, y: yScale.domain()[1] },
]
const axis = canvas.append('g')
    .attr('class', 'axis')
  .selectAll('path')
    .data([x_axis, y_axis])
  .enter().append('path')
    .attr('d', line)

// Draw Function
// =============
const f = x => 1/x
const fn = []
let data = []
for(let i=0; i<=MAX_SAMPLE; i++) {
  const x = range.x.lo + i*((range.x.hi - range.x.lo)/MAX_SAMPLE)
  const y = f(x)
  if (!Number.isNaN(x) && !Number.isNaN(y) && Number.isFinite(x) && Number.isFinite(y) && range.y.lo <= y && y <= range.y.hi) {
    data.push({
      x: x,
      y: y
    })
  } else if (data.length) {
    fn.push(data)
    data = []
  }
}
if (data.length) { fn.push(data) }

// split data from vertical asymptote
// ***** detect vertical asymptote

const graph = canvas.append('g')
    .attr('class', 'fn')
  .selectAll('path')
    .data(fn)
  .enter().append('path')
    .attr('d', line)
