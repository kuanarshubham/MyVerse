import Mapdata from "../../assets/map/office.json";

const mapLayers = Mapdata["layers"].filter(x => x.id !== 1).map(x => x.data);

// processing layers
let layerUnavailable: number[] = [];

for(let i=0; i<mapLayers[0].length; i++){
    let val: number = 0;
    for(let j=0; j<mapLayers.length; j++){
        val += mapLayers[j][i];

        if(val>1){
            val = 1;
            break;
        }
    }
    layerUnavailable.push(0);
}

console.log(layerUnavailable);

export default layerUnavailable; 