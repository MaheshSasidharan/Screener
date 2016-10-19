var Helper = {
	GUID: function() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + '-' + s4() + '-' + s4() + '-' + s4();
	},
	FindItemInArray: function (array, keyName, keyVal, returnType) {
        var found = false;
        if (undefined === keyVal || null === keyVal) {
            return null;
        }
        for (var i in array) {
            if (array[i][keyName] == keyVal) {
                found = true;
                break;
            }
        }
        if (!found) {
            return null;
        }
        if (returnType === "index") {
            return i;
        } else {
            return array[i];
        }
    }
};

module.exports = Helper;