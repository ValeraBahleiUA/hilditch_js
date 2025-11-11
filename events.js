let tabs = document.getElementsByClassName("viewport_tab");
Array.from(tabs).forEach(
    item=> {
        item.addEventListener("click", ()=>{
            set_active_tab(item.id);
        })
    }
)
document.getElementById("rst_btn").addEventListener("click",()=>{
    console.log("clicked it")
    init_anim_handle = init_anim();
})
document.getElementById("rerun_btn").addEventListener("click",() => {
    image.onload();
})