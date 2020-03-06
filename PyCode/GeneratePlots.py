import pandas as pd
import numpy as np
import json
from bokeh.models import ColumnDataSource
from bokeh.plotting import figure
from bokeh.embed import components
from bokeh.models import TapTool, GeoJSONDataSource, NumeralTickFormatter, LinearColorMapper, LogColorMapper, HoverTool
from bokeh.models.glyphs import Text
from bokeh.models.callbacks import CustomJS
from bokeh.layouts import column, row, gridplot
from bokeh.transform import dodge

from bokeh.palettes import brewer
from bokeh.io import show #To be removed later


# PLOT 1 : Bar plot for countries taking in Venezuelans
# Can try side by side instead of stack

df1 = pd.read_csv("c_people_from_ven.csv")
df1['Total'] = df1.sum(axis=1)

years = list(range(2005, 2019))
years = [str(year) for year in years]


y = np.zeros(len(years)).tolist()
s12 = ColumnDataSource(data=dict(x=years, y=y))

p12 = figure(plot_width=480, plot_height=280, title="Select a country to see more", toolbar_location=None)
p12.sizing_mode = 'scale_width'
p12.outline_line_alpha = 0

p12.line(x='x', y='y', source=s12, line_width=4, color="#FF954D")

p12.xaxis.axis_line_color = "#575757"
p12.xaxis.minor_tick_line_color = None
p12.xaxis.major_tick_line_color = "#878787"
p12.xaxis.major_tick_out = 1


p12.y_range.start = 0
p12.yaxis.axis_line_color = "#575757"
p12.yaxis.minor_tick_line_color = None
p12.yaxis.major_tick_line_color = "#878787"
p12.yaxis.major_tick_out = 1
p12.yaxis.formatter = NumeralTickFormatter(format="0.0a")


filtered = df1.nlargest(5, 'Total')
Country = filtered['Country'].tolist()
Country.reverse()
s11 = ColumnDataSource(filtered)

p11 = figure(y_range=Country, plot_width=490, plot_height=280, title="Venezuelan Refugees (2018)",
             toolbar_location="above", tools="hover", tooltips="Refugees: @2018")
p11.sizing_mode = 'scale_width'
p11.outline_line_alpha = 0

p11.hbar(right='2018', y='Country', height=0.70, source=s11, color="#FF954D")

p11.yaxis.axis_line_color = "#575757"
p11.yaxis.major_tick_line_color = None
p11.yaxis.major_tick_out = 1
p11.ygrid.grid_line_color = None

p11.x_range.start = 0
p11.xaxis.axis_line_color = None
p11.xaxis.minor_tick_line_color = None
p11.xaxis.major_tick_line_color = "#878787"
p11.xaxis.major_tick_out = 1
p11.xaxis.formatter = NumeralTickFormatter(format="0.0a")

#p11.hover.tooltips=["Click to find out more"]

callback1 = CustomJS(args=dict(s11=s11, s12=s12), code=
"""
var inds = cb_data.source.selected['1d'].indices
var d11 = s11.data
var d12 = s12.data
d12['y'] = []

for (var i = 2005; i<2019; i++) {
    d12['y'].push(d11[i.toString(10)][inds])
    console.log(d12['y'])
}

s12.change.emit()
""")
p11.add_tools(TapTool(callback=callback1))



# PLOT 2 : Colombia demographics

df = pd.read_csv("c_demo_colombia.csv",dtype=str)
df['Density'] = pd.to_numeric(df[' Population']) / pd.to_numeric(df[' Areakm2'])
df['Density'] = df['Density'].round(2)
df[' Illiteracy'] = pd.to_numeric(df[' Illiteracy'], errors='coerce')
df[' Unemployment'] = pd.to_numeric(df[' Unemployment'], errors='coerce')
df[' Poverty'] = pd.to_numeric(df[' Poverty'], errors='coerce')
df[' TOTALVen'] = pd.to_numeric(df[' TOTALVen'], errors='coerce')

