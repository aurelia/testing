beforeEach(function () {
  function boolMatcher(match) {
    return function () {
      return {
        compare: function (actual, expected) {
          return {
            pass: match(actual, expected)
          }
        }
      }
    }
  }

  jasmine.addMatchers({
    //actual is expected to be a jquery object
    toBeVisible: boolMatcher((actual)=>
      actual.length > 0 && !actual.hasClass('aurelia-hide') && actual.filter(":visible").length === actual.length
    ),

    //actual is expected to be a jquery object
    toBeHidden: boolMatcher(
      //if.bind does not generate the dom element, so a zero length selector is normal
      (actual)=>actual.length === 0 ||

        //show.bind set the class
      actual.hasClass('aurelia-hide')
    )
  });
});

