# Libraries
library('shiny')
library('shinydashboard')
library('ggplot2')
library('googleVis')
library('plotly')
library('forecast')
library('AnomalyDetection')

# Data
data("iris")
data("Fruits")

# Point data from Dubai Marina
df <- read.table("www/data/heatmapDataSimulatedExample.csv", header = TRUE, sep = ",")

# Data for Time-Series Forecast
timese <- ts(WWWusage, start = c(2008, 1), end = c(2016, 1), frequency = 12)
fit <- StructTS(timese, "trend")
fit2 <- StructTS(timese, "level")

#Data for shiny dash
messageData <- data.frame(from = c("Data Submarine", "New User", "Support"), message = c("Welcome to the interactive dashboard!", "How do I register?", "Ideal server conditions."), stringsAsFactors = FALSE)


# Shiny Server ------------------------------------------------------------

shinyServer(function(input, output) {
  
  
  # Time Series - Index1.html -----------------------------------------------
  
  output$plot1 <- renderPlot({
    
    selectedForecast <- input$selectForecast
    selectedConfidence <- input$setConfidence
    
    ifelse(test = selectedForecast == "trend",
           yes = plot(forecast(fit, level = c(selectedConfidence), sub = "Confidence Interval 70% ~ 90% or Determined by user", ylab = "Y Axis Variable", main = "Forecast Linear Structural Model @ Trend-Wise", ylim = c(0,400))),
           no = plot(forecast(fit2, level = c(selectedConfidence), sub = "Confidence Interval 70% ~ 90% or Determined by user", ylab = "Y Axis Variable", main = "Forecast Linear Structural Model @ Level-Wise", ylim = c(0,400)))
           )
    })
  
  # Heatmap - Index2.html ---------------------------------------------------
  
  output$divHtml <- renderUI({
    
    radius <- input$radius
    colorGradient <- input$color
    opacity <- input$opacity
    blur <- input$blur
    rate <- input$valueRate/100
    
    dfSubset <- subset(x = df, year == input$years & rateValue >= rate[1] & rateValue <= rate[2], select = c("lon", "lat", "rateValue"))
    
    print(nrow(dfSubset))
    
    j <- paste0("[", dfSubset[, "lat"], ",", dfSubset[, "lon"], ",", dfSubset[, "rateValue"], "]", collapse = ",")
    j <- paste0("[", j, "]")
    
    mapa <- HTML(
        paste(
          "<script>",
          sprintf("var buildingsCoords = %s;", j),
          "buildingsCoords = buildingsCoords.map(function(p) {
          return [p[0], p[1]];});
          if(map.hasLayer(heat)) {
          map.removeLayer(heat);  
                                };
          var heat = L.heatLayer(buildingsCoords, {minOpacity:", opacity,", radius:", radius, colorGradient, ", blur:", blur,"}).addTo(map);
          </script>"
        ), sep = "")
    
    return(mapa)
    
  })
  
  # Dashboard - Index3.html -------------------------------------------------
  
  output$messageMenu <- renderMenu({
    # Code to generate each of the messageItems here, in a list. messageData
    # is a data frame with two columns, 'from' and 'message'.
    # Also add on slider value to the message content, so that messages update.
    msgs <- apply(messageData, 1, function(row) {
      
      messageItem(from = row[["from"]], message = paste(row[["message"]], input$text))
      
    })
    
    dropdownMenu(type = "messages", .list = msgs)
  })
  
  output$plot3 <- renderPlot({
    hist(rnorm(input$slider), main = "Data Submarine test dashboard #01")
  })
  
  output$infoBox <- renderInfoBox({
    
    infoBox("Progress", paste0(25 + input$slider, "%"), icon = icon("list"), color = "purple")
    
  })
  
    # Index4.html - About Us --------------------------------------------------
  
  output$plot4 <- renderPlotly({
    
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
  
  
  output$plot4b <- renderPlot({
    
    
  })
  
})