df.fillna("NA", inplace=True)

dataToAdd = df.set_index('DPTO').T.to_dict('list')

with open('Colombia.geojson', 'r') as f:
    data = json.load(f)


for feat in data['features']:
    ToAdd = dataToAdd[feat['properties']['DPTO']]
    feat['properties']['Name'] = ToAdd[0]
    feat['properties']['Refugees'] = ToAdd[1]
    feat['properties']['Area'] = ToAdd[2]
    feat['properties']['Population'] = ToAdd[3]
    feat['properties']['Unemployment'] = ToAdd[4]
    feat['properties']['Poverty'] = ToAdd[5]
    feat['properties']['Illiteracy'] = ToAdd[6]
    feat['properties']['Density'] = ToAdd[7]


with open('new.geojson', 'w') as f:
    json.dump(data, f)


with open(r'new.geojson') as f:
    geo_src = GeoJSONDataSource(geojson=f.read())

#palette = brewer['OrRd'][9]
#palette.reverse()
#palette = ["#C12546", "#CB4762", "#D4687F", "#D9798D", "#DE8A9B", "#E29AAA", "#E7ABB8",
#           "#ECBCC6", "#F3D5DB", "#FAEEF1", "#FFFFFF"]
palette = ["#181335", "#48276F", "#6C397F", "#8C4D84", "#B5648F", "#DD6F86", "#F68A7B", "#FDAE84", "#FDD6A4", "#FBFCCA"]
palette.reverse()
color_mapper = LogColorMapper(palette=palette)
color_mapper_lin = LinearColorMapper(palette=palette)
m_fill_alpha = 0.8
# m_line_color = "#140D35"
# m_line_color = "#EFEFEF"
m_line_color = "#FFFFFF"
m_line_width = 1
m_line_alpha = 0.8


p21 = figure(title="Venezuelan Refugees", width=550, height=660, x_axis_location=None, y_axis_location=None, toolbar_location="left", tools="pan,wheel_zoom,reset")
p21.grid.grid_line_color = None
p21.sizing_mode = 'scale_width'
p21.outline_line_alpha = 0

p21.patches('xs', 'ys', fill_color={'field': 'Refugees', 'transform': color_mapper}, fill_alpha=m_fill_alpha,
            line_color=m_line_color, line_width=m_line_width+1, line_alpha=m_line_alpha, source=geo_src,
            selection_fill_color={'field': 'Refugees', 'transform': color_mapper})
p21.x_range.start = -80
p21.x_range.end = -66
p21.y_range.start = -5
p21.y_range.end = 13
p21.min_border_left = 0
p21.min_border_right = 0

s22 = ColumnDataSource(dict(x=[-79.5, -79.5], y=[-4.5, -3.8], text=["Venezuelan Refugees:", "Department:"]))
display1 = Text(x="x", y="y", text="text")
p21.add_glyph(s22, display1)


p22 = figure(title="Population Density (sq.km)", width=275, height=330, x_axis_location=None, y_axis_location=None,
             toolbar_location="left", tools=[],
             x_range=p21.x_range, y_range=p21.y_range)
#p22.sizing_mode = 'scale_width'
p22.grid.grid_line_color = None
p22.outline_line_alpha = 0
p22.toolbar.logo = None
p22.min_border_left = 0
p22.min_border_right = 0

p22.patches('xs', 'ys', fill_color={'field': 'Density', 'transform': color_mapper}, fill_alpha=m_fill_alpha,
            line_color=m_line_color, line_width=m_line_width, line_alpha=m_line_alpha, source=geo_src)

s23 = ColumnDataSource(dict(x=[-79.5], y=[-4.5], text=["Population Density:"]))
display2 = Text(x="x", y="y", text="text", text_font_size="9pt")
p22.add_glyph(s23, display2)


p23 = figure(title="Unemployment", width=275, height=330, x_axis_location=None, y_axis_location=None,
             toolbar_location="left", tools=[],
             x_range=p21.x_range, y_range=p21.y_range)
