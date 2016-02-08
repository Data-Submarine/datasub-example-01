# Libraries
library('shiny')
library('ggplot2')
library('googleVis')
library('plotly')

# Data
data("iris")
data("Fruits")


# Shiny Server
shinyServer(function(input, output) {
  
  # Index1 - Time Series
  output$plot1 <- renderGvis({
    gvisBubbleChart(
      Fruits, idvar = "Fruit", xvar = "Sales", yvar = "Expenses", sizevar = "Profit", options =
        list(colorAxis = "{colors: ['lightblue', 'blue']}")
    )
    
  })
  
  # Index2 - Map
  #   output$mymap <- renderLeaflet({
  #     map = leaflet() %>% addTiles() %>% setView(lat = 25.0779, lng = 55.1386, zoom = 14) %>%
  #     addMarkers(lat = 25.079791, lng = 55.135020, popup="Nice, this is popuping! Tengo que sacarle el box...")
  #   })
  
  
  output$divHtml <- renderUI({
    
    radius <- input$radius
    colorGradient <- input$color
    
    mapa <- HTML(
      paste(
        "
        <div id='map'></div>

        <script>
        
        var map = L.map('map').setView([25.0779, 55.1386], 14);
        
        var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        }).addTo(map);
        
        addressPoints = addressPoints.map(function(p) {
        return [p[0], p[1]];
        });
        
        var heat = L.heatLayer(addressPoints, {radius:", radius, colorGradient, "}).addTo(map);
        
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