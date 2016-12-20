app.controller('ContactCtrl', ['$http', 'Factory_DataService', Contact]);

function Contact($http, DataService) {
    var vm = this;
    vm.Users = [];

    vm.oService = {
        GoToServer: function() {
            return DataService.GetCurrentUsers().then(function(data) {
                if (data.status) {
                    vm.Users = data.users;
                    return data.data;
                } else {
                    alert("Something Went Wrong");
                }
            });

        }
    }
}
