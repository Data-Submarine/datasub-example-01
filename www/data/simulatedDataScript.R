### Create heatmap dataset

options(digits = 8)

# Load requiered libreries
library(maptools)
library(mapview)
library(reshape)

# Load buildings centroids from shapefile
# centroides <- readShapePoints(fn = "/home/guzman/Documentos/Data-Submarine/DataSubmarine/Shapefiles Dubai/buildingsInDubai_centroids", proj4string = CRS("+init=epsg:4326"))

centroides <- readShapePoints(fn = "/home/guzman/Documentos/Data-Submarine/DataSubmarine/Shapefiles Dubai/pointSamplingCentroidsOverDubaiZones", proj4string = CRS("+init=epsg:4326"))

# Keep Long, Lat and Zone
buildingscoords <- data.frame(centroides@coords, centroides@data)

# Change column names
colnames(buildingscoords) <- c("lon", "lat", "zone")

# Add random values per year
for(i in 2009:2016) {
  buildingscoords <- cbind(buildingscoords, sample(x = seq(1, 100, 1), replace = TRUE, size = nrow(buildingscoords)))
}

colnames(buildingscoords) <- c("lon", "lat", "zone", "Year2009", "Year2010", "Year2011", "Year2012", "Year2013", "Year2014", "Year2015", "Year2016")

### Add 3-5% per year to Emirates Hill zone
rowsEmiratesHills <- nrow(buildingscoords[which(buildingscoords$zone == "Emirates Hills"), ])
queryEmiratesHills <- which(buildingscoords$zone == "Emirates Hills")

for(i in 1:7) {
  
buildingscoords[queryEmiratesHills, i + 4] <- buildingscoords[queryEmiratesHills, i + 3] + buildingscoords[queryEmiratesHills, i + 3] * rnorm(n = rowsEmiratesHills, mean = 4, sd = 0.33)/100
  
}

# Plot increment
plot(sort(buildingscoords[queryEmiratesHills, 4]), type = "l", ylab = "Prices", main = "Emirates Hill - 3 to 5% increment anually", ylim = c(0, 150))
lines(sort(buildingscoords[queryEmiratesHills, 5]), col = "red")
lines(sort(buildingscoords[queryEmiratesHills, 6]), col = "blue")
lines(sort(buildingscoords[queryEmiratesHills, 7]), col = "green")
lines(sort(buildingscoords[queryEmiratesHills, 8]), col = "darkred")
lines(sort(buildingscoords[queryEmiratesHills, 9]), col = "darkblue")
lines(sort(buildingscoords[queryEmiratesHills, 10]), col = "orange")
lines(sort(buildingscoords[queryEmiratesHills, 11]), col = "darkgreen")

### Remove 2% per year to Jumeirah Lakes Towers zone
rowsJumeirahLakesTowers <- nrow(buildingscoords[which(buildingscoords$zone == "Jumeirah Lakes Towers"), ])
queryJumeirahLakesTowers <- which(buildingscoords$zone == "Jumeirah Lakes Towers")

for(i in 1:7) {
  
  buildingscoords[queryJumeirahLakesTowers, i + 4] <- buildingscoords[queryJumeirahLakesTowers, i + 3] - buildingscoords[queryJumeirahLakesTowers, i + 3] * rnorm(n = rowsJumeirahLakesTowers, mean = 4, sd = 0.33)/100
  
}

# Plot increment
plot(sort(buildingscoords[queryJumeirahLakesTowers, 4]), type = "l", ylab = "Prices", main = "Jumeirah Lakes Towers - 2% decrement anually", ylim = c(0, 150))
lines(sort(buildingscoords[queryJumeirahLakesTowers, 5]), col = "red")
lines(sort(buildingscoords[queryJumeirahLakesTowers, 6]), col = "blue")
lines(sort(buildingscoords[queryJumeirahLakesTowers, 7]), col = "green")
lines(sort(buildingscoords[queryJumeirahLakesTowers, 8]), col = "darkred")
lines(sort(buildingscoords[queryJumeirahLakesTowers, 9]), col = "darkblue")
lines(sort(buildingscoords[queryJumeirahLakesTowers, 10]), col = "orange")
lines(sort(buildingscoords[queryJumeirahLakesTowers, 11]), col = "darkgreen")

# Calculate increment per year in all the zones and add columns with this data
for(i in 1:7) {
  rate <- (buildingscoords[, i + 4] - buildingscoords[, i + 3] ) / 100
  buildingscoords <- cbind(buildingscoords, rate)
}

colnames(buildingscoords) <- c("lon", "lat", "zone", "Year2009", "Year2010", "Year2011", "Year2012", "Year2013", "Year2014", "Year2015", "Year2016", "Rate2010", "Rate2011", "Rate2012", "Rate2013", "Rate2014", "Rate2015", "Rate2016")

# Reshape data
mdata <- melt(data = buildingscoords[, c(1:3,12:18)], id = c("lon", "lat", "zone"))
mdata$variable <- as.numeric(substring(text = mdata$variable, first = 5, last = 8))
colnames(mdata) <- c("lon", "lat", "zone", "year", "rateValue")
                               
# Write table
# write.table(x = coordinatesBuildings, file = "/home/guzman/Documentos/Data-Submarine/DataSubmarine/datosBuildingsXYZ.csv", row.names = FALSE, sep = ",")

write.table(x = mdata, file = "/home/guzman/Documentos/GitHub/Data-Submarine/datasub-example-01/www/data/heatmapDataSimulatedExample.csv", row.names = FALSE, sep = ",")