#p23.sizing_mode = 'scale_width'
p23.grid.grid_line_color = None
p23.outline_line_alpha = 0
p23.toolbar.logo = None
p23.min_border_left = 0
p23.min_border_right = 0

p23.patches('xs', 'ys', fill_color={'field': 'Unemployment', 'transform': color_mapper}, fill_alpha=m_fill_alpha,
            line_color=m_line_color, line_width=m_line_width, line_alpha=m_line_alpha, source=geo_src)

s24 = ColumnDataSource(dict(x=[-79.5], y=[-4.5], text=["Unemployment:"]))
display3 = Text(x="x", y="y", text="text", text_font_size="9pt")
p23.add_glyph(s24, display3)


p24 = figure(title="Poverty", width=275, height=330, x_axis_location=None, y_axis_location=None,
             toolbar_location="left", tools=[],
             x_range=p21.x_range, y_range=p21.y_range)
#p24.sizing_mode = 'scale_width'
p24.grid.grid_line_color = None
p24.outline_line_alpha = 0
p24.toolbar.logo = None
p24.min_border_left = 0
p24.min_border_right = 0

p24.patches('xs', 'ys', fill_color={'field': 'Poverty', 'transform': color_mapper}, fill_alpha=m_fill_alpha,
            line_color=m_line_color, line_width=m_line_width, line_alpha=m_line_alpha, source=geo_src)

s25 = ColumnDataSource(dict(x=[-79.5], y=[-4.5], text=["Poverty:"]))
display4 = Text(x="x", y="y", text="text", text_font_size="9pt")
p24.add_glyph(s25, display4)


p25 = figure(title="Illiteracy", width=275, height=330, x_axis_location=None, y_axis_location=None,
             toolbar_location="left", tools=[],
             x_range=p21.x_range, y_range=p21.y_range)
#p25.sizing_mode = 'scale_width'
p25.grid.grid_line_color = None
p25.outline_line_alpha = 0
p25.toolbar.logo = None
p25.min_border_left = 0
p25.min_border_right = 0

p25.patches('xs', 'ys', fill_color={'field': 'Illiteracy', 'transform': color_mapper}, fill_alpha=m_fill_alpha,
            line_color=m_line_color, line_width=m_line_width, line_alpha=m_line_alpha, source=geo_src)

s26 = ColumnDataSource(dict(x=[-79.5], y=[-4.5], text=["Illiteracy:"]))
display5 = Text(x="x", y="y", text="text", text_font_size="9pt")
p25.add_glyph(s26, display5)

p26 = figure(width=275, height=330, x_axis_location=None, y_axis_location=None, toolbar_location=None)
p26.outline_line_alpha = 0
p27 = figure(width=275, height=330, x_axis_location=None, y_axis_location=None, toolbar_location=None)
p27.outline_line_alpha = 0

callback2 = CustomJS(args=dict(s21=geo_src, s22=s22, s23=s23, s24=s24, s25=s25, s26=s26), code=
    """
    var inds = cb_data.source.selected['1d'].indices
    var d21 = s21.data
    var d22 = s22.data
    var d23 = s23.data
    var d24 = s24.data
    var d25 = s25.data
    var d26 = s26.data

    d22['text'] = []
    var str1 = "Venezuelan Refugees: "
    var str2 = "Department: "
    var str3 = "Population Density: "
    var str4 = "Unemployment: "
    var str5 = "Poverty: "
    var str6 = "Illiteracy: "

    var refug = d21['Refugees'][inds]
    var popu = d21['Density'][inds]
    var unem = d21['Unemployment'][inds]
    var pov = d21['Poverty'][inds]
    var illi = d21['Illiteracy'][inds]

    d22['text'][0] = str1.concat(refug.toString(10))
    d22['text'][1] = str2.concat(d21['Name'][inds])
    d23['text'][0] = str3.concat(popu.toString(10))
    d24['text'][0] = str4.concat(unem.toString(10), "%")
    d25['text'][0] = str5.concat(pov.toString(10), "%")
    d26['text'][0] = str6.concat(illi.toString(10), "%")

    s22.change.emit()
    s23.change.emit()
    s24.change.emit()
    s25.change.emit()
    s26.change.emit()
    """)

