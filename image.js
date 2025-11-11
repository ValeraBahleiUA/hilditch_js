
const count_non_zero_neighbors = (y,x,arr) => {

    return arr[y-1][x] + arr[y-1][x+1] +  arr[y][x+1] + arr[y+1][x+1] + arr[y+1][x] + arr[y+1][x-1] + arr[y][x-1] + arr[y-1][x-1]
}


const count_ext_0_1_transitions = (y,x,arr) =>{
    return Number( arr[y-1][x] - arr[y-1][x+1] == -1 && (arr[y-2][x+1] || arr[y-2][x+2] || arr[y-1][x+2])  ) +
        Number( arr[y-1][x+1] - arr[y][x+1] == -1 && (arr[y-1][x+2] || arr[y][x+2] || arr[y+1][x+2]) ) +
        Number( arr[y][x+1] - arr[y+1][x+1] == -1 && (arr[y+1][x+2] || arr[y+2][x+2] || arr[y+2][x+1])) +
        Number( arr[y+1][x+1] - arr[y+1][x] == -1 && (arr[y+2][x+1] || arr[y+2][x] || arr[y+2][x-1]) ) +
        Number( arr[y+1][x] - arr[y+1][x-1] == -1 && (arr[y+2][x-1] || arr[y+2][x-2] || arr[y+1][x-2])) +
        Number( arr[y+1][x-1] - arr[y][x-1] == -1 && (arr[y+1][x-2] || arr[y][x-2] || arr[y-1][x-2])) +
        Number( arr[y][x-1] - arr[y-1][x-1] == -1 && (arr[y-1][x-2] || arr[y-2][x-2] || arr[y-2][x-1])) +
        Number( arr[y-1][x-1] - arr[y-1][x] == -1 && (arr[y-2][x] || arr[y-2][x-1] || arr[y-2][x+1]))

}

const count_0_1_transitions = (y,x,arr) => {
    return Number( arr[y-1][x] - arr[y-1][x+1] == -1 ) +
        Number( arr[y-1][x+1] - arr[y][x+1] == -1 ) +
        Number( arr[y][x+1] - arr[y+1][x+1] == -1 ) +
        Number( arr[y+1][x+1] - arr[y+1][x] == -1 ) +
        Number( arr[y+1][x] - arr[y+1][x-1] == -1 ) +
        Number( arr[y+1][x-1] - arr[y][x-1] == -1 ) +
        Number( arr[y][x-1] - arr[y-1][x-1] == -1 ) +
        Number( arr[y-1][x-1] - arr[y-1][x] == -1 )

}





function grayscale_image(){
    //assume operating on whole canvas;

    const imageData = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height);
    const pixels = imageData.data;
    for (var y = 0; y < ctx.canvas.height; y++){
        for (var x = 0; x<ctx.canvas.width; x++){
            const pixel = (y * ctx.canvas.width + x) * 4;

            const lightness = parseInt( (pixels[pixel] + pixels[pixel+1] + pixels[pixel+2]) / 3);
            pixels[pixel] = pixels[pixel+1] = pixels[pixel+2] = lightness;
        }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.putImageData(imageData,0,0);
    return imageData;

}





function binarize_image(threshold){
    //assume operation on whole canvas
    //assume greyscale

    const imageData = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height);
    const pixels = imageData.data;
    for(var y = 0; y < ctx.canvas.height; y++){
        for (var x = 0; x<ctx.canvas.width; x++){
            const pixel = (y * ctx.canvas.width + x) * 4;

            if(pixels[pixel+3] != 255){
                pixels[pixel] = pixels[pixel+1] = pixels[pixel+2] = pixels[pixel+3] = 255;
            }


            pixels[pixel] >= threshold ? (pixels[pixel] = pixels[pixel+1] = pixels[pixel+2] = 255) : (pixels[pixel] = pixels[pixel+1] = pixels[pixel+2] = 0)

        }
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.putImageData(imageData,0,0);
    return imageData;
}





function binarized_image_to_bool_2d_array(ctx) {
    const { width, height } = ctx.canvas;
    const arr = Array.from({ length: height }, () => Array(width).fill(0));
    const { data } = ctx.getImageData(0, 0, width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i];
            arr[y][x] = (r == 0) ? 1 : 0;

        }
    }

    return arr;
}




