do ($ = jQuery, window, document) ->

	# Create the defaults once
	pluginName = "taghead"
	defaults =
		remote:
			enable: false			# Enable/Disable the remote data source
			source: ''				# Set the source URL
			method: 'GET'			# Set the method (POST/GET)
			sentParam: 'value'		# Set the name of the send parameter
			displayData: 'value'	# Set the name of the parameter used for display
			storeData: 'value'		# Set the name of the parameter used for value
			minLength: 2			# Set the min length of the value for ajax calls
			forceValid: false		# The tag has to come from the source
		allowDuplicates: false		# Allow dupplicates entry or not
		style:
			wrapperClass: ''
			tagClass: ''
			tagListWrapperClass: ''
			tagListClass: ''
			tagListItemClass: ''
			inputClass: ''
		text:
			phAddTag: 'Add a tag'

	class Plugin
		constructor: (@element, options) ->
			# Merge settings and set attributes
			@settings = $.extend(true, @settings, defaults, options)
			@_defaults = defaults
			@_name = pluginName
			@tags = []
			@ids = []
			@element = $(@element)
			@init()

		# Edit the DOM and Bind events
		init: ->
			# Edit the DOM
			@element.addClass('th-original-input')
			# Create and save the taggead-wrapper
			@element.wrap("<span class='th-wrapper #{@settings.style.wrapperClass}'></span>")
			@wrapper = @element.parent()
			# Create and save the taggead-input
			@wrapper.append("<input type='text' class='th-input #{@settings.style.inputClass}' placeholder='#{@settings.text.phAddTag}' autocomplete='off' spellcheck='false' dir='auto'/>")
			@input = @wrapper.find('.th-input')
			# Create and save the taggead-tag-list-wrapper
			@wrapper.append("<div class='th-tag-list-wrapper #{@settings.style.tagListWrapperClass}'><span class='th-tag-list #{@settings.style.tagListClass}'></span></div>")
			@list = @wrapper.find('.th-tag-list')

			@list.hide()
			@element.hide()

			# Init with the current values
			if(@element.val() != '')
				# If @element has tags, use it as label
				if(@element.data('tags') && @element.data('tags') != '')
					labels = @element.data('tags').split(',')
					ids = @element.val().split(',')
					for v, i in labels
						@addTag(v, ids[i])

				else
					labels = @element.val().split(',')
					for v in labels
						@addTag(v, v)

			# Keydown event
			@input.on('keyup', (event) =>

				# Detect Enter and validate
				if(event.keyCode == 13)
					if(@wrapper.find('.th-active').length > 0)
						@addTag(@wrapper.find('.th-active').text(), @wrapper.find('.th-active').data('id'))
					else
						# If the validation is forced, we can't validate with enter
						if(@settings.remote.forceValid)
							return
						@addTag(@input.val(), @input.val())
					@input.val('')
					@list.empty()
					@list.hide()
				
				# Up and Down event
				if(event.keyCode == 38) # up
					@_keyboard(true)
					return
				if(event.keyCode == 40) # down
					@_keyboard(false)
					return

				# Check the length of the input value
				if(@input.val().length < @settings.remote.minLength || event.keyCode == 27)
					@list.empty()
					@list.hide()
					return

				# If remote enable, send a XHR request
				if(@settings.remote.enable)
					d = {}
					d[@settings.remote.sentParam] = @input.val()
					$.ajax({
						type: @settings.remote.method
						url: @settings.remote.source
						data: d
					})
					.done((da) =>
						# Empty the list and display the result
						@list.empty()
						@list.append("<a data-id='#{e[@settings.remote.storeData]}' class='th-tag-list-item #{@settings.style.tagListItemClass}'>#{e[@settings.remote.displayData]}</a>") for e in da
						@list.show()
						@element.trigger('th.remoteresponse')
					)
			)

			@input.on('keydown', (event) =>
				if(event.keyCode == 8 && @input.val().length == 0)
					@removeTag(@tags[@tags.length-1])
			)

			# Remove tag event
			@wrapper.on('click', "a.th-tag-link", (event) =>
				# Get the tag label
				label = $(event.target).text()
				@removeTag(label)
				event.preventDefault()
			)

			# Validate a tag
			@wrapper.on('click', "a.th-tag-list-item", (event) =>
				@addTag($(event.target).text(), $(event.target).attr('data-id'))
				@list.empty()
				@list.hide()
				@input.val('')
				@element.trigger('th.clicktoadd')
				event.preventDefault()
			)

			# Hover a tag
			@wrapper.on('mouseenter', "a.th-tag-list-item", (event) ->
				$(@).addClass('th-active')
			)
			@wrapper.on('mouseleave', "a.th-tag-list-item", (event) ->
				$(@).removeClass('th-active')
			)


		# Add a tag
		addTag: (label, id) ->
			if(!@settings.allowDuplicates && (@tags.indexOf(label) > -1 || @ids.indexOf(id) > -1))
				return

			# Create the DOM element
			@input.before("<span class='th-tag #{@settings.style.tagClass}' data-label='#{label}' data-id=#{id}><a href='#' class='th-tag-link'>#{label}</a></span>")
			
			@tags.push(label)
			@ids.push(id)
			
			# Edit the initial input value
			@element.val(@ids.join(','))
			@element.trigger('th.addtag')

		# Remove tag
		removeTag: (label, id) ->
			# Get the right index
			if(id?)
				index = @ids.indexOf(id)
			else
				index = @tags.indexOf(label)

			# Remove the tag
			if(index > -1)
				@tags.splice(index, 1)
				@ids.splice(index, 1)
			else
				return
			# Look for the parent element				
			parent = @wrapper.find(".th-tag[data-label='#{label}']");

			# Remove the tag (DOM element)
			if(parent.hasClass(@settings.style.tagClass))
				parent.remove()
			else
				return

			# Edit the initial input value
			@element.val(@ids.join(','))
			@element.trigger('th.removetag')

		# Keyboard Up/Down event
		_keyboard: (up) ->
			if(@input.val().length < @settings.remote.minLength)
				return

			if(@wrapper.find('.th-active').length > 0)
				el = @wrapper.find('.th-active')
				if(up)
					@wrapper.find('.th-active').prev().addClass('th-active')
				else
					@wrapper.find('.th-active').next().addClass('th-active')
				el.removeClass('th-active')
			else
				if(up)
					@wrapper.find('.th-tag-list-item').last().addClass('th-active')
				else
					@wrapper.find('.th-tag-list-item').first().addClass('th-active')
			
	# Wrap the plugin
	$.fn[pluginName] = (options) ->
		@each ->
			unless $.data(@, "plugin_#{pluginName}")
				opt = $.extend(true, defaults, options)
				$.data(@, "plugin_#{pluginName}", new Plugin @, opt)
