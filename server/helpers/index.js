// function hasOwnProperty(obj, prop) {
//     var proto = obj.__proto__ || obj.constructor.prototype;
//     return (prop in obj) &&
//         (!(prop in proto) || proto[prop] !== obj[prop]);
// }
//
// if ( Object.prototype.hasOwnProperty ) {
//     var hasOwnProperty = function(obj, prop) {
//         return obj.hasOwnProperty(prop);
//     }
// }

export const objectHasProperties = (obj, properties) => {
  if( Array.isArray(properties) && typeof obj == "object" ){
    return properties.reduce((acum, prop) => {
      return acum && obj.hasOwnProperty(prop)
    }, true)

  }else{
    return false;
  }
}


export const log = (message) => {
  if(!process.env.LOG){
    console.log(message)
  }
}