p21.add_tools(TapTool(callback=callback2))

hover = HoverTool()
hover.tooltips = [("Department", "@Name"),("Refugees", "@Refugees")]
p21.tools.append(hover)


# PLOT 3: Asylum applications
# Pending Asylum applications

# Stacked Bar plot for a few years
df3 = pd.read_csv("c_pending.csv")
df3['rdecisions'] = df3['decisions'].rolling(3, min_periods=1).sum()


s31 = ColumnDataSource(df3)

p31 = figure(x_range =(1999, 2019), plot_height=380, plot_width=600, title="Asylum Applications",
             toolbar_location=None)
p31.vbar(x=dodge('Year', -0.16, range=p31.x_range), top='applied', width=0.3, color="#DDCC85", source=s31, legend_label="Applications")
p31.vbar(x=dodge('Year', 0.16, range=p31.x_range), top='pending', width=0.3, color="#DD8494", source=s31, legend_label="Pending")

p31.line(x='Year', y='rdecisions', source=s31, legend_label="Average Decisions", line_width=5, color="#2AA089")

p31.outline_line_alpha = 0
p31.sizing_mode = 'scale_width'
p31.legend.location = "top_left"

p31.xaxis.axis_line_color = "#575757"
p31.xaxis.minor_tick_line_color = None
p31.xaxis.major_tick_line_color = "#878787"
p31.xaxis.major_tick_out = 1
p31.xgrid.grid_line_color = None
p31.xaxis.ticker = [2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2018]


p31.y_range.start = 0
p31.yaxis.axis_line_color = "#575757"
p31.yaxis.minor_tick_line_color = None
p31.yaxis.major_tick_line_color = "#878787"
p31.xaxis.major_tick_out = 1
p31.yaxis.formatter = NumeralTickFormatter(format="0.0a")


# PLOT 4: Immigration
df4 = pd.read_csv("c_immigration.csv")

s41 = ColumnDataSource(df4)

p41 = figure(plot_width=480, plot_height=350, title="Migration from & to Colombia", toolbar_location=None)
p41.sizing_mode = 'scale_width'
p41.outline_line_alpha = 0


p41.line(x='Year', y='fromc', color="#3AB1CC", source=s41, line_width=4, legend_label="From Colombia")
p41.line(x='Year', y='toc', color="#DD8494", source=s41, line_width=4, legend_label="To Colombia")

p41.legend.location = "top_left"

p41.x_range.start = 2000
p41.xaxis.axis_line_color = "#575757"
p41.xaxis.minor_tick_line_color = None
p41.xaxis.major_tick_line_color = "#878787"
p41.xaxis.major_tick_out = 1
p41.xaxis.ticker = [2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2018]

p41.y_range.start = 0
p41.yaxis.axis_line_color = "#575757"
p41.yaxis.minor_tick_line_color = None
p41.yaxis.major_tick_line_color = "#878787"
p41.yaxis.major_tick_out = 1
p41.yaxis.formatter = NumeralTickFormatter(format="0.0a")

# show(column(row(p11, p12),
#             row(p21,column(row(p23,p24,p25),row(p22,p26,p27), sizing_mode='scale_width')),
#             row(p31, p41)))

# Once done list all plots in a dictionary and generate script and div boxes to be added in the html file.
plots = {'plot1': row(p11, p12), 'plot2': p21,
         'plot3': column(row(p23,p24,p25),row(p22,p26,p27), sizing_mode='scale_width'),
         'plot4': p31,
         'plot5': p41}

script, div = components(plots)

with open('plots.js', 'w') as f:
    f.write(script[10:(len(script)-10)])

with open('plotsdiv.txt', 'w') as f:
    f.write(str(div))

print(len(script))
print(script[0:8])
print(script[(len(script)-9):len(script)])
print(div)
