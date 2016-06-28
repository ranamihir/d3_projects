var data = [];

var e = json_data.series["Series 1"].points;

for(var i = 0; i < e.length; i++) {
  data.push([e[i].coordinates[0], e[i].coordinates[1], Math.abs(e[i].coordinates[0] - e[i].coordinates[1])]);
}

visualize_scatterchart(data);

function visualize_scatterchart(data) {
    var margin = {top: 0.2*window.innerHeight, right: 0.2*window.innerWidth, bottom: 0.2*window.innerHeight, left: 0.2*window.innerWidth},
        width = 0.6*window.innerWidth,
        height = 0.6*window.innerHeight;
    
    var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[0]; })])
              .range([ 0, width ]);
  
    var y = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[1]; })])
              .range([ height, 0 ]);
    
    var chart = d3.select('body')
                  .append('svg:svg')
                  .attr('width', width + margin.right + margin.left)
                  .attr('height', height + margin.top + margin.bottom)
                  .attr('class', 'chart')

    var main = chart.append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'main');
      
    // Draw the x axis
    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient('bottom');

    main.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis dark')
        .call(xAxis);

    // Draw the y axis
    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient('left');

    main.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'main axis dark')
        .call(yAxis);

    var g = main.append('svg:g'); 
  
    var color = d3.scale.linear()
                  .domain([d3.min(data, function(d) { return d[2];}), d3.max(data, function(d) { return d[2];})])
                  .range([0.2, 1]);  

    g.selectAll('scatter-dots')
    .data(data)
    .enter().append('svg:circle')
            .attr('cx', function (d,i) { return x(d[0]); } )
            .attr('cy', function (d) { return y(d[1]); } )
            .attr('r', 4)
            .attr('class', 'dark')
            .style('fill-opacity', function(d) { return color(d[2]); });

    var padding_y = Math.max(50, 0.07*window.innerHeight),
        padding_x = Math.max(60, 0.045*window.innerWidth);
    
    g.append('text')
     .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + padding_y) + ')')
     .attr('class', 'dark')
     .style('text-anchor', 'middle')
     .style('font-size', '14')
     .text('Actual value');

    g.append('text')
     .attr('transform', 'rotate(-90)')
     .attr('y',  - padding_x)
     .attr('x', - (height / 2))
     .attr('dy', '1em')
     .attr('class', 'dark')
     .style('text-anchor', 'middle')
     .style('font-size', '14')
     .text('Predicted Value');

    var min  = Math.min(d3.max(data, function(d) { return d[0]; }),d3.max(data, function(d) { return d[1]; }));

    var line = g.append('line')
                .attr('x1', x(0))
                .attr('y1',  y(0))
                .attr('x2', x(min))
                .attr('y2', y(min))
                .attr('class', 'dark')
                .attr('stroke-width', 2);
    
    $('.axis path').addClass('dark');
    $('.main text').css('fill', 'white');
    $('line').css('stroke', 'green');
}

$('#select_theme' ).change(function() {
    var theme = $('#select_theme option:selected').val();
    changeTheme(theme);
});

function changeTheme(theme) {
    var opposite_theme = theme === 'dark' ? 'light' : 'dark';
    var text_fill = theme === 'dark' ? 'white' : 'black';
    var line_stroke = theme === 'dark' ? 'green' : 'black';
    $('body').addClass(theme).removeClass(opposite_theme);
    $('circle').addClass(theme).removeClass(opposite_theme);
    $('.text').addClass(theme).removeClass(opposite_theme);
    $('.axis path').addClass(theme).removeClass(opposite_theme);
    $('.main text').css('fill', text_fill);
    $('line').css('stroke', line_stroke);
}