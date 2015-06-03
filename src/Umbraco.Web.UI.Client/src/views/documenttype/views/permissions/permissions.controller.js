/**
 * @ngdoc controller
 * @name Umbraco.Editors.DocumentType.PropertyController
 * @function
 *
 * @description
 * The controller for the content type editor property dialog
 */
function PermissionsController($scope, contentTypeResource) {

    /* ----------- SCOPE VARIABLES ----------- */

    $scope.contentTypes = [];
    $scope.showPlaceholderDetails = false;

    /* ---------- INIT ---------- */

    init();

    function init() {

        contentTypeResource.getAll().then(function(contentTypes){

            $scope.contentTypes = contentTypes;

            angular.forEach($scope.contentTypes, function(contentType){

                var exists = false;

                angular.forEach($scope.contentType.allowedContentTypes, function(allowedContentType){

                    if( contentType.alias === allowedContentType.alias ) {
                        exists = true;
                    }

                });

                if(exists) {
                    contentType.show = false;
                } else {
                    contentType.show = true;
                }

            });

        });

    }

    $scope.addSelectedContentType = function(selectedContentType) {

        if(selectedContentType.alias !== "undefined" || selectedContentType.alias !== null) {

            var reformatedContentType = {
                "name": selectedContentType.name,
                "id": {
                    "m_boxed": {
                        "m_value": selectedContentType.id
                    }
                },
                "icon": selectedContentType.icon,
                "key": selectedContentType.key,
                "alias": selectedContentType.alias
            };

            // push selected content type to allowed array
            $scope.contentType.allowedContentTypes.push(reformatedContentType);

            // hide selected content type from content types array
            for (var contentTypeIndex = 0; contentTypeIndex < $scope.contentTypes.length; contentTypeIndex++) {

                var contentType = $scope.contentTypes[contentTypeIndex];

                if( selectedContentType.alias === contentType.alias ) {
                    contentType.show = false;
                }
            }

            // hide placeholder details
            $scope.showPlaceholderDetails = false;

        }

    };

    $scope.togglePlaceholderDetails = function() {
        $scope.showPlaceholderDetails = !$scope.showPlaceholderDetails;
    };

    $scope.removeAllowedChildNode = function(selectedContentType) {

        // splice from array
        var selectedContentTypeIndex = $scope.contentType.allowedContentTypes.indexOf(selectedContentType);
        $scope.contentType.allowedContentTypes.splice(selectedContentTypeIndex, 1);

        // show content type in content types array
        for (var contentTypeIndex = 0; contentTypeIndex < $scope.contentTypes.length; contentTypeIndex++) {

            var contentType = $scope.contentTypes[contentTypeIndex];

            if( selectedContentType.alias === contentType.alias ) {
                contentType.show = true;
            }
        }

    };


}

angular.module("umbraco").controller("Umbraco.Editors.DocumentType.PermissionsController", PermissionsController);
