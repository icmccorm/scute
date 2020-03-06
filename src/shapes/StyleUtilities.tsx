
export enum UnitType {
	PX = "px"
}

export function getTranslate(translate: Array<number>, units:UnitType ) {
	return " translate(" + translate[0] + "px, " + translate[1] + units + ") ";
}

export function getScale(scale: number){
	return "scale(" + scale + ")";
}

export function getRGBA(r: number, g: number, b: number, a:number){
	return " rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

export function getColorFromArray(rgba: Array<any>){
	return " rgba(" + rgba[0].value + ", " + rgba[1].value + ", " + rgba[2].value + ", " + rgba[3].value + ")";
}