# Libraries
library('shiny')
library('ggplot2')
library('googleVis')
library('plotly')
library('forecast')

# Data
data("iris")
data("Fruits")

# Point data from Dubai Marina
df <-
  read.table("www/data/datosBuildingsXYZ.csv", header = TRUE, sep = ",")

# Data for Time-Series Forecast
timese <-
  ts(
    WWWusage, start = c(2008, 1), end = c(2016, 1), frequency = 12
  )
fit <- StructTS(timese, "trend")
fit2 <- StructTS(timese, "level")

# Shiny Server
shinyServer(function(input, output) {
  
  # Index1 - Time Series
  output$plot1 <- renderPlot({
    selectedForecast <- input$selectForecast
    selectedConfidence <- input$setConfidence
    
    ifelse(
      test = selectedForecast == "trend",
      yes = plot(
        forecast(
          fit, level = c(selectedConfidence), sub = "Confidence Interval 70% ~ 90% or Determined by user", ylab = "Y Axis Variable", main = "Forecast Linear Structural Model @ Trend-Wise", ylim = c(0,400)
        )
      ),
      no = plot(
        forecast(
          fit2, level = c(selectedConfidence), sub = "Confidence Interval 70% ~ 90% or Determined by user", ylab = "Y Axis Variable", main = "Forecast Linear Structural Model @ Level-Wise", ylim = c(0,400)
        )
      )
    )
    
  })
  
  # Index2 - Heatmap
  output$divHtml <- renderUI({
    radius <- input$radius
    colorGradient <- input$color
    opacity <- input$opacity
    blur <- input$blur
    
    
    dfSubset <-
      subset(x = df, year == input$years, select = c("lon", "lat", "value"))
    
    j <-
      paste0("[",dfSubset[,"lat"], ",", dfSubset[,"lon"], ",", dfSubset[,"value"], "]", collapse =
               ",")
    j <- paste0("[",j,"]")
    
    mapa <-
      HTML(
        paste(
          "<script>",
          sprintf("var addressPoints = %s;", j),
          "addressPoints = addressPoints.map(function(p) {
          return [p[0], p[1]];});
          if(map.hasLayer(heat)) {
          map.removeLayer(heat);  
                                };

          var heat = L.heatLayer(addressPoints, {minOpacity:", opacity,", radius:", radius, colorGradient, ", blur:", blur,"}).addTo(map);
          </script>"
        ), sep = ""
      )
    
    return(mapa)
    
  })
  
  # Index3
  output$plot3 <- renderPlotly({
    # size of the bins depend on the input 'bins'
    
    gg <- ggplot(mpg, aes(displ, hwy, colour = class)) +
      geom_point() +
      geom_smooth(se = FALSE, method = "lm")
    ggplot(mpg, aes(displ, hwy)) +
      geom_point() +
      geom_smooth(span = 0.8) +
      facet_wrap( ~ drv)
    
    # Convert the ggplot to a plotly
    p <- ggplotly(gg)
    p
    
  })
  
  # Index4
  output$plot4 <- renderPlotly({
    # size of the bins depend on the input 'bins'
    size <- input$bins3
    
    gg <- ggplot(iris, aes(x = Petal.Width)) +
      geom_histogram(aes(y = ..density.., fill = Petal.Length), bins = size)
    
    # Convert the ggplot to a plotly
    p <- ggplotly(gg)
    p
    
  })
  
})
