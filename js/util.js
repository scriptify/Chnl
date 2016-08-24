export const bindMethods = (methods, objToBind) => {
  let retMethods = {};
  for(let prop in methods) {
    const method = methods[prop];
    if(typeof method === 'function') {
      retMethods[prop] = method.bind(undefined, objToBind);
    } else {
      throw new Error('One of the object members wasn\'t a method.');
    }
  }

  return retMethods;
};

export const functionsToValues = obj => {
  // If a member of the object (obj) is a function, the return value of this function will be set as the value of this property
  const retObj = Object.assign({}, obj);
  for(let prop in retObj) {
    if(typeof retObj[prop] === 'function')
      retObj[prop] = retObj[prop]();
  }

  return retObj;
};

export const objToArray = obj => {
  let array = [];
  for(let prop in obj) {
    array.push( obj[prop] );
  }
  return array;
};
