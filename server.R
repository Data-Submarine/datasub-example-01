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
  # Index1
  output$plot1 <- renderGvis({
    
    gvisBubbleChart(Fruits, idvar="Fruit", xvar="Sales", yvar="Expenses", sizevar="Profit", options=list(colorAxis="{colors: ['lightblue', 'blue']}"))
    
  })
  
  # Index2
  output$plot2 <- renderPlot({
    
    # size of the bins depend on the input 'bins'
    size <- input$bins2
    
    gg <- ggplot(iris, aes(x = Petal.Length)) +
      geom_histogram(aes(y = ..density..), bins = size)
    
    return(gg)
    
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
      facet_wrap(~drv)
    
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