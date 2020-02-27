#%%
import pandas as pd
import numpy as np
from bokeh.models import ColumnDataSource
from bokeh.plotting import figure
from bokeh.embed import components
from bokeh.models import TapTool, GeoJSONDataSource
from bokeh.models.callbacks import CustomJS
from bokeh.layouts import row

from bokeh.palettes import brewer
from bokeh.io import show #To be removed later


# PLOT 1 : Bar plot for countries taking in Venezuelans
# Can try side by side instead of stack

# df = pd.read_csv("c_people_from_ven.csv")
# df['Total'] = df.sum(axis=1)
#
# years = list(range(2000, 2019))
# years = [str(year) for year in years]
#
#
# y = np.zeros(len(years)).tolist()
# s12 = ColumnDataSource(data=dict(x=years, y=y))
#
# p12 = figure(plot_height=400, title="Select a country to see more", toolbar_location=None)
# p12.line(x='x', y='y', source=s12, line_width=2)
#
#
# filtered = df.nlargest(5,'Total')
# Country = filtered['Country'].tolist()
# Country.reverse()
# s11 = ColumnDataSource(filtered)
#
# p11 = figure(y_range=Country, plot_height=400, title="Refugee Intake", toolbar_location="above", tools="hover")
# p11.hbar(right='Total', y='Country', height=0.4, source=s11)
# #p11.hover.tooltips=["Click to find out more"]
#
# callback1 = CustomJS(args=dict(s11=s11,s12=s12), code=
# """
# var inds = cb_data.source.selected['1d'].indices
# var d1 = s11.data
# var d2 = s12.data
# d2['y'] = []
#
# //var year = 2018
# //console.log(d1['2018'][0])
# //console.log(d1[year.toString(10)][0])
#
#
# for (var i = 2000; i<2019; i++) {
#     d2['y'].push(d1[i.toString(10)][inds])
# }
#
# s2.change.emit()
# """)
# p11.add_tools(TapTool(callback=callback1))
#
#
# # Stacked Bar plot for a few years
# # colors = brewer['Set3'][len(years)]
# # colors.reverse()
# # p1 = figure(y_range=Country, plot_height=500, title="Refugee Intake",
# #            toolbar_location=None, tools="hover", tooltips="$name @Country: @$name")
# # p1.hbar_stack(years, y='Country', height=0.4, color=colors, source=ColumnDataSource(filtered), legend_label=years)
# #
# # p1.x_range.start = 0
# # p1.x_range.end = max(df['Total'])
# # p1.y_range.range_padding = 0.1
# # p1.ygrid.grid_line_color = None
# # p1.axis.minor_tick_line_color = None
# # p1.outline_line_color = None
# # p1.legend.location = "bottom_right"
# # p1.legend.orientation = "vertical"
#
#
# show(row(p11, p12))


# PLOT 2 : Colombia demographics

with open(r'PyCode/Colombia.geojson') as f:
    geo_src = GeoJSONDataSource(geojson=f.read())

p21 = figure(title='France Département', x_axis_location=None, y_axis_location=None, width=500, height=500)
p21.grid.grid_line_color = None

p21.patches('xs', 'ys', fill_alpha=0.7,
         line_color='black', line_width=0.5, source=geo_src)


show(p21)

# Once done list all plots in a dictionary and generate script and div boxes to be added in the html file.
# plots = {'plot1': p1, 'plot2': p2, 'plot3': p3}

# script, div = components(plots)
# print(script)
# print(div)

#%%
