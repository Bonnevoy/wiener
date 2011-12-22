var event_gender;

event_gender = (function() {

  function event_gender() {}

  event_gender.app_id = "292295494139725";

  event_gender.male = 0;

  event_gender.female = 0;

  event_gender.pathname = '';

  event_gender.getAccessToken = function() {
    var path, query, query_params, url;
    if (window.location.hash.length === 0) {
      path = 'https://www.facebook.com/dialog/oauth?';
      query_params = ['client_id=' + this.app_id, 'redirect_uri=' + window.location, 'response_type=token'];
      query = query_params.join('&');
      url = path + query;
      return window.location = url;
    } else {
      return this.access_token || (this.access_token = window.location.hash.substring(1));
    }
  };

  event_gender.getEventId = function() {
    return window.location.pathname.split('/')[2];
  };

  event_gender.getEvent = function() {
    var path_event, query, query_params, url_event;
    path_event = "https://graph.facebook.com/" + this.getEventId() + "/attending?";
    query_params = [this.access_token, 'limit=2500'];
    query = query_params.join('&');
    url_event = path_event + query;
    return $.getJSON(url_event);
  };

  event_gender.getUsers = function(event_users) {
    var defs, i, ids, url_user, user, _i, _len, _ref,
      _this = this;
    ids = [];
    defs = [];
    for (_i = 0, _len = event_users.length; _i < _len; _i++) {
      user = event_users[_i];
      ids.push(user.id);
    }
    for (i = 0, _ref = ids.length; i <= _ref; i += 100) {
      url_user = "https://graph.facebook.com/?ids=" + ids.slice(i, (i + 100) + 1 || 9e9).join(',');
      defs.push($.getJSON(url_user).done(function(data) {
        var user_id;
        for (user_id in data) {
          _this[data[user_id].gender]++;
        }
        return _this.updateStats();
      }));
    }
    return $.when.apply($, defs).done(function() {
      return $('.gender_icon').removeClass('spin');
    });
  };

  event_gender.updateStats = function() {
    $('#stats_male').html(this.male);
    return $('#stats_female').html(this.female);
  };

  event_gender.render = function() {
    var html;
    html = '<li class="uiListItem uiListLight uiListVerticalItemBorder">\
    <ul class="uiList uiListHorizontal clearfix">\
        <li class="prs uiListItem uiListLight uiListHorizontalItemBorder uiListHorizontalItem">\
            <div class="clearfix pvm prm">\
                <div class="fbInfoIcon lfloat">\
                    <i class="img gender_icon spin" title="Females" style="display:inline-block;height:10px;width:10px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM3MUQ3N0QwMkJDMzExRTFBMDZEOTkyREM0NDhDQjFEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM3MUQ3N0QxMkJDMzExRTFBMDZEOTkyREM0NDhDQjFEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzcxRDc3Q0UyQkMzMTFFMUEwNkQ5OTJEQzQ0OENCMUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzcxRDc3Q0YyQkMzMTFFMUEwNkQ5OTJEQzQ0OENCMUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JwWsmAAAAG1BMVEWkpKTHx8fj4+Px8fGdnZ34+PjV1dWrq6v////p2CD9AAAAOElEQVR42mSLWwoAIAzD6mNb7n9inQqC9iOE0gosZgwE4eCxFRYevYN507lBqclU73K+lmbJIcAAm3QCxIbmdfUAAAAASUVORK5CYII=);">\
                        <u>Females</u>\
                    </i>\
                </div>\
                <div class="lfloat" id="stats_female">...</div>\
            </div>\
        </li>\
        <li class="prs uiListItem uiListLight uiListHorizontalItemBorder uiListHorizontalItem">\
            <div class="clearfix pvm">\
                <div class="fbInfoIcon lfloat">\
                    <i class="img gender_icon spin" title="Males" style="display:inline-block;height:10px;width:10px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUwQTBFODkzMkJDMzExRTFBOUFBOUFBNENCQzNENDA4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUwQTBFODk0MkJDMzExRTFBOUFBOUFBNENCQzNENDA4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTBBMEU4OTEyQkMzMTFFMUE5QUE5QUE0Q0JDM0Q0MDgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTBBMEU4OTIyQkMzMTFFMUE5QUE5QUE0Q0JDM0Q0MDgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7VXAIjAAAAJFBMVEXAwMDq6urOzs7c3NzHx8ekpKTj4+OdnZ25ubn4+Pirq6v///+k93TOAAAARElEQVR42jzMSRLAMAgDQWyHReL//w1QTrjQhwHJf+RuUj4uZ/EoPXwVTZEZ0W1YB94k5qwpuwRtghumZ/7i4fSvAAMAzBEDmokwAngAAAAASUVORK5CYII=);">\
                        <u>Males</u>\
                    </i>\
                </div>\
                <div class="lfloat" id="stats_male">...</div>\
            </div>\
        </li>\
    </ul>\
    </li>';
    $('#contentArea .fbEventInfo .uiList li.uiListVerticalItemBorder:first-child').after(html);
    html = '<style>\
    @-webkit-keyframes spin {\
      0%   { -webkit-transform: rotateY(0deg); }\
      50% { -webkit-transform: rotateY(180deg); }\
      100% { -webkit-transform: rotateY(0deg); }\
    }\
    .spin {\
      -webkit-animation: spin 4s infinite;\
    }\
    </style>';
    return $('head').append(html);
  };

  event_gender.init = function() {
    var _this = this;
    if (this.pathname !== window.location.pathname) {
      this.pathname = window.location.pathname;
      this.getAccessToken();
      this.render();
      return this.getEvent().done(function(res) {
        return _this.getUsers(res.data);
      });
    }
  };

  return event_gender;

})();

$(function() {
  return setInterval((function() {
    if (window.location.pathname.search(/events\/[0-9]*\//i) !== -1) {
      return event_gender.init();
    }
  }), 200);
});