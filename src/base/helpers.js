String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

// A few helpful functions to map/convert dot representations to their object counterparts.
// Very useful when want to store/pull to/from database as a column name but want to
// represent it in a view as a nested object.

// var objStrConv = {};

// function to set value for a nested object.
// It will initialize the parent object if it doesn't exist
// and recursively move down until child object is set
// If no val is passed in then it basically initializes the object
Object.setAtString = function (obj, dotarr, val) {
    let a = dotarr.shift()
    if (dotarr.length === 0) {
        // if at last element in chain, set value
        if (obj[a] === undefined) {
            obj[a] = {}
        }
        if (Array.isArray(val)) {
            obj[a] = val
        } else if (typeof val === 'object') {
            Object.assign(obj[a], val)
            /*
          for(key in val) {
              obj[a][key] = val[key];
          }
          */
        } else {
            obj[a] = val
        }
        return
    } else {
        if (obj[a] === undefined) {
            obj[a] = {}
        }
        Object.setAtString(obj[a], dotarr, val)
    }
}
// https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
// Khaseem's revised snippet.
Object.setAtString = function (obj, dotarr, val) {
    dotarr.reduce((p, c, i) => {
        p[c] =
            dotarr.length === ++i
                ? typeof val === 'object'
                    ? Object.assign(p[c] || {}, val)
                    : val
                : p[c] || {}
        return p[c]
    }, obj)
}

// get value of a nested object by its string representation 'blah.blah1.blah2'
Object.getByString = function (obj, dotarr) {
    let a = dotarr.shift()
    if (dotarr.length === 0) {
        // if at last element in chain, get value
        return obj[a] || null
    } else {
        if (obj[a] === undefined) {
            // database likes null, but doesn't like undefined
            return null
        }
        return Object.getByString(obj[a], dotarr)
    }
}
// Khaseem's revised snippet.
Object.getByString = function (obj, dotarr) {
    dotarr.reduce((p, c) => {
        p[c] = p?.[c] || null
        return p[c] || null
    }, obj)
}

// Find the first key where 2 arrays or objects intersect and return it
Array.arraysIntersect = function (arr1, arr2) {
    if (Array.isArray(arr1) && Array.isArray(arr2)) {
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i] === arr2[j]) {
                    Array.arraysIntersectK(arr1, arr2)
                    console.log('Original arraysIntersect ' + arr1[i])
                    return arr1[i]
                }
            }
        }
    } else if (Array.isArray(arr1) && !Array.isArray(arr2)) {
        for (let i = 0; i < arr1.length; i++) {
            for (const key in arr2) {
                if (arr1[i] === key && arr2[key]) {
                    Array.arraysIntersectK(arr1, arr2)
                    console.log('Original arraysIntersect ' + key)
                    return key
                }
            }
        }
    } else if (!Array.isArray(arr1) && Array.isArray(arr2)) {
        for (const key in arr1) {
            for (let i = 0; i < arr2.length; i++) {
                if (arr2[i] === key && arr1[key]) {
                    Array.arraysIntersectK(arr1, arr2)
                    console.log('Original arraysIntersect ' + key)
                    return key
                }
            }
        }
    } else {
        for (const key in arr1) {
            for (const key2 in arr2) {
                if (key === key2 && arr1[key] && arr2[key2]) {
                    Array.arraysIntersectK(arr1, arr2)
                    console.log('Original arraysIntersect ' + key)
                    return key
                }
            }
        }
    }
    Array.arraysIntersectK(arr1, arr2)
    console.log('Original arraysIntersect false')
    return false
}

Array.arraysIntersectK = function (arr1, arr2) {
    console.log(arr1)
    console.log(arr2)
    arr1 = !Array.isArray(arr1) ? Object.keys(arr1) : arr1
    arr2 = !Array.isArray(arr2) ? Object.keys(arr2) : arr2
    const res = arr1.find((e) => arr2.indexOf(e) !== -1)
    console.log(
        `Khaseem arraysIntersect ${typeof res === 'undefined' ? false : res}`
    )
    if (typeof res != 'undefined') {
        console.log(arr1)
        console.log(arr2)
    }
}

Array.equals = function (arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false
    }

    if (!arr1.every((v, i) => v === arr2[i])) {
        return false
    }

    return true
}
