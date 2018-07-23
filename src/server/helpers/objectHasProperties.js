const objectHasProperties = (obj, properties) => {
  if( Array.isArray(properties) && typeof obj == "object" ){
    return properties.reduce((acum, prop) => {
      return acum && obj.hasOwnProperty(prop)
    }, true)

  }else{
    return false;
  }
}
