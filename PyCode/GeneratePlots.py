from bokeh.models import ColumnDataSource
from bokeh.plotting import figure
from bokeh.embed import components


# Once done list all plots in a dictionary and generate script and div boxes to be added in the html file.
plots = {'plot1': p1, 'plot2': p2, 'plot3': p3}

script, div = components(plots)
print(script)
print(div)