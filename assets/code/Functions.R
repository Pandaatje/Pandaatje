attach_img_data = function(img_data,wd,bin_path_mac="/opt/homebrew/bin"){
  
  n_img = length(img_data)
  for(j in 1:n_img){
    
    print(paste(j,"/",n_img))
    
    files = glue::glue("{wd}/images/{img_data[[j]]$img_dir}/") 
    files = list.files(files,full.names=TRUE)
    files = grep(img_data[[j]]$name_no_ext,files,value=TRUE)
    files = grep(".webp",files,value=TRUE)
    
    if(Sys.info()[['sysname']]=="Darwin"){
      command = glue::glue('{bin_path_mac}/identify -format "%h" {files}')
    }else if(Sys.info()[['sysname']]=="Windows"){
      command = glue::glue('{wd}/code/win_bin/identify.exe -format "%h" {files}')
    }
      
    w_sizes = c(150,300,400,550,700,900,1200,1600,1800,2500)
    h_sizes = c()
    
    for(i in 1:length(w_sizes)){
        cmd = command[grep(glue::glue("{w_sizes[i]}.webp"),files)]      
        h_sizes[i] = system(cmd, intern=TRUE)
    }
    
    img_data[[j]]$img_ext = "webp"
    img_data[[j]]$w_sizes = w_sizes
    img_data[[j]]$h_sizes = as.numeric(h_sizes)
    
    if(is.null(img_data[[j]]$contrast_adj)){
      img_data[[j]]$contrast_adj=1
    }
    
    if(is.null(img_data[[j]]$brightness_adj)){
      img_data[[j]]$brightness_adj=1
    }
    
  }
  
  return(img_data)
  
}

process_image = function(full_name,qlty=85,wd,conv_webp=FALSE,move_to="_processed",
                         bin_path_mac="/opt/homebrew/bin") {
  
  dir = glue::glue("{wd}/images/_inject")
  files = list.files(dir,full.names=TRUE)
  if(length(files)==0) return("no files in 'images/_inject' found...")
  file = grep(full_name,files,value=TRUE)[1]
  if(is.na(file)) return("no file matching the provided full_name...")
  print(file)
  file_ext = strsplit(file,"[.]")[[1]][2]
  file_name = strsplit(file,"[.]")[[1]][1]
  
  if(file_ext=="webp") {
    conv_webp = FALSE
  }
  
  if(conv_webp) {
    if(Sys.info()[['sysname']]=="Darwin"){
      system(glue::glue("{bin_path_mac}/convert {file} {file_name}.webp")) 
    }else if(Sys.info()[['sysname']]=="Windows") {
      system(glue::glue("{wd}/code/win_bin/convert.exe {file} {file_name}.webp")) 
    } 
    file_target_jpg = stringr::str_replace(file,"_inject",move_to)
    file.rename(file, file_target_jpg)
    file = glue::glue("{file_name}.webp")
    file_ext = "webp"
  }
  
  # convert exported jpgs for web
  w_sizes = c(150,300,400,550,700,900,1200,1600,1800,2500)
  for(j in 1:length(w_sizes)) {
    
    source = glue::glue("{file_name}_{w_sizes[j]}.{file_ext}")
    file.copy(file,source)
    
    if(Sys.info()[['sysname']]=="Darwin"){
      cmd = glue::glue("{bin_path_mac}/mogrify -quality {qlty} -resize {w_sizes[j]} {file_name}_{w_sizes[j]}.{file_ext}")
    }else if(Sys.info()[['sysname']]=="Windows") {
      cmd = glue::glue("{wd}/code/win_bin/mogrify.exe -quality {qlty} -resize {w_sizes[j]} {file_name}_{w_sizes[j]}.{file_ext}")
    } 
    
    system(cmd)  
    
    target = stringr::str_replace(glue::glue("{file_name}_{w_sizes[j]}.{file_ext}"),"_inject",move_to)
    file.rename(source, target)

  }
  
  # move original file
  file_target = stringr::str_replace(file,"_inject",move_to)
  file.rename(file, file_target)
}

