var e = json_data.series['Series 1'].points;

var data = [], lineGraph;
for(var i = 0; i < e.length; i++) {
    data.push([e[i].coordinates[0], e[i].coordinates[1], Math.abs(e[i].coordinates[0] - e[i].coordinates[1])]);
}

visualize_roc_curve(data);

function visualize_roc_curve(data) {
    var margin = {top: 0, right: 0.2*window.innerHeight, bottom: 0, left: 0.2*window.innerHeight},
        width = 0.6*window.innerHeight,
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
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'main');

    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient('bottom');

    main.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis dark')
        .call(xAxis);

    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient('left');

    main.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'main axis dark')
        .call(yAxis);

    var g = main.append('svg:g'); 

    var padding_y = Math.max(50, 0.07*window.innerHeight),
        padding_x = Math.max(60, 0.045*window.innerWidth);

    var div = d3.select("body").append("div") 
                               .attr("class", "tooltip")       
                               .style("opacity", 0);

    g.append('text')
     .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + padding_y) + ')')
     .attr('class', 'dark')
     .style('text-anchor', 'middle')
     .style('font-size', '14')
     .text('False Positive Rate');

    g.append('text')
     .attr('transform', 'rotate(-90)')
     .attr('y',  - padding_x)
     .attr('x', - (height / 2))
     .attr('dy', '0.5em')
     .attr('class', 'dark')
     .style('text-anchor', 'middle')
     .style('font-size', '14')
     .text('True Positive Rate');

    g.selectAll('scatter-dots')
    .data(data)
    .enter().append('svg:circle')
            .attr('cx', function (d,i) { return x(d[0]); } )
            .attr('cy', function (d) { return y(d[1]); } )
            .attr('r', 10)
            .style('opacity', 0)
            .on("mouseover", function(d) {
                    var $this = $(this);
                    var x = Math.pow(d[0],2),
                        y = Math.pow(1 - d[1],2),
                        cp = Math.pow(x + y, 0.5);
                div.transition()
                    .duration(0)
                    .style("opacity", .9);
                div .html('<span> Cutoff = <br/>' + cp.toString() + '</span>')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");;
                })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    var lineFunction = d3.svg.line()
                         .x(function(d) { return x(d[0]); })
                         .y(function(d) { return y(d[1]); })
                         .interpolate('linear');

    lineGraph = g.append('path').attr('d', lineFunction(data))
                                .attr('stroke', 'orange')
                                .attr('stroke-width', 2)
                                .attr('fill', 'none');

    $('.axis path').addClass('dark');
    $('.main text').css('fill', 'white');
    $('line').css('stroke', 'white');
}

$('#theme_selector' ).change(function() {
    var theme = $('#theme_selector option:selected').val();
    changeTheme(theme);
});

function changeTheme(theme) {
    var opposite_theme = theme === 'dark' ? 'light' : 'dark';
    var text_fill = theme === 'dark' ? 'white' : 'black';
    var line_stroke = theme === 'dark' ? 'orange' : 'green';
    $('body').addClass(theme).removeClass(opposite_theme);
    $('circle').addClass(theme).removeClass(opposite_theme);
    $('.text').addClass(theme).removeClass(opposite_theme);
    $('line').css('stroke', text_fill);
    lineGraph.attr('stroke', line_stroke);
    $('.axis path').addClass(theme).removeClass(opposite_theme);
    $('.main text').css('fill', text_fill);
    $('#heading').css('color', text_fill);
}