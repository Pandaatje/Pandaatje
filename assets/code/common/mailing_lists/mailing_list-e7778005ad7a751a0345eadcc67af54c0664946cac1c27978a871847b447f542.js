(function() {
    (function() {
      var $, EMAIL_REGEXP, initializeMailingLists;
      $ = this.jQuery;
      EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i;
      initializeMailingLists = (function(_this) {
        return function() {
          return $('.format-mailing-list').each(function(domIndex, domElement) {
            var $errorMessage, $form, $input, $mailingList, $submitButton, $successMessage, buttonStyle, buttonText, formHasBeenSubmitted, placeholder, submitForm, successMessageText, validateForm;
            $mailingList = $(domElement);
            $form = $mailingList.find('.format-mailing-list__form');
            $input = $mailingList.find('.format-mailing-list__email-input');
            $submitButton = $mailingList.find('.format-mailing-list__submit-button');
            $successMessage = $mailingList.find('.format-mailing-list__success-message').hide();
            $errorMessage = $mailingList.find('.format-mailing-list__error-message').hide();
            formHasBeenSubmitted = false;
            $form.on("submit", function($event) {
              var formIsValid;
              $event.preventDefault();
              formHasBeenSubmitted = true;
              formIsValid = validateForm();
              if (formIsValid) {
                return submitForm();
              }
            });
            $input.on("keyup", function($event) {
              return validateForm();
            });
            placeholder = $.trim($mailingList.find('.format-mailing-list__email-input-placeholder-text').text());
            $input.attr({
              placeholder: placeholder
            });
            successMessageText = $.trim($mailingList.find('.format-mailing-list__success-message-text').text());
            $successMessage.text(successMessageText);
            buttonText = $.trim($mailingList.find('.format-mailing-list__submit-button-text').html());
            $submitButton.html(buttonText);
            buttonStyle = window.getComputedStyle($mailingList[0]).getPropertyValue('--button-style');
            $submitButton.addClass("format-mailing-list__submit-button--" + ($.trim(buttonStyle)));
            validateForm = function() {
              var email, message;
              email = $input.val();
              if (!email || !email.match(EMAIL_REGEXP)) {
                message = "Please enter a valid email";
              }
              if (message && formHasBeenSubmitted) {
                $errorMessage.text(message).show();
              } else {
                $errorMessage.hide();
              }
              return !message;
            };
            return submitForm = function() {
              $submitButton.attr("disabled", true);
              $submitButton.text("Sending...");
              return $.ajax({
                url: $form.attr("action"),
                data: $form.serialize(),
                type: "POST"
              }).done(function() {
                $form.hide();
                $errorMessage.hide();
                return $successMessage.show();
              }).fail(function() {
                $errorMessage.text("Something went wrong. Please try again.");
                return $errorMessage.show();
              }).always(function() {
                $submitButton.attr("disabled", false);
                return $submitButton.html(buttonText);
              });
            };
          });
        };
      })(this);
      return $(initializeMailingLists);
    }).call(_4ORMAT);
  
  }).call(this);
  