import * as THREE from 'three';

/**
 *  1. in a given class file MyWhateverNameClass.js in the constructor call:
 * 
 *  this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
 *  this.reader.open("scenes/<path to json file>.json");	
 * 
 *  The last argumet in the constructor is a method that is called when the json file is loaded and parsed (see step 2).
 * 
 *  2. in the MyWhateverNameClass.js class, add a method with signature: 
 *     onSceneLoaded(data) {
 *     }
 * 
 *  This method is called once the json file is loaded and parsed successfully. The data argument is the entire scene data object. 
 * 
 */

class MyFileReader {

	/**
	   constructs the object
	*/
	constructor(onSceneLoadedCallback) {
		this.errorMessage = null;
		this.onSceneLoadedCallback = onSceneLoadedCallback;
		this.graph = null;
	}

	open(jsonfile) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", jsonfile, false);
		try {
			xhr.send();
			if (xhr.status !== 200) {
				throw new Error(`HTTP error! Status: ${xhr.status}`);
			}
			const data = JSON.parse(xhr.responseText);
			this.onSceneLoadedCallback(data);
		} catch (error) {
			console.error("Unable to fetch data:", error);
		}
	}
}

export { MyFileReader };
