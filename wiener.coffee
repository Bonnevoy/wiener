class event_gender
  @app_id: "292295494139725"
  @male: 0
  @female: 0
  @pathname: ''

  # Acquire an access token with OAuth and save it to @access_token for future use.
  @getAccessToken: ->
    if (window.location.hash.length is 0)
      path = 'https://www.facebook.com/dialog/oauth?'
      query_params =
        ['client_id=' + @app_id
         'redirect_uri=' + window.location
         'response_type=token']
      query = query_params.join('&')
      url = path + query
      window.location = url
    else
      @access_token or= window.location.hash.substring(1);

  # Acquire the id of the event. The path name will be of the form /events/event_id/.
  @getEventId: ->
    window.location.pathname.split('/')[2]

  # Acquire the attending list of the event. The list is limited to 2500 attendees for speed issues.
  # The function will return a jQurey Deferred Object.
  @getEvent: ->
    path_event = "https://graph.facebook.com/" + @getEventId() + "/attending?"
    query_params = [@access_token, 'limit=2500']
    query = query_params.join('&')
    url_event = path_event + query
    $.getJSON(url_event)

  # The information about the users is required in batches of 100, once again for speed issues.
  @getUsers: (event_users) ->
    ids = []
    defs = []
    ids.push user.id for user in event_users
    for i in [0..ids.length] by 100
      url_user = "https://graph.facebook.com/?ids=" + ids[i..(i+100)].join(',')
      defs.push $.getJSON(url_user).done (data) =>
        @[data[user_id].gender]++ for user_id of data
        @updateStats()
    $.when.apply($, defs).done ->
      $('.gender_icon').removeClass('spin')


  # The stats are updated after every batch that is finished.
  @updateStats: ->
    $('#stats_male').html(@male)
    $('#stats_female').html(@female)

  @render: ->
    html = '<li class="uiListItem uiListLight uiListVerticalItemBorder">
    <ul class="uiList uiListHorizontal clearfix">
        <li class="prs uiListItem uiListLight uiListHorizontalItemBorder uiListHorizontalItem">
            <div class="clearfix pvm prm">
                <div class="fbInfoIcon lfloat">
                    <i class="img gender_icon spin" title="Females" style="display:inline-block;height:10px;width:10px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM3MUQ3N0QwMkJDMzExRTFBMDZEOTkyREM0NDhDQjFEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM3MUQ3N0QxMkJDMzExRTFBMDZEOTkyREM0NDhDQjFEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzcxRDc3Q0UyQkMzMTFFMUEwNkQ5OTJEQzQ0OENCMUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzcxRDc3Q0YyQkMzMTFFMUEwNkQ5OTJEQzQ0OENCMUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JwWsmAAAAG1BMVEWkpKTHx8fj4+Px8fGdnZ34+PjV1dWrq6v////p2CD9AAAAOElEQVR42mSLWwoAIAzD6mNb7n9inQqC9iOE0gosZgwE4eCxFRYevYN507lBqclU73K+lmbJIcAAm3QCxIbmdfUAAAAASUVORK5CYII=);">
                        <u>Females</u>
                    </i>
                </div>
                <div class="lfloat" id="stats_female">...</div>
            </div>
        </li>
        <li class="prs uiListItem uiListLight uiListHorizontalItemBorder uiListHorizontalItem">
            <div class="clearfix pvm">
                <div class="fbInfoIcon lfloat">
                    <i class="img gender_icon spin" title="Males" style="display:inline-block;height:10px;width:10px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUwQTBFODkzMkJDMzExRTFBOUFBOUFBNENCQzNENDA4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUwQTBFODk0MkJDMzExRTFBOUFBOUFBNENCQzNENDA4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTBBMEU4OTEyQkMzMTFFMUE5QUE5QUE0Q0JDM0Q0MDgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTBBMEU4OTIyQkMzMTFFMUE5QUE5QUE0Q0JDM0Q0MDgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7VXAIjAAAAJFBMVEXAwMDq6urOzs7c3NzHx8ekpKTj4+OdnZ25ubn4+Pirq6v///+k93TOAAAARElEQVR42jzMSRLAMAgDQWyHReL//w1QTrjQhwHJf+RuUj4uZ/EoPXwVTZEZ0W1YB94k5qwpuwRtghumZ/7i4fSvAAMAzBEDmokwAngAAAAASUVORK5CYII=);">
                        <u>Males</u>
                    </i>
                </div>
                <div class="lfloat" id="stats_male">...</div>
            </div>
        </li>
    </ul>
    </li>'
    $('#contentArea .fbEventInfo .uiList li.uiListVerticalItemBorder:first-child').after(html)

    html = '<style>
    @-webkit-keyframes spin {
      0%   { -webkit-transform: rotateY(0deg); }
      50% { -webkit-transform: rotateY(180deg); }
      100% { -webkit-transform: rotateY(0deg); }
    }
    .spin {
      -webkit-animation: spin 4s infinite;
    }
    </style>'
    $('head').append(html)
      
  # Require an access token, render the UI, get the attendees and subsequently their gender.
  @init: ->
    if @pathname isnt window.location.pathname
      @pathname = window.location.pathname
      @getAccessToken()
      @render()
      @getEvent().done (res) =>
        @getUsers(res.data)

# FB uses pushstate for navigation and as far as we know there is no event fired when history.pushstate is used.
# Therefore, an interval is set to check if the current page is an event.
# Anyone with a better solution for this?
$( ->
  setInterval ( -> event_gender.init() if window.location.pathname.search(/events\/[0-9]*\//i) isnt -1), 200
)