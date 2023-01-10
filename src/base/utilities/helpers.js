String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// Find the first key where 2 arrays or objects intersect and return it
Array.arraysIntersect = function (arr1, arr2) {
  if (Array.isArray(arr1) && Array.isArray(arr2)) {
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i] === arr2[j]) {
          Array.arraysIntersectK(arr1, arr2);
          console.log("Original arraysIntersect " + arr1[i]);
          return arr1[i];
        }
      }
    }
  } else if (Array.isArray(arr1) && !Array.isArray(arr2)) {
    for (let i = 0; i < arr1.length; i++) {
      for (let key in arr2) {
        if (arr1[i] === key && arr2[key]) {
          Array.arraysIntersectK(arr1, arr2);
          console.log("Original arraysIntersect " + key);
          return key;
        }
      }
    }
  } else if (!Array.isArray(arr1) && Array.isArray(arr2)) {
    for (let key in arr1) {
      for (let i = 0; i < arr2.length; i++) {
        if (arr2[i] === key && arr1[key]) {
          Array.arraysIntersectK(arr1, arr2);
          console.log("Original arraysIntersect " + key);
          return key;
        }
      }
    }
  } else {
    for (let key in arr1) {
      for (let key2 in arr2) {
        if (key === key2 && arr1[key] && arr2[key2]) {
          Array.arraysIntersectK(arr1, arr2);
          console.log("Original arraysIntersect " + key);
          return key;
        }
      }
    }
  }
  Array.arraysIntersectK(arr1, arr2);
  console.log("Original arraysIntersect false");
  return false;
};

Array.arraysIntersectK = function (arr1, arr2) {
  arr1 = !Array.isArray(arr1) ? Object.keys(arr1) : arr1;
  arr2 = !Array.isArray(arr2) ? Object.keys(arr2) : arr2;
  let res = arr1.find((e) => arr2.indexOf(e) !== -1);
  console.log(
    `Khaseem arraysIntersect ${typeof res === "undefined" ? false : res}`
  );
  if (typeof res != "undefined") {
    console.log(arr1);
    console.log(arr2);
  }
};

Array.equals = function (arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  if (!arr1.every((v, i) => v === arr2[i])) {
    return false;
  }

  return true;
};
