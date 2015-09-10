(function () {
  angular.module('Hungry.core.directives.dropzone')
    .directive('dropZone', function ($window, $rootScope) {
      return {
          scope: {
              action: "@",
              autoProcess: "=?",
              callback: "&",
              dataMax: "=?",
              mimetypes: "=?",
              message: "@?",
              name: "=?"
          },
          link: function (scope, element, attrs) {
              console.log("Creating dropzone");

              // Max file size
              if (scope.dataMax == null) {
                  scope.dataMax = Dropzone.prototype.defaultOptions.maxFilesize;
              } else {
                  scope.dataMax = parseInt(scope.dataMax);
              }

              // Message for the uploading
              if (scope.message == null) {
                  scope.message = Dropzone.prototype.defaultOptions.dictDefaultMessage;
              }

              element.dropzone({
                  url: scope.action,
                  maxFilesize: scope.dataMax,
                  paramName: attrs.name,
                  acceptedFiles: scope.mimetypes,
                  maxThumbnailFilesize: scope.dataMax,
                  dictDefaultMessage: scope.message,
                  autoProcessQueue: scope.autoProcess === 'false' ? false : true,
                  success: function (file, response) {
                    $rootScope.$emit('dropzone:uploaded', response);
                  },
                  sending: function(file, xhr, formData) {
                    formData.append("_token", $window.csrfToken);
                  },
                  init: function() {
                    this.on('queuecomplete', function() {
                      $rootScope.$emit('dropzone:queue:uploaded');
                    });

                    $rootScope.$on('dropzone:queue:process', this.processQueue);
                  }
              });

          }
      }
  });
})(); 