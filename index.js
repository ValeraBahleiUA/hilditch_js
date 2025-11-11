const Tabs = {
  skele: "tab_skele",
  bin:"tab_bin",
  points:"tab_points"
};
let image_loaded = 0;



const viewport_tab_datas = {
  "tab_bin":undefined,
  "tab_grayscale":undefined,
  "tab_skele":undefined,
  "tab_points":undefined
}


let last_exec_time = NaN;



  function set_last_exec_time(time) {
    let exectime_span = document.getElementById("exectime");
    let exectime_diff_span = document.getElementById("exectime_diff");

    exectime_diff_span.textContent =
        (Number(time) - Number(exectime_span.textContent)) < 0 ?
            String(Number(time) - Number(exectime_span.textContent)) :
            ("+" + String(Number(time) - Number(exectime_span.textContent)))

    exectime_span.textContent = String(time);

  }
  function set_active_tab(tab){
    Array.from(document.getElementsByClassName("viewport_tab")).forEach(
        (tab) =>{
          tab.removeAttribute("aria-selected");
        }
    );

    document.getElementById(tab).setAttribute("aria-selected","true");
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.putImageData(viewport_tab_datas[tab],0,0);

    var is_same = (viewport_tab_datas["tab_skele"].data.length === viewport_tab_datas["tab_bin"].data.length) && viewport_tab_datas["tab_skele"].data.every(function(element, index) {
      return element === viewport_tab_datas["tab_bin"].data[index];
    });
  }


const canvas = document.getElementById("the_canvas");
const rerun_btn = document.getElementById("rerun_btn");
let ctx = canvas.getContext("2d");
const imgs_div = document.getElementById('imgs');
let init_anim_handle = init_anim();
let binarr;
let image;



imgs_div.addEventListener('image_added', e => {
  image = e.detail.img;
  clearInterval(init_anim_handle)
  image.onload = (e) => {
    ctx.canvas.width = image.naturalWidth
    ctx.canvas.height = image.naturalHeight;
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
    ctx.drawImage(image,0,0);
    grayscale_image(ctx);
    recalc_images();
    rerun_btn.removeAttribute("disabled");
  }
});


function recalc_images (){
  let start = performance.now()
  let threshold_slider_value = document.getElementById("threshold_range").value
  viewport_tab_datas["tab_bin"] = binarize_image(Number(threshold_slider_value));
  binarr = binarized_image_to_bool_2d_array(ctx);
  let hilditch_plus = document.querySelector('#hilditch_plus:checked')
  let skelebinarr = hilditch_thinning(binarr,!!hilditch_plus);
  viewport_tab_datas["tab_skele"] = bool_2d_array_to_binarized_image(skelebinarr);

  viewport_tab_datas["tab_points"] = paint_ends_splits(get_ends_splits(skelebinarr))
  let end = performance.now();
  set_last_exec_time(end-start);

  let active_tab = document.querySelector('.viewport_tab[aria-selected="true"]')
  if (active_tab){
    ctx.putImageData(viewport_tab_datas[active_tab.id],0,0);
  }else {
    ctx.putImageData(viewport_tab_datas["tab_skele"],0,0);
    document.getElementById("tab_skele").setAttribute("aria-selected","true");
  }





}




function init_anim(){
  let grad_var = 0;
  const text = `Drag and Drop image here\nor click to upload`;
  const s_text = text.split(/\r?\n/);
  let longest_line = 0;
  s_text.map((s,i)=>{
    if (s.length > s_text[i].length){
      longest_line = i;
    }
  })

  ctx.fillStyle = "beige";
  ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);

  const inital_font_size = 30;
  ctx.font = inital_font_size + "px Arial";
  const initial_max_text_w = ctx.measureText(s_text[longest_line]).width + 20;
  const desired_text_w = ctx.canvas.width;
  const new_font_size = inital_font_size * desired_text_w / initial_max_text_w;

  ctx.font = new_font_size + "px Arial";

  let grad = ctx.createLinearGradient(0,0,2000,0);
  grad.addColorStop(0, "darkblue");
  grad.addColorStop(0.50, "lightblue");
  grad.addColorStop(1, "darkblue");
  ctx.fillStyle = grad;
  ctx.fillText("Drag and drop image here",10,150);
  ctx.fillText("or click to upload",10, 220);

  return setInterval(()=> {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.fillStyle = "beige";
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
    grad=ctx.createLinearGradient(0,0,grad_var,0);
    grad.addColorStop(0, "darkblue");
    grad.addColorStop(0.50, "lightblue");
    grad.addColorStop(1, "darkblue");
    ctx.fillStyle = grad;
    ctx.fillText("Drag and drop image here",10,150);
    ctx.fillText("or click to upload",10, 220);
    grad_var >= 5000 ? grad_var = 1 : grad_var+=30;
  },30)

}