create_data_file = function(img_data,wd,template_file="template.js",out_name="test.js") {
  
  data_template = '
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
  "dominant_color": "{color}",
  "image_url_1800x0": "images/{img_dir}/{name_no_ext}_1800.jpg","image_dimensions_1800x0": [1800, {h_sizes[w_sizes==1800]}],"image_uncropped_dimensions_1800x0": [1800, {h_sizes[w_sizes==1800]}],
  "image_url_2500x0": "images/{img_dir}/{name_no_ext}_2500.jpg","image_dimensions_2500x0": [2500, {h_sizes[w_sizes==2500]}],"image_uncropped_dimensions_2500x0": [2500, {h_sizes[w_sizes==2500]}],
  "image_url_900x0": "images/{img_dir}/{name_no_ext}_900.jpg","image_dimensions_900x0": [900, {h_sizes[w_sizes==900]}],"image_uncropped_dimensions_900x0": [900, {h_sizes[w_sizes==900]}],
  "image_url_700x0": "images/{img_dir}/{name_no_ext}_700.jpg","image_dimensions_700x0": [700, {h_sizes[w_sizes==700]}],"image_uncropped_dimensions_700x0": [700, {h_sizes[w_sizes==700]}],
  "image_url_550x0": "images/{img_dir}/{name_no_ext}_550.jpg","image_dimensions_550x0": [550, {h_sizes[w_sizes==550]}],"image_uncropped_dimensions_550x0": [550, {h_sizes[w_sizes==550]}],
  "image_url_400x0": "images/{img_dir}/{name_no_ext}_400.jpg","image_dimensions_400x0": [400, {h_sizes[w_sizes==400]}],"image_uncropped_dimensions_400x0": [400, {h_sizes[w_sizes==400]}],
  "image_url_300x0": "images/{img_dir}/{name_no_ext}_300.jpg","image_dimensions_300x0": [300, {h_sizes[w_sizes==300]}],"image_uncropped_dimensions_300x0": [300, {h_sizes[w_sizes==300]}],
  "image_url_150x0": "images/{img_dir}/{name_no_ext}_150.jpg","image_dimensions_150x0": [150, {h_sizes[w_sizes==150]}],"image_uncropped_dimensions_150x0": [150, {h_sizes[w_sizes==150]}],
  "image_url_1600x0": "images/{img_dir}/{name_no_ext}_1600.jpg","image_dimensions_1600x0": [1600, {h_sizes[w_sizes==1600]}],"image_uncropped_dimensions_1600x0": [1600, {h_sizes[w_sizes==1600]}],
  "image_url_1200x0": "images/{img_dir}/{name_no_ext}_1200.jpg","image_dimensions_1200x0": [1200, {h_sizes[w_sizes==1200]}],"image_uncropped_dimensions_1200x0": [1200, {h_sizes[w_sizes==1200]}]'
  
  data_template_filled = c()
  data_template_filled = c(data_template_filled," ")
  for(i in 1:length(img_data)){
    
    img_title = img_data[[i]]$img_title
    name_no_ext = img_data[[i]]$name_no_ext
    img_dir = img_data[[i]]$img_dir
    color = img_data[[i]]$color
    img_ext = img_data[[i]]$img_ext
    w_sizes = img_data[[i]]$w_sizes
    h_sizes = img_data[[i]]$h_sizes
    
    # fill template
    data_template_filled = c(data_template_filled,paste0("{",glue::glue(data_template),"},"))
    data_template_filled = c(data_template_filled," ")
    
  }

  # read template to paste data into  
  file_contents = readLines(glue::glue("{wd}/code/{template_file}"))

  # inset data into file_contents
  idx = grep("new data gets automatically inserted here",file_contents)
  file_contents = c(file_contents[1:idx], data_template_filled, file_contents[idx:length(file_contents)])
  
  # write to new file
  fileConn<-file(glue::glue("{wd}/{out_name}"))
  writeLines(file_contents, fileConn)
  close(fileConn)
  
}

