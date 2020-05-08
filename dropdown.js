<script>
  
   (function (jQuery, window, undefined) {
        $(function () {
            //DOM CACHE
            var DOM = {
                $window: $(window),
                $document: $(document),
                $countryNameString: "",
                $countryDataSource: [],
                $drpCountries: $("#countries"),
                $btnSave: $("#btnSave"),
                $countryDropDownWrapper: $("#countryDropDownWrapper"),
                $notAvailable: $.parseHTML('@Resource.Country_NotAvailable')[0].data,
                $pleaseSelect: $.parseHTML('@Resource.Country_PleaseSelect')[0].data,
                $countryValidationMsg: $.parseHTML('@Resource.Validation_CountrySelect')[0].data,
                $viewBagQueryStringEmail: "@ViewBag.QueryStringEmail",
                $viewBagQueryStringToken: "@ViewBag.QueryStringToken"
            };
        });
})();
  
  getAllCountriesDataSource: function () {
                    $.ajax({
                        url: '/controller path',
                        type: 'POST',
                        dataType: 'json',
                        beforeSend: function () {
                            $(".ajaxmask, #imgAjaxLoading").show();
                        },
                        success: function (countryDataSource) {                            
                            $(".ajaxmask, #imgAjaxLoading").hide();
                            if (countryDataSource.countryList.countrySuccessList != undefined && countryDataSource.countryList.countrySuccessList.length > 0) {
                                DOM.$countryDataSource = countryDataSource.countryList.countrySuccessList;
                            }
                            else if (countryDataSource.countryList.exceptionMsg != undefined && countryDataSource.countryList.exceptionMsg.length > 0) {
                                DOM.$countryDataSource = [{ "countryId": "-1", "countryName": DOM.$notAvailable, "flag": "no_flag", }];
                                faclityApp.errorMessage(countryDataSource.countryList.exceptionMsg, "countryDropDownWrapper");
                            }
                            else {
                                DOM.$countryDataSource = [{ "countryId": "-1", "countryName": DOM.$notAvailable, "flag": "no_flag", }];
                            }
                            var isFirstTimeSessionStorage =  sessionStorage.getItem('isFirstTime');
                            if (countryDataSource.countryId != undefined && isFirstTimeSessionStorage == "true") {
                                viewBagCountryId = countryDataSource.countryId;
                                sessionStorage.setItem('isFirstTime', 'false');
                            }
                            
                            //RENDER COUNTRY DROPDOWN
                            if (viewBagCountryId == "" && viewBagCountryId == null)
                                faclityApp.renderCountryDropdown(DOM.$countryDataSource);
                            else {                                
                                faclityApp.renderCountryDropdown(DOM.$countryDataSource, viewBagCountryId);
                            }
                        },
                        error: function (err) {
                            $(".ajaxmask, #imgAjaxLoading").hide();
                            DOM.$countryDataSource = [{ "countryId": "-1", "countryName": DOM.$notAvailable, "flag": "no_flag", }];
                            //RENDER COUNTRY DROPDOWN WITH NO COUNTRY
                            faclityApp.renderCountryDropdown(DOM.$countryDataSource);
                        }

                    });

                }
  renderCountryDropdown: function (countryDataSource, selectedCountryId) {
                    if (countryDataSource.length > 0) {
                        DOM.$countryNameString += "<option value='' data-imagecss='no_flag' data-title='" + DOM.$pleaseSelect + "' selected='selected'>" + DOM.$pleaseSelect + "</option>";
                        $.each(countryDataSource, function (key) {
                                DOM.$countryNameString += "<option value='" + countryDataSource[key].countryId + "' data-image='../css/images/msdropdown/icons/blank.gif' data-imagecss='flag " + countryDataSource[key].flag + "' data-title='" + countryDataSource[key].countryName + "'>" + countryDataSource[key].countryName + "</option>";
                        });
                        DOM.$drpCountries.val(viewBagCountryId);
                        //APPEND ALL HTML OF COUNTRIES WITH ID, NAME AND FLAG
                        DOM.$drpCountries.html(DOM.$countryNameString);
                         //UPDATE VALUE TO SELECTED COUNTRY
                        if (selectedCountryId>0)
                        DOM.$drpCountries.val(selectedCountryId);
                        //RENDER msDropdown
                        DOM.$drpCountries.msDropdown();

                        //SET COUNTRY ID VALUE IN SESSION STORAGE FOR ONE OF BACK BUTTON SCENARIO
                        sessionStorage.setItem('CountryId', $("#countries").val());

                        //AFTER COUNTRY DROPDOWN RENDERING CALL CLICK EVENT
                        $("#countries_msdd").click(function () {
                            $("#countries_titleText").show();

                            // DISPLAY ARROW ON DROPDOWN OPEN
                            if ($('#countries_child:visible').length > 0 && $("#countries_titleText:visible").length > 0) {
                                $(this).children().children(".arrow").addClass("arrowon");
                                $(this).children().children(".arrow").removeClass("arrowoff");
                            }
                            else if ($('#countries_child:visible').length == 0 && $("#countries_titleText:visible").length == 0) {
                                $(this).children().children(".arrow").addClass("arrowoff");
                                $(this).children().children(".arrow").removeClass("arrowon");
                            } else {
                                $(this).children().children(".arrow").addClass("arrowoff");
                                $(this).children().children(".arrow").removeClass("arrowon");
                            }
                        });

                        // DISPLAY DEFAULT ARROW DOWN ON COUNTRY SELECT
                        $("#countries_child li").click(function (e) {
                            e.stopPropagation();
                            $("#countries_msdd").children().children(".arrow").addClass("arrowoff");
                            $("#countries_msdd").children().children(".arrow").removeClass("arrowon");
                        });

                        // DISPLAY DEFAULT ARROW DOWN ON DOCUMENT CLICK
                        $(document).on('click', function (event) {
                            var value = $(event.target).val();
                            if (!$(event.target).closest('#countries_msdd').length) {
                                $("#countries_msdd").children().children(".arrow").addClass("arrowoff");
                                $("#countries_msdd").children().children(".arrow").removeClass("arrowon");
                                $("#countries_titleText").hide();
                            }
                        });
                    }
                }


validateCountryDropDown: function (_currentId) {
                    if (_currentId.val() == "" || _currentId.val() == "-1") {
                        $(".country-label").addClass("countryErrorText");
                        DOM.$countryDropDownWrapper.find(".field_errorblock").remove();
                        faclityApp.errorMessage(DOM.$countryValidationMsg, "countryDropDownWrapper");
                        $(".ddTitle").addClass("countryselecterror");
                    }
                    else {
                        $(".country-label").removeClass("countryErrorText");
                        DOM.$countryDropDownWrapper.find(".field_errorblock").remove();
                        $(".ddTitle").removeClass("countryselecterror");
                    }
                }


$(function(){
  $("#countries").change(function () {
      //faclityApp.validateCountryDropDown($(this));
      validateCountryDropDown($(this));
  });
});

</script>