function bool_2d_array_to_binarized_image(arr){
    const imageData = ctx.createImageData(ctx.canvas.width,ctx.canvas.height);
    const pixels = imageData.data;
    for ( var y = 0; y < arr.length; y++){
        for( var x = 0; x < arr[0].length; x++){
            const pixel = (y * arr[0].length + x) * 4;

            if (arr[y][x] == 1) {
                pixels[pixel] = pixels[pixel + 1] = pixels[pixel + 2] = 0; // black
            } else {
                pixels[pixel] = pixels[pixel + 1] = pixels[pixel + 2] = 255; // white
            }

            pixels[pixel + 3] = 255;

        }

    }
    ctx.putImageData(imageData,0,0);
    return imageData;
}


function hilditch_thinning(arr,plus = false){
    const start_time = performance.now();

    const p_arr = Array.from({length:arr.length + 4}, () => Array(arr[0].length + 4).fill(0));
    let changed = 0;
    let total_changed = 0;
    const p_arr_to_del =  Array.from({length:arr.length + 4}, () => Array(arr[0].length + 4).fill(0));

    for(var y = 2; y < p_arr.length - 2; y++){
        for(var x = 2; x < p_arr[0].length - 2; x++){
            p_arr[y][x]=arr[y-2][x-2];
        }
    }

    do{

        changed = 0

        for(var y = 2; y < p_arr.length - 2; y++){
            for(var x = 2; x < p_arr[0].length - 2; x++){
                if( ( (2 <= count_non_zero_neighbors(y,x,p_arr)) && (count_non_zero_neighbors(y,x,p_arr) <= 6) ) &&
                    (count_0_1_transitions(y,x,p_arr) === 1) &&
                    (plus ? (
                                (p_arr[y-1][x] * p_arr[y][x+1] * p_arr[y][x-1] == 0 || (count_0_1_transitions(y-1,x,p_arr) !=1 )) &&
                                (p_arr[y-1][x] * p_arr[y][x+1] * p_arr[y+1][x] == 0 || (count_0_1_transitions(y,x+1,p_arr) !=1 ))
                            ) : (
                                (p_arr[y-1][x] * p_arr[y][x+1] * p_arr[y][x-1] == 0) &&
                                (p_arr[y-1][x] * p_arr[y][x+1] * p_arr[y+1][x] == 0)
                                )
                    )


                ){ p_arr_to_del[y][x] = 1 }
            }
        }

        for(var y = 2; y < p_arr.length - 2; y++){
            for(var x = 2; x < p_arr[0].length - 2; x++){
                if (p_arr_to_del[y][x]&& p_arr[y][x]!=0){
                    p_arr[y][x] = 0;
                    changed ++
                    total_changed ++;
                }
            }
        }

    } while (changed > 0)

    if(total_changed){
        return p_arr.slice(2, -2).map(r => r.slice(2, -2));
    }else{

        console.log("NON POSITIVE TOTAL_CHANGED VALUE");

        return false;
    }

}



function paint_ends_splits({ends_arr,splits_arr}){
    const paint_start = performance.now();
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const imageData = ctx.getImageData(0,0, cw, ch);
    const pixels = imageData.data;




    for (let i = 0; i < ends_arr.length; i += 2) {
        const y = ends_arr[i];
        const x = ends_arr[i + 1];
        const pixel = (y * cw + x) * 4;
        pixels[pixel] = 255;         // red
        pixels[pixel + 1] = 0;
        pixels[pixel + 2] = 0;
    }

    // splits_arr: [y0, x0, y1, x1, ...]
    for (let i = 0; i < splits_arr.length; i += 2) {
        const y = splits_arr[i];
        const x = splits_arr[i + 1];
        const pixel = (y * cw + x) * 4;
        pixels[pixel] = 140;
        pixels[pixel + 1] = 200;
        pixels[pixel + 2] = 70;     // blue
    }

    return imageData;
}



function get_ends_splits(arr){
    const calcends_start = performance.now();
    const p_arr = Array.from({length:arr.length + 4}, () => Array(arr[0].length + 4).fill(0));
    const ends_arr =  [];
    // x1,y1,x2,y2,x3...
    const splits_arr = []




    for(let y = 2; y < p_arr.length -2; y++){
        for (let x = 2; x < p_arr[0].length -2; x++){
            p_arr[y][x] = arr[y-2][x-2];
        }
    }


    for(let y = 2; y < arr.length -2; y++){
        for (let x = 2; x < arr[0].length -2; x++){
            if(p_arr[y][x] === 1 && count_non_zero_neighbors(y,x,p_arr) === 1){

                ends_arr.push(y-2,x-2);

            }else if(p_arr[y][x] === 1 && count_ext_0_1_transitions(y,x,p_arr) >= 3){

                splits_arr.push(y-2,x-2);

            }
        }
    }
    return {ends_arr: ends_arr,splits_arr: splits_arr};

}