create_html_file = function(img_data,wd,template_file="template_main.html",out_name="test.html",data_name="data_main.js")
{
  
  data_template = '<article class="asset lazyload_container title_element" id="no{i}">
    <div class="asset_center"><a href="#no{i+1}"  class="asset_image_container hoverable">
      <img class="lazyload" style="filter: contrast({SET_CONTRAST_VAL}) brightness({SET_BRIGHTNESS_VAL});"
      data-src="images/{img_dir}/{name_no_ext}_1800.{img_ext}" 
      data-srcset="images/{img_dir}/{name_no_ext}_2500.{img_ext} 2500w {h_sizes[w_sizes==2500]}h, 
      images/{img_dir}/{name_no_ext}_900.{img_ext} 900w {h_sizes[w_sizes==900]}h, 
      images/{img_dir}/{name_no_ext}_700.{img_ext} 700w {h_sizes[w_sizes==700]}h, 
      images/{img_dir}/{name_no_ext}_550.{img_ext} 550w {h_sizes[w_sizes==550]}h, 
      images/{img_dir}/{name_no_ext}_400.{img_ext} 400w {h_sizes[w_sizes==400]}h, 
      images/{img_dir}/{name_no_ext}_300.{img_ext} 300w {h_sizes[w_sizes==300]}h, 
      images/{img_dir}/{name_no_ext}_150.{img_ext} 150w {h_sizes[w_sizes==150]}h, 
      images/{img_dir}/{name_no_ext}_1600.{img_ext} 1600w {h_sizes[w_sizes==1600]}h, 
      images/{img_dir}/{name_no_ext}_1200.{img_ext} 1200w {h_sizes[w_sizes==1200]}h"
      data-sizes="auto" alt="" nopin="true"/>
      <canvas class="image-placeholder" width="1800" height="{h_sizes[w_sizes==1800]}" style="background-color: #14151700"></canvas>
    </a></div>
  </article>'
  
  data_template_filled = c()
  data_template_filled = c(data_template_filled," ")
  for(i in 1:length(img_data)){
    
    img_title = img_data[[i]]$img_title
    name_no_ext = img_data[[i]]$name_no_ext
    img_dir = img_data[[i]]$img_dir
    color = img_data[[i]]$color
    img_ext = img_data[[i]]$img_ext
    w_sizes = img_data[[i]]$w_sizes
    h_sizes = img_data[[i]]$h_sizes
    SET_CONTRAST_VAL = img_data[[i]]$contrast_adj
    SET_BRIGHTNESS_VAL = img_data[[i]]$brightness_adj
    
    # fill template
    data_template_filled = c(data_template_filled,glue::glue(data_template))
    data_template_filled = c(data_template_filled," ")
    
  }
  
  data_template2 = '<li class="gallery_thumb lazyload_container image is_loading"><a href="#no{i}" class="hoverable_noText">
    <img class="lazyload" data-src="images/{img_dir}/{name_no_ext}_1800.{img_ext}" 
    style="filter: contrast({SET_CONTRAST_VAL}) brightness({SET_BRIGHTNESS_VAL});"
    data-srcset="images/{img_dir}/{name_no_ext}_2500.{img_ext} 2500w {h_sizes[w_sizes==2500]}h, 
    images/{img_dir}/{name_no_ext}_900.{img_ext} 900w {h_sizes[w_sizes==900]}h, 
    images/{img_dir}/{name_no_ext}_700.{img_ext} 700w {h_sizes[w_sizes==700]}h, 
    images/{img_dir}/{name_no_ext}_550.{img_ext} 550w {h_sizes[w_sizes==550]}h, 
    images/{img_dir}/{name_no_ext}_400.{img_ext} 400w {h_sizes[w_sizes==400]}h, 
    images/{img_dir}/{name_no_ext}_300.{img_ext} 300w {h_sizes[w_sizes==300]}h, 
    images/{img_dir}/{name_no_ext}_150.{img_ext} 150w {h_sizes[w_sizes==150]}h, 
    images/{img_dir}/{name_no_ext}_1600.{img_ext} 1600w {h_sizes[w_sizes==1600]}h, 
    images/{img_dir}/{name_no_ext}_1200.{img_ext} 1200w {h_sizes[w_sizes==1200]}h"
    data-sizes="auto" alt="" nopin="true"/>
  </a></li>'
  
  data_template_filled2 = c()
  data_template_filled2 = c(data_template_filled2," ")
  for(i in 1:length(img_data)){
    
    img_title = img_data[[i]]$img_title
    name_no_ext = img_data[[i]]$name_no_ext
    img_dir = img_data[[i]]$img_dir
    color = img_data[[i]]$color
    img_ext = img_data[[i]]$img_ext
    w_sizes = img_data[[i]]$w_sizes
    h_sizes = img_data[[i]]$h_sizes
    SET_CONTRAST_VAL = img_data[[i]]$contrast_adj
    SET_BRIGHTNESS_VAL = img_data[[i]]$brightness_adj
    
    # fill template
    data_template_filled2 = c(data_template_filled2,glue::glue(data_template2))
    data_template_filled2 = c(data_template_filled2," ")
    
  }
  
  # read template to paste data into
  file_contents = readLines(glue::glue("{wd}/code/{template_file}"))
  
  # set name of data
  idx_data = grep("data_name",file_contents)
  file_contents[idx_data] = glue::glue(file_contents[idx_data])

  # inset article data into file_contents
  idx = grep("new article data gets inserted automatically above",file_contents)
  file_contents = c(file_contents[1:idx], data_template_filled, file_contents[idx:length(file_contents)])
  
  # inset thumbnail data into file_contents
  idx = grep("new thumbnail data gets inserted automatically above",file_contents)
  file_contents = c(file_contents[1:idx], data_template_filled2, file_contents[idx:length(file_contents)])
  
  # write to new file
  fileConn<-file(glue::glue("{wd}/{out_name}"))
  writeLines(file_contents, fileConn)
  close(fileConn)
  
}

get_idx = function(lst) length(lst)+1
