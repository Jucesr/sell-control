const formatText = (text) => {
  return capitalizeFirstLetter(replaceAll(text, '_', ' '))
}

export const replaceAll = (target, search, replacement) => {
  return target.replace(new RegExp(search, "g"), replacement)
}

export const replaceNullWithBlank = (target) => {
  return JSON.parse(JSON.stringify(target, (key, value) => {
      // Filtering out properties
      if (value === null || value === undefined) {
        return '';
      }
      return value;
    }))
}

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const assignValueToFields = (fields, values) => Object.keys(fields).reduce((acum, key) => ({
  ...acum,
  [key]: {
    ...fields[key],
    value: values ? values[key] : ''
  }
}), {})

export const extractValueFromFields = fields => {
  /*

    Input = {
        _id: {
        value: 01030
      },
        code: {
        value: 001
      },
        blah: {
        value: 'jeje'
      }
    }

    output = {
    _id: 01030,
    code: 001,
    blah: 'jeje'
  }

  */

  return Object.keys(fields).reduce((acum, key) => {
    return {
      ...acum,
     [key]: fields[key]['value']  ?  fields[key]['value'] : ''
    }
  }, {})
}

export const addPropertiesToFields = fields => Object.keys(fields).reduce((acum, key) => ({
  ...acum,
  [key]: {
    ...fields[key],
    type: fields[key].hasOwnProperty('type') ? fields[key]['type'] : 'text',
    label: fields[key].hasOwnProperty('label') ? fields[key]['label'] : formatText(key),
    render: fields[key].hasOwnProperty('render') ? fields[key]['render'] : true
  }
}), {})
