library(glue)
library(httr)
library(jsonlite)
library(stringr)

# set album id
album_id = "72177720310431432"
key = "cb93bec605e4ab52dfd938123758030e" # api key
user_id = "192449207@N07"

website_dir= "/Users/osx/Documents/Websites/WEBSITE_Pandaatje/data"# "/Volumes/WebLib/Websites/WEBSITE_Pandaatje/data"
date=format(Sys.time(), format="%Y_%m_%d_%H_%M")

removeCharacters = function(str){
  str = str_replace_all(str, "[[:punct:]]", "")
  str = str_replace_all(str," ","_")
  str = str_to_lower(str)
  return(str)
}

# code below is for update website data
getAlbumPhotos = function(API_KEY,USER_ID,ALBUM_ID){ 
  entry = "https://api.flickr.com/services/rest/?"
  method = "flickr.photosets.getPhotos"
  url = glue("{entry}method={method}&photoset_id={ALBUM_ID}&user_id={USER_ID}&format=json&nojsoncallback=1&api_key={API_KEY}")
  call = GET(url)
  res = fromJSON(rawToChar(call$content))
  return(res)
}

getPhotoInfo = function(API_KEY,PHOTO_ID) { 
  entry = "https://api.flickr.com/services/rest/?"
  method = "flickr.photos.getInfo"
  url = glue("{entry}method={method}&photo_id={PHOTO_ID}&format=json&nojsoncallback=1&api_key={API_KEY}")
  call = GET(url)
  res = fromJSON(rawToChar(call$content))
  return(res)
}

getPhotoSizeAndURLs = function(API_KEY,PHOTO_ID) { 
  entry = "https://api.flickr.com/services/rest/?"
  method = "flickr.photos.getSizes"
  url = glue("{entry}method={method}&photo_id={PHOTO_ID}&format=json&nojsoncallback=1&api_key={API_KEY}")
  call = GET(url)
  res = fromJSON(rawToChar(call$content))
  return(res$sizes$size)
}

albumPhotos = getAlbumPhotos(key,user_id,album_id)
albumPhotos$photoset$photo

getPhotoInfo(key,albumPhotos$photoset$photo$id[1])
getPhotoSizeAndURLs(key,albumPhotos$photoset$photo$id[1])

dataPhotos = list()
n = nrow(albumPhotos$photoset$photo)
for(i in 1:n){
  cat(i,"/",n,"\n")
  dataPhotos[[i]] = list()
  dataPhotos[[i]]$pid = albumPhotos$photoset$photo$id[i]
  dataPhotos[[i]]$file_title = albumPhotos$photoset$photo$title[i]
  photoSizes = getPhotoSizeAndURLs(key,albumPhotos$photoset$photo$id[i])
  photoSizes = photoSizes[,c("source","width","height")]
  photoSizes = photoSizes[photoSizes$width>200,]
  if(photoSizes$height[nrow(photoSizes)]>photoSizes$width[nrow(photoSizes)]){
    dataPhotos[[i]]$orientation = "P"
    dataPhotos[[i]]$url_small = photoSizes$source[which(photoSizes$width>400)[1]]
    dataPhotos[[i]]$url_medium = photoSizes$source[which(photoSizes$width>1000)[1]]
    dataPhotos[[i]]$url_medium2 = photoSizes$source[which(photoSizes$width>1400)[1]]
    dataPhotos[[i]]$url_large = photoSizes$source[which(photoSizes$width>2200)[1]]
  }else{
    dataPhotos[[i]]$orientation = "L"
    dataPhotos[[i]]$url_small = photoSizes$source[which(photoSizes$width>400)[1]]
    dataPhotos[[i]]$url_medium = photoSizes$source[which(photoSizes$width>600)[1]]
    dataPhotos[[i]]$url_medium2 = photoSizes$source[which(photoSizes$width>850)[1]]
    dataPhotos[[i]]$url_large = photoSizes$source[which(photoSizes$width>1600)[1]]
  }
  rownames(photoSizes) = NULL
  dataPhotos[[i]]$sizes = photoSizes
}

albumPhotosJSON = toJSON(dataPhotos)

# write js data
data_name = removeCharacters(albumPhotos$photoset$title)
write("var data = ", file = glue("{website_dir}/{data_name}.js"))
write(albumPhotosJSON, file = glue("{website_dir}/{data_name}.js"), append = TRUE)




