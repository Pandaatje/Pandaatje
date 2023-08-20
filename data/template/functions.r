
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

create_data_file = function(img_data,wd,template_file="template.js",out_name="test.js") {
  
  data_template_head = '
  "title": "{img_title}",
  "id": "{name_no_ext}_",
  "type": "image",
  "copy_alignment": "none",
  "copy": null,
  "width": 0,
  "copy_width": 0,
  "scaled_image_width": 0,
  "tag": null,
  "alt_text": "",
  "filename": null,
  "dominant_color": "{color}",'

  data_template_body_07 = '
  "image_url_01": "{sources[1]}","image_dimensions_01" : [{w_sizes[1]},{h_sizes[1]}],
  "image_url_02": "{sources[2]}","image_dimensions_02" : [{w_sizes[2]},{h_sizes[2]}],
  "image_url_03": "{sources[3]}","image_dimensions_03" : [{w_sizes[3]},{h_sizes[3]}],
  "image_url_04": "{sources[4]}","image_dimensions_04" : [{w_sizes[4]},{h_sizes[4]}],
  "image_url_05": "{sources[5]}","image_dimensions_05" : [{w_sizes[5]},{h_sizes[5]}],
  "image_url_06": "{sources[6]}","image_dimensions_06" : [{w_sizes[6]},{h_sizes[6]}],
  "image_url_07": "{sources[7]}","image_dimensions_07" : [{w_sizes[7]},{h_sizes[7]}],
  "image_url_08": "{sources[7]}","image_dimensions_08" : [{w_sizes[7]},{h_sizes[7]}],
  "image_url_09": "{sources[7]}","image_dimensions_09" : [{w_sizes[7]},{h_sizes[7]}],
  "image_url_10": "{sources[7]}","image_dimensions_10" : [{w_sizes[7]},{h_sizes[7]}]'

  data_template_body_08 = '
  "image_url_01": "{sources[1]}","image_dimensions_01" : [{w_sizes[1]},{h_sizes[1]}],
  "image_url_02": "{sources[2]}","image_dimensions_02" : [{w_sizes[2]},{h_sizes[2]}],
  "image_url_03": "{sources[3]}","image_dimensions_03" : [{w_sizes[3]},{h_sizes[3]}],
  "image_url_04": "{sources[4]}","image_dimensions_04" : [{w_sizes[4]},{h_sizes[4]}],
  "image_url_05": "{sources[5]}","image_dimensions_05" : [{w_sizes[5]},{h_sizes[5]}],
  "image_url_06": "{sources[6]}","image_dimensions_06" : [{w_sizes[6]},{h_sizes[6]}],
  "image_url_07": "{sources[7]}","image_dimensions_07" : [{w_sizes[7]},{h_sizes[7]}],
  "image_url_08": "{sources[8]}","image_dimensions_08" : [{w_sizes[8]},{h_sizes[8]}],
  "image_url_09": "{sources[8]}","image_dimensions_09" : [{w_sizes[8]},{h_sizes[8]}],
  "image_url_10": "{sources[8]}","image_dimensions_10" : [{w_sizes[8]},{h_sizes[8]}]'

  data_template_body_09 = '
  "image_url_01": "{sources[1]}","image_dimensions_01" : [{w_sizes[1]},{h_sizes[1]}],
  "image_url_02": "{sources[2]}","image_dimensions_02" : [{w_sizes[2]},{h_sizes[2]}],
  "image_url_03": "{sources[3]}","image_dimensions_03" : [{w_sizes[3]},{h_sizes[3]}],
  "image_url_04": "{sources[4]}","image_dimensions_04" : [{w_sizes[4]},{h_sizes[4]}],
  "image_url_05": "{sources[5]}","image_dimensions_05" : [{w_sizes[5]},{h_sizes[5]}],
  "image_url_06": "{sources[6]}","image_dimensions_06" : [{w_sizes[6]},{h_sizes[6]}],
  "image_url_07": "{sources[7]}","image_dimensions_07" : [{w_sizes[7]},{h_sizes[7]}],
  "image_url_08": "{sources[8]}","image_dimensions_08" : [{w_sizes[8]},{h_sizes[8]}],
  "image_url_09": "{sources[9]}","image_dimensions_09" : [{w_sizes[9]},{h_sizes[9]}],
  "image_url_10": "{sources[9]}","image_dimensions_10" : [{w_sizes[9]},{h_sizes[9]}]'

  data_template_body_10 = '
  "image_url_01": "{sources[1]}","image_dimensions_01" : [{w_sizes[1]},{h_sizes[1]}],
  "image_url_02": "{sources[2]}","image_dimensions_02" : [{w_sizes[2]},{h_sizes[2]}],
  "image_url_03": "{sources[3]}","image_dimensions_03" : [{w_sizes[3]},{h_sizes[3]}],
  "image_url_04": "{sources[4]}","image_dimensions_04" : [{w_sizes[4]},{h_sizes[4]}],
  "image_url_05": "{sources[5]}","image_dimensions_05" : [{w_sizes[5]},{h_sizes[5]}],
  "image_url_06": "{sources[6]}","image_dimensions_06" : [{w_sizes[6]},{h_sizes[6]}],
  "image_url_07": "{sources[7]}","image_dimensions_07" : [{w_sizes[7]},{h_sizes[7]}],
  "image_url_08": "{sources[8]}","image_dimensions_08" : [{w_sizes[8]},{h_sizes[8]}],
  "image_url_09": "{sources[9]}","image_dimensions_09" : [{w_sizes[9]},{h_sizes[9]}],
  "image_url_10": "{sources[10]}","image_dimensions_10" : [{w_sizes[10]},{h_sizes[10]}]'

  data_template_filled = c()
  data_template_filled = c(data_template_filled," ")
  for(i in 1:length(img_data)){
    
    img_title = img_data[[i]]$file_title
    name_no_ext = stringr::str_split(img_data[[i]]$url_large,".jpg",simplify=TRUE)[1,1]
    color = img_data[[i]]$dominant_color
    w_sizes = img_data[[i]]$sizes$width
    h_sizes = img_data[[i]]$sizes$height
    sources = img_data[[i]]$sizes$source
    
    # fill template
    data_template_filled = c(data_template_filled,paste0("{",glue::glue(data_template_head)))
    if(length(sources)<8){
      data_template_filled = c(data_template_filled,paste0(glue::glue(data_template_body_07),"},"))
    }else if(length(sources)==8){
      data_template_filled = c(data_template_filled,paste0(glue::glue(data_template_body_08),"},"))
    }else  if(length(sources)==9){
      data_template_filled = c(data_template_filled,paste0(glue::glue(data_template_body_09),"},"))
    }else if(length(sources)>9){
      data_template_filled = c(data_template_filled,paste0(glue::glue(data_template_body_10),"},"))
    }
    
    data_template_filled = c(data_template_filled," ")
    
  }

  # read template to paste data into  
  file_contents = readLines(template_file)

  # inset data into file_contents
  idx = grep("new data gets automatically inserted here",file_contents)
  file_contents = c(file_contents[1:idx], data_template_filled, file_contents[idx:length(file_contents)])
  
  # write to new file
  fileConn<-file(out_name)
  writeLines(file_contents, fileConn)
  close(fileConn)
  
}

get_idx = function(lst) length(lst)+1
