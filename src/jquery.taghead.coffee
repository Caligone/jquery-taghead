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
			removeClass: ''
		text:
			phAddTag: 'Add a tag'

	class Plugin
		constructor: (@element, options) ->
			# Merge settings and set attributes
			@settings = $.extend(true, defaults, options)
			@_defaults = defaults
			@_name = pluginName
			@tags = []
			@ids = []
			@init()
			console.log(@settings)

		# Edit the DOM and Bind events
		init: ->
			# Edit the DOM
			# Create and save the taggead-wrapper
			$(@element).wrap("<span class='taghead-wrapper #{@settings.style.wrapperClass}'></span>")
			@wrapper = $(@element).parent()[0]
			# Create and save the taggead-input
			$(@wrapper).append("<input type='text' class='taghead-input #{@settings.style.inputClass}' placeholder='#{@settings.text.phAddTag}'/>")
			@input = $(@wrapper).find('.taghead-input')[0]
			# Create and save the taggead-tag-list-wrapper
			$(@wrapper).append("<span class='taghead-tag-list-wrapper #{@settings.style.tagListWrapperClass}'><ul class='taghead-tag-list #{@settings.style.tagListClass}'></ul></span>")
			@list = $(@wrapper).find('.taghead-tag-list')[0]	
			
			$(@element).hide()

			# Keydown event
			$(@input).on('keyup', (event) =>
				# Detect Enter and validate
				if(event.keyCode == 13)
					# If the validation is forced, we can't validate with enter
					if(@settings.remote.forceValid)
						return

					@addTag($(@input).val(), $(@input).val())
					$(@input).val('')
				else 
					if(event.keyCode == 8 && $(@input).val() == '')
						@removeTag(@tags[@tags.length-1])

				# Check the length of the input value
				if($(@input).val().length < @settings.remote.minLength)
					return

				# If remote enable, send a XHR request
				if(@settings.remote.enable)
					data = {}
					data[@settings.remote.sentParam] = $(@input).val()
					$.ajax({
						type: @settings.remote.method
						url: @settings.remote.source
						data: data
					})
					.done((data) =>
						# Empty the list and display the result
						$(@list).empty()
						$(@list).append("<li><a href='#' data-id='#{e[@settings.remote.storeData]}' class='taghead-tag-list-item #{@settings.style.tagListItemClass}'>#{e[@settings.remote.displayData]}</a></li>") for e in data
					)
			)

			# Remove tag event
			$(@wrapper).on('click', "a.taghead-remove", (event) =>
				# Get the tag label
				label = $(event.target).parent().text().slice(0, -1)
				@removeTag(label)
			)

			# Validate a tag
			$(@wrapper).on('click', "a.taghead-tag-list-item", (event) =>
				@addTag($(event.target).text(), $(event.target).attr('data-id'))
			)


		# Add a tag
		addTag: (label, id) ->
			if(!@settings.allowDuplicates && (@tags.indexOf(label) > -1 || @ids.indexOf(id) > -1))
				return

			# Create the DOM element
			$(@wrapper).append("<span class='taghead-tag #{@settings.style.tagClass}' data-label='#{label}' data-id=#{id}>#{label}<a href='#' class='taghead-remove #{@settings.style.removeClass}'>X</a></span>")
			
			@tags.push(label)
			@ids.push(id)
			
			# Edit the initial input value
			$(@element).val(@ids.join(','))

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
			parent = $(@wrapper).find(".taghead-tag[data-label='#{label}']");

			# Remove the tag (DOM element)
			if(parent.hasClass(@settings.style.tagClass))
				parent.remove()
			else
				return

			# Edit the initial input value
			$(@element).val(@ids.join(','))

			
	# Wrap the plugin
	$.fn[pluginName] = (options) ->
		@each ->
			unless $.data(@, "plugin_#{pluginName}")
				$.data(@, "plugin_#{pluginName}", new Plugin @, options